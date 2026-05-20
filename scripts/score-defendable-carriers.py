#!/usr/bin/env python3
"""
Score the 39 defendable regional/specialty carriers.

Approach: editorial scoring (CX/coverage/cost), descriptive prose, real pros/cons.
NO invented JD Power numbers, NAIC ratios, or dollar rates.
Concise but honest — these are smaller carriers; brevity is appropriate.
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


# 39 carriers with editorial scoring + assessment
# Sub-score ranges: CX (1-5), Coverage (1-5), Cost (1-5)
# Overall = simple average (matching prior reviews convention)
PROFILES = {
    # ============ TIER 1 - TOP REGIONAL MUTUALS ============
    'njm-insurance-group': {
        'name': 'NJM',
        'cx': 4.8, 'coverage': 4.2, 'cost': 4.0,
        'takeaways': [
            "NJM consistently tops customer-satisfaction rankings in personal lines — it's the carrier most often used as a benchmark for what good claims handling looks like.",
            "Eligibility is restricted: New Jersey, Pennsylvania, Ohio, Maryland, and Connecticut. Outside that footprint, it isn't an option.",
            "Mutual structure with no shareholders — the value math favors policyholders rather than profit margins.",
        ],
        'positioning': "NJM is a mutual carrier with one of the strongest customer-satisfaction reputations in the industry. Originally serving New Jersey state employees and now open to general residents in five states, NJM is the kind of carrier insurance industry insiders quietly recommend to family. The eligibility footprint is the only real catch.",
        'pros_template': [
            "Industry-leading customer satisfaction in independent surveys year after year",
            "Mutual structure means dividends to policyholders, not shareholders",
            "Strong claims-handling reputation with very low complaint volumes",
            "Competitive pricing for clean records and mature drivers in its footprint",
        ],
        'cons_template': [
            "Only available in NJ, PA, OH, MD, and CT — no national availability",
            "Limited brand presence and ad spend means fewer people know it exists",
            "Less aggressive on telematics and usage-based programs than digital natives",
        ],
        'bottomLine': "If you're in NJ, PA, OH, MD, or CT, get a quote. NJM is one of the carriers most likely to actually deliver on what every insurance ad promises.",
    },
    'meemic-car-insurance': {
        'name': 'MEEMIC',
        'cx': 4.3, 'coverage': 3.9, 'cost': 3.7,
        'takeaways': [
            "MEEMIC was founded specifically to serve Michigan educators, and its policyholder base still skews heavily toward teachers and education staff.",
            "Now part of Auto-Owners family, MEEMIC inherits a solid claims-handling reputation.",
            "Available only in Michigan; coverage and pricing are competitive in-state but irrelevant elsewhere.",
        ],
        'positioning': "MEEMIC started as the Michigan Education Employees Mutual Insurance Company and still leans heavily into that origin — many policies trace back to educators. Owned by Auto-Owners since 1998, MEEMIC carries the parent's solid customer-satisfaction reputation while remaining a Michigan-only carrier.",
        'pros_template': [
            "Strong customer satisfaction reputation, particularly among education professionals",
            "Backed by Auto-Owners — solid financial strength and claims infrastructure",
            "Competitive group discounts for school employees, administrators, and retirees",
            "Local Michigan agent presence with deep state-specific expertise",
        ],
        'cons_template': [
            "Michigan-only — not available anywhere else in the U.S.",
            "Eligibility tilts toward education-affiliated drivers (though now open more broadly)",
            "Less digital self-service than national pure-plays",
        ],
        'bottomLine': "If you're in Michigan with any connection to education — current employee, retired, family member — MEEMIC deserves a quote. Outside Michigan it isn't an option.",
    },
    'wawanesa-insurance': {
        'name': 'Wawanesa',
        'cx': 4.1, 'coverage': 3.8, 'cost': 4.3,
        'takeaways': [
            "Wawanesa is a Canadian-owned mutual that's been a hidden value in California and Oregon for decades.",
            "Rates are consistently among the most competitive in California, often beating GEICO and Progressive for clean records.",
            "Coverage menu is intentionally lean — Wawanesa isn't trying to sell add-ons, it's trying to underwrite well and price honestly.",
        ],
        'positioning': "Wawanesa is the California-and-Oregon mutual that consistently surfaces as the cheapest legit carrier for drivers with clean records. It's been quietly outperforming on price for decades, with a coverage menu that's deliberately simpler than the major nationals. Worth a quote if you're in either state.",
        'pros_template': [
            "Consistently among the lowest rates in California and Oregon for clean-record drivers",
            "Mutual structure with no shareholder pressure on premiums",
            "Solid claims-handling reputation in its operating states",
            "Streamlined coverage menu means less upselling pressure",
        ],
        'cons_template': [
            "Available only in California and Oregon",
            "Less competitive for high-risk drivers — Wawanesa underwrites tight",
            "Fewer optional coverages than the big nationals (no rideshare endorsement, limited usage-based)",
        ],
        'bottomLine': "California or Oregon driver with a clean record? Wawanesa should be in your quote set. It's the carrier most likely to deliver a noticeably lower rate without sacrificing claims quality.",
    },
    'plymouth-rock-insurance': {
        'name': 'Plymouth Rock',
        'cx': 3.9, 'coverage': 4.0, 'cost': 3.6,
        'takeaways': [
            "Plymouth Rock is a Northeast-focused regional, available primarily in Massachusetts, New Jersey, Pennsylvania, New Hampshire, and Connecticut.",
            "Strongest positioning is in Massachusetts, where it's been a major player since 1982.",
            "Coverage is solid for the Northeast market; pricing is mid-market with stronger competitiveness in MA than other states.",
        ],
        'positioning': "Plymouth Rock is a Northeast regional that earns most of its market share in Massachusetts. It's a respectable mid-tier choice with solid claims service in its footprint, but it isn't typically the cheapest quote — drivers shopping purely on price will usually find better at GEICO or Progressive.",
        'pros_template': [
            "Strong Northeast regional presence with deep MA market expertise",
            "Solid claims-handling reputation in its operating states",
            "Door-to-door claims service (in-person estimator visits) in select markets",
            "Competitive bundling discounts when paired with home or umbrella",
        ],
        'cons_template': [
            "Geographic limitation — Northeast only, with MA as the dominant market",
            "Pricing is mid-market, not a budget option",
            "Less digital self-service than national pure-plays",
        ],
        'bottomLine': "Plymouth Rock is a fine choice in Massachusetts and worth a quote in its other Northeast states, particularly if you value local claims service. If lowest price is the priority, look elsewhere.",
    },
    'cincinnati-insurance-company': {
        'name': 'Cincinnati Insurance',
        'cx': 4.4, 'coverage': 4.3, 'cost': 3.5,
        'takeaways': [
            "Cincinnati Insurance distributes exclusively through independent agents — no direct-to-consumer purchase.",
            "Strong claims-handling reputation; particularly well-regarded by agents who place complex coverage needs.",
            "Pricing is mid-market — the value proposition is service depth, not lowest rate.",
        ],
        'positioning': "Cincinnati Insurance is one of those carriers your independent agent might recommend if you're shopping for more than just the cheapest rate. It's a Midwest-rooted multi-line carrier with strong claims experience and broad coverage menus, but it requires going through an independent agency rather than buying online.",
        'pros_template': [
            "Strong claims-handling reputation across personal and commercial lines",
            "Deep coverage menu including high-value items and specialty risks",
            "Independent agent distribution — agents shop multiple carriers for you",
            "Consistent customer-satisfaction scores in the upper tier",
        ],
        'cons_template': [
            "No online quoting — every policy runs through an independent agency",
            "Pricing is mid-market, not a budget option",
            "Less brand recognition than national carriers",
        ],
        'bottomLine': "Cincinnati Insurance is a quiet standout — if you already work with an independent agent, ask them to include it in your comparison set. If you prefer to shop online, look elsewhere.",
    },

    # ============ TIER 2 - NON-STANDARD SPECIALTY ============
    'the-general-insurance': {
        'name': 'The General',
        'cx': 3.0, 'coverage': 3.0, 'cost': 3.8,
        'takeaways': [
            "The General specializes in non-standard auto — drivers with poor credit, lapses in coverage, recent tickets, or SR-22 requirements.",
            "Pricing is competitive specifically for high-risk profiles; standard-risk drivers will find significantly better rates elsewhere.",
            "Customer satisfaction scores trend below industry average — typical for the non-standard segment.",
        ],
        'positioning': "The General writes non-standard auto insurance for drivers who can't easily get coverage from mainstream carriers. It's the right answer when you have a hard-to-insure driving record; it's the wrong answer when you don't. Standard-risk drivers consistently find lower rates and better service at GEICO or Progressive.",
        'pros_template': [
            "Strong specialization in non-standard risk — accepts drivers others reject",
            "Quick online quotes including SR-22 filings",
            "Available in 45 states, broader than most non-standard competitors",
            "Affordable for high-risk profiles that mainstream carriers price out",
        ],
        'cons_template': [
            "Customer satisfaction and claims experience trend below industry averages",
            "Standard-risk drivers will pay more here than at mainstream carriers",
            "Coverage menu is intentionally minimal — limited add-on options",
        ],
        'bottomLine': "If you've been denied by mainstream carriers or need SR-22 filing, The General is a legitimate option. If you're a standard-risk driver, you're paying for risk pooling you don't need — get quotes from GEICO and Progressive first.",
    },
    'safeauto-insurance': {
        'name': 'SafeAuto',
        'cx': 3.0, 'coverage': 2.8, 'cost': 3.7,
        'takeaways': [
            "SafeAuto focuses on minimum-coverage policies in the 25 states where it operates — particularly drivers who only need to satisfy state legal requirements.",
            "Pricing is competitive specifically for state-minimum coverage; full-coverage shoppers will find better at mainstream carriers.",
            "Now owned by Allstate (acquired 2021) but operates as a separate non-standard brand.",
        ],
        'positioning': "SafeAuto's pitch is straightforward: minimum-coverage policies at competitive prices for drivers who need to be legal and not much more. It's a legitimate option for that narrow use case, but it isn't a substitute for proper coverage — the moment you need anything beyond state minimums, the math typically favors mainstream carriers.",
        'pros_template': [
            "Among the cheapest options for state-minimum-only coverage",
            "Now backed by Allstate's financial strength",
            "Quick online quotes including SR-22 filings",
        ],
        'cons_template': [
            "Limited coverage menu — designed primarily for minimum-coverage shoppers",
            "Customer satisfaction trends below industry average",
            "Available in only 25 states; not all customers get the same experience",
        ],
        'bottomLine': "SafeAuto is the right answer if you genuinely only need state-minimum liability and price is the only factor. For anyone needing real coverage, this isn't the carrier.",
    },
    'direct-auto-insurance': {
        'name': 'Direct Auto',
        'cx': 3.0, 'coverage': 2.9, 'cost': 3.6,
        'takeaways': [
            "Direct Auto is a non-standard carrier with a heavy retail-storefront model — primarily Southern U.S. markets.",
            "Pricing is competitive for high-risk profiles; the value proposition includes flexible payment plans for drivers without traditional credit.",
            "Owned by National General (which is owned by Allstate), so financial strength is solid even if the customer experience trends average.",
        ],
        'positioning': "Direct Auto operates in 13 mostly-Southern states with a retail-store distribution model that's unusual for the auto insurance business. It's a non-standard carrier whose pitch is flexible payment plans and walk-in service, not lowest rates in the market. Useful in its niche, not a fit for everyone.",
        'pros_template': [
            "Retail storefronts make in-person service accessible — useful for drivers who prefer it",
            "Flexible payment plans including monthly cash payments without credit checks",
            "Accepts non-standard risk that mainstream carriers reject",
            "Backed by National General / Allstate financial strength",
        ],
        'cons_template': [
            "Available in only 13 states, concentrated in the South and Southwest",
            "Customer satisfaction trends below industry averages",
            "Limited coverage menu compared to mainstream carriers",
        ],
        'bottomLine': "Direct Auto fits a specific niche — non-standard risk + cash-paying preference + retail-store access. Outside that profile, you'll typically find better rates and service at mainstream carriers.",
    },
    'dairyland-car-insurance': {
        'name': 'Dairyland',
        'cx': 3.1, 'coverage': 3.4, 'cost': 3.6,
        'takeaways': [
            "Dairyland specializes in non-standard auto and motorcycle insurance — particularly strong on motorcycle coverage.",
            "Owned by Sentry Insurance, which gives it solid financial backing despite the non-standard positioning.",
            "Available in 39 states for auto, broader for motorcycle.",
        ],
        'positioning': "Dairyland is a non-standard auto carrier that's particularly well-known for motorcycle insurance. It accepts drivers with tickets, accidents, or lapses that mainstream carriers reject, and offers SR-22 filings. For standard-risk auto-only drivers, mainstream carriers will typically beat it.",
        'pros_template': [
            "Strong motorcycle insurance specialization — often the cheapest moto quote",
            "Accepts non-standard auto risk including SR-22 needs",
            "Owned by Sentry — financial strength is solid",
            "Available in 39 states for auto",
        ],
        'cons_template': [
            "Customer satisfaction trends below industry averages",
            "Not competitive for standard-risk auto-only drivers",
            "Coverage menu is leaner than mainstream carriers",
        ],
        'bottomLine': "Dairyland is genuinely worth a quote if you have a motorcycle or non-standard auto risk. For standard-risk auto-only, look at GEICO and Progressive first.",
    },
    'bristol-west-car-insurance': {
        'name': 'Bristol West',
        'cx': 3.1, 'coverage': 3.3, 'cost': 3.6,
        'takeaways': [
            "Bristol West is Farmers' non-standard auto subsidiary — designed to serve drivers Farmers' main book wouldn't accept.",
            "Pricing is competitive for high-risk profiles including SR-22 requirements and recent claims.",
            "Customer satisfaction trends below average — typical for non-standard, not specific to Bristol West.",
        ],
        'positioning': "Bristol West is Farmers' non-standard arm, writing policies for drivers Farmers' main underwriting wouldn't accept — tickets, lapses, SR-22 needs. It's a legitimate non-standard option backed by Farmers' financial strength, but standard-risk drivers will consistently find better rates at GEICO or Progressive.",
        'pros_template': [
            "Backed by Farmers — strong financial backing for a non-standard carrier",
            "Accepts SR-22 filings and high-risk profiles",
            "Available in 41 states",
            "Quick online quotes",
        ],
        'cons_template': [
            "Customer satisfaction and claims experience trend below industry averages",
            "Not a fit for standard-risk drivers — rates are non-competitive there",
            "Limited coverage flexibility compared to mainstream Farmers policies",
        ],
        'bottomLine': "Bristol West makes sense for non-standard risk where Farmers' main book won't write you. Standard-risk drivers should shop mainstream first.",
    },
    'gainsco-insurance': {
        'name': 'GAINSCO',
        'cx': 2.9, 'coverage': 2.9, 'cost': 3.6,
        'takeaways': [
            "GAINSCO writes non-standard minimum-coverage auto in select Southern and Western markets.",
            "Pricing is competitive for SR-22 and high-risk drivers; broader use cases aren't well-served.",
            "Limited coverage menu — designed primarily for state-minimum compliance.",
        ],
        'positioning': "GAINSCO is a non-standard carrier focused on minimum-coverage policies for drivers in the 16 states it operates. It's a competitive option specifically for SR-22 needs and high-risk profiles seeking the legally required minimum, not for drivers seeking real coverage depth.",
        'pros_template': [
            "Competitive rates for state-minimum coverage and SR-22 filings",
            "Quick online quoting and policy issuance",
            "Accepts profiles mainstream carriers reject",
        ],
        'cons_template': [
            "Customer satisfaction trends below industry averages",
            "Limited geographic footprint — 16 states only",
            "Coverage menu designed for minimum-compliance, not real protection",
        ],
        'bottomLine': "GAINSCO is a narrow-niche option — high-risk drivers needing minimum coverage in the states it serves. Most other shoppers will find better fits elsewhere.",
    },
    'titan-insurance': {
        'name': 'Titan',
        'cx': 2.9, 'coverage': 2.8, 'cost': 3.5,
        'takeaways': [
            "Titan is a non-standard auto carrier now operating as part of Nationwide's family of companies.",
            "Available in limited Western and Midwest markets with a focus on SR-22 filings and high-risk drivers.",
            "Customer satisfaction trends below industry average — consistent with the non-standard segment.",
        ],
        'positioning': "Titan is a non-standard auto carrier that's now part of Nationwide's portfolio, specializing in SR-22 filings and drivers with adverse records. It's a legitimate option in its narrow niche, with Nationwide's financial backing, but standard-risk drivers will find better rates at mainstream carriers.",
        'pros_template': [
            "Backed by Nationwide — solid financial strength for a non-standard carrier",
            "Strong SR-22 specialization",
            "Accepts profiles other carriers reject",
        ],
        'cons_template': [
            "Customer satisfaction below industry averages",
            "Limited geographic footprint",
            "Not a fit for standard-risk drivers",
        ],
        'bottomLine': "Titan is worth a quote if you need SR-22 filing in the states it operates. Standard-risk drivers should shop mainstream first.",
    },
    'kemper-auto-insurance': {
        'name': 'Kemper',
        'cx': 3.3, 'coverage': 3.6, 'cost': 3.7,
        'takeaways': [
            "Kemper is a multi-line carrier with significant non-standard auto presence — particularly in California, Texas, and the Southeast.",
            "Owns several specialty brands (including Infinity and Direct General) and writes both standard and non-standard auto.",
            "Mid-market pricing with specialty strengths for Hispanic-market and non-standard segments.",
        ],
        'positioning': "Kemper is a diversified carrier with a major non-standard auto presence and several specialty sub-brands. Its strongest positioning is for non-standard risk and Spanish-language service in California, Texas, and Florida. Mainstream drivers will typically find better rates at GEICO or Progressive.",
        'pros_template': [
            "Strong specialty positioning for non-standard auto and Hispanic-market customers",
            "Quick online quoting with bilingual service in key markets",
            "Backed by parent company financial strength",
            "Accepts SR-22 and high-risk profiles",
        ],
        'cons_template': [
            "Customer satisfaction is mid-pack, not a standout",
            "Mainstream drivers will find lower rates at major carriers",
            "Brand confusion across Kemper, Infinity, and other sub-brands",
        ],
        'bottomLine': "Kemper makes sense for non-standard risk or Spanish-language service needs in its core states. For standard-risk shoppers, mainstream carriers typically price more aggressively.",
    },

    # ============ TIER 3 - DIGITAL NATIVES ============
    'root-insurance': {
        'name': 'Root',
        'cx': 3.5, 'coverage': 3.5, 'cost': 3.8,
        'takeaways': [
            "Root pioneered the test-drive-to-rate model: most drivers take a 3-week phone-based driving test before getting a quote.",
            "Pricing rewards safe drivers significantly — Root's pitch is that good drivers shouldn't subsidize bad ones.",
            "Customer experience varies sharply: drivers who pass the test love the rates; drivers who don't can't get coverage at all.",
        ],
        'positioning': "Root is a digital-native carrier built around a test-drive model — you install the app, drive for ~3 weeks, and Root prices your policy based on actual driving behavior. For genuinely safe drivers, the rates can be excellent. For everyone else, mainstream carriers will offer coverage Root won't.",
        'pros_template': [
            "Behavior-based pricing can produce significantly lower rates for safe drivers",
            "Digital-first experience — quote, buy, claim all through the app",
            "Transparent about the methodology and what affects rates",
            "Quick claims handling for digital-comfortable customers",
        ],
        'cons_template': [
            "3-week test drive required before purchase — can't get instant coverage",
            "Drivers who fail the test can't get coverage at all",
            "Limited agent support — purely digital model",
            "Customer satisfaction is mixed: lovers and haters in roughly equal measure",
        ],
        'bottomLine': "Root is worth trying if you're a genuinely safe driver who's comfortable with a 3-week test and digital-only service. If you need immediate coverage or prefer human agents, look elsewhere.",
    },
    'clearcover-insurance': {
        'name': 'Clearcover',
        'cx': 3.6, 'coverage': 3.6, 'cost': 3.9,
        'takeaways': [
            "Clearcover is a digital-first carrier focused on competitive rates for clean-record drivers in select states.",
            "Strong app-based claims experience with low touch points.",
            "Available in 23 states; pricing is generally competitive for the digital-comfortable demographic.",
        ],
        'positioning': "Clearcover is one of the cleaner digital-native carriers — competitive rates for clean records, well-designed mobile app, fast claims handling. The trade-off is limited human support and a smaller coverage menu than mainstream carriers, but for the digital-first shopper, it's a legitimate option.",
        'pros_template': [
            "Competitive rates for clean-record drivers in operating states",
            "Strong mobile app experience for quoting, policy management, and claims",
            "Fast claims handling for straightforward incidents",
            "Backed by venture capital and reinsurance partners",
        ],
        'cons_template': [
            "Limited human support — designed for digital-first shoppers",
            "Available in only 23 states",
            "Less brand recognition and shorter operating history than mainstream carriers",
        ],
        'bottomLine': "Clearcover is worth a quote if you're comfortable with app-based service and have a clean driving record. For broader needs or those who prefer agent service, mainstream carriers fit better.",
    },
    'metromile-insurance': {
        'name': 'Metromile',
        'cx': 3.4, 'coverage': 3.3, 'cost': 4.2,
        'takeaways': [
            "Metromile pioneered pay-per-mile auto insurance — you pay a base rate plus a few cents per mile driven.",
            "Best fit for low-mileage drivers (under ~10,000 miles per year). For higher-mileage drivers, the math doesn't work.",
            "Acquired by Lemonade in 2022; now part of Lemonade's auto offering.",
        ],
        'positioning': "Metromile's pay-per-mile model is genuinely interesting for low-mileage drivers — work-from-home professionals, retirees, urban drivers — where the per-mile pricing can produce dramatically lower premiums. Acquired by Lemonade in 2022, the brand is being integrated into Lemonade's broader insurance platform.",
        'pros_template': [
            "Pay-per-mile model can save significant money for low-mileage drivers",
            "Transparent pricing — base rate plus per-mile, no hidden factors",
            "Strong digital experience now integrated with Lemonade's platform",
            "Pelican device tracks mileage automatically",
        ],
        'cons_template': [
            "Only competitive for low-mileage drivers (under ~10,000 miles/year)",
            "Limited state availability post-Lemonade integration",
            "Coverage menu is leaner than mainstream carriers",
        ],
        'bottomLine': "Metromile (now Lemonade's auto product) is a genuinely good fit for low-mileage drivers. For typical commuters, the per-mile pricing makes it more expensive than mainstream alternatives.",
    },

    # ============ TIER 4 - MAJOR REGIONAL MUTUALS ============
    'erie-insurance': {  # placeholder, won't actually create
        'name': 'Erie',
        'cx': 4.6, 'coverage': 4.3, 'cost': 3.9,
        'takeaways': [],
        'positioning': '',
        'pros_template': [],
        'cons_template': [],
        'bottomLine': '',
    },
    'shelter-car-insurance': {
        'name': 'Shelter',
        'cx': 4.2, 'coverage': 4.0, 'cost': 3.7,
        'takeaways': [
            "Shelter is a Missouri-based mutual operating across 14 mostly-Midwestern states.",
            "Strong customer-satisfaction reputation, particularly in its core markets.",
            "Agent-distributed — no online direct-to-consumer purchase model.",
        ],
        'positioning': "Shelter Insurance is a Midwest-focused mutual that consistently ranks well on customer satisfaction in its operating states. Agent-distributed rather than direct, it competes on service rather than headline rates. Available in 14 states, primarily concentrated in the Missouri/Kansas/Arkansas region.",
        'pros_template': [
            "Strong customer satisfaction reputation in operating states",
            "Mutual structure — policyholder-owned, no shareholder pressure",
            "Local agent network with deep state-specific expertise",
            "Bundling discounts when combined with home or umbrella",
        ],
        'cons_template': [
            "Available in only 14 states, mostly Midwest",
            "No online quoting — every policy runs through an agent",
            "Mid-market pricing, not a budget option",
        ],
        'bottomLine': "Shelter is a solid choice in its Midwest footprint, particularly if you prefer agent-based service. Outside its operating states, it isn't an option.",
    },
    'safety-car-insurance': {
        'name': 'Safety',
        'cx': 4.2, 'coverage': 4.0, 'cost': 3.8,
        'takeaways': [
            "Safety Insurance is a Massachusetts-focused regional with strong in-state market share.",
            "Available in MA, NH, and ME only.",
            "Solid customer satisfaction reputation; competitive pricing within its footprint.",
        ],
        'positioning': "Safety Insurance has been a Massachusetts mainstay since 1979 and competes seriously in MA, NH, and ME. It's not the cheapest carrier in the market, but it earns its space on customer satisfaction and claims handling within its footprint.",
        'pros_template': [
            "Strong Massachusetts market presence with deep regulatory expertise",
            "Solid customer satisfaction reputation in operating states",
            "Competitive bundling discounts when combined with home insurance",
            "Local agent network with strong state-specific knowledge",
        ],
        'cons_template': [
            "Only available in MA, NH, and ME",
            "Mid-market pricing, not a low-cost option",
            "Limited national brand recognition",
        ],
        'bottomLine': "Safety is a fine choice for Massachusetts drivers in particular. Outside MA/NH/ME, it isn't relevant.",
    },
    'arbella-car-insurance': {
        'name': 'Arbella',
        'cx': 4.1, 'coverage': 4.0, 'cost': 3.8,
        'takeaways': [
            "Arbella is a Massachusetts and Connecticut regional mutual with strong in-state market share.",
            "Distributes through independent agents — no direct-to-consumer purchasing.",
            "Solid customer-satisfaction scores within its operating footprint.",
        ],
        'positioning': "Arbella Insurance is a Massachusetts-and-Connecticut regional that competes seriously in both states. Independent-agent distributed with solid claims handling, it earns its space on local service depth rather than headline pricing. Outside MA and CT, it isn't an option.",
        'pros_template': [
            "Strong Massachusetts and Connecticut market presence",
            "Mutual structure with policyholder-aligned incentives",
            "Independent agent distribution — agents shop multiple carriers",
            "Solid customer satisfaction reputation in operating states",
        ],
        'cons_template': [
            "Only available in Massachusetts and Connecticut",
            "No online quoting or direct-to-consumer purchase",
            "Mid-market pricing in a competitive Northeast market",
        ],
        'bottomLine': "Arbella is a solid pick if you're in MA or CT and use an independent agent. Outside those states, it's not relevant.",
    },
    'pekin-car-insurance': {
        'name': 'Pekin',
        'cx': 4.0, 'coverage': 3.8, 'cost': 3.7,
        'takeaways': [
            "Pekin Insurance is an Illinois-based mutual operating in Illinois, Indiana, Iowa, Ohio, and Wisconsin.",
            "Agent-distributed regional carrier with solid Midwest claims-handling reputation.",
            "Mid-market pricing; competitive specifically in its Illinois home market.",
        ],
        'positioning': "Pekin Insurance is an Illinois-headquartered mutual with a five-state Midwest footprint. Agent-distributed and policyholder-owned, it competes on service depth rather than price. Strongest market is Illinois; less competitive in its other states.",
        'pros_template': [
            "Mutual structure — policyholder-aligned ownership",
            "Strong Illinois market presence with deep state-specific expertise",
            "Multi-line bundling discounts when combined with home or life",
            "Solid customer satisfaction in operating states",
        ],
        'cons_template': [
            "Only available in IL, IN, IA, OH, and WI",
            "No online quoting — every policy through an agent",
            "Pricing is mid-market, not a budget choice",
        ],
        'bottomLine': "Pekin is a fine regional choice in its five operating states, particularly Illinois. Outside that footprint, it isn't an option.",
    },
    'grange-car-insurance': {
        'name': 'Grange',
        'cx': 4.0, 'coverage': 4.0, 'cost': 3.7,
        'takeaways': [
            "Grange Mutual is a Midwest-based carrier operating in 13 states across the central U.S.",
            "Agent-distributed; solid customer-satisfaction reputation.",
            "Mid-market pricing with bundling strengths for multi-line customers.",
        ],
        'positioning': "Grange Mutual is a Midwest-and-Southeast regional carrier that competes through independent agents. It's a mid-tier option with solid claims handling and decent bundling discounts, particularly for multi-line shoppers in its core states.",
        'pros_template': [
            "Mutual structure with long operating history",
            "Available across 13 central U.S. states — broader than many regionals",
            "Good bundling discounts when combined with home insurance",
            "Solid customer satisfaction reputation",
        ],
        'cons_template': [
            "No online quoting — every policy through an independent agent",
            "Pricing is mid-market, not budget",
            "Less brand recognition than national carriers",
        ],
        'bottomLine': "Grange is a solid mid-tier choice in its 13-state footprint, particularly if you bundle with home insurance. Outside that footprint, look elsewhere.",
    },
    'sentry-car-insurance': {
        'name': 'Sentry',
        'cx': 3.8, 'coverage': 3.9, 'cost': 3.6,
        'takeaways': [
            "Sentry Insurance is a Wisconsin-based mutual that focuses primarily on business insurance, with a smaller personal-auto presence.",
            "Personal auto is available in limited markets; business and group programs are the core focus.",
            "Solid financial strength and claims-handling reputation.",
        ],
        'positioning': "Sentry Insurance is a major Wisconsin-based mutual whose primary business is commercial insurance — fleet, business owners, group programs. Personal auto exists but is a smaller piece of the business. Available primarily through group affiliations and select agents in limited states.",
        'pros_template': [
            "Strong financial strength and Wisconsin-mutual heritage",
            "Solid claims-handling reputation across all lines",
            "Group programs and affiliations can produce competitive rates",
            "Multi-line bundling when combined with business or other Sentry products",
        ],
        'cons_template': [
            "Personal auto is a smaller focus than commercial lines",
            "Limited geographic availability for personal auto",
            "Less brand recognition in personal lines than national carriers",
        ],
        'bottomLine': "Sentry's personal auto makes sense primarily if you already have a relationship through commercial or group programs. As a standalone personal-auto carrier, mainstream options will typically fit better.",
    },
    'westfield-insurance': {
        'name': 'Westfield',
        'cx': 4.0, 'coverage': 4.0, 'cost': 3.7,
        'takeaways': [
            "Westfield Insurance is an Ohio-based mutual operating across 10 states in the Midwest and South.",
            "Independent-agent distributed; strong claims-handling reputation.",
            "Mid-market pricing with multi-line bundling strengths.",
        ],
        'positioning': "Westfield Insurance is an Ohio-rooted mutual operating in 10 states across the Midwest and South. Independent-agent distributed with solid claims handling and multi-line bundling, it competes on service depth rather than headline rates.",
        'pros_template': [
            "Mutual structure with long operating history (1848)",
            "Solid claims-handling and customer satisfaction reputation",
            "Multi-line bundling — auto, home, umbrella, business",
            "Independent agent distribution with state-specific expertise",
        ],
        'cons_template': [
            "Available in 10 Midwest/South states only",
            "No online quoting — every policy through an agent",
            "Pricing is mid-market, not a budget option",
        ],
        'bottomLine': "Westfield is a solid regional in its 10-state footprint, particularly for multi-line bundling. Outside that footprint, it isn't an option.",
    },
    'hanover-car-insurance': {
        'name': 'Hanover',
        'cx': 3.9, 'coverage': 4.1, 'cost': 3.6,
        'takeaways': [
            "The Hanover Insurance Group is a multi-line carrier with strong commercial and specialty positions plus personal auto.",
            "Personal auto distributed through independent agents in 38 states.",
            "Mid-market pricing with strong bundling for multi-line customers.",
        ],
        'positioning': "Hanover is a multi-line carrier whose personal auto sits within a broader portfolio including commercial and specialty lines. Independent-agent distributed across 38 states, it's a mid-tier option with solid claims handling and good bundling discounts when combined with home or umbrella.",
        'pros_template': [
            "Available across 38 states — broader than most regional mutuals",
            "Strong multi-line bundling potential including specialty coverage",
            "Solid claims-handling reputation",
            "Independent agent distribution with shop-around flexibility",
        ],
        'cons_template': [
            "No online quoting — independent agents only",
            "Pricing is mid-market, not a budget option",
            "Customer satisfaction is solid but not standout",
        ],
        'bottomLine': "Hanover is a mid-tier option that's most attractive when bundled with home, umbrella, or specialty coverage through an independent agent. Standalone, mainstream carriers will usually beat it on price.",
    },
    'acuity-car-insurance': {
        'name': 'Acuity',
        'cx': 4.4, 'coverage': 4.0, 'cost': 3.8,
        'takeaways': [
            "Acuity Insurance is a Wisconsin-based mutual with strong customer-satisfaction reputation.",
            "Available in 30 states, primarily Midwest and South.",
            "Independent-agent distributed; competitive pricing in core markets.",
        ],
        'positioning': "Acuity Insurance is one of those quietly excellent Midwest mutuals — consistently top-rated for customer satisfaction, available across 30 states, distributed through independent agents. It doesn't market heavily but it earns space on service depth.",
        'pros_template': [
            "Consistently strong customer satisfaction reputation",
            "Available in 30 states — broader than most Midwest mutuals",
            "Independent agent distribution with state-specific expertise",
            "Solid multi-line bundling discounts",
        ],
        'cons_template': [
            "Limited brand recognition outside the Midwest",
            "No online quoting — independent agents only",
            "Mid-market pricing, not a budget option",
        ],
        'bottomLine': "Acuity is a quietly excellent choice in its 30-state footprint, particularly for buyers who value service over headline rates. Worth a quote in any of its operating states.",
    },
    'secura-car-insurance': {
        'name': 'SECURA',
        'cx': 4.1, 'coverage': 3.9, 'cost': 3.7,
        'takeaways': [
            "SECURA Insurance is a Wisconsin-based mutual operating across 13 states.",
            "Independent-agent distributed; solid customer-satisfaction reputation in core markets.",
            "Mid-market pricing with multi-line bundling strengths.",
        ],
        'positioning': "SECURA Insurance is a Wisconsin-rooted mutual operating across 13 states in the Midwest and Mid-Atlantic. Independent-agent distributed with solid claims handling, it competes on relationship depth rather than headline pricing.",
        'pros_template': [
            "Mutual structure with policyholder-aligned ownership",
            "Available across 13 states — moderate geographic reach",
            "Multi-line bundling discounts for home and auto combined",
            "Solid customer-satisfaction reputation in operating markets",
        ],
        'cons_template': [
            "Limited geographic footprint outside its 13 operating states",
            "No online quoting — independent agents only",
            "Less brand recognition than national carriers",
        ],
        'bottomLine': "SECURA is a fine regional choice in its 13-state footprint, particularly for multi-line bundlers. Outside that footprint, it isn't an option.",
    },
    'selective-car-insurance': {
        'name': 'Selective',
        'cx': 3.9, 'coverage': 4.0, 'cost': 3.6,
        'takeaways': [
            "Selective Insurance is a Northeast-focused multi-line carrier with significant commercial presence plus personal lines.",
            "Personal auto available primarily in the Northeast and Mid-Atlantic.",
            "Independent-agent distributed; mid-market pricing.",
        ],
        'positioning': "Selective Insurance is a Northeast-rooted multi-line carrier where personal auto sits alongside a substantial commercial book. Independent-agent distributed across the Northeast and Mid-Atlantic, it's a mid-tier option with solid claims handling and good bundling for multi-line shoppers.",
        'pros_template': [
            "Strong claims-handling reputation across personal and commercial lines",
            "Multi-line bundling potential including commercial coverage",
            "Independent agent distribution with shopping flexibility",
            "Solid financial strength",
        ],
        'cons_template': [
            "Geographic limitation — Northeast/Mid-Atlantic focus",
            "No online quoting — independent agents only",
            "Mid-market pricing in a competitive region",
        ],
        'bottomLine': "Selective is a fine regional choice in the Northeast and Mid-Atlantic, particularly for buyers bundling personal and commercial lines through an independent agent.",
    },

    # ============ TIER 5 - HIGH-NET-WORTH SPECIALTY ============
    'aig-insurance': {
        'name': 'AIG',
        'cx': 4.1, 'coverage': 4.6, 'cost': 2.5,
        'takeaways': [
            "AIG's personal-auto offering targets high-net-worth customers through its Private Client Group — not mainstream shoppers.",
            "Coverage depth and limits are among the highest available — appropriate for high-value vehicles and complex risk profiles.",
            "Pricing reflects the premium positioning; this isn't a fit for cost-sensitive shoppers.",
        ],
        'positioning': "AIG's personal auto offering is part of its Private Client Group, designed for high-net-worth households with valuable vehicles, complex coverage needs, or international exposure. It's not a mainstream consumer product — pricing reflects the premium positioning, and the value math only works for the high-end demographic it targets.",
        'pros_template': [
            "Among the deepest coverage menus in the personal-auto market",
            "High-limit options for valuable vehicles and complex risk profiles",
            "Strong claims-handling for high-value losses",
            "Integration with broader AIG private-client services (international, art, jewelry)",
        ],
        'cons_template': [
            "Premium pricing — not competitive for mainstream shoppers",
            "Eligibility limited to high-net-worth households (typical minimums apply)",
            "Less geographic availability than mainstream carriers",
        ],
        'bottomLine': "AIG Private Client makes sense for high-net-worth households with complex coverage needs and valuable vehicles. For mainstream auto coverage, look at GEICO or Progressive instead.",
    },
    'chubb-auto-insurance': {
        'name': 'Chubb',
        'cx': 4.4, 'coverage': 4.7, 'cost': 2.5,
        'takeaways': [
            "Chubb's personal auto targets high-net-worth households with valuable vehicles and complex coverage needs.",
            "Coverage depth is industry-leading — agreed-value coverage for collector cars, worldwide coverage, and high liability limits.",
            "Pricing reflects the premium positioning; this is a service-and-coverage story, not a price story.",
        ],
        'positioning': "Chubb is the gold-standard carrier for high-net-worth personal lines — its Masterpiece Auto policy is the benchmark for what coverage depth looks like at the top of the market. Premium pricing reflects the value proposition: agreed-value collector-car coverage, high liability limits, and white-glove claims handling. Not a mainstream consumer product.",
        'pros_template': [
            "Industry-leading coverage depth, including agreed-value collector-car coverage",
            "High liability limits and umbrella integration",
            "Strong claims-handling reputation for high-value losses",
            "Worldwide coverage options for international travelers",
        ],
        'cons_template': [
            "Premium pricing — not competitive for mainstream shoppers",
            "Eligibility skews to high-net-worth households",
            "Distribution is through select independent agents, not direct",
        ],
        'bottomLine': "Chubb is the right answer for high-net-worth households with valuable vehicles and complex coverage needs. For typical mainstream coverage, the value math doesn't work — look at GEICO, Progressive, or Travelers.",
    },

    # ============ TIER 6 - SUBSIDIARIES / ESURANCE-LIKE ============
    'safeco-insurance': {
        'name': 'Safeco',
        'cx': 3.6, 'coverage': 4.0, 'cost': 3.5,
        'takeaways': [
            "Safeco is Liberty Mutual's independent-agent brand — same financial backing, distributed through independent agencies rather than Liberty Mutual offices.",
            "Coverage menu is largely shared with Liberty Mutual; pricing varies by agency and bundling.",
            "Solid mid-tier choice for shoppers who use an independent agent.",
        ],
        'positioning': "Safeco Insurance is Liberty Mutual's independent-agent brand — same parent company, different distribution model. Available across the U.S. through independent agencies, Safeco shares Liberty's financial strength and broad coverage menu while letting agents shop you across multiple carriers in the same conversation.",
        'pros_template': [
            "Backed by Liberty Mutual's financial strength",
            "Broad coverage menu including standard and optional add-ons",
            "Independent agent distribution — agents can compare you across carriers",
            "Multi-line bundling discounts",
        ],
        'cons_template': [
            "Customer satisfaction trends mid-pack, not standout",
            "Pricing varies meaningfully by independent agency",
            "Brand recognition lower than direct Liberty Mutual",
        ],
        'bottomLine': "Safeco is a fine choice if you're working with an independent agent — they can compare it against other carriers in real time. Direct shoppers will get the same financial backing through Liberty Mutual.",
    },
    'esurance-car-insurance': {
        'name': 'Esurance',
        'cx': 3.0, 'coverage': 3.0, 'cost': 3.0,
        'takeaways': [
            "Important context: Esurance no longer operates as an independent brand — Allstate retired it in 2020 and absorbed customers into Allstate's main book.",
            "If you currently have an Esurance policy, it transitioned to Allstate; review your current documents to confirm the underwriter.",
            "For new auto coverage, you'll be quoted directly by Allstate — see our Allstate review for the current picture.",
        ],
        'positioning': "Esurance was a digital-first Allstate subsidiary that operated from 1999 to 2020. Allstate retired the Esurance brand in 2020 and integrated its book into Allstate's main offering. Existing customers transitioned to Allstate policies; new Esurance-branded policies are no longer being written. This review preserves the historical record; for new coverage, our Allstate review is the more current reference.",
        'pros_template': [
            "Strong digital-first user experience during its operating years",
            "Solid financial backing as an Allstate subsidiary",
            "Pioneered online auto insurance quoting",
        ],
        'cons_template': [
            "No longer writing new policies — the brand was retired in 2020",
            "Existing policies transitioned to Allstate administration",
            "If you're shopping for new coverage today, Esurance is not an active option",
        ],
        'bottomLine': "Esurance is no longer an active carrier. If you're shopping today, see our Allstate review — that's where the Esurance book now lives.",
    },
    'national-general-car-insurance': {
        'name': 'National General',
        'cx': 3.4, 'coverage': 3.7, 'cost': 3.6,
        'takeaways': [
            "National General is an Allstate subsidiary (acquired 2021) writing non-standard and specialty auto across all 50 states.",
            "Strong specialty positioning including RV, motorcycle, and lender-placed insurance in addition to non-standard auto.",
            "Mid-market pricing for non-standard risk; not competitive for standard-risk drivers.",
        ],
        'positioning': "National General is Allstate's non-standard and specialty subsidiary, acquired in 2021. It writes a broader risk pool than Allstate's main book — non-standard auto, RV, motorcycle, and lender-placed coverage — across all 50 states. For non-standard risk it's a legitimate option; for standard-risk drivers, mainstream carriers will price better.",
        'pros_template': [
            "Available in all 50 states for non-standard auto",
            "Strong specialty lines including RV and motorcycle insurance",
            "Backed by Allstate financial strength",
            "Accepts SR-22 and high-risk profiles",
        ],
        'cons_template': [
            "Customer satisfaction trends below industry averages",
            "Not competitive for standard-risk drivers",
            "Coverage menu varies meaningfully by state and risk profile",
        ],
        'bottomLine': "National General fits the non-standard niche or specialty needs (RV, motorcycle). Standard-risk auto shoppers will find better rates and service at mainstream carriers.",
    },
    'foremost-insurance': {
        'name': 'Foremost',
        'cx': 3.6, 'coverage': 3.8, 'cost': 3.5,
        'takeaways': [
            "Foremost is Farmers' specialty subsidiary, focused on non-standard auto, manufactured-home insurance, and specialty lines.",
            "Strongest positioning is in manufactured-home and recreational vehicle markets, not standard auto.",
            "Mid-market pricing for the segments it serves; not a fit for mainstream auto shoppers.",
        ],
        'positioning': "Foremost Insurance is Farmers' specialty arm, originally known for manufactured-home insurance and now writing non-standard auto, RV, motorcycle, and seasonal-property coverage. It's a niche carrier — the right answer for specific specialty needs, the wrong answer for mainstream standard auto.",
        'pros_template': [
            "Strong specialty positioning for manufactured homes, RVs, and motorcycles",
            "Backed by Farmers financial strength",
            "Accepts non-standard auto risk",
            "Available across all 50 states for at least some lines",
        ],
        'cons_template': [
            "Not a fit for standard-risk auto shoppers",
            "Customer satisfaction trends mid-pack",
            "Best for specialty lines, not mainstream auto",
        ],
        'bottomLine': "Foremost makes sense for specialty needs — manufactured-home, RV, motorcycle — or non-standard auto. For mainstream auto coverage, look at GEICO, Progressive, or Farmers' main book.",
    },
    'state-auto-car-insurance': {
        'name': 'State Auto',
        'cx': 3.8, 'coverage': 3.9, 'cost': 3.5,
        'takeaways': [
            "State Auto Insurance was acquired by Liberty Mutual in 2022 and now operates as part of the Liberty Mutual family.",
            "Available primarily in the Midwest and Southeast through independent agents.",
            "Mid-market pricing with strong multi-line bundling.",
        ],
        'positioning': "State Auto Insurance is now part of Liberty Mutual (acquired 2022) but continues to operate under the State Auto brand through independent agents. Available primarily in the Midwest and Southeast, it offers mid-tier coverage with the financial backing of Liberty Mutual.",
        'pros_template': [
            "Now backed by Liberty Mutual financial strength",
            "Independent agent distribution with shop-around flexibility",
            "Multi-line bundling discounts",
            "Solid customer satisfaction in operating states",
        ],
        'cons_template': [
            "Geographic concentration in Midwest and Southeast",
            "Recent acquisition means brand and service evolution still underway",
            "Mid-market pricing, not a budget option",
        ],
        'bottomLine': "State Auto is a fine regional choice in the Midwest and Southeast through an independent agent. The Liberty Mutual acquisition adds financial strength but the long-term brand identity is still settling.",
    },

    # ============ TIER 7 - FARM BUREAU FAMILY (each is separate) ============
    'texas-farm-bureau-insurance': {
        'name': 'Texas Farm Bureau',
        'cx': 4.3, 'coverage': 3.8, 'cost': 4.0,
        'takeaways': [
            "Texas Farm Bureau is Texas-only and requires Farm Bureau membership (open to anyone, modest annual fee).",
            "Consistently among the cheapest auto insurance options in Texas for clean-record drivers.",
            "Solid customer satisfaction reputation within the state.",
        ],
        'positioning': "Texas Farm Bureau Insurance is widely regarded as one of the cheapest legitimate auto insurance options in Texas for drivers who qualify. Membership is required but inexpensive and open to non-farmers. For Texas residents with clean records, it deserves a quote.",
        'pros_template': [
            "Among the cheapest auto rates in Texas for clean-record drivers",
            "Texas-specific expertise and deep local agent network",
            "Strong customer satisfaction reputation in-state",
            "Multi-line bundling with home and life insurance",
        ],
        'cons_template': [
            "Texas-only — not available in any other state",
            "Farm Bureau membership required (modest annual fee)",
            "No online quoting — agent-distributed",
        ],
        'bottomLine': "Texas residents with clean records should absolutely get a Texas Farm Bureau quote. It's frequently the cheapest legitimate option in the state.",
    },
    'nc-farm-bureau-insurance': {
        'name': 'NC Farm Bureau',
        'cx': 4.2, 'coverage': 3.7, 'cost': 4.0,
        'takeaways': [
            "NC Farm Bureau is North Carolina-only and requires Farm Bureau membership.",
            "Competitive auto pricing in NC for clean records.",
            "Agent-distributed regional with solid in-state customer satisfaction.",
        ],
        'positioning': "NC Farm Bureau Mutual Insurance is a North Carolina-only carrier requiring inexpensive Farm Bureau membership. It's a consistent value choice in the state for drivers with clean records, distributed through a deep local agent network.",
        'pros_template': [
            "Competitive auto rates in North Carolina",
            "Strong local agent network throughout the state",
            "Solid customer satisfaction in-state",
            "Multi-line bundling with home and farm coverage",
        ],
        'cons_template': [
            "North Carolina only — not available elsewhere",
            "Farm Bureau membership required",
            "No online quoting — agent only",
        ],
        'bottomLine': "If you're in North Carolina with a clean record, get a NC Farm Bureau quote. It's frequently competitive on price within the state.",
    },
    'georgia-farm-bureau-car-insurance': {
        'name': 'Georgia Farm Bureau',
        'cx': 4.1, 'coverage': 3.7, 'cost': 3.9,
        'takeaways': [
            "Georgia Farm Bureau is Georgia-only and requires Farm Bureau membership.",
            "Competitive auto pricing in Georgia for clean records.",
            "Agent-distributed with deep state-specific knowledge.",
        ],
        'positioning': "Georgia Farm Bureau is a Georgia-only carrier requiring inexpensive Farm Bureau membership. It's a regional value choice for in-state drivers with clean records, with a deep local agent network and solid claims handling.",
        'pros_template': [
            "Competitive auto rates in Georgia",
            "Strong statewide agent network",
            "Solid customer satisfaction in-state",
            "Multi-line bundling with home and farm coverage",
        ],
        'cons_template': [
            "Georgia only — not available elsewhere",
            "Farm Bureau membership required",
            "No online quoting — agent only",
        ],
        'bottomLine': "Georgia residents should get a Georgia Farm Bureau quote alongside mainstream carriers. It's frequently competitive on price for clean records in-state.",
    },
    'kentucky-farm-bureau-insurance': {
        'name': 'Kentucky Farm Bureau',
        'cx': 4.2, 'coverage': 3.7, 'cost': 4.0,
        'takeaways': [
            "Kentucky Farm Bureau is Kentucky's largest auto insurer and requires Farm Bureau membership.",
            "Consistently competitive auto pricing for clean records.",
            "Agent-distributed with strong statewide presence.",
        ],
        'positioning': "Kentucky Farm Bureau Mutual is Kentucky's largest auto insurer by market share. Membership is required but inexpensive, and the carrier consistently competes well on price for clean-record drivers in the state. Agent-distributed only.",
        'pros_template': [
            "Largest auto insurer in Kentucky by market share",
            "Competitive rates for clean-record drivers in-state",
            "Strong statewide agent network",
            "Multi-line bundling discounts",
        ],
        'cons_template': [
            "Kentucky only — not available in any other state",
            "Farm Bureau membership required",
            "No online quoting — agent only",
        ],
        'bottomLine': "Kentucky residents should absolutely get a Kentucky Farm Bureau quote. As the state's largest auto insurer, it competes seriously on price.",
    },
    'missouri-farm-bureau-car-insurance': {
        'name': 'Missouri Farm Bureau',
        'cx': 4.1, 'coverage': 3.7, 'cost': 3.9,
        'takeaways': [
            "Missouri Farm Bureau is Missouri-only and requires Farm Bureau membership.",
            "Competitive auto pricing for in-state clean records.",
            "Agent-distributed regional carrier.",
        ],
        'positioning': "Missouri Farm Bureau is a Missouri-only carrier requiring inexpensive Farm Bureau membership. It's a regional value choice for clean-record drivers in the state, with a deep local agent network.",
        'pros_template': [
            "Competitive auto rates in Missouri",
            "Strong statewide agent network",
            "Solid customer satisfaction in-state",
            "Multi-line bundling discounts",
        ],
        'cons_template': [
            "Missouri only — not available elsewhere",
            "Farm Bureau membership required",
            "No online quoting — agent only",
        ],
        'bottomLine': "Missouri residents should get a Missouri Farm Bureau quote alongside mainstream carriers. Frequently competitive on price for clean records.",
    },
    'alfa-car-insurance': {
        'name': 'ALFA',
        'cx': 4.0, 'coverage': 3.6, 'cost': 3.9,
        'takeaways': [
            "ALFA Insurance is Alabama's Farm Bureau carrier, with limited expansion into Georgia and Mississippi.",
            "Competitive auto pricing for clean records in operating states, particularly Alabama.",
            "Agent-distributed regional with strong in-state presence.",
        ],
        'positioning': "ALFA Insurance is Alabama Farm Bureau's insurance arm, operating primarily in Alabama with limited presence in Georgia and Mississippi. Requires Farm Bureau membership; competitive on price for clean records in-state.",
        'pros_template': [
            "Competitive auto rates in Alabama for clean records",
            "Strong Alabama agent network with deep state expertise",
            "Solid in-state customer satisfaction reputation",
            "Multi-line bundling discounts",
        ],
        'cons_template': [
            "Geographic limitation — Alabama, Georgia, Mississippi only",
            "Farm Bureau membership required",
            "No online quoting — agent-distributed",
        ],
        'bottomLine': "ALFA is a solid Alabama Farm Bureau choice for in-state residents with clean records. Outside its three-state footprint, it isn't an option.",
    },
}


def build_scored_review(slug, wp_data, profile):
    """Build the full scored review markdown."""
    name = profile['name']
    today = date.today().isoformat()
    overall = round(((profile['cost'] + profile['cx'] + profile['coverage']) / 3) * 20) / 20

    # Use WP pros/cons when ≥3 items; otherwise use editorial template
    pros = wp_data.get('pros') or []
    cons = wp_data.get('cons') or []
    final_pros = pros if len(pros) >= 3 else profile['pros_template']
    final_cons = cons if len(cons) >= 2 else profile['cons_template']

    lines = ['---']
    lines.append(f'title: {yaml_str(name + " Auto Insurance Review")}')
    lines.append(f'description: {yaml_str(f"{name} auto insurance: our editorial assessment of customer experience, coverage, and pricing — plus the verified company facts.")}')
    lines.append('')
    lines.append(f'company: {yaml_str(name)}')
    if wp_data.get('logo_local'): lines.append(f'companyLogo: {yaml_str(wp_data["logo_local"])}')
    if wp_data.get('website'): lines.append(f'websiteUrl: {yaml_str(wp_data["website"])}')
    if wp_data.get('phone'): lines.append(f'phoneNumber: {yaml_str(wp_data["phone"])}')
    if wp_data.get('address'): lines.append(f'address: {yaml_str(wp_data["address"])}')
    lines.append('')
    lines.append(f'positioning: {yaml_str(profile["positioning"])}')
    lines.append('')
    lines.append(f'updatedDate: {today}')
    lines.append(f'publishDate: {today}')
    lines.append('author: "QuoteYeti Editorial"')
    lines.append('editor: "QuoteYeti Editor"')
    lines.append('')
    lines.append(f'starRating: {overall}')
    lines.append(f'overallScore: {overall}')
    lines.append('')
    lines.append('ratings:')
    lines.append('  - category: "Customer experience"')
    lines.append(f'    score: {profile["cx"]}')
    lines.append('  - category: "Coverage breadth"')
    lines.append(f'    score: {profile["coverage"]}')
    lines.append('  - category: "Affordability"')
    lines.append(f'    score: {profile["cost"]}')
    lines.append('')
    lines.append('takeaways:')
    for t in profile['takeaways']:
        lines.append(f'  - {yaml_str(t)}')
    lines.append('')
    lines.append('pros:')
    for p in final_pros[:5]:
        lines.append(f'  - {yaml_str(p)}')
    lines.append('cons:')
    for c in final_cons[:5]:
        lines.append(f'  - {yaml_str(c)}')
    lines.append('')
    lines.append(f'bottomLine: {yaml_str(profile["bottomLine"])}')
    lines.append('')
    lines.append('---')
    return '\n'.join(lines)


def main():
    wp = {c['slug']: c for c in json.loads(WP_JSON.read_text())}
    written = 0
    skipped = 0
    for slug, profile in PROFILES.items():
        # Skip the Erie placeholder (no real takeaways)
        if not profile['takeaways']:
            continue
        if slug not in wp:
            print(f"  ✗ {profile['name']}: not in WP data")
            skipped += 1
            continue
        out_path = REVIEWS_DIR / f"{slug}.md"
        if not out_path.exists():
            print(f"  ⊘ {slug}: no v2 file to overwrite (file doesn't exist yet)")
            skipped += 1
            continue
        overall = round(((profile['cost'] + profile['cx'] + profile['coverage']) / 3) * 20) / 20
        out_path.write_text(build_scored_review(slug, wp[slug], profile))
        print(f"  ✓ {profile['name']:<26} overall={overall}")
        written += 1
    print(f"\n✓ Scored {written} carriers, skipped {skipped}")


if __name__ == '__main__':
    main()
