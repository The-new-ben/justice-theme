/* LawyerScout: 3D legal map of Israel (Mapbox GL v3).
   Click-to-load facade: nothing downloads until the visitor asks for the
   map, so homepage CWV stays untouched. Data comes from the live GeoJSON
   endpoint (approved lawyers + imported legal places only). */
(function () {
	var wrap = document.getElementById('legal-map');
	var btn = document.getElementById('legal-map-load');
	if (!wrap || !btn || !window.JusticeMap || !window.JusticeMap.token) { return; }

	var CFG = window.JusticeMap;
	var GL_JS = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js';
	var GL_CSS = 'https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css';

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
		btn.disabled = true;
		btn.textContent = 'טוען את המפה…';
		Promise.all([loadAsset(GL_JS, false), loadAsset(GL_CSS, true), fetch(CFG.endpoint).then(function (r) { return r.json(); })])
			.then(function (out) {
				var data = out[2];
				wrap.classList.add('is-live');
				btn.parentElement.removeChild(btn);

				mapboxgl.accessToken = CFG.token;
				var map = new mapboxgl.Map({
					container: 'legal-map-canvas',
					style: 'mapbox://styles/mapbox/standard',
					center: [34.79, 32.08],
					zoom: 11.6,
					pitch: 55,
					bearing: -15,
					language: 'he',
					attributionControl: true
				});
				map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');
				var geo = new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false, showUserLocation: true });
				map.addControl(geo, 'top-left');

				map.on('load', function () {
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
							map.flyTo({ center: target.geometry.coordinates, zoom: 15, pitch: 60 });
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
				btn.disabled = false;
				btn.textContent = 'המפה לא נטענה, נסו שוב';
			});
	}

	btn.addEventListener('click', boot);
}());
