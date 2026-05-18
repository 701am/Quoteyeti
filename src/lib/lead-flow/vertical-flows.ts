/**
 * Per-vertical lead-flow configurations.
 *
 * Each FlowConfig defines: which steps, which fields per step, copy.
 * The shared <LeadFlow> component renders these.
 *
 * Language guidelines applied throughout:
 *   - Publisher voice ("compare offers from our partner network")
 *   - Never name a specific partner ("EverQuote", "MediaAlpha") in user-facing copy
 *   - Never say "agent will call you" or "we'll quote you" (would require licensing)
 *   - TCPA consent always references "our network of licensed insurance carriers and agents"
 */

import { pills, type FlowConfig } from "./types";

const currentYear = new Date().getFullYear();
const VEHICLE_YEARS = Array.from({ length: currentYear - 1994 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));
const PROPERTY_YEARS = [
  { value: "2020+", label: "2020 or newer" },
  { value: "2010-2019", label: "2010 – 2019" },
  { value: "2000-2009", label: "2000 – 2009" },
  { value: "1990-1999", label: "1990 – 1999" },
  { value: "1980-1989", label: "1980 – 1989" },
  { value: "1970-1979", label: "1970 – 1979" },
  { value: "pre-1970", label: "Before 1970" },
];

const VEHICLE_MAKES = pills([
  "Acura","Audi","BMW","Buick","Cadillac","Chevrolet","Chrysler","Dodge","Fiat",
  "Ford","GMC","Genesis","Honda","Hyundai","Infiniti","Jaguar","Jeep","Kia",
  "Land Rover","Lexus","Lincoln","Mazda","Mercedes-Benz","Mini","Mitsubishi",
  "Nissan","Porsche","Ram","Subaru","Tesla","Toyota","Volkswagen","Volvo","Other",
]);

const CARRIERS_AUTO = pills([
  "Allstate","American Family","Erie","Farmers","GEICO","Liberty Mutual",
  "Mercury","Nationwide","Progressive","Safeco","State Farm","Travelers",
  "USAA","Other","Not currently insured",
]);

const CARRIERS_HOME = pills([
  "Allstate","American Family","Amica","Erie","Farmers","Liberty Mutual",
  "Nationwide","Progressive","State Farm","Travelers","USAA","Other","Not currently insured",
]);

const CARRIERS_LIFE = pills([
  "Banner Life","Haven Life","MassMutual","MetLife","New York Life",
  "Northwestern Mutual","Pacific Life","Prudential","State Farm",
  "Transamerica","Other","Not currently insured",
]);

const CARRIERS_HEALTH = pills([
  "Aetna","Anthem / BCBS","Cigna","Humana","Kaiser Permanente",
  "Oscar","UnitedHealthcare","Other","Not currently insured",
]);

const CARRIERS_PET = pills([
  "Embrace","Figo","Fetch","Healthy Paws","Lemonade","MetLife Pet",
  "Nationwide","Pets Best","Spot","Trupanion","Other","Not currently insured",
]);

const COMMON_DOG_BREEDS = pills([
  "Mixed / Mutt","Labrador","Golden Retriever","German Shepherd","French Bulldog",
  "Bulldog","Poodle","Beagle","Rottweiler","Yorkshire Terrier","Dachshund",
  "Boxer","Chihuahua","Siberian Husky","Great Dane","Shih Tzu","Other",
]);
const COMMON_CAT_BREEDS = pills([
  "Domestic Shorthair","Domestic Longhair","Maine Coon","Siamese","Persian",
  "Ragdoll","Bengal","British Shorthair","Sphynx","Other",
]);

