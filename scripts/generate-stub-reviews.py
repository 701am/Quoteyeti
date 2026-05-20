#!/usr/bin/env python3
"""
Generate new auto carrier review markdown files from WordPress data.

For each WP carrier NOT already in src/content/auto/reviews/, write a frontmatter file
with the data we trust (logo, facts, prose, pros/cons) and explicitly omit data we don't
(no fake star ratings, no fake cost numbers, no fake industry ratings).

The ReviewLayout has been modified to handle stub-mode gracefully — sections without
data simply don't render, and the Ratings slot shows a "Scoring in progress" notice.
"""
import json
import re
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
WP_JSON = ROOT / 'scripts' / 'wp-carriers.json'
OUT_DIR = ROOT / 'src' / 'content' / 'auto' / 'reviews'

def yaml_escape(s):
    """Escape a string for YAML double-quoted context. Collapses newlines to spaces."""
    if s is None: return ""
    s = re.sub(r'\s+', ' ', s).strip()
    return s.replace('\\', '\\\\').replace('"', '\\"')

def normalize_carrier_name(name):
    """Strip trailing 'Auto' or 'Car' so titles don't read 'X Auto Auto Insurance'."""
    # Remove trailing 'Auto', 'Car', 'Mutual' that the WP titles bake in redundantly
    n = re.sub(r'\s+(Auto|Car)$', '', name)
    return n.strip()

def positioning_for(carrier):
    """
    Build a 1-2 sentence positioning line.
    Honest framing for stubs: state what we have (carrier exists, has these facts)
    and that scoring is in progress. We don't pretend the WP prose is our editorial voice.
    """
    name = normalize_carrier_name(carrier['name'])
    hq = carrier.get('address') or ''
    # Pull state from end of address if present
    state_match = re.search(r',\s*([A-Z]{2})\s*\d{5}', hq)
    state = state_match.group(1) if state_match else None
    
    if state:
        opener = f"{name} is an auto insurance carrier headquartered in {state}."
    else:
        opener = f"{name} is an auto insurance carrier in our coverage universe."
    
    closer = "We're still finalizing the editorial scoring for this carrier — what's on this page is the verified company facts plus the strengths and weaknesses we've identified so far."
    return f"{opener} {closer}"

def build_markdown(carrier):
    name = normalize_carrier_name(carrier['name'])
    slug = carrier['slug']
    today = date.today().isoformat()
    
    # Field accumulation
    lines = ['---']
    lines.append(f'title: "{yaml_escape(name)} Auto Insurance Review"')
    lines.append(f'description: "{yaml_escape(name)} auto insurance: verified company facts, our editorial analysis, and the strengths and weaknesses you should know before requesting a quote."')
    lines.append('')
    lines.append(f'company: "{yaml_escape(name)}"')
    if carrier.get('logo_local'):
        lines.append(f'companyLogo: "{carrier["logo_local"]}"')
    if carrier.get('website'):
        lines.append(f'websiteUrl: "{yaml_escape(carrier["website"])}"')
    if carrier.get('phone'):
        lines.append(f'phoneNumber: "{yaml_escape(carrier["phone"])}"')
    if carrier.get('address'):
        lines.append(f'address: "{yaml_escape(carrier["address"])}"')
    lines.append('')
    lines.append(f'positioning: "{yaml_escape(positioning_for(carrier))}"')
    lines.append('')
    lines.append(f'updatedDate: {today}')
    lines.append(f'publishDate: {today}')
    lines.append('author: "QuoteYeti Editorial"')
    lines.append('editor: "QuoteYeti Editor"')
    lines.append('')
    
    # Pros & Cons — only when we have real data from WordPress
    pros = carrier.get('pros') or []
    cons = carrier.get('cons') or []
    if pros:
        lines.append('pros:')
        for p in pros:
            lines.append(f'  - "{yaml_escape(p)}"')
    else:
        lines.append('pros: []')
    if cons:
        lines.append('cons:')
        for c in cons:
            lines.append(f'  - "{yaml_escape(c)}"')
    else:
        lines.append('cons: []')
    lines.append('')
    
    # Takeaways: leave empty (defaults to []) so the takeaways section is sparse for stubs
    # NO overallScore, ratings, cost data — schema is now permissive and layout gracefully omits
    
    lines.append('---')
    lines.append('')
    # No body content for stubs — the layout will render facts + pros/cons + stub-notice.
    # Dumping uneven WP prose would dilute the v2 editorial register.
    
    return '\n'.join(lines)

def main():
    wp = json.loads(WP_JSON.read_text())
    
    # Find which slugs already exist in v2 (across all verticals — we only want truly new)
    existing = {f.stem for f in (ROOT / 'src' / 'content').rglob('reviews/*.md')}
    new_carriers = [c for c in wp if c['slug'] not in existing]
    
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    created = 0
    skipped = 0
    
    for c in new_carriers:
        out_path = OUT_DIR / f"{c['slug']}.md"
        if out_path.exists():
            skipped += 1
            continue
        out_path.write_text(build_markdown(c))
        created += 1
    
    print(f"✓ Created {created} new carrier review pages")
    print(f"  Skipped (already exist): {skipped}")
    print(f"  → {OUT_DIR}/")

if __name__ == '__main__':
    main()
