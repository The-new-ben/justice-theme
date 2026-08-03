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
			+ (p.logo ? '<img class="jtcm-flag__photo" src="' + esc(p.logo) + '" alt="" loading="lazy">' : '')
			+ '<span class="jtcm-flag__name">' + esc(p.name) + '</span>'
			+ '<span class="jtcm-flag__tag" data-jt-sponsored-disclosure="active-paid">מקודם</span>';
		return el;
	}

	// Professional inline SVG glyphs (owner order 2026-07-16: no emoji
	// icons anywhere on the map - they read like a 1985 terminal, not a
	// top-tier legal platform). Single-color, inherit currentColor.
	var SVG = {
		scales: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M8 21h8M12 5l-5.5 2M12 5l5.5 2"/><path d="M6.5 7l-2.8 6a3 3 0 005.6 0L6.5 7zM17.5 7l-2.8 6a3 3 0 005.6 0L17.5 7z"/></svg>',
		building: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 21h18M4 21V10m16 11V10M2 10h20L12 3 2 10zM7 21v-7m5 7v-7m5 7v-7"/></svg>',
		shield: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 7.8-8 9-4.6-1.2-8-4.5-8-9V6l8-3z"/></svg>',
		clip: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 12l6-6a3 3 0 114 4l-8 8a5 5 0 11-7-7l8-8"/></svg>'
	};

	function placeGlyph(t) {
		if (t === 'court' || t === 'rabbinical') { return SVG.scales; }
		if (t === 'institution' || t === 'bar') { return SVG.building; }
		if (t === 'legal_aid') { return SVG.shield; }
		if (t === 'enforcement') { return SVG.clip; }
		return '';
	}

	// Default portrait avatars for lawyer cards without a photo: clean
	// professional silhouettes, gender picked ONLY from the person's own
	// honorific in their public name (עורכת דין = female form), firm
	// avatar for offices. Never a guess beyond their own words.
	function avatarSvg(name) {
		var n = String(name || '');
		var isFirm = n.indexOf('משרד') === 0 || n.indexOf('ושות') !== -1;
		var isFemale = n.indexOf('עורכת') !== -1 || n.indexOf('טוענת') !== -1;
		var head = '<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#eef2fa"/>';
		if (isFirm) {
			return head + '<path d="M10 36V20l14-8 14 8v16" fill="none" stroke="#33507e" stroke-width="2.4" stroke-linejoin="round"/><path d="M17 36v-9m7 9v-9m7 9v-9" stroke="#33507e" stroke-width="2.4" stroke-linecap="round"/><path d="M8 36h32" stroke="#33507e" stroke-width="2.4" stroke-linecap="round"/></svg>';
		}
		if (isFemale) {
			return head + '<circle cx="24" cy="18" r="7" fill="#7d90b5"/><path d="M13 40c0-8 5-12 11-12s11 4 11 12" fill="#7d90b5"/><path d="M15 22c-1-7 3-12 9-12s10 5 9 12l-2 1c.5-6-2.5-10-7-10s-7.5 4-7 10l-2-1z" fill="#33507e"/></svg>';
		}
		return head + '<circle cx="24" cy="18" r="7" fill="#7d90b5"/><path d="M13 40c0-8 5-12 11-12s11 4 11 12" fill="#7d90b5"/></svg>';
	}

	// Layer key per feature: 'lawyer' | 'court' | 'institution'.
	function layerKey(p) {
		if (p.kind === 'lawyer') { return 'lawyer'; }
		var t = p.place_type;
		if (t === 'court' || t === 'rabbinical') { return 'court'; }
		return 'institution';
	}

	function haversineKm(a, b) {
		var R = 6371, dLat = (b[1] - a[1]) * Math.PI / 180, dLng = (b[0] - a[0]) * Math.PI / 180;
		var s = Math.sin(dLat / 2) * Math.sin(dLat / 2)
			+ Math.cos(a[1] * Math.PI / 180) * Math.cos(b[1] * Math.PI / 180)
			* Math.sin(dLng / 2) * Math.sin(dLng / 2);
		return 2 * R * Math.asin(Math.sqrt(s));
	}

	function chipMarker(p) {
		var el = document.createElement('div');
		var glyph = (p.kind === 'place') ? placeGlyph(p.place_type) : '';
		el.className = 'jtcm-chip' + (p.kind === 'place' ? ' jtcm-chip--place' : '') + (glyph ? ' jtcm-chip--glyph' : '');
		el.innerHTML = (glyph ? '<b class="jtcm-chip__g" aria-hidden="true">' + glyph + '</b>' : '')
			+ (p.kind === 'lawyer' && !p.logo ? '<b class="jtcm-chip__av" aria-hidden="true">' + avatarSvg(p.name) + '</b>' : '')
			+ (p.logo ? '<img src="' + esc(p.logo) + '" alt="" loading="lazy">' : '')
			+ '<span>' + esc(p.name) + '</span>';
		return el;
	}

	// Non-paying offices are anonymous dots (owner order 2026-07-18): present
	// on the map - the index looks complete - but mute until clicked. A paid
	// plan is what buys an always-visible label. One tiny div per dot keeps
	// ~1,000 markers cheap.
	function dotMarker(p) {
		var el = document.createElement('div');
		el.className = 'jtcm-dot';
		el.setAttribute('role', 'button');
		el.setAttribute('aria-label', p.name || 'משרד עורכי דין');
		return el;
	}

	function navUrl(p) {
		var q = [p.name, p.address, p.city].filter(Boolean).join(' ');
		return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
	}

	function popupHtml(p) {
		// The rich card (owner order 2026-07-16): portrait, name, areas,
		// city, honest verification state, real actions. No emoji.
		var h = '<div class="jtcm-pop">';

		if (p.kind === 'lawyer') {
			h += '<div class="jtcm-pop__card">'
				+ '<span class="jtcm-pop__ava">' + (p.logo ? '<img src="' + esc(p.logo) + '" alt="">' : avatarSvg(p.name)) + '</span>'
				+ '<span class="jtcm-pop__id"><strong>' + esc(p.name) + '</strong>';
			if (p.paid) {
				h += '<span class="jtcm-pop__sponsored" data-jt-sponsored-disclosure="active-paid">מקודם</span>';
			}
			var meta = [];
			if (p.areas && p.areas.length) { meta.push(esc([].concat(p.areas).join(', '))); }
			if (p.city) { meta.push(esc(p.city)); }
			if (meta.length) { h += '<span class="jtcm-pop__meta">' + meta.join(' · ') + '</span>'; }
			h += p.verified
				? '<span class="jtcm-pop__badge jtcm-pop__badge--v">מאומת</span>'
				: '<span class="jtcm-pop__badge">כרטיס ציבורי, טרם אומת</span>';
			h += '</span></div>';
			h += '<div class="jtcm-pop__acts">';
			var wa = p.wa || p.whatsapp;
			if (wa) { h += '<a class="jtcm-pop__wa" href="' + esc(wa) + '" target="_blank" rel="noopener nofollow">וואטסאפ</a>'; }
			if (p.url) { h += '<a class="jtcm-pop__go" href="' + esc(p.url) + '">לפרופיל המלא</a>'; }
			h += '</div>';
			// Demand interception (owner order 2026-07-18): a free dot's popup
			// quietly routes attention to the nearest PAYING office when one
			// exists in the radius - the visible value a plan buys.
			if (!p.paid && p.nearPaid) {
				h += '<a class="jtcm-pop__near" href="' + esc(p.nearPaid.url || '#') + '">'
					+ '<span class="jtcm-pop__near-tag" data-jt-sponsored-disclosure="active-paid">מקודם</span>'
					+ '<strong>' + esc(p.nearPaid.name) + '</strong>'
					+ (p.nearPaid.km < 9 ? '<span class="jtcm-pop__near-km">' + (p.nearPaid.km < 1 ? Math.round(p.nearPaid.km * 1000) + ' מ׳' : p.nearPaid.km.toFixed(1) + ' ק"מ') + ' מכאן</span>' : '')
					+ '</a>';
			}
			// The FOMO door: an unclaimed office sees exactly what it is - a
			// mute dot next to labeled competitors - and gets the one-click way in.
			if (p.claim) {
				h += '<a class="jtcm-pop__claim" href="' + esc(p.claim) + '" data-lead-utm-source="map_dot_claim" data-lead-utm-medium="map" data-lead-utm-campaign="firm_index">'
					+ 'זה המשרד שלכם? הירשמו וקבלו כרטיס רשום עם תווית בולטת במפה ←</a>';
			}
		} else {
			h += '<strong>' + esc(p.name) + '</strong>';
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
				var premium = features.filter(function (f) { return f.properties && f.properties.paid; });

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
				map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

				['pointerdown', 'wheel', 'touchstart'].forEach(function (evt) {
					map.getCanvas().addEventListener(evt, function () {
						userTookOver = true;
						if (orbitFrame) { cancelAnimationFrame(orbitFrame); }
					}, { passive: true });
				});

				// Live filter state: every marker registers with its layer and
				// practice areas, so the chips, the practice-area cards and the
				// legend stay truthful to what is actually on screen.
				var registry = [];
				var activeLayer = 'all';
				var activeArea = '';
				var legendEl = document.getElementById('jt-cinema-legend');

				function areaMatches(r) {
					if (!activeArea) { return true; }
					if (r.layer !== 'lawyer') { return false; }
					var areas = [].concat((r.feature.properties || {}).areas || []).join(' ');
					return areas.indexOf(activeArea) !== -1 || activeArea.indexOf(areas) !== -1 && areas !== '';
				}

				function applyFilters() {
					var counts = { lawyer: 0, court: 0, institution: 0 };
					registry.forEach(function (r) {
						var show = (activeLayer === 'all' || r.layer === activeLayer) && (activeArea === '' || areaMatches(r));
						r.el.style.display = show ? '' : 'none';
						if (show) { counts[r.layer]++; }
					});
					if (legendEl) {
						if (activeArea && !counts.lawyer) {
							legendEl.textContent = 'אין עדיין משרדים מסומנים בתחום ' + activeArea + ' - המאגר גדל כל הזמן';
						} else {
							var parts = [];
							if (counts.lawyer) { parts.push(counts.lawyer + ' משרדים'); }
							if (counts.court) { parts.push(counts.court + ' בתי משפט'); }
							if (counts.institution) { parts.push(counts.institution + ' מוסדות'); }
							legendEl.textContent = parts.join(' · ');
						}
					}
				}

				function selectChip(btn) {
					document.querySelectorAll('.jtcm-chipbtn').forEach(function (b) { b.classList.remove('is-on'); });
					if (btn) { btn.classList.add('is-on'); }
				}

				document.querySelectorAll('.jtcm-chipbtn').forEach(function (btn) {
					btn.addEventListener('click', function () {
						selectChip(btn);
						activeLayer = btn.getAttribute('data-layer') || 'all';
						activeArea = btn.getAttribute('data-area') || '';
						applyFilters();
					});
				});

				// Practice-area chips, built from the DATA (only areas that a
				// real registered office carries - never an empty menu of
				// promises), appended after the layer chips.
				function buildAreaChips() {
					var host = document.querySelector('.jtcm-chips');
					if (!host) { return; }
					var seen = {};
					features.forEach(function (f) {
						var p = f.properties || {};
						if (p.kind !== 'lawyer') { return; }
						[].concat(p.areas || []).forEach(function (a) {
							if (a && !seen[a]) { seen[a] = true; }
						});
					});
					Object.keys(seen).forEach(function (a) {
						var b = document.createElement('button');
						b.type = 'button';
						b.className = 'jtcm-chipbtn jtcm-chipbtn--area';
						b.setAttribute('data-layer', 'lawyer');
						b.setAttribute('data-area', a);
						b.textContent = a;
						b.addEventListener('click', function () {
							selectChip(b);
							activeLayer = 'lawyer';
							activeArea = a;
							applyFilters();
						});
						host.appendChild(b);
					});
				}

				// The practice-areas band (homepage) talks to the map: a quiet
				// "on the map" affordance appears on each practice card; a tap
				// filters the map to that area and glides to it. The card's
				// own link keeps working untouched - SEO paths stay real.
				function wirePracticeBand() {
					var band = document.getElementById('practice-areas');
					var wrap = document.querySelector('.jtcm-wrap');
					if (!band || !wrap) { return; }
					band.querySelectorAll('a').forEach(function (card) {
						var label = (card.textContent || '').trim();
						if (!label || label.length > 60) { return; }
						var short = label.split('\n')[0].replace(/^עורך דין |^עורכי דין /, '').trim();
						if (!short) { return; }
						var pin = document.createElement('button');
						pin.type = 'button';
						pin.className = 'jtcm-cardpin';
						pin.setAttribute('aria-label', 'הצגת ' + short + ' על המפה');
						pin.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 21s-7-5.3-7-11a7 7 0 0114 0c0 5.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/></svg> על המפה';
						pin.addEventListener('click', function (ev) {
							ev.preventDefault();
							ev.stopPropagation();
							activeLayer = 'lawyer';
							activeArea = short;
							selectChip(document.querySelector('.jtcm-chipbtn[data-area="' + short.replace(/"/g, '\\"') + '"]'));
							applyFilters();
							wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
						});
						if (card.parentElement) { card.parentElement.appendChild(pin); }
					});
				}

				// Deep link: /?map_area=דיני משפחה pre-filters the map.
				function applyUrlArea() {
					try {
						var q = new URLSearchParams(window.location.search).get('map_area');
						if (q) {
							activeLayer = 'lawyer';
							activeArea = q;
							applyFilters();
						}
					} catch (e) {}
				}

				map.on('load', function () {
					try { map.setConfigProperty('basemap', 'lightPreset', 'day'); } catch (e) {}

					// Precompute each free office's nearest PAYING office within
					// the interception radius. Paid count is tiny, so this is
					// features×paid, effectively linear.
					var NEAR_KM = 3;
					var paidRegistry = [];
					premium.forEach(function (f) {
						paidRegistry.push({ feature: f, el: null });
					});

					function nearestPaid(coords) {
						var best = null, bestKm = Infinity;
						paidRegistry.forEach(function (r) {
							var km = haversineKm(coords, r.feature.geometry.coordinates);
							if (km < bestKm) { bestKm = km; best = r; }
						});
						return (best && bestKm <= NEAR_KM) ? { reg: best, km: bestKm } : null;
					}

					features.forEach(function (f) {
						var p = f.properties || {};
						var isLawyer = p.kind === 'lawyer';
						var near = (isLawyer && !p.paid) ? nearestPaid(f.geometry.coordinates) : null;
						if (near) {
							p.nearPaid = {
								name: near.reg.feature.properties.name,
								url: near.reg.feature.properties.url,
								km: near.km
							};
						}
						var el = p.paid ? flagMarker(p) : (isLawyer ? dotMarker(p) : chipMarker(p));
						var marker = new mapboxgl.Marker({ element: el, anchor: p.paid ? 'bottom' : 'center' })
							.setLngLat(f.geometry.coordinates)
							.setPopup(new mapboxgl.Popup({ offset: 18, maxWidth: '280px' }).setHTML(popupHtml(p)))
							.addTo(map);
						if (p.paid) {
							el.style.zIndex = 5;
							paidRegistry.forEach(function (r) {
								if (r.feature === f) { r.el = el; }
							});
						}
						// Hovering a mute dot wakes its nearest paying neighbor:
						// the paid label pulses for a beat, so paid offices
						// intercept attention even around free dots.
						if (near) {
							el.addEventListener('mouseenter', function () {
								var hot = near.reg.el;
								if (!hot) { return; }
								hot.classList.add('is-hot');
								setTimeout(function () { hot.classList.remove('is-hot'); }, 1800);
							});
						}
						registry.push({ el: el, layer: layerKey(p), marker: marker, premium: !!p.paid, feature: f });
					});

					buildAreaChips();
					wirePracticeBand();
					applyUrlArea();
					applyFilters();

					// Declutter on national zoom: far out, non-premium chips fade
					// so the eye reads the country, not 40 fighting labels
					// (map-UX research: fade less critical data by zoom).
					map.on('zoom', function () {
						var far = map.getZoom() < 8.2;
						registry.forEach(function (r) {
							if (!r.premium) { r.el.style.opacity = far ? '0.35' : '1'; }
						});
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
									// Rest the camera on the lawyers, not the whole
									// national court spread, so the overview lands
									// where the paying offices are. Courts stay on
									// the map as labeled chips within the view.
									var lawyers = features.filter(function (f) { return f.properties && f.properties.kind === 'lawyer'; });
									var overview = lawyers.length ? lawyers : (premium.length ? premium : features);
									var bounds = new mapboxgl.LngLatBounds();
									overview.forEach(function (f) { bounds.extend(f.geometry.coordinates); });
									map.fitBounds(bounds, { padding: 140, pitch: 40, maxZoom: 13.4 });
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

				// "מצאו את הקרובים אליי": real browser geolocation; flies to
				// the visitor, opens the nearest visible office/court popup.
				// Honest failure: no location permission = quiet flight to the
				// national overview, never an invented position.
				var nearBtn = document.getElementById('jt-cinema-near');

				if (nearBtn) {
					nearBtn.addEventListener('click', function () {
						if (!navigator.geolocation) { return; }
						nearBtn.disabled = true;
						nearBtn.textContent = 'מאתר...';
						navigator.geolocation.getCurrentPosition(function (pos) {
							userTookOver = true;
							if (orbitFrame) { cancelAnimationFrame(orbitFrame); }
							var here = [pos.coords.longitude, pos.coords.latitude];
							map.flyTo({ center: here, zoom: 12.2, pitch: 45, speed: 1.1, essential: true });
							var best = null, bestKm = Infinity;
							registry.forEach(function (r) {
								if (r.el.style.display === 'none') { return; }
								var km = haversineKm(here, r.feature.geometry.coordinates);
								if (km < bestKm) { bestKm = km; best = r; }
							});
							if (best) {
								map.once('moveend', function () { best.marker.togglePopup(); });
							}
							nearBtn.disabled = false;
							nearBtn.textContent = 'מצאו את הקרובים אליי';
						}, function () {
							nearBtn.disabled = false;
							nearBtn.textContent = 'מצאו את הקרובים אליי';
							map.flyTo({ center: [34.86, 31.95], zoom: 7.2, essential: true });
						}, { timeout: 8000, maximumAge: 120000 });
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