// ============================================
// AUTO INSURANCE
// ============================================
const autoFlow: FlowConfig = {
  slug: "auto",
  verticalKey: "auto",
  eyebrow: "Auto insurance",
  submitLabel: "See my offers",
  thanksUrl: "/auto/quotes/thanks/",
  steps: [
    {
      heading: "Let's {italic}get started{/italic}.",
      lede: "Confirm your ZIP and tell us how many drivers are in your household. Takes about 90 seconds total.",
      fields: [
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code" },
        { name: "drivers_count", label: "Drivers in household", kind: "pills", required: true, options: pills(["1","2","3","4+"]) },
      ],
    },
    {
      heading: "Tell us about your {italic}vehicle{/italic}.",
      lede: "If you have more than one, start with your primary vehicle.",
      fields: [
        { name: "vehicle_year", label: "Year", kind: "select", required: true, options: VEHICLE_YEARS, width: "half" },
        { name: "vehicle_make", label: "Make", kind: "select", required: true, options: VEHICLE_MAKES, width: "half" },
        { name: "vehicle_model", label: "Model", kind: "text", required: true, placeholder: "e.g. Camry, F-150, Civic" },
        { name: "vehicle_ownership", label: "Ownership", kind: "pills", required: true, options: pills(["Owned","Financed","Leased"]) },
      ],
    },
    {
      heading: "How do you {italic}use it{/italic}?",
      lede: "Usage is one of the biggest factors carriers use to set your rate.",
      fields: [
        { name: "primary_use", label: "Primary use", kind: "pills", required: true, options: pills(["Commute","Business","Pleasure"]) },
        { name: "annual_mileage", label: "Annual mileage", kind: "select", required: true, options: [
          { value: "0-5000", label: "Under 5,000 miles" },
          { value: "5000-10000", label: "5,000 – 10,000 miles" },
          { value: "10000-15000", label: "10,000 – 15,000 miles" },
          { value: "15000+", label: "15,000+ miles" },
        ]},
        { name: "garaging", label: "Where is it parked overnight?", kind: "pills", required: true, options: pills(["Garage","Driveway","Street","Apartment lot"]) },
      ],
    },
    {
      heading: "A few {italic}details about you{/italic}.",
      lede: "Carriers use these to determine eligibility and discounts.",
      fields: [
        { name: "dob", label: "Date of birth", kind: "date", required: true, autocomplete: "bday", min: "1920-01-01", max: `${currentYear - 16}-12-31`, hint: "You must be at least 16 to request quotes." },
        { name: "marital_status", label: "Marital status", kind: "pills", required: true, options: pills(["Single","Married","Divorced","Widowed","Separated"]) },
        { name: "homeownership", label: "Homeownership", kind: "pills", required: true, options: pills(["Own","Rent","Live with family"]) },
      ],
    },
    {
      heading: "Your {italic}insurance history{/italic}.",
      lede: "Currently-insured drivers with clean records typically see the lowest rates.",
      fields: [
        { name: "currently_insured", label: "Are you currently insured?", kind: "yesno", required: true },
        { name: "current_carrier", label: "Current carrier", kind: "select", showIf: "currently_insured=Yes", options: CARRIERS_AUTO },
        { name: "years_with_carrier", label: "Years with current carrier", kind: "select", showIf: "currently_insured=Yes", options: [
          { value: "<1", label: "Less than 1 year" },
          { value: "1-3", label: "1–3 years" },
          { value: "3-5", label: "3–5 years" },
          { value: "5+", label: "5+ years" },
        ]},
        { name: "incidents_3yr", label: "Accidents, tickets, or claims in the last 3 years?", kind: "pills", required: true, options: pills(["None","1","2","3+"]) },
        { name: "license_status", label: "License status", kind: "pills", required: true, options: pills(["Valid","Suspended","Permit","International"]) },
      ],
    },
    // Step 6: contact + TCPA is injected by the LeadFlow component.
  ],
};

