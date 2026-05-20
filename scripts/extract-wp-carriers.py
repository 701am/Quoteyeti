#!/usr/bin/env python3
"""
Extract structured carrier data from the WordPress XML export.

Reads:    /mnt/user-data/uploads/quoteyeti_WordPress_2026-05-17.xml
Writes:   scripts/wp-carriers.json  (clean carrier records)
          scripts/download-carrier-logos.sh  (manifest of all 99 logo URLs)
"""
import re
import json
from pathlib import Path

SRC = '/mnt/user-data/uploads/quoteyeti_WordPress_2026-05-17.xml'

def text_of(html):
    """Strip tags + collapse whitespace."""
    if not html: return ""
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', html)).strip()

def clean_wp_blocks(raw):
    """Strip Gutenberg block comments."""
    return re.sub(r'<!--\s*/?wp:[^>]*-->', '', raw).strip()

def get_meta(item, key):
    m = re.search(
        rf'<wp:postmeta>\s*<wp:meta_key><!\[CDATA\[{re.escape(key)}\]\]></wp:meta_key>\s*<wp:meta_value><!\[CDATA\[(.*?)\]\]></wp:meta_value>\s*</wp:postmeta>',
        item, re.DOTALL,
    )
    return m.group(1) if m else None

def extract_list_after_anchor(html, anchor_id):
    """Find <h3 id="anchor_id">...</h3> then return the next <ul>'s <li> items."""
    m = re.search(rf'<h\d[^>]*id="{re.escape(anchor_id)}"[^>]*>.*?</h\d>(.*?)<h', html, re.DOTALL)
    if not m: return []
    chunk = m.group(1)
    ul_m = re.search(r'<ul[^>]*>(.*?)</ul>', chunk, re.DOTALL)
    if not ul_m: return []
    lis = re.findall(r'<li[^>]*>(.*?)</li>', ul_m.group(1), re.DOTALL)
    return [text_of(li) for li in lis if text_of(li)]

