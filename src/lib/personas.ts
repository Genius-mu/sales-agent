import { hasFeature } from "@/lib/plans";

/** Preset personalities available on every plan. */
export const PERSONAS = [
  { value: "friendly and professional", label: "Friendly & professional", desc: "Warm, helpful, builds trust" },
  { value: "direct and concise", label: "Direct & concise", desc: "Gets to the point fast" },
  { value: "enthusiastic and energetic", label: "Enthusiastic & energetic", desc: "High energy, exciting" },
  { value: "warm and consultative", label: "Warm & consultative", desc: "Advisory, thoughtful" },
];

export const DEFAULT_PERSONA = PERSONAS[0].value;
export const MAX_CUSTOM_PERSONA = 300;

export function isPresetPersona(value: string | null | undefined): boolean {
  return !!value && PERSONAS.some((p) => p.value === value);
}

/**
 * The personality the agent should actually use. Custom (written) personas
 * only apply on plans with the "customPersona" feature; otherwise we fall
 * back to the default preset, so the rule can't be bypassed from the browser.
 */
export function resolvePersona(stored: string | null | undefined, plan: string | null | undefined): string {
  const value = (stored ?? "").trim();
  if (!value) return DEFAULT_PERSONA;
  if (isPresetPersona(value)) return value;
  return hasFeature(plan, "customPersona") ? value.slice(0, MAX_CUSTOM_PERSONA) : DEFAULT_PERSONA;
}
