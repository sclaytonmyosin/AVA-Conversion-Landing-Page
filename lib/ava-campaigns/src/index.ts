/** Public campaign configuration shared by the page and lead endpoint. No secrets here. */
export interface Offer {
  id: string;
  freePeriod: string;
  priceAfter: string;
  cta: string;
  shortCta: string;
  signupTitle: string;
  terms: string;
  downloadInstructions: string;
  downloadUrl: string;
}

// Only add an offer once its terms AND App Store redemption mechanism are confirmed.
export const standardOffer: Offer = {
  id: "14-day-trial",
  freePeriod: "14 days",
  priceAfter: "$12.99/month",
  cta: "Get my 14 days free",
  shortCta: "Get 14 days free",
  signupTitle: "Start your 14 free days",
  terms: "AVA is free for 14 days, then $12.99/month. Cancel anytime through Apple.",
  downloadInstructions: "Download AVA from the App Store and start your free trial inside the app. Your 14 days begin when you subscribe through Apple.",
  downloadUrl: "https://apps.apple.com/app/id6746447344",
};

export interface InfluencerCampaign {
  id: string;
  influencer: string;
  source: string;
  sourceAliases: readonly string[];
  campaignAliases: readonly string[];
  welcome: string;
  offer: Offer;
}

export const influencerCampaigns: readonly InfluencerCampaign[] = [
  {
    id: "sean-clayton",
    influencer: "Sean Clayton",
    source: "SEANVIP",
    sourceAliases: ["SEANVIP"],
    campaignAliases: ["sean-clayton", "SEANVIP"],
    welcome: "Welcome, Sean Clayton’s community",
    // No Sean-specific discount or endorsement has been confirmed.
    offer: standardOffer,
  },
];

export interface ResolvedCampaign {
  campaign: InfluencerCampaign | null;
  offer: Offer;
}

const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase();

/** Recognized source wins. Campaign can identify an influencer when source is a channel. */
export function resolveCampaign(source?: string | null, campaign?: string | null): ResolvedCampaign {
  const sourceKey = normalize(source);
  const campaignKey = normalize(campaign);
  const selected = influencerCampaigns.find((entry) =>
    entry.sourceAliases.some((alias) => normalize(alias) === sourceKey),
  ) ?? influencerCampaigns.find((entry) =>
    entry.campaignAliases.some((alias) => normalize(alias) === campaignKey),
  ) ?? null;
  return { campaign: selected, offer: selected?.offer ?? standardOffer };
}

/** Generates path-only links; never guesses a deployment domain. */
export function getCampaignLink(id: string, basePath = "/"): string {
  const campaign = influencerCampaigns.find((entry) => entry.id === id);
  if (!campaign) throw new Error(`Unknown campaign: ${id}`);
  const params = new URLSearchParams({
    utm_source: campaign.source,
    utm_medium: "influencer",
    utm_campaign: campaign.id,
  });
  return `${basePath.replace(/\/?$/, "/")}getava?${params}`;
}
