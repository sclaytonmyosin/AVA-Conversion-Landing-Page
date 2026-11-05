import assert from "node:assert/strict";
import test from "node:test";
import { getCampaignLink, resolveCampaign, standardOffer } from "@workspace/ava-campaigns";

test("the existing SEANVIP link selects Sean's configured campaign", () => {
  const selected = resolveCampaign("SEANVIP");
  assert.equal(selected.campaign?.id, "sean-clayton");
  assert.equal(selected.offer, standardOffer);
});

test("matching tolerates case and whitespace, without partial matching", () => {
  assert.equal(resolveCampaign(" seanvip ").campaign?.id, "sean-clayton");
  assert.equal(resolveCampaign("SEANVIP-FAKE").campaign, null);
});

test("campaign identifies the influencer when source names the channel", () => {
  assert.equal(resolveCampaign("instagram", "sean-clayton").campaign?.id, "sean-clayton");
});

test("unknown and missing UTMs cannot create personalized offers", () => {
  for (const source of [undefined, "", "unknown", "<script>alert(1)</script>", "six-months-free"]) {
    const selected = resolveCampaign(source, "unknown");
    assert.equal(selected.campaign, null);
    assert.equal(selected.offer.id, "14-day-trial");
    assert.equal(selected.offer.downloadUrl, standardOffer.downloadUrl);
  }
});

test("generated links round-trip into the same campaign and respect the base path", () => {
  for (const base of ["/", "/ava", "/ava/"]) {
    const path = getCampaignLink("sean-clayton", base);
    const url = new URL(path, "https://example.invalid");
    assert.equal(url.pathname, base === "/" ? "/getava" : "/ava/getava");
    assert.equal(url.searchParams.get("utm_medium"), "influencer");
    assert.equal(resolveCampaign(url.searchParams.get("utm_source"), url.searchParams.get("utm_campaign")).campaign?.id, "sean-clayton");
  }
});

test("link generation rejects unconfigured influencers", () => {
  assert.throws(() => getCampaignLink("not-configured"), /Unknown campaign/);
});