// ============================================
// HOME INSURANCE
// ============================================
const homeFlow: FlowConfig = {
  slug: "home",
  verticalKey: "home",
  eyebrow: "Home insurance",
  submitLabel: "See my offers",
  thanksUrl: "/home-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Let's {italic}find your home{/italic}.",
      lede: "Start with the property location. Takes about 90 seconds total.",
      fields: [
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code" },
        { name: "property_address", label: "Street address (optional)", kind: "text", required: false, placeholder: "123 Main Street", autocomplete: "street-address", hint: "Optional — speeds up your quote but not required." },
      ],
    },
    {
      heading: "What {italic}type of home{/italic} is it?",
      lede: "Property type changes which carriers can quote you.",
      fields: [
        { name: "property_type", label: "Property type", kind: "pills", required: true, options: pills(["Single-family","Condo","Townhouse","Multi-family"]) },
        { name: "occupancy", label: "Is this your primary residence?", kind: "pills", required: true, options: pills(["Primary","Secondary","Investment"]) },
      ],
    },
    {
      heading: "About the {italic}property{/italic}.",
      lede: "Construction details affect both your rate and your coverage limits.",
      fields: [
        { name: "year_built", label: "Year built", kind: "select", required: true, options: PROPERTY_YEARS, width: "half" },
        { name: "square_footage", label: "Square footage", kind: "select", required: true, width: "half", options: [
          { value: "<1000", label: "Under 1,000 sq ft" },
          { value: "1000-1500", label: "1,000 – 1,500" },
          { value: "1500-2000", label: "1,500 – 2,000" },
          { value: "2000-2500", label: "2,000 – 2,500" },
          { value: "2500-3500", label: "2,500 – 3,500" },
          { value: "3500+", label: "3,500+" },
        ]},
        { name: "construction_type", label: "Construction type", kind: "pills", required: true, options: pills(["Wood frame","Brick","Concrete","Other / not sure"]) },
        { name: "roof_type", label: "Roof type", kind: "pills", required: true, options: pills(["Asphalt shingle","Metal","Tile","Other / not sure"]) },
      ],
    },
    {
      heading: "Coverage {italic}preferences{/italic}.",
      lede: "These set the floor for the offers you'll see — adjust later.",
      fields: [
        { name: "dwelling_coverage", label: "Estimated rebuild / dwelling coverage", kind: "select", required: true, options: [
          { value: "<200k", label: "Under $200,000" },
          { value: "200k-400k", label: "$200,000 – $400,000" },
          { value: "400k-600k", label: "$400,000 – $600,000" },
          { value: "600k-1m", label: "$600,000 – $1M" },
          { value: "1m+", label: "$1M+" },
          { value: "not-sure", label: "Not sure" },
        ]},
        { name: "deductible_preference", label: "Preferred deductible", kind: "pills", required: true, options: pills(["$500","$1,000","$2,500+"]) },
      ],
    },
    {
      heading: "Your {italic}claims history{/italic}.",
      lede: "Most carriers look at the last 5 years.",
      fields: [
        { name: "currently_insured", label: "Are you currently insured?", kind: "yesno", required: true },
        { name: "current_carrier", label: "Current carrier", kind: "select", showIf: "currently_insured=Yes", options: CARRIERS_HOME },
        { name: "prior_claims_5yr", label: "Home insurance claims in the last 5 years?", kind: "pills", required: true, options: pills(["None","1","2+"]) },
        { name: "security_features", label: "Do you have a monitored alarm or smart security?", kind: "yesno", required: true },
      ],
    },
  ],
};

