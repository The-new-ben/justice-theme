/* Jus-Tice cinematic map.
   Mapbox GL v3 Standard style: real 3D buildings, native Hebrew POI labels
   (courthouses and government buildings labeled by the basemap itself, no
   invented data). The camera flies like a drone: an intro descent onto the
   top paying lawyer, a slow orbit around the building, then an overview.
   Premium lawyers render as gold flag markers with a portrait; other firms
   render as quiet logo chips only. Everything lazy loads near the viewport
   so page speed never pays for the show. Motion respects the reduced motion
   preference and stops on the first user touch. */
(function () {
	'use strict';

	var GL_VER = 'v3.7.0';
	var GL_JS = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.js';
	var GL_CSS = 'https://api.mapbox.com/mapbox-gl-js/' + GL_VER + '/mapbox-gl.css';
	var RTL_PLUGIN = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.3.0/mapbox-gl-rtl-text.js';

	var CFG = window.JT_CINEMA || {};
	var container = document.getElementById('jt-cinema-map');

	if (!container || !CFG.token) { return; }

	var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var userTookOver = false;
	var orbitFrame = null;

	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	function loadAsset(kind, src) {
		return new Promise(function (resolve, reject) {
			var el;
			if (kind === 'css') {
				el = document.createElement('link');
				el.rel = 'stylesheet';
				el.href = src;
			} else {
				el = document.createElement('script');
				el.src = src;
				el.async = true;
			}
			el.onload = resolve;
			el.onerror = reject;
			document.head.appendChild(el);
		});
	}

	function approxCenter() {
		return new Promise(function (resolve) {
			var done = false;
			var t = setTimeout(function () { if (!done) { done = true; resolve(null); } }, 1400);
			try {
				fetch('https://ipapi.co/json/', { mode: 'cors' }).then(function (r) { return r.json(); }).then(function (d) {
					if (done) { return; }
					done = true;
					clearTimeout(t);
					if (d && d.country_code === 'IL' && d.longitude && d.latitude) {
						resolve([parseFloat(d.longitude), parseFloat(d.latitude)]);
					} else {
						resolve(null);
					}
				}).catch(function () { if (!done) { done = true; clearTimeout(t); resolve(null); } });
			} catch (e) { if (!done) { done = true; clearTimeout(t); resolve(null); } }
		});
	}

	function flagMarker(p) {
		var el = document.createElement('div');
		el.className = 'jtcm-flag';
		el.innerHTML = '<span class="jtcm-flag__pin"></span>'
			+ (p.photo ? '<img class="jtcm-flag__photo" src="' + esc(p.photo) + '" alt="" loading="lazy">' : '')
			+ '<span class="jtcm-flag__name">' + esc(p.name) + '</span>'
			+ '<span class="jtcm-flag__tag">מקודם</span>';
		return el;
	}

	function placeGlyph(t) {
		if (t === 'court' || t === 'rabbinical') { return '⚖'; }        // scales of justice
		if (t === 'institution' || t === 'bar') { return '🏛'; }  // classical building
		if (t === 'legal_aid') { return '🛟'; }                   // ring buoy
		if (t === 'enforcement') { return '📎'; }                 // paperclip
		return '';
	}

	function chipMarker(p) {
		var el = document.createElement('div');
		var glyph = (p.kind === 'place') ? placeGlyph(p.place_type) : '';
		el.className = 'jtcm-chip' + (p.kind === 'place' ? ' jtcm-chip--place' : '') + (glyph ? ' jtcm-chip--glyph' : '');
		el.innerHTML = (glyph ? '<b class="jtcm-chip__g" aria-hidden="true">' + glyph + '</b>' : '')
			+ (p.logo ? '<img src="' + esc(p.logo) + '" alt="" loading="lazy">' : '')
			+ '<span>' + esc(p.name) + '</span>';
		return el;
	}

	function navUrl(p) {
		var q = [p.name, p.address, p.city].filter(Boolean).join(' ');
		return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
	}

	function popupHtml(p) {
		var h = '<div class="jtcm-pop"><strong>' + esc(p.name) + '</strong>';
		if (p.premium) {
			h += '<div class="jtcm-pop__acts">';
			if (p.wa) { h += '<a class="jtcm-pop__wa" href="' + esc(p.wa) + '" target="_blank" rel="noopener nofollow">וואטסאפ</a>'; }
			if (p.url) { h += '<a class="jtcm-pop__go" href="' + esc(p.url) + '">לפרופיל</a>'; }
			h += '</div>';
		} else if (p.url && p.kind === 'lawyer') {
			h += '<div class="jtcm-pop__acts"><a class="jtcm-pop__go" href="' + esc(p.url) + '">לפרופיל</a></div>';
		} else if (p.kind === 'place') {
			if (p.type_label) { h += '<div class="jtcm-pop__meta">' + esc(p.type_label) + (p.address ? ' · ' + esc(p.address) : '') + '</div>'; }
			h += '<div class="jtcm-pop__acts"><a class="jtcm-pop__go" href="' + esc(navUrl(p)) + '" target="_blank" rel="noopener nofollow">ניווט</a></div>';
		}
		return h + '</div>';
	}

	function orbit(map, seconds, onDone) {
		if (reduced || userTookOver) { if (onDone) { onDone(); } return; }
		var start = null;
		function frame(ts) {
			if (userTookOver) { if (onDone) { onDone(); } return; }
			if (!start) { start = ts; }
			map.setBearing(map.getBearing() + 0.05);
			if (ts - start < seconds * 1000) {
				orbitFrame = requestAnimationFrame(frame);
			} else if (onDone) { onDone(); }
		}
		orbitFrame = requestAnimationFrame(frame);
	}

	function flyTour(map, stops, i) {
		if (!stops.length || userTookOver) { return; }
		var idx = i % stops.length;
		map.flyTo({
			center: stops[idx].geometry.coordinates,
			zoom: 16.4,
			pitch: 63,
			bearing: -24 + 48 * (idx % 2),
			speed: 0.62,
			curve: 1.6,
			essential: false
		});
		map.once('moveend', function () {
			orbit(map, 8, function () {
				if (!userTookOver) { flyTour(map, stops, idx + 1); }
			});
		});
	}

	function boot() {
		Promise.all([loadAsset('css', GL_CSS), loadAsset('js', GL_JS)]).then(function () {
			if (mapboxgl.getRTLTextPluginStatus && mapboxgl.getRTLTextPluginStatus() === 'unavailable') {
				mapboxgl.setRTLTextPlugin(RTL_PLUGIN, null, true);
			}

			mapboxgl.accessToken = CFG.token;

			Promise.all([
				fetch(CFG.data).then(function (r) { return r.json(); }),
				approxCenter()
			]).then(function (results) {
				var geo = results[0] || {};
				var near = results[1];
				var features = (geo.features || []).filter(function (f) {
					return f && f.geometry && Array.isArray(f.geometry.coordinates);
				});
				var premium = features.filter(function (f) { return f.properties && f.properties.premium; });

				var map = new mapboxgl.Map({
					container: 'jt-cinema-map',
					style: 'mapbox://styles/mapbox/standard',
					center: [34.86, 31.95],
					zoom: 6.4,
					pitch: reduced ? 0 : 45,
					bearing: 0,
					antialias: true,
					attributionControl: true,
					cooperativeGestures: true
				});

				map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-left');

				['pointerdown', 'wheel', 'touchstart'].forEach(function (evt) {
					map.getCanvas().addEventListener(evt, function () {
						userTookOver = true;
						if (orbitFrame) { cancelAnimationFrame(orbitFrame); }
					}, { passive: true });
				});

				map.on('load', function () {
					try { map.setConfigProperty('basemap', 'lightPreset', 'day'); } catch (e) {}

					features.forEach(function (f) {
						var p = f.properties || {};
						var el = p.premium ? flagMarker(p) : chipMarker(p);
						var marker = new mapboxgl.Marker({ element: el, anchor: p.premium ? 'bottom' : 'center' })
							.setLngLat(f.geometry.coordinates)
							.setPopup(new mapboxgl.Popup({ offset: 18, maxWidth: '280px' }).setHTML(popupHtml(p)))
							.addTo(map);
						if (p.premium) { el.style.zIndex = 5; }
					});

					var target = premium[0] || features[0];

					if (!target) { return; }

					if (reduced) {
						map.jumpTo({ center: target.geometry.coordinates, zoom: 14.5, pitch: 0 });
						return;
					}

					// The drone descent: high approach, dive to the paying
					// lawyer's building, slow orbit, then the overview.
					setTimeout(function () {
						if (userTookOver) { return; }
						map.flyTo({
							center: near || target.geometry.coordinates,
							zoom: near ? 11.5 : 15.8,
							pitch: 58,
							speed: 0.55,
							curve: 1.5,
							essential: false
						});
						map.once('moveend', function () {
							if (userTookOver) { return; }
							map.flyTo({ center: target.geometry.coordinates, zoom: 16.4, pitch: 63, bearing: -18, speed: 0.6, curve: 1.5 });
							map.once('moveend', function () {
								orbit(map, 10, function () {
									if (userTookOver || !features.length) { return; }
									var bounds = new mapboxgl.LngLatBounds();
									features.forEach(function (f) { bounds.extend(f.geometry.coordinates); });
									map.fitBounds(bounds, { padding: 70, pitch: 40, maxZoom: 13 });
								});
							});
						});
					}, 700);
				});

				var tourBtn = document.getElementById('jt-cinema-tour');

				if (tourBtn) {
					tourBtn.addEventListener('click', function () {
						userTookOver = false;
						flyTour(map, premium.length ? premium : features, 0);
					});
				}
			});
		}).catch(function () {});
	}

	if ('IntersectionObserver' in window) {
		var seen = false;
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting && !seen) {
					seen = true;
					io.disconnect();
					boot();
				}
			});
		}, { rootMargin: '500px 0px' });
		io.observe(container);
	} else {
		boot();
	}
})();