def extract_pros_cons_fallback(html):
    """Fallback: find a 'Pros and Cons' section, take next two ULs as pros + cons."""
    # Find any heading mentioning Pros and Cons / Advantages and Disadvantages / Benefits and Drawbacks
    m = re.search(
        r'<h\d[^>]*>(?:[^<]|<(?!/?h\d))*?(?:Pros\s+and\s+Cons|Advantages\s+and\s+Disadvantages|Benefits\s+and\s+Drawbacks)(?:[^<]|<(?!/?h\d))*?</h\d>(.*?)(?=<h2|$)',
        html, re.DOTALL | re.IGNORECASE,
    )
    if not m: return [], []
    chunk = m.group(1)
    # Find two ULs — pros first, cons second
    uls = re.findall(r'<ul[^>]*>(.*?)</ul>', chunk, re.DOTALL)
    if len(uls) < 2: return [], []
    pros = [text_of(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', uls[0], re.DOTALL)]
    cons = [text_of(li) for li in re.findall(r'<li[^>]*>(.*?)</li>', uls[1], re.DOTALL)]
    return [p for p in pros if p][:5], [c for c in cons if c][:5]

def extract_paragraphs(html, max_n=4):
    """Return first N substantial paragraphs as plain text."""
    paras = re.findall(r'<p>(.*?)</p>', html, re.DOTALL)
    out = []
    for p in paras:
        t = text_of(p)
        if t and len(t) > 40 and not t.lower().startswith('click here'):
            out.append(t)
        if len(out) >= max_n: break
    return out

def clean_name(title):
    """Allstate Insurance Review -> Allstate."""
    n = title
    for suffix in [' Insurance Review', ' Car Insurance Review', ' Auto Insurance Review',
                   ' Car Insurance', ' Auto Insurance', ' Insurance Group Review',
                   ' Insurance Company Review', ' Insurance', ' Review', ' Group']:
        if n.endswith(suffix):
            n = n[:-len(suffix)]
            break
    return n.strip()

def main():
    with open(SRC, 'r', encoding='utf-8') as f:
        content = f.read()

    items = re.findall(r'<item>(.*?)</item>', content, re.DOTALL)

    # Attachment ID -> URL map
    att_map = {}
    for it in items:
        if not re.search(r'<wp:post_type><!\[CDATA\[attachment\]\]>', it): continue
        pid = re.search(r'<wp:post_id>(\d+)</wp:post_id>', it)
        url = re.search(r'<wp:attachment_url><!\[CDATA\[(.*?)\]\]></wp:attachment_url>', it)
        if pid and url:
            att_map[pid.group(1)] = url.group(1)

    # Filter to actual review items (skip nav_menu_items with same title)
    reviews = [
        it for it in items
        if re.search(r'<wp:post_type><!\[CDATA\[review\]\]>', it)
    ]

    carriers = []
    for r in reviews:
        title_m = re.search(r'<title><!\[CDATA\[(.*?)\]\]></title>', r)
        link_m = re.search(r'<link>(.*?)</link>', r)
        if not title_m or not link_m: continue

        title = title_m.group(1)
        slug = link_m.group(1).rstrip('/').split('/')[-1]

        cdata_start = r.find('<content:encoded><![CDATA[')
        cdata_end = r.find(']]></content:encoded>')
        raw = r[cdata_start+26:cdata_end] if cdata_start >= 0 and cdata_end > cdata_start else ''
        body = clean_wp_blocks(raw)

        logo_id = get_meta(r, 'company_logo')
        logo_url = att_map.get(logo_id) if logo_id else None
        logo_filename = logo_url.split('/')[-1].lower() if logo_url else None

        pros = extract_list_after_anchor(body, 'pros')[:5]
        cons = extract_list_after_anchor(body, 'cons')[:5]
        if not pros and not cons:
            pros, cons = extract_pros_cons_fallback(body)

        carriers.append({
            'title': title,
            'name': clean_name(title),
            'slug': slug,
            'logo_url': logo_url,
            'logo_filename': logo_filename,
            'logo_local': f"/assets/images/carriers/{logo_filename}" if logo_filename else None,
            'website': get_meta(r, 'website_url'),
            'phone': get_meta(r, 'phone_number'),
            'address': get_meta(r, 'address'),
            'paragraphs': extract_paragraphs(body, max_n=4),
            'pros': pros,
            'cons': cons,
        })

    # Write JSON
    out_json = Path(__file__).parent / 'wp-carriers.json'
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump(carriers, f, indent=2)

    # Write logo download manifest as a bash script
    out_sh = Path(__file__).parent / 'download-carrier-logos.sh'
    lines = [
        '#!/usr/bin/env bash',
        '# Download all 99 carrier logos from the WordPress media library.',
        '# Run from project root: bash scripts/download-carrier-logos.sh',
        'set -e',
        'DEST="public/assets/images/carriers"',
        'mkdir -p "$DEST"',
        'echo "Downloading 99 carrier logos to $DEST..."',
        '',
    ]
    seen = set()
    for c in carriers:
        if not c['logo_url'] or c['logo_filename'] in seen: continue
        seen.add(c['logo_filename'])
        lines.append(f'curl -fsSL "{c["logo_url"]}" -o "$DEST/{c["logo_filename"]}" && echo "  ✓ {c["logo_filename"]}" || echo "  ✗ FAILED {c["logo_filename"]}"')
    lines.append('')
    lines.append('echo "Done. Run: ls -la $DEST"')
    out_sh.write_text('\n'.join(lines))
    out_sh.chmod(0o755)

    # Summary
    with_pros = sum(1 for c in carriers if c['pros'])
    with_cons = sum(1 for c in carriers if c['cons'])
    with_logo = sum(1 for c in carriers if c['logo_url'])
    with_paras = sum(1 for c in carriers if c['paragraphs'])

    print(f"✓ {len(carriers)} carriers extracted")
    print(f"  Logo URLs:       {with_logo}/{len(carriers)}")
    print(f"  Paragraphs:      {with_paras}/{len(carriers)}")
    print(f"  Pros parsed:     {with_pros}/{len(carriers)}")
    print(f"  Cons parsed:     {with_cons}/{len(carriers)}")
    print(f"\n  → {out_json}")
    print(f"  → {out_sh}")

if __name__ == '__main__':
    main()
