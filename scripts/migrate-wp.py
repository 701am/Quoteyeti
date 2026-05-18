#!/usr/bin/env python3
"""
WordPress XML → Astro Markdown migration script.

Scope: glossary, faq, brand post types only.
Marks all migrated content as draft: true for human review.

Usage:
    python3 scripts/migrate-wp.py
"""

import re
import os
import sys
import html2text
from pathlib import Path

WP_XML = "/mnt/user-data/uploads/quoteyeti_WordPress_2026-05-17.xml"
ROOT = Path("/home/claude/quoteyeti-v2/src/content")

# Output directories — separate from existing content so editor can review
MIGRATED_GLOSSARY = ROOT / "auto" / "glossary"   # Same dir; check before write
MIGRATED_FAQS = ROOT / "auto" / "faqs"
MIGRATED_BRANDS = ROOT / "auto" / "brands"


def load_wp_items(path):
    """Stream items from WP XML."""
    with open(path, encoding="utf-8") as f:
        content = f.read()
    items = re.findall(r"<item>(.*?)</item>", content, flags=re.DOTALL)
    return items


def extract_cdata(item, field):
    """Extract <field><![CDATA[...]]></field> value."""
    m = re.search(
        rf"<{re.escape(field)}><!\[CDATA\[(.*?)\]\]></{re.escape(field)}>",
        item,
        flags=re.DOTALL,
    )
    return m.group(1) if m else None


def extract_field(item, field):
    """Extract <field>...</field> (non-CDATA)."""
    m = re.search(
        rf"<{re.escape(field)}>(.*?)</{re.escape(field)}>",
        item,
        flags=re.DOTALL,
    )
    return m.group(1).strip() if m else None


def extract_post_type(item):
    m = re.search(r"<wp:post_type><!\[CDATA\[([^\]]+)\]\]", item)
    return m.group(1) if m else None


def get_item_status(item):
    m = re.search(r"<wp:status><!\[CDATA\[([^\]]+)\]\]", item)
    return m.group(1) if m else None


def get_item_slug(item):
    m = re.search(r"<wp:post_name><!\[CDATA\[([^\]]+)\]\]", item)
    return m.group(1) if m else None


def get_item_date(item, field="wp:post_date"):
    m = re.search(
        rf"<{re.escape(field)}><!\[CDATA\[([^\]]+)\]\]",
        item,
    )
    if not m:
        return None
    date_str = m.group(1).strip()
    # Format: "2023-03-21 12:00:00" → take date part
    return date_str.split(" ")[0] if date_str else None


def get_item_creator(item):
    m = re.search(r"<dc:creator><!\[CDATA\[([^\]]+)\]\]", item)
    return m.group(1) if m else None


def get_title(item):
    return extract_cdata(item, "title")


def get_content(item):
    return extract_cdata(item, "content:encoded") or ""


def clean_wp_blocks(html):
    """Remove WordPress Gutenberg block comments."""
    # Strip <!-- wp:* --> and <!-- /wp:* --> comments
    html = re.sub(r"<!--\s*/?wp:[^-]+-->", "", html)
    # Strip wp-specific divs (figures etc) — keep their inner content
    return html.strip()


def html_to_markdown(html):
    """Convert WP HTML to clean markdown."""
    h = html2text.HTML2Text()
    h.body_width = 0  # don't wrap
    h.ignore_images = True  # we don't have image hosting set up yet
    h.ignore_emphasis = False
    h.skip_internal_links = True
    h.protect_links = True
    return h.handle(html).strip()


def yaml_escape(s):
    """Escape a string for safe YAML frontmatter."""
    if s is None:
        return ""
    s = str(s)
    # Escape backslashes first
    s = s.replace("\\", "\\\\")
    # Replace double quotes with escaped
    s = s.replace('"', '\\"')
    return s


