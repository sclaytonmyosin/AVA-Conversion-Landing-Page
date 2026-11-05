# Influencer campaigns

The landing page and email endpoint use the same public campaign list in `src/index.ts`.

To add an influencer:

1. Add an entry to `influencerCampaigns` with a unique ID, influencer display name, source, source aliases, campaign aliases, welcome copy, and approved offer.
2. Generate links with `pnpm --filter @workspace/scripts campaign-links`. Output is path-only; use the domain serving this rebuilt landing page, not necessarily the original AVA domain.
3. Run `pnpm --filter @workspace/scripts test:campaigns` and `pnpm run typecheck`.
4. Publish the updated configuration when approved. This is configuration-based automation, not a self-service campaign dashboard.

`utm_source` is matched case-insensitively to an exact configured alias. A recognized source wins; otherwise a recognized `utm_campaign` can select the influencer when source is a channel such as Instagram. Unknown UTMs get the standard page and trial. Query parameters cannot override names, prices, copy, or download URLs.

Every offer's CTA, duration, pricing terms, signup copy, download instructions, and redemption URL live together. Only introduce different terms once the real App Store redemption mechanism is confirmed. Sean's campaign currently uses the standard 14-day trial, not an unconfirmed six-month offer.

New leads retain raw source/medium/campaign plus server-derived campaign ID, influencer name, and offer ID. Existing-email submissions preserve the original acquisition record (first-touch attribution), rather than overwriting it with whichever link was clicked most recently. Emails remain in this project's database; this does not integrate with AVA's email provider or grant a subscription.
