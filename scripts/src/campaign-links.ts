import { getCampaignLink, influencerCampaigns } from "@workspace/ava-campaigns";

// Path-only output can be attached to whichever domain serves this landing page.
for (const campaign of influencerCampaigns) {
  console.log(`${campaign.influencer}: ${getCampaignLink(campaign.id)}`);
}
