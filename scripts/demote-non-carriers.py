#!/usr/bin/env python3
"""
Demote 7 entities that aren't insurance carriers:
- 6 lead-gen marketplaces / comparison platforms
- 1 credit bureau (Experian)

Rewrite their positioning to be honest about what they are,
set entityType to 'aggregator' or 'non-carrier',
and point readers to actual carriers.
"""
import json
import re
from pathlib import Path
from datetime import date

ROOT = Path(__file__).resolve().parent.parent
WP_JSON = ROOT / 'scripts' / 'wp-carriers.json'
REVIEWS_DIR = ROOT / 'src' / 'content' / 'auto' / 'reviews'


def yaml_str(s):
    if s is None: return '""'
    s = re.sub(r'\s+', ' ', s).strip()
    s = s.replace('\\', '\\\\').replace('"', '\\"')
    return f'"{s}"'


DEMOTIONS = {
    'insurance-io': {
        'name': 'Insurance.io',
        'entityType': 'aggregator',
        'positioning': "Insurance.io is an online insurance comparison platform — it doesn't underwrite policies. When you request a quote, your information is shared with insurance carriers and agents who then contact you with their own offers. We've kept this page as a reference but corrected the categorization: this is a marketplace, not a carrier.",
        'banner_lede': "Insurance.io is a comparison marketplace, not an insurance carrier.",
        'banner_explain': "Comparison platforms don't write policies — they collect your information and pass it to carriers, agents, or partners who then contact you with their own offers. The carriers behind any quote you get from Insurance.io will be standalone companies you can also shop directly. Use Insurance.io if you want a one-form-to-many-carriers experience, but be aware that your contact details may be shared widely.",
    },
    'fast-insurance-rates': {
        'name': 'Fast Insurance Rates',
        'entityType': 'aggregator',
        'positioning': "Fast Insurance Rates is a lead-generation marketplace, not an insurance carrier. It collects shopper information and routes it to carriers and agent partners for follow-up quotes. We've kept this page as a reference but corrected the categorization.",
        'banner_lede': "Fast Insurance Rates is a lead-generation marketplace, not an insurance carrier.",
        'banner_explain': "Lead-generation platforms collect your contact information and sell it (or share it) with insurance carriers, agents, and other marketers who then reach out with their own offers. This isn't the same as buying a policy from a carrier directly. If you want to compare carriers in one place, our auto rankings cover the major options; if you want to shop a specific carrier, go to that carrier's website directly.",
    },
    'insurance-quotes': {
        'name': 'InsuranceQuotes.com',
        'entityType': 'aggregator',
        'positioning': "InsuranceQuotes.com is a comparison marketplace operated by QuinStreet, not an insurance carrier. It collects shopper information and matches it to carrier and agent partners. We've kept this page as a reference but corrected the categorization.",
        'banner_lede': "InsuranceQuotes.com is a comparison marketplace, not an insurance carrier.",
        'banner_explain': "Comparison platforms don't underwrite policies — they collect your information and route it to insurance carriers and agents who then send you quotes. The carriers you'd ultimately buy from are listed in our actual carrier rankings, where you can also shop them directly.",
    },
    'ultimate-insurance-review': {
        'name': 'UltimateInsurance.com',
        'entityType': 'aggregator',
        'positioning': "UltimateInsurance.com is an insurance comparison platform, not a carrier. It connects shoppers to insurance carriers and agent partners for follow-up quotes. We've kept this page as a reference but corrected the categorization.",
        'banner_lede': "UltimateInsurance.com is a comparison platform, not an insurance carrier.",
        'banner_explain': "Comparison sites don't write policies — they collect your information and share it with carriers and agents who then contact you. For carrier-direct shopping, our auto rankings cover the major options. Use a comparison site if you want a single form to reach multiple carriers, but be aware of lead-sharing practices.",
    },
    'carinsurance-net-insurance-review': {
        'name': 'CarInsurance.net',
        'entityType': 'aggregator',
        'positioning': "CarInsurance.net is an auto insurance lead-generation site, not a carrier. It collects shopper information and routes it to insurance carriers and agents for quote follow-up. We've kept this page as a reference but corrected the categorization.",
        'banner_lede': "CarInsurance.net is a lead-generation site, not an insurance carrier.",
        'banner_explain': "Lead-generation platforms collect your contact information and sell it to insurance carriers, agents, and marketing partners. The carriers behind any quote you receive are standalone companies you could also approach directly. Our auto rankings cover the major carriers if you want to shop them yourself.",
    },
    'insurify-car-insurance': {
        'name': 'Insurify',
        'entityType': 'aggregator',
        'positioning': "Insurify is a venture-funded auto insurance comparison platform — it doesn't underwrite policies. You enter your information once and Insurify queries multiple carriers for quotes. We've kept this page as a reference but corrected the categorization: Insurify is a comparison tool, not a carrier.",
        'banner_lede': "Insurify is an auto insurance comparison platform, not a carrier.",
        'banner_explain': "Insurify is one of the better-known comparison platforms — it shows you real-time quotes from multiple carriers based on a single application. Unlike pure lead-gen sites, Insurify displays carrier quotes side-by-side so you can compare and choose. The carriers behind those quotes (Progressive, Liberty Mutual, etc.) are the actual underwriters; Insurify is the matching layer. Use Insurify if you want one form to query multiple carriers; use our carrier rankings if you want editorial assessment of who's actually worth buying from.",
    },
    'experian-insurance-review': {
        'name': 'Experian',
        'entityType': 'non-carrier',
        'positioning': "Experian is a credit reporting bureau, not an insurance carrier. Experian operates a small insurance comparison feature within its consumer platform, but the company itself doesn't underwrite auto insurance. We've kept this page as a reference but corrected the categorization.",
        'banner_lede': "Experian is a credit bureau, not an insurance carrier.",
        'banner_explain': "Experian is one of the three major U.S. credit reporting agencies. It does operate a small insurance comparison feature within its consumer products that connects users to carriers, but Experian itself isn't an insurance company and doesn't write policies. If you arrived here looking for auto insurance, our carrier rankings cover the actual carriers worth considering. If you arrived looking for credit-monitoring services, you want Experian's main consumer site, not an insurance review.",
    },
}