// ============================================
// LIFE INSURANCE
// ============================================
const lifeFlow: FlowConfig = {
  slug: "life",
  verticalKey: "life",
  eyebrow: "Life insurance",
  submitLabel: "See my options",
  thanksUrl: "/life-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Find {italic}affordable coverage{/italic}.",
      lede: "Start with your age and ZIP. Takes about 60 seconds.",
      fields: [
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code", width: "half" },
        { name: "dob", label: "Date of birth", kind: "date", required: true, autocomplete: "bday", min: "1920-01-01", max: `${currentYear - 18}-12-31`, width: "half" },
        { name: "gender", label: "Gender (used by carriers for rating)", kind: "pills", required: true, options: pills(["Male","Female"]) },
      ],
    },
    {
      heading: "How much {italic}coverage{/italic} do you need?",
      lede: "A common rule of thumb: 10–12× your annual income.",
      fields: [
        { name: "coverage_amount", label: "Coverage amount", kind: "pills", required: true, options: pills(["$50K-$100K","$100K-$250K","$250K-$500K","$500K-$1M","$1M+"]) },
        { name: "policy_type", label: "Policy type", kind: "pills", required: true, options: pills(["Term","Whole life","Universal","Not sure"]) },
        { name: "term_length", label: "Term length", kind: "pills", required: false, showIf: "policy_type=Term", options: pills(["10 years","15 years","20 years","30 years"]) },
      ],
    },
    {
      heading: "A few {italic}health questions{/italic}.",
      lede: "Be honest — carriers verify, and this is just a quick screen.",
      fields: [
        { name: "tobacco_use", label: "Have you used tobacco or nicotine in the last 12 months?", kind: "yesno", required: true },
        { name: "general_health", label: "How would you describe your overall health?", kind: "pills", required: true, options: pills(["Excellent","Good","Fair","Poor"]) },
        { name: "chronic_conditions", label: "Diagnosed with diabetes, heart disease, or cancer?", kind: "yesno", required: true },
        { name: "recent_hospitalization", label: "Hospitalized in the last 2 years (excluding routine)?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "Your {italic}lifestyle{/italic}.",
      lede: "Some occupations and hobbies affect your rate. Most don't.",
      fields: [
        { name: "occupation_risk", label: "How would you classify your occupation?", kind: "pills", required: true, options: pills(["Desk / professional","Trades / manual","High-risk","Retired / unemployed"]) },
        { name: "hazardous_hobbies", label: "Regular high-risk hobbies (skydiving, racing, scuba, etc.)?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "Your {italic}financial picture{/italic}.",
      lede: "Used to size coverage appropriately — never reported to credit agencies.",
      fields: [
        { name: "annual_income", label: "Annual income range", kind: "select", required: true, options: [
          { value: "<50k", label: "Under $50,000" },
          { value: "50k-100k", label: "$50,000 – $100,000" },
          { value: "100k-200k", label: "$100,000 – $200,000" },
          { value: "200k+", label: "$200,000+" },
          { value: "prefer-not", label: "Prefer not to say" },
        ]},
        { name: "currently_insured", label: "Do you have existing life insurance?", kind: "yesno", required: true },
        { name: "current_carrier", label: "Current carrier", kind: "select", showIf: "currently_insured=Yes", options: CARRIERS_LIFE },
      ],
    },
  ],
};

// ============================================
// BUSINESS INSURANCE
// ============================================
const businessFlow: FlowConfig = {
  slug: "business",
  verticalKey: "business",
  eyebrow: "Business insurance",
  submitLabel: "See my offers",
  thanksUrl: "/business-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Tell us about your {italic}business{/italic}.",
      lede: "Start with the basics. Takes about 2 minutes total.",
      fields: [
        { name: "zip", label: "Business ZIP code", kind: "zip", required: true, autocomplete: "postal-code", width: "half" },
        { name: "business_name", label: "Business name", kind: "text", required: true, autocomplete: "organization", width: "half" },
        { name: "industry", label: "Industry", kind: "select", required: true, options: pills([
          "Construction / trades","Retail","Restaurant / food service","Professional services",
          "Technology / IT","Healthcare","Manufacturing","Real estate","Transportation",
          "Personal services","Wholesale / distribution","Nonprofit","Other",
        ])},
        { name: "entity_type", label: "Entity type", kind: "pills", required: true, options: pills(["LLC","Corporation","Sole proprietor","Partnership"]) },
      ],
    },
    {
      heading: "Business {italic}scale{/italic}.",
      lede: "Used to match you with carriers that quote businesses your size.",
      fields: [
        { name: "annual_revenue", label: "Annual revenue", kind: "select", required: true, options: [
          { value: "<100k", label: "Under $100,000" },
          { value: "100k-500k", label: "$100,000 – $500,000" },
          { value: "500k-1m", label: "$500,000 – $1M" },
          { value: "1m-5m", label: "$1M – $5M" },
          { value: "5m+", label: "$5M+" },
        ]},
        { name: "employees", label: "Number of employees", kind: "pills", required: true, options: pills(["Just me","2-10","11-50","50+"]) },
        { name: "years_in_business", label: "Years in business", kind: "pills", required: true, options: pills(["<1","1-3","3-5","5+"]) },
      ],
    },
    {
      heading: "Your {italic}operations{/italic}.",
      lede: "How and where you do business changes which coverages you need.",
      fields: [
        { name: "operations_model", label: "How do you operate?", kind: "pills", required: true, options: pills(["Online only","Brick-and-mortar","Hybrid","Mobile / on-site"]) },
        { name: "customer_exposure", label: "Customer foot traffic at your location", kind: "pills", required: true, options: pills(["None","Low","Moderate","High"]) },
        { name: "owns_commercial_auto", label: "Do you have business-use vehicles?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "What {italic}coverage{/italic} do you need?",
      lede: "Pick all that apply — we'll match offers across these.",
      fields: [
        { name: "coverage_general_liability", label: "General liability", kind: "yesno", required: true },
        { name: "coverage_professional_liability", label: "Professional liability / E&O", kind: "yesno", required: true },
        { name: "coverage_workers_comp", label: "Workers' compensation", kind: "yesno", required: true },
        { name: "coverage_cyber", label: "Cyber liability", kind: "yesno", required: true },
        { name: "coverage_property", label: "Commercial property", kind: "yesno", required: true },
      ],
    },
    {
      heading: "Risk {italic}history{/italic}.",
      lede: "Last details. Most businesses have none of these.",
      fields: [
        { name: "currently_insured", label: "Currently have business insurance?", kind: "yesno", required: true },
        { name: "prior_claims_3yr", label: "Insurance claims in the last 3 years?", kind: "pills", required: true, options: pills(["None","1","2+"]) },
      ],
    },
  ],
};

// ============================================
// ============================================
// HEALTH INSURANCE — with Medicare branching path
// ============================================
// Health insurance funnels through ONE flow. Step 1 asks the user
// what kind of plan they're looking for. If they pick "Medicare,"
// downstream steps show Medicare-specific questions and hide the
// ACA-specific ones. Same Netlify form, same TCPA capture — the
// branch flag (`plan_kind`) tells the partner adapter how to route.
const healthFlow: FlowConfig = {
  slug: "health",
  verticalKey: "health",
  eyebrow: "Health insurance",
  submitLabel: "See my plans",
  thanksUrl: "/health-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Find {italic}health coverage{/italic} that fits.",
      lede: "Start with what kind of plan you're looking for. Takes about 90 seconds.",
      fields: [
        // Plan-kind selector — drives the branching
        { name: "plan_kind", label: "What kind of health plan are you looking for?", kind: "pills", required: true, options: pills([
          "ACA / Marketplace","Medicare","Short-term","Just exploring",
        ])},
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code", width: "half" },
        { name: "dob", label: "Date of birth", kind: "date", required: true, autocomplete: "bday", min: "1920-01-01", max: `${currentYear - 18}-12-31`, width: "half" },
      ],
    },

    // ============= STEP 2: SITUATION (branched) =============
    {
      heading: "Your {italic}situation{/italic}.",
      lede: "A few questions tailored to the kind of plan you're shopping for.",
      fields: [
        // ---- Non-Medicare path: household + employment ----
        {
          name: "household_size",
          label: "How many people need coverage?",
          kind: "pills",
          required: true,
          options: pills(["Just me","2","3","4","5+"]),
          showIf: "plan_kind!=Medicare",
        },
        {
          name: "employment_status",
          label: "Employment status",
          kind: "pills",
          required: true,
          options: pills(["Employed","Self-employed","Unemployed","Student","Retired"]),
          showIf: "plan_kind!=Medicare",
        },
        {
          name: "employer_coverage",
          label: "Is employer-sponsored coverage available to you?",
          kind: "yesno",
          required: true,
          showIf: "plan_kind!=Medicare",
        },

        // ---- Medicare path: enrollment + plan type interest + drug needs ----
        {
          name: "medicare_enrollment_status",
          label: "Where are you in Medicare enrollment?",
          kind: "pills",
          required: true,
          options: pills([
            "Already enrolled in Part A & B",
            "Turning 65 soon",
            "Eligible due to disability",
            "Not yet enrolled",
          ]),
          showIf: "plan_kind=Medicare",
        },
        {
          name: "medicare_plan_interest",
          label: "What kind of Medicare plan interests you?",
          kind: "pills",
          required: true,
          options: pills([
            "Medicare Advantage (Part C)",
            "Medicare Supplement (Medigap)",
            "Part D (prescription drug only)",
            "Not sure — show me everything",
          ]),
          showIf: "plan_kind=Medicare",
        },
        {
          name: "medicare_prescription_needs",
          label: "Do you currently take prescription drugs regularly?",
          kind: "pills",
          required: true,
          options: pills(["No prescriptions","1–3 prescriptions","4+ prescriptions"]),
          showIf: "plan_kind=Medicare",
        },
      ],
    },

    // ============= STEP 3: INCOME (shared, but contextualized) =============
    {
      heading: "Your {italic}income{/italic}.",
      lede: "Used for subsidy and Extra Help eligibility estimates. Never reported to credit agencies.",
      fields: [
        { name: "household_income", label: "Estimated household income (annual)", kind: "select", required: true, options: [
          { value: "<30k", label: "Under $30,000" },
          { value: "30k-50k", label: "$30,000 – $50,000" },
          { value: "50k-75k", label: "$50,000 – $75,000" },
          { value: "75k-100k", label: "$75,000 – $100,000" },
          { value: "100k-200k", label: "$100,000 – $200,000" },
          { value: "200k+", label: "$200,000+" },
        ]},
      ],
    },

    // ============= STEP 4: PLAN PREFERENCES (branched) =============
    {
      heading: "Plan {italic}preferences{/italic}.",
      lede: "What matters most in the plan you choose?",
      fields: [
        // ---- Non-Medicare preferences ----
        {
          name: "plan_priority",
          label: "Pick what matters most",
          kind: "pills",
          required: true,
          options: pills(["Low premium","Balanced","Low deductible"]),
          showIf: "plan_kind!=Medicare",
        },
        {
          name: "primary_care_usage",
          label: "How often do you see a doctor?",
          kind: "pills",
          required: true,
          options: pills(["Rarely","A few times a year","Monthly+"]),
          showIf: "plan_kind!=Medicare",
        },
        {
          name: "prescription_dependency",
          label: "Take any regular prescriptions?",
          kind: "yesno",
          required: true,
          showIf: "plan_kind!=Medicare",
        },

        // ---- Medicare preferences ----
        {
          name: "medicare_doctor_preference",
          label: "Do you want to keep your current doctors?",
          kind: "pills",
          required: true,
          options: pills([
            "Yes — must keep my doctors",
            "Prefer to, but flexible",
            "I'm open to switching",
          ]),
          showIf: "plan_kind=Medicare",
        },
        {
          name: "medicare_extras_interest",
          label: "Interested in extras like dental, vision, or fitness?",
          kind: "pills",
          required: true,
          options: pills(["Yes — important to me","Nice to have","Not important"]),
          showIf: "plan_kind=Medicare",
        },
        {
          name: "medicare_budget",
          label: "Preferred monthly premium budget",
          kind: "pills",
          required: true,
          options: pills(["$0/mo plans","Under $50/mo","$50–$150/mo","No budget — best value"]),
          showIf: "plan_kind=Medicare",
        },
      ],
    },

    // ============= STEP 5: COVERAGE DETAILS (shared) =============
    {
      heading: "Coverage {italic}details{/italic}.",
      lede: "Last screen before contact.",
      fields: [
        { name: "currently_insured", label: "Currently have health insurance?", kind: "yesno", required: true },
        { name: "current_carrier", label: "Current carrier", kind: "select", showIf: "currently_insured=Yes", options: CARRIERS_HEALTH },
        { name: "chronic_conditions", label: "Diagnosed with any chronic conditions?", kind: "yesno", required: true },
      ],
    },
  ],
};