def write_glossary_entry(item, dry_run=False):
    title = get_title(item)
    slug = get_item_slug(item)
    if not (title and slug):
        return None

    date = get_item_date(item) or "2023-03-21"
    creator = get_item_creator(item) or "QuoteYeti Editorial"

    raw_html = clean_wp_blocks(get_content(item))
    if not raw_html or len(raw_html.strip()) < 50:
        return None  # Skip empty entries

    body_md = html_to_markdown(raw_html)

    # Generate frontmatter matching auto-glossary schema
    fm = f"""---
title: "{yaml_escape(title)} — Auto Insurance Glossary"
term: "{yaml_escape(title)}"
description: ""
publishDate: {date}
draft: true
author: "{yaml_escape(creator)}"
---

{body_md}
"""

    out_path = MIGRATED_GLOSSARY / f"{slug}.md"
    if not dry_run:
        # Don't overwrite existing handwritten content
        if out_path.exists():
            existing = out_path.read_text()
            if "draft: true" not in existing:
                # Hand-written, skip
                return ("skipped-exists", slug)
        out_path.write_text(fm, encoding="utf-8")
    return ("wrote", slug)


def write_faq_entry(item, dry_run=False):
    title = get_title(item)
    slug = get_item_slug(item)
    if not (title and slug):
        return None

    date = get_item_date(item) or "2023-03-21"
    creator = get_item_creator(item) or "QuoteYeti Editorial"

    raw_html = clean_wp_blocks(get_content(item))
    if not raw_html or len(raw_html.strip()) < 50:
        return None

    body_md = html_to_markdown(raw_html)

    fm = f"""---
title: "{yaml_escape(title)}"
question: "{yaml_escape(title)}"
description: ""
category: "Migrated"
publishDate: {date}
draft: true
author: "{yaml_escape(creator)}"
---

{body_md}
"""

    out_path = MIGRATED_FAQS / f"{slug}.md"
    if not dry_run:
        if out_path.exists():
            existing = out_path.read_text()
            if "draft: true" not in existing:
                return ("skipped-exists", slug)
        out_path.write_text(fm, encoding="utf-8")
    return ("wrote", slug)


def write_brand_entry(item, dry_run=False):
    title = get_title(item)
    slug = get_item_slug(item)
    if not (title and slug):
        return None

    date = get_item_date(item) or "2023-03-21"
    creator = get_item_creator(item) or "QuoteYeti Editorial"

    raw_html = clean_wp_blocks(get_content(item))
    if not raw_html or len(raw_html.strip()) < 50:
        return None

    body_md = html_to_markdown(raw_html)

    # Try to extract a brand name from title — title is often "[Brand] Insurance Review" etc.
    brand_guess = title.split(" Insurance")[0].strip() if " Insurance" in title else ""

    fm = f"""---
title: "{yaml_escape(title)}"
description: ""
brand: "{yaml_escape(brand_guess)}"
tags: ["migrated"]
publishDate: {date}
draft: true
author: "{yaml_escape(creator)}"
---

{body_md}
"""

    out_path = MIGRATED_BRANDS / f"{slug}.md"
    if not dry_run:
        if out_path.exists():
            existing = out_path.read_text()
            if "draft: true" not in existing:
                return ("skipped-exists", slug)
        out_path.write_text(fm, encoding="utf-8")
    return ("wrote", slug)


def main():
    items = load_wp_items(WP_XML)
    print(f"Loaded {len(items)} items from WP export")

    counts = {"glossary": {"wrote": 0, "skipped-exists": 0, "empty": 0},
              "faq": {"wrote": 0, "skipped-exists": 0, "empty": 0},
              "brand": {"wrote": 0, "skipped-exists": 0, "empty": 0}}

    for item in items:
        if get_item_status(item) != "publish":
            continue
        ptype = extract_post_type(item)

        if ptype == "glossary":
            result = write_glossary_entry(item)
        elif ptype == "faq":
            result = write_faq_entry(item)
        elif ptype == "brand":
            result = write_brand_entry(item)
        else:
            continue

        if result is None:
            counts[ptype]["empty"] += 1
        else:
            counts[ptype][result[0]] += 1

    print("\n=== Migration summary ===")
    for ptype, c in counts.items():
        total = sum(c.values())
        print(f"  {ptype}: {c['wrote']} written, {c['skipped-exists']} skipped (existing), {c['empty']} empty — total seen: {total}")


if __name__ == "__main__":
    main()
