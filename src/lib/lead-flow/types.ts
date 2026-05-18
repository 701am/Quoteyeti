/**
 * Lead-flow type system
 *
 * Each vertical's funnel is described as a FlowConfig: an ordered list of
 * StepDefs, each with a heading and a list of FieldDefs. The LeadFlow
 * component reads this and renders the form.
 *
 * Conventions:
 * - Use snake_case for `name` — that's what lands in Netlify Forms.
 * - `kind` controls rendering: pills for radios, dropdown for selects, etc.
 * - `showIf` is a string like "field_name=Value" for conditional reveal.
 * - Mark fields `required: false` to make them optional.
 */

export type FieldKind =
  | "text"
  | "email"
  | "tel"
  | "number"
  | "date"
  | "zip"
  | "select"
  | "pills"        // radio group rendered as tappable pills
  | "yesno";       // shortcut for two-button Yes/No pills

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldDef {
  name: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  options?: SelectOption[] | string[];  // for select / pills
  autocomplete?: string;
  inputmode?: string;
  pattern?: string;
  maxlength?: number;
  min?: string;
  max?: string;
  /** Show this field only when another field has a given value. Format: "field_name=Value" */
  showIf?: string;
  /** Width hint for layout: "full" (default) or "half" (sits in a 2-col row). */
  width?: "full" | "half";
}

export interface StepDef {
  /** Step heading. Can include a single `{italic}…{/italic}` flourish that we render in the editorial-italic style. */
  heading: string;
  lede: string;
  /** Fields rendered top-to-bottom on this step. */
  fields: FieldDef[];
}

export interface FlowConfig {
  /** Slug used in URLs and as the Netlify form name's prefix (e.g. "auto" → form name "auto-quotes-lead"). */
  slug: string;
  verticalKey: import("~/data/verticals").VerticalKey;
  /** Hero/eyebrow accent text. */
  eyebrow: string;
  /** Final-step submit-button text. */
  submitLabel: string;
  steps: StepDef[];
  /** Where to send the user after successful submit. Conventionally `/<vertical>/quotes/thanks/`. */
  thanksUrl: string;
  /** Optional: TCPA consent override. Default uses the network-with-reference-link pattern. */
  tcpaPartners?: string;  // e.g. "our partner network" or named partners
}

/**
 * Helper: turn a list of strings into SelectOption[] (label === value).
 */
export function pills(values: string[]): SelectOption[] {
  return values.map((v) => ({ value: v, label: v }));
}