// ============================================
// RENTERS INSURANCE
// ============================================
const rentersFlow: FlowConfig = {
  slug: "renters",
  verticalKey: "renters",
  eyebrow: "Renters insurance",
  submitLabel: "See my offers",
  thanksUrl: "/renters-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Renters insurance {italic}made simple{/italic}.",
      lede: "Most renters get a policy in under 60 seconds.",
      fields: [
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code" },
        { name: "rental_type", label: "What kind of place do you rent?", kind: "pills", required: true, options: pills(["Apartment","House","Condo","Room"]) },
        { name: "move_in_status", label: "Are you renewing or moving in?", kind: "pills", required: true, options: pills(["Already moved in","Moving soon","Not sure yet"]) },
      ],
    },
    {
      heading: "Tell us {italic}about you{/italic}.",
      lede: "Just the basics — no SSN, no credit check.",
      fields: [
        { name: "dob", label: "Date of birth", kind: "date", required: true, autocomplete: "bday", min: "1920-01-01", max: `${currentYear - 18}-12-31`, width: "half" },
        { name: "marital_status", label: "Marital status", kind: "pills", required: true, options: pills(["Single","Married","Partnered"]) },
        { name: "roommates", label: "Living with roommates (excluding spouse/partner)?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "How much {italic}coverage{/italic}?",
      lede: "Estimate the value of everything you'd want replaced if something happened.",
      fields: [
        { name: "personal_property_value", label: "Estimated value of your belongings", kind: "pills", required: true, options: pills(["<$15K","$15K-$30K","$30K-$50K","$50K+"]) },
        { name: "deductible_preference", label: "Preferred deductible", kind: "pills", required: true, options: pills(["$250","$500","$1,000"]) },
        { name: "valuable_items", label: "Own anything valuable (jewelry, electronics, art) worth $1,500+?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "Coverage {italic}history{/italic}.",
      lede: "Almost done.",
      fields: [
        { name: "currently_insured", label: "Currently have renters insurance?", kind: "yesno", required: true },
        { name: "prior_claims_5yr", label: "Filed a renters insurance claim in the last 5 years?", kind: "pills", required: true, options: pills(["None","1","2+"]) },
        { name: "pets", label: "Do you have pets?", kind: "yesno", required: true },
      ],
    },
  ],
};

// ============================================
// PET INSURANCE
// ============================================
const petFlow: FlowConfig = {
  slug: "pet",
  verticalKey: "pet",
  eyebrow: "Pet insurance",
  submitLabel: "See my plans",
  thanksUrl: "/pet-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Meet your {italic}furry family{/italic}.",
      lede: "Tell us about your pet — takes about a minute.",
      fields: [
        { name: "zip", label: "ZIP code", kind: "zip", required: true, autocomplete: "postal-code", width: "half" },
        { name: "pet_type", label: "Pet type", kind: "pills", required: true, options: pills(["Dog","Cat","Other"]), width: "half" },
        { name: "pet_name", label: "Pet's name (optional)", kind: "text", required: false, placeholder: "e.g. Bailey" },
      ],
    },
    {
      heading: "About {italic}your dog{/italic}.",
      lede: "Breed and age are the biggest factors in your premium.",
      fields: [
        { name: "dog_breed", label: "Breed", kind: "select", required: true, showIf: "pet_type=Dog", options: COMMON_DOG_BREEDS },
        { name: "cat_breed", label: "Breed", kind: "select", required: true, showIf: "pet_type=Cat", options: COMMON_CAT_BREEDS },
        { name: "other_species", label: "Species", kind: "text", required: true, showIf: "pet_type=Other", placeholder: "e.g. Rabbit, Bird, Reptile" },
        { name: "pet_age", label: "Pet's age", kind: "select", required: true, options: [
          { value: "<1", label: "Under 1 year (puppy/kitten)" },
          { value: "1-3", label: "1 – 3 years" },
          { value: "4-7", label: "4 – 7 years" },
          { value: "8-11", label: "8 – 11 years" },
          { value: "12+", label: "12+ years (senior)" },
        ], width: "half" },
        { name: "pet_gender", label: "Gender", kind: "pills", required: true, options: pills(["Male","Female"]), width: "half" },
      ],
    },
    {
      heading: "Your pet's {italic}health{/italic}.",
      lede: "Most plans don't cover pre-existing conditions, so disclose accurately.",
      fields: [
        { name: "spayed_neutered", label: "Spayed or neutered?", kind: "yesno", required: true },
        { name: "preexisting_conditions", label: "Diagnosed with any chronic or pre-existing conditions?", kind: "yesno", required: true },
        { name: "vaccinations_current", label: "Are vaccinations up to date?", kind: "yesno", required: true },
        { name: "indoor_outdoor", label: "Indoor or outdoor?", kind: "pills", required: true, options: pills(["Indoor only","Mostly indoor","Outdoor"]) },
      ],
    },
    {
      heading: "Coverage {italic}preferences{/italic}.",
      lede: "Almost there.",
      fields: [
        { name: "coverage_type", label: "What kind of coverage?", kind: "pills", required: true, options: pills(["Accident only","Accident + illness","Comprehensive (+ wellness)"]) },
        { name: "monthly_budget", label: "Monthly budget", kind: "pills", required: true, options: pills(["<$30","$30-$60","$60+"]) },
        { name: "currently_insured", label: "Currently insured?", kind: "yesno", required: true },
        { name: "current_carrier", label: "Current carrier", kind: "select", showIf: "currently_insured=Yes", options: CARRIERS_PET },
      ],
    },
  ],
};

