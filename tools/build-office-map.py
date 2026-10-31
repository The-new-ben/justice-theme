"""HAD-616: a light street plan of the blocks around Adv. Maya Rotenberg's office, from OpenStreetMap (ODbL).
Output: one SVG with a viewBox only, so an <img> of any shape crops it around the pin (preserveAspectRatio slice)."""
import json
import math
import sys

LAT, LON = 32.1096992, 34.8373336  # Google Maps place pin, read 31.10.2026
W, H = 640, 376  # the frame: +-400 m across, +-235 m down
HALF_M = 400.0
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src, encoding='utf-8'))

m_per_deg_lat = 111320.0
m_per_deg_lon = 111320.0 * math.cos(math.radians(LAT))
scale = (W / 2) / HALF_M  # px per metre
# The office sits 26 px under the centre, so the pin's head (not its tip) is in the middle of a cropped thumbnail.
OX, OY = W / 2, H / 2 + 26


def xy(p):
    dx = (p['lon'] - LON) * m_per_deg_lon * scale
    dy = (p['lat'] - LAT) * m_per_deg_lat * scale
    return round(OX + dx, 1), round(OY - dy, 1)


def path(geom, close=False):
    pts = [xy(p) for p in geom]
    s = 'M' + ' L'.join(f'{x:g} {y:g}' for x, y in pts)
    return s + ('Z' if close else '')


ROAD = {  # class: (width, casing)
    'trunk': (12, True), 'primary': (11, True), 'secondary': (10, True), 'tertiary': (9, True),
    'residential': (6.5, False), 'unclassified': (6, False), 'living_street': (5, False),
    'service': (3.5, False), 'pedestrian': (4, False),
}
parks, buildings, roads, foot = [], [], {}, []
for e in d['elements']:
    t, g = e.get('tags', {}), e.get('geometry')
    if not g:
        continue
    if t.get('leisure') == 'park' or t.get('landuse') == 'grass':
        parks.append(path(g, True))
    elif 'building' in t:
        buildings.append(path(g, True))
    elif t.get('highway') in ('footway',):
        foot.append(path(g))
    elif t.get('highway') in ROAD:
        roads.setdefault(t['highway'], []).append(path(g))

order = ['service', 'pedestrian', 'living_street', 'unclassified', 'residential', 'tertiary', 'secondary', 'primary', 'trunk']
svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="מפת הרחובות סביב המשרד, ראול ולנברג 18, תל אביב">',
       f'<rect width="{W}" height="{H}" fill="#EEF3F8"/>']
if parks:
    svg.append(f'<path fill="#DDE9EC" d="{" ".join(parks)}"/>')
if buildings:
    svg.append(f'<path fill="#DCE4EE" stroke="#CBD7E4" stroke-width=".6" d="{" ".join(buildings)}"/>')
if foot:
    svg.append(f'<path fill="none" stroke="#C3D1DF" stroke-width="1.2" stroke-dasharray="3 3" d="{" ".join(foot)}"/>')
for cls in order:
    if cls in roads and ROAD[cls][1]:
        svg.append(f'<path fill="none" stroke="#C3D1DF" stroke-width="{ROAD[cls][0] + 2}" stroke-linecap="round" stroke-linejoin="round" d="{" ".join(roads[cls])}"/>')
for cls in order:
    if cls in roads:
        svg.append(f'<path fill="none" stroke="#FFFFFF" stroke-width="{ROAD[cls][0]}" stroke-linecap="round" stroke-linejoin="round" d="{" ".join(roads[cls])}"/>')
cx, cy = OX, OY
# The pin's tip sits on the office; the halo marks the spot under it.
# The plan shows at about 250 px wide, so the pin is drawn large (a 29 px head on the 640 px frame).
svg.append(f'<ellipse cx="{cx:g}" cy="{cy:g}" rx="24" ry="9" fill="#14477D" fill-opacity=".2"/>')
svg.append(f'<path fill="#14477D" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round" d="M{cx:g} {cy:g}C{cx - 7:g} {cy - 15:g} {cx - 29:g} {cy - 29:g} {cx - 29:g} {cy - 51:g}A29 29 0 1 1 {cx + 29:g} {cy - 51:g}C{cx + 29:g} {cy - 29:g} {cx + 7:g} {cy - 15:g} {cx:g} {cy:g}Z"/>')
svg.append(f'<circle cx="{cx:g}" cy="{cy - 51:g}" r="11" fill="#FFFFFF"/>')
svg.append('</svg>')
open(out, 'w', encoding='utf-8', newline='\n').write('\n'.join(svg) + '\n')
print('parks', len(parks), 'buildings', len(buildings), 'foot', len(foot), {k: len(v) for k, v in roads.items()})
