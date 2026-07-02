/* LawyerScout: 3D legal map of Israel (Mapbox GL v3).
   Auto-loads when the band scrolls near the viewport (IntersectionObserver),
   so first paint stays clean but the visitor never has to click. Style is
   light-v11 with a 3D-buildings layer: institutional, fast, no visual noise.
   Hebrew labels render through the official RTL text plugin (without it the
   text draws mirrored). Data comes from the live GeoJSON endpoint only. */
(function () {
	var wrap = document.getElementById('legal-map');
	if (!wrap || !window.JusticeMap || !window.JusticeMap.token) { return; }

	var btn = document.getElementById('legal-map-load');
	var CFG = window.JusticeMap;
	var GL_JS = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js';
	var GL_CSS = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css';
	var RTL_PLUGIN = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js';
	var booted = false;

	function loadAsset(src, isCss) {
		return new Promise(function (res, rej) {
			var el;
			if (isCss) {
				el = document.createElement('link');
				el.rel = 'stylesheet';
				el.href = src;
			} else {
				el = document.createElement('script');
				el.src = src;
			}
			el.onload = res;
			el.onerror = rej;
			document.head.appendChild(el);
		});
	}

	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	function popupHTML(p) {
		var h = '<div class="lmap-pop" dir="rtl">';
		h += '<strong class="lmap-pop__name">' + esc(p.name) + '</strong>';
		if (p.kind === 'lawyer') {
			if (p.verified) { h += '<span class="lmap-pop__badge">מאומת</span>'; }
			if (p.rating > 0 && p.reviews > 0) {
				h += '<span class="lmap-pop__stars">★ ' + esc(p.rating) + ' (' + esc(p.reviews) + ' ביקורות)</span>';
			}
			var areas = [];
			try { areas = JSON.parse(p.areas || '[]'); } catch (e) { areas = Array.isArray(p.areas) ? p.areas : []; }
			if (areas.length) { h += '<span class="lmap-pop__meta">' + esc(areas.join(' · ')) + '</span>'; }
			if (p.city) { h += '<span class="lmap-pop__meta">' + esc(p.city) + '</span>'; }
			h += '<span class="lmap-pop__cta">';
			h += '<a class="lmap-pop__btn" href="' + esc(p.url) + '">לפרופיל המלא</a>';
			if (p.whatsapp) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" target="_blank" rel="noopener" href="' + esc(p.whatsapp) + '">וואטסאפ</a>'; }
			else if (p.phone) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" href="' + esc(p.phone) + '">שיחה</a>'; }
			h += '</span>';
		} else {
			h += '<span class="lmap-pop__badge lmap-pop__badge--place">' + esc(p.type_label || 'מוסד משפטי') + '</span>';
			if (p.address) { h += '<span class="lmap-pop__meta">' + esc(p.address) + '</span>'; }
			h += '<span class="lmap-pop__cta">';
			if (p.website) { h += '<a class="lmap-pop__btn" target="_blank" rel="noopener nofollow" href="' + esc(p.website) + '">לאתר</a>'; }
			if (p.phone) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" href="tel:' + esc(String(p.phone).replace(/[^0-9+]/g, '')) + '">שיחה</a>'; }
			h += '</span>';
		}
		h += '</div>';
		return h;
	}

	function distanceKm(a, b) {
		var R = 6371, dLat = (b[1] - a[1]) * Math.PI / 180, dLng = (b[0] - a[0]) * Math.PI / 180;
		var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);
		return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
	}

	function boot() {
		if (booted) { return; }
		booted = true;
		if (btn) {
			btn.disabled = true;
			btn.textContent = 'טוען את המפה…';
		}
		Promise.all([loadAsset(GL_JS, false), loadAsset(GL_CSS, true), fetch(CFG.endpoint).then(function (r) { return r.json(); })])
			.then(function (out) {
				var data = out[2];
				wrap.classList.add('is-live');
				if (btn && btn.parentElement) { btn.parentElement.removeChild(btn); }

				// Hebrew renders mirrored without the RTL text plugin.
				if (mapboxgl.getRTLTextPluginStatus && mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
					mapboxgl.setRTLTextPlugin(RTL_PLUGIN, null, true);
				}

				mapboxgl.accessToken = CFG.token;
				var map = new mapboxgl.Map({
					container: 'legal-map-canvas',
					style: 'mapbox://styles/mapbox/light-v11',
					center: [34.79, 32.08],
					zoom: 11.8,
					pitch: 45,
					bearing: 0,
					attributionControl: true
				});
				map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
				var geo = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showUserLocation: true });
				map.addControl(geo, 'top-left');

				map.on('load', function () {
					// Quiet 3D: building extrusions only, no extra POI noise.
					var layers = map.getStyle().layers;
					var labelLayerId;
					for (var i = 0; i < layers.length; i++) {
						if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
							labelLayerId = layers[i].id;
							break;
						}
					}
					map.addLayer({
						id: 'jt-3d-buildings',
						source: 'composite',
						'source-layer': 'building',
						filter: ['==', 'extrude', 'true'],
						type: 'fill-extrusion',
						minzoom: 13,
						paint: {
							'fill-extrusion-color': '#d7e0ea',
							'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, ['get', 'height']],
							'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, ['get', 'min_height']],
							'fill-extrusion-opacity': 0.55
						}
					}, labelLayerId);

					map.addSource('legal', { type: 'geojson', data: data, cluster: true, clusterMaxZoom: 13, clusterRadius: 46 });
					map.addLayer({
						id: 'clusters', type: 'circle', source: 'legal', filter: ['has', 'point_count'],
						paint: {
							'circle-color': '#14477D',
							'circle-radius': ['step', ['get', 'point_count'], 16, 10, 22, 50, 30],
							'circle-stroke-width': 2, 'circle-stroke-color': '#FFFFFF'
						}
					});
					map.addLayer({
						id: 'cluster-count', type: 'symbol', source: 'legal', filter: ['has', 'point_count'],
						layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-size': 13 },
						paint: { 'text-color': '#FFFFFF' }
					});
					map.addLayer({
						id: 'points', type: 'circle', source: 'legal', filter: ['!', ['has', 'point_count']],
						paint: {
							'circle-color': ['case', ['==', ['get', 'kind'], 'lawyer'], '#E4572E', '#1866B4'],
							'circle-radius': 8, 'circle-stroke-width': 2.5, 'circle-stroke-color': '#FFFFFF'
						}
					});

					map.on('click', 'clusters', function (e) {
						var f = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })[0];
						map.getSource('legal').getClusterExpansionZoom(f.properties.cluster_id, function (err, zoom) {
							if (!err) { map.easeTo({ center: f.geometry.coordinates, zoom: zoom + 0.5 }); }
						});
					});
					map.on('click', 'points', function (e) {
						var f = e.features[0];
						new mapboxgl.Popup({ offset: 14, maxWidth: '300px' })
							.setLngLat(f.geometry.coordinates)
							.setHTML(popupHTML(f.properties))
							.addTo(map);
					});
					map.on('mouseenter', 'points', function () { map.getCanvas().style.cursor = 'pointer'; });
					map.on('mouseleave', 'points', function () { map.getCanvas().style.cursor = ''; });
				});

				var nearBtn = document.getElementById('legal-map-nearest');
				if (nearBtn) {
					nearBtn.addEventListener('click', function () {
						if (!navigator.geolocation) { return; }
						nearBtn.textContent = 'מאתר אתכם…';
						navigator.geolocation.getCurrentPosition(function (pos) {
							var me = [pos.coords.longitude, pos.coords.latitude];
							var lawyers = (data.features || []).filter(function (f) { return f.properties.kind === 'lawyer'; });
							if (!lawyers.length) { lawyers = data.features || []; }
							lawyers.sort(function (a, b) {
								return distanceKm(me, a.geometry.coordinates) - distanceKm(me, b.geometry.coordinates);
							});
							var target = lawyers[0];
							if (!target) { return; }
							nearBtn.textContent = 'עורך הדין הקרוב אליכם';
							map.flyTo({ center: target.geometry.coordinates, zoom: 15, pitch: 50 });
							new mapboxgl.Popup({ offset: 14, maxWidth: '300px' })
								.setLngLat(target.geometry.coordinates)
								.setHTML(popupHTML(target.properties))
								.addTo(map);
						}, function () {
							nearBtn.textContent = 'לא הצלחנו לאתר מיקום';
						});
					});
				}
			})
			.catch(function () {
				booted = false;
				if (btn) {
					btn.disabled = false;
					btn.textContent = 'המפה לא נטענה, נסו שוב';
				}
			});
	}

	// Auto-load as soon as the band approaches the viewport; the button
	// stays as a fallback for browsers without IntersectionObserver.
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].isIntersecting) {
					io.disconnect();
					boot();
					return;
				}
			}
		}, { rootMargin: '400px 0px' });
		io.observe(wrap);
	}

	if (btn) { btn.addEventListener('click', boot); }
}());