// ============================================
// TRAVEL INSURANCE
// ============================================
const travelFlow: FlowConfig = {
  slug: "travel",
  verticalKey: "travel",
  eyebrow: "Travel insurance",
  submitLabel: "See my plans",
  thanksUrl: "/travel-insurance/quotes/thanks/",
  steps: [
    {
      heading: "Your {italic}trip{/italic}.",
      lede: "Start with where and when. Takes about 60 seconds.",
      fields: [
        { name: "destination", label: "Primary destination (country)", kind: "text", required: true, placeholder: "e.g. Italy, Japan, Mexico" },
        { name: "departure_date", label: "Departure date", kind: "date", required: true, width: "half" },
        { name: "return_date", label: "Return date", kind: "date", required: true, width: "half" },
        { name: "trip_type", label: "Trip type", kind: "pills", required: true, options: pills(["Leisure","Business","Adventure","Study abroad","Cruise"]) },
      ],
    },
    {
      heading: "Who's {italic}traveling{/italic}?",
      lede: "Family plans usually beat per-traveler pricing.",
      fields: [
        { name: "traveler_count", label: "Number of travelers", kind: "pills", required: true, options: pills(["1","2","3","4","5+"]) },
        { name: "group_type", label: "Group type", kind: "pills", required: true, options: pills(["Solo","Couple","Family","Friends","Business team"]) },
        { name: "primary_age", label: "Primary traveler age range", kind: "pills", required: true, options: pills(["Under 30","30-49","50-69","70+"]) },
      ],
    },
    {
      heading: "Trip {italic}details{/italic}.",
      lede: "Coverage matches the value and risk of your trip.",
      fields: [
        { name: "trip_cost", label: "Total trip cost (per person)", kind: "select", required: true, options: [
          { value: "<1000", label: "Under $1,000" },
          { value: "1000-3000", label: "$1,000 – $3,000" },
          { value: "3000-7000", label: "$3,000 – $7,000" },
          { value: "7000+", label: "$7,000+" },
        ]},
        { name: "preexisting_conditions", label: "Any traveler with a pre-existing medical condition?", kind: "yesno", required: true },
        { name: "high_risk_activities", label: "Planning any high-risk activities (skiing, diving, climbing)?", kind: "yesno", required: true },
      ],
    },
    {
      heading: "What {italic}should it cover{/italic}?",
      lede: "Pick what you'd be most upset losing.",
      fields: [
        { name: "coverage_medical", label: "Emergency medical & evacuation", kind: "yesno", required: true },
        { name: "coverage_cancellation", label: "Trip cancellation / interruption", kind: "yesno", required: true },
        { name: "coverage_baggage", label: "Lost or delayed baggage", kind: "yesno", required: true },
        { name: "purchase_intent", label: "Where are you in the decision?", kind: "pills", required: true, options: pills(["Buying now","Comparing options","Just researching"]) },
      ],
    },
  ],
};

// ============================================
// Public registry
// ============================================
export const FLOWS = {
  auto: autoFlow,
  home: homeFlow,
  life: lifeFlow,
  business: businessFlow,
  health: healthFlow,
  renters: rentersFlow,
  pet: petFlow,
  travel: travelFlow,
} as const;

export type FlowKey = keyof typeof FLOWS;