def build_demoted(slug, wp_data, demotion):
    name = demotion['name']
    today = date.today().isoformat()
    
    lines = ['---']
    lines.append(f'title: {yaml_str(name + " — Comparison Platform, Not a Carrier")}')
    lines.append(f'description: {yaml_str(f"{name} is a comparison marketplace or lead-generation site, not an insurance carrier. Here is what it actually does and where to find real carrier reviews.")}')
    lines.append('')
    lines.append(f'company: {yaml_str(name)}')
    if wp_data.get('logo_local'): lines.append(f'companyLogo: {yaml_str(wp_data["logo_local"])}')
    if wp_data.get('website'): lines.append(f'websiteUrl: {yaml_str(wp_data["website"])}')
    if wp_data.get('phone'): lines.append(f'phoneNumber: {yaml_str(wp_data["phone"])}')
    if wp_data.get('address'): lines.append(f'address: {yaml_str(wp_data["address"])}')
    lines.append('')
    lines.append(f'entityType: {demotion["entityType"]}')
    lines.append('')
    lines.append(f'positioning: {yaml_str(demotion["positioning"])}')
    lines.append('')
    # Banner fields for the layout
    lines.append(f'aggregatorBannerLede: {yaml_str(demotion["banner_lede"])}')
    lines.append(f'aggregatorBannerExplain: {yaml_str(demotion["banner_explain"])}')
    lines.append('')
    lines.append(f'updatedDate: {today}')
    lines.append(f'publishDate: {today}')
    lines.append('author: "QuoteYeti Editorial"')
    lines.append('editor: "QuoteYeti Editor"')
    lines.append('')
    lines.append('pros: []')
    lines.append('cons: []')
    lines.append('---')
    return '\n'.join(lines)


def main():
    wp = {c['slug']: c for c in json.loads(WP_JSON.read_text())}
    written = 0
    for slug, demotion in DEMOTIONS.items():
        if slug not in wp:
            print(f"  ✗ {demotion['name']}: not in WP data")
            continue
        out_path = REVIEWS_DIR / f"{slug}.md"
        out_path.write_text(build_demoted(slug, wp[slug], demotion))
        print(f"  ✓ {demotion['name']:<28} → {demotion['entityType']}")
        written += 1
    print(f"\n✓ Demoted {written} non-carriers")


if __name__ == '__main__':
    main()
