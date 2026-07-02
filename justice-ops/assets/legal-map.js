/* LawyerScout: 3D legal map of Israel (Mapbox GL v3).
   Auto-loads near the viewport. Light style, quiet 3D buildings, RTL
   Hebrew via the official plugin. Paid lawyer profiles render as premium
   flag markers (open mini-card with call button, visible from far away);
   everything else stays a small dot with a popup. GeoJSON is cached in
   localStorage (30 min) so repeat visits paint the map instantly. */
(function () {
	var wrap = document.getElementById('legal-map');
	if (!wrap || !window.JusticeMap || !window.JusticeMap.token) { return; }

	var btn = document.getElementById('legal-map-load');
	var CFG = window.JusticeMap;
	var GL_VER = 'v3.8.0';
	var GL_JS = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.js';
	var GL_CSS = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.css';
	var RTL_PLUGIN = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js';
	var CACHE_KEY = 'justice_map_data_v2';
	var CACHE_TTL = 30 * 60 * 1000;
	var booted = false;

	// Warm the connection to the tile server before the visitor reaches
	// the band: DNS + TLS are already done when the map boots.
	(function preconnect() {
		var l = document.createElement('link');
		l.rel = 'preconnect';
		l.href = 'https://api.mapbox.com';
		l.crossOrigin = 'anonymous';
		document.head.appendChild(l);
	}());

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

	// Titles arrive HTML-encoded from WordPress (&quot; etc). Decode once,
	// then esc() before building HTML, so עו"ד renders as עו"ד.
	var decodeBox = document.createElement('textarea');
	function decode(s) {
		if (s == null) { return ''; }
		decodeBox.innerHTML = String(s);
		return decodeBox.value;
	}

	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	function parseAreas(v) {
		if (Array.isArray(v)) { return v; }
		try { var a = JSON.parse(v || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; }
	}

	function isPaidLawyer(p) {
		if (p.kind !== 'lawyer') { return false; }
		return p.paid === true || p.paid === 'true' || p.verified === true || p.verified === 'true';
	}

	function popupHTML(p) {
		var name = esc(decode(p.name));
		var h = '<div class="lmap-pop" dir="rtl">';
		h += '<strong class="lmap-pop__name">' + name + '</strong>';
		if (p.kind === 'lawyer') {
			if (p.verified === true || p.verified === 'true') { h += '<span class="lmap-pop__badge">מאומת</span>'; }
			if (p.rating > 0 && p.reviews > 0) {
				h += '<span class="lmap-pop__stars">★ ' + esc(p.rating) + ' (' + esc(p.reviews) + ' ביקורות)</span>';
			}
			var areas = parseAreas(p.areas);
			if (areas.length) { h += '<span class="lmap-pop__meta">' + esc(decode(areas.join(' · '))) + '</span>'; }
			if (p.city) { h += '<span class="lmap-pop__meta">' + esc(decode(p.city)) + '</span>'; }
			h += '<span class="lmap-pop__cta">';
			h += '<a class="lmap-pop__btn" href="' + esc(p.url) + '">לפרופיל המלא</a>';
			if (p.whatsapp) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" target="_blank" rel="noopener" href="' + esc(p.whatsapp) + '">וואטסאפ</a>'; }
			else if (p.phone) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" href="' + esc(p.phone) + '">שיחה</a>'; }
			h += '</span>';
		} else {
			h += '<span class="lmap-pop__badge lmap-pop__badge--place">' + esc(decode(p.type_label || 'מוסד משפטי')) + '</span>';
			if (p.address) { h += '<span class="lmap-pop__meta">' + esc(decode(p.address)) + '</span>'; }
			h += '<span class="lmap-pop__cta">';
			if (p.website) { h += '<a class="lmap-pop__btn" target="_blank" rel="noopener nofollow" href="' + esc(p.website) + '">לאתר</a>'; }
			if (p.phone) { h += '<a class="lmap-pop__btn lmap-pop__btn--wa" href="tel:' + esc(String(p.phone).replace(/[^0-9+]/g, '')) + '">שיחה</a>'; }
			h += '</span>';
		}
		h += '</div>';
		return h;
	}

	// Premium flag: an always-open mini card on a pole, readable from a
	// distance. Paid profiles only.
	function flagElement(p) {
		var el = document.createElement('div');
		el.className = 'lmap-flag';
		el.dir = 'rtl';
		var areas = parseAreas(p.areas);
		var html = '<div class="lmap-flag__card">';
		html += '<strong class="lmap-flag__name">' + esc(decode(p.name)) + '</strong>';
		if (areas.length) { html += '<span class="lmap-flag__area">' + esc(decode(areas[0])) + '</span>'; }
		if (p.rating > 0 && p.reviews > 0) {
			html += '<span class="lmap-flag__stars">★ ' + esc(p.rating) + '</span>';
		}
		html += '<span class="lmap-flag__cta">';
		if (p.whatsapp) { html += '<a class="lmap-flag__btn lmap-flag__btn--call" target="_blank" rel="noopener" href="' + esc(p.whatsapp) + '">וואטסאפ</a>'; }
		else if (p.phone) { html += '<a class="lmap-flag__btn lmap-flag__btn--call" href="' + esc(p.phone) + '">שיחה</a>'; }
		html += '<a class="lmap-flag__btn" href="' + esc(p.url) + '">לפרופיל</a>';
		html += '</span></div><span class="lmap-flag__pole"></span><span class="lmap-flag__dot"></span>';
		el.innerHTML = html;
		return el;
	}

	function fetchData() {
		try {
			var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
			if (cached && cached.ts && (Date.now() - cached.ts) < CACHE_TTL && cached.data && cached.data.features) {
				// Serve instantly, refresh silently for next time.
				fetch(CFG.endpoint).then(function (r) { return r.json(); }).then(function (fresh) {
					try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: fresh })); } catch (e) {}
				}).catch(function () {});
				return Promise.resolve(cached.data);
			}
		} catch (e) {}
		return fetch(CFG.endpoint).then(function (r) { return r.json(); }).then(function (data) {
			try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data })); } catch (e) {}
			return data;
		});
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
		Promise.all([loadAsset(GL_JS, false), loadAsset(GL_CSS, true), fetchData()])
			.then(function (out) {
				var data = out[2];
				wrap.classList.add('is-live');
				if (btn && btn.parentElement) { btn.parentElement.removeChild(btn); }

				// Hebrew renders mirrored without the RTL text plugin.
				if (mapboxgl.getRTLTextPluginStatus && mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
					mapboxgl.setRTLTextPlugin(RTL_PLUGIN, null, true);
				}

				var allFeatures = (data && data.features) || [];
				var flagged = allFeatures.filter(function (f) { return isPaidLawyer(f.properties); });
				var dotted = { type: 'FeatureCollection', features: allFeatures.filter(function (f) { return !isPaidLawyer(f.properties); }) };

				mapboxgl.accessToken = CFG.token;
				var map = new mapboxgl.Map({
					container: 'legal-map-canvas',
					style: 'mapbox://styles/mapbox/light-v11',
					center: [34.781, 32.072],
					zoom: 12.4,
					pitch: 32,
					bearing: 0,
					maxBounds: [[33.6, 29.2], [36.4, 33.7]],
					fadeDuration: 0,
					attributionControl: true
				});
				map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
				var geo = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showUserLocation: true });
				map.addControl(geo, 'top-left');

				// Premium flags live outside the clustered source so they are
				// always visible, at every zoom.
				flagged.forEach(function (f) {
					new mapboxgl.Marker({ element: flagElement(f.properties), anchor: 'bottom' })
						.setLngLat(f.geometry.coordinates)
						.addTo(map);
				});

				map.on('load', function () {
					// Quiet 3D: building extrusions only when zoomed right in.
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
						minzoom: 15,
						paint: {
							'fill-extrusion-color': '#d7e0ea',
							'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'height']],
							'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 16, ['get', 'min_height']],
							'fill-extrusion-opacity': 0.5
						}
					}, labelLayerId);

					map.addSource('legal', { type: 'geojson', data: dotted, cluster: true, clusterMaxZoom: 13, clusterRadius: 46 });
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
							var lawyers = allFeatures.filter(function (f) { return f.properties.kind === 'lawyer'; });
							if (!lawyers.length) { lawyers = allFeatures; }
							lawyers.sort(function (a, b) {
								return distanceKm(me, a.geometry.coordinates) - distanceKm(me, b.geometry.coordinates);
							});
							var target = lawyers[0];
							if (!target) { return; }
							nearBtn.textContent = 'עורך הדין הקרוב אליכם';
							map.flyTo({ center: target.geometry.coordinates, zoom: 15, pitch: 45 });
							if (!isPaidLawyer(target.properties)) {
								new mapboxgl.Popup({ offset: 14, maxWidth: '300px' })
									.setLngLat(target.geometry.coordinates)
									.setHTML(popupHTML(target.properties))
									.addTo(map);
							}
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
