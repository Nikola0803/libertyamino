"use client";

export interface CampaignAttribution {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPath?: string;
  capturedAt?: string;
}

const STORAGE_KEY = "evlv_campaign_attribution_v1";
const PARAMS: Array<[keyof CampaignAttribution, string]> = [
  ["source", "utm_source"],
  ["medium", "utm_medium"],
  ["campaign", "utm_campaign"],
  ["content", "utm_content"],
  ["term", "utm_term"],
];

function clean(value: string | null) {
  return value?.trim().slice(0, 120) || undefined;
}

export function captureAttributionFromUrl(url = new URL(window.location.href)): CampaignAttribution | null {
  const next: CampaignAttribution = {};
  for (const [field, parameter] of PARAMS) next[field] = clean(url.searchParams.get(parameter));
  const hasCampaignData = PARAMS.some(([field]) => Boolean(next[field]));
  if (!hasCampaignData) return getStoredAttribution();
  next.landingPath = `${url.pathname}${url.search}`.slice(0, 500);
  next.capturedAt = new Date().toISOString();
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* attribution remains available for this call */ }
  return next;
}

export function getStoredAttribution(): CampaignAttribution | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as CampaignAttribution : null;
  } catch { return null; }
}

export function formatAttributionNote(attribution: CampaignAttribution | null): string | undefined {
  if (!attribution) return undefined;
  const values = [
    attribution.source && `source=${attribution.source}`,
    attribution.medium && `medium=${attribution.medium}`,
    attribution.campaign && `campaign=${attribution.campaign}`,
    attribution.content && `content=${attribution.content}`,
    attribution.term && `term=${attribution.term}`,
    attribution.landingPath && `landing=${attribution.landingPath}`,
  ].filter(Boolean);
  return values.length ? `Campaign attribution: ${values.join(", ")}` : undefined;
}
