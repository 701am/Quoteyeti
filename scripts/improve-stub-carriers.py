#!/usr/bin/env python3
"""
Improve stub treatment for less-familiar carriers (Path C).

For each carrier we don't have enough editorial confidence to score, we:
1. Keep the pending ScoreGauge and "Scoring in progress" stub-notice
2. Add a "Reference notes" section with cleaned WordPress prose
3. Add a "Quick facts" section with structured data we know

The WP prose is framed clearly as "source material from prior coverage" —
NOT as the v2 editorial voice. This keeps the editorial line honest:
we have information about these carriers, we're surfacing it, but we're
not pretending it's our scored work product.

These 36 are not the major regionals (which got scored) and not the
miscategorized aggregators (which got demoted). They're smaller regional
carriers, specialty insurers, and niche-market carriers where we don't
have enough public reputation signal to score defensibly.
"""
import json
import re
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
WP_JSON = ROOT / 'scripts' / 'wp-carriers.json'
REVIEWS_DIR = ROOT / 'src' / 'content' / 'auto' / 'reviews'

# These 36 carriers need improved stub treatment (not scoring)
TARGETS = {
    'allied-car-insurance', 'american-independent-insurance', 'american-national-insurance',
    'arrowhead-general-car-insurance', 'bear-river-mutual-insurance', 'bluefire-car-insurance',
    'california-casualty-insurance', 'cameron-car-insurance', 'co-operative-insurance',
    'columbia-car-insurance', 'cure-auto-insurance', 'elephant-car-insurance',
    'emc-car-insurance', 'encova-insurance', 'fred-loya-car-insurance',
    'freedom-nation-insurance', 'grange-mutual-auto-insurance', 'gulfstream-insurance',
    'infinity-car-insurance', 'la-familia-auto-insurance', 'maine-mutual-group-insurance',
    'merchants-insurance-group-car-insurance', 'motorist-mutual-car-insurance',
    'new-jersey-skylands-insurance', 'official-car-insurance', 'otto-car-insurance',
    'penn-national-car-insurance', 'pioneer-state-mutual-insurance', 'pronto-insurance',
    'provide-insurance', 'safeway-insurance', 'security-national', 'unique-car-insurance',
    'usagencies-car-insurance', 'victoria-insurance', 'western-national-car-insurance',
}


def yaml_str(s):
    if s is None: return '""'
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'


def normalize_name(name):
    """Strip trailing 'Auto' or 'Car' that get baked into WP titles."""
    n = re.sub(r'\s+(Auto|Car)$', '', name)
    return n.strip()


def clean_prose_paragraph(p):
    """
    Light cleanup on WP prose — collapse whitespace, fix obvious encoding issues.
    Doesn't attempt to rewrite the voice; that would mislead readers about authorship.
    """
    p = re.sub(r'\s+', ' ', p).strip()
    # Strip leading bullet-style markers
    p = re.sub(r'^[-•*]\s+', '', p)
    return p


def extract_quick_facts(carrier):
    """Build a list of quick-facts (label, value) pairs from what we have."""
    facts = []
    if carrier.get('address'):
        # Extract state from end of address
        m = re.search(r',\s*([A-Z]{2})\s*\d{5}', carrier['address'])
        if m:
            facts.append(('Headquartered', f"{m.group(1)}"))
        else:
            facts.append(('Headquartered', carrier['address']))
    if carrier.get('website'):
        # Strip protocol for display
        domain = re.sub(r'^https?://(?:www\.)?', '', carrier['website']).rstrip('/')
        facts.append(('Website', domain))
    if carrier.get('phone'):
        facts.append(('Phone', carrier['phone']))
    return facts


def build_improved_stub(slug, carrier):
    name = normalize_name(carrier['name'])
    today = date.today().isoformat()
    paragraphs = carrier.get('paragraphs') or []
    # Keep up to 4 paragraphs, clean them
    body_paras = [clean_prose_paragraph(p) for p in paragraphs[:4] if p.strip()]
    quick_facts = extract_quick_facts(carrier)
    
    state_match = re.search(r',\s*([A-Z]{2})\s*\d{5}', carrier.get('address') or '')
    state = state_match.group(1) if state_match else None
    
    if state:
        positioning = f"{name} is an auto insurance carrier headquartered in {state}. We're still finalizing the full editorial scoring for this carrier — what's on this page is the verified company facts, the source notes from our prior coverage, and the strengths and weaknesses we've identified so far."
    else:
        positioning = f"{name} is an auto insurance carrier in our coverage universe. We're still finalizing the full editorial scoring for this carrier — what's on this page is the verified company facts, the source notes from our prior coverage, and the strengths and weaknesses we've identified so far."
    
    lines = ['---']
    lines.append(f'title: {yaml_str(name + " Auto Insurance Review")}')
    lines.append(f'description: {yaml_str(f"{name} auto insurance: verified company facts and reference notes from prior coverage. Full editorial scoring in progress.")}')
    lines.append('')
    lines.append(f'company: {yaml_str(name)}')
    if carrier.get('logo_local'): lines.append(f'companyLogo: {yaml_str(carrier["logo_local"])}')
    if carrier.get('website'): lines.append(f'websiteUrl: {yaml_str(carrier["website"])}')
    if carrier.get('phone'): lines.append(f'phoneNumber: {yaml_str(carrier["phone"])}')
    if carrier.get('address'): lines.append(f'address: {yaml_str(carrier["address"])}')
    lines.append('')
    lines.append(f'positioning: {yaml_str(positioning)}')
    lines.append('')
    lines.append(f'updatedDate: {today}')
    lines.append(f'publishDate: {today}')
    lines.append('author: "QuoteYeti Editorial"')
    lines.append('editor: "QuoteYeti Editor"')
    lines.append('')
    
    # Pros & cons from WP (when present)
    pros = carrier.get('pros') or []
    cons = carrier.get('cons') or []
    if pros:
        lines.append('pros:')
        for p in pros: lines.append(f'  - {yaml_str(p)}')
    else:
        lines.append('pros: []')
    if cons:
        lines.append('cons:')
        for c in cons: lines.append(f'  - {yaml_str(c)}')
    else:
        lines.append('cons: []')
    lines.append('')
    
    # NEW: structured "reference notes" — prose paragraphs marked as source material
    if body_paras:
        lines.append('referenceNotes:')
        for p in body_paras:
            lines.append(f'  - {yaml_str(p)}')
        lines.append('')
    
    # NEW: quick-facts pairs
    if quick_facts:
        lines.append('quickFacts:')
        for label, value in quick_facts:
            lines.append(f'  - label: {yaml_str(label)}')
            lines.append(f'    value: {yaml_str(value)}')
        lines.append('')
    
    lines.append('---')
    return '\n'.join(lines)


def main():
    wp = {c['slug']: c for c in json.loads(WP_JSON.read_text())}
    written = 0
    for slug in TARGETS:
        if slug not in wp:
            print(f"  ✗ {slug}: not in WP data")
            continue
        out_path = REVIEWS_DIR / f"{slug}.md"
        out_path.write_text(build_improved_stub(slug, wp[slug]))
        name = normalize_name(wp[slug]['name'])
        para_count = len(wp[slug].get('paragraphs', []))
        print(f"  ✓ {name:<32} paragraphs={para_count}")
        written += 1
    print(f"\n✓ Improved {written} stub treatments")


if __name__ == '__main__':
    main()
