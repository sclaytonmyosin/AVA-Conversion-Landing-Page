# /gift — Design handoff

Visual prototype of the AVA gifting flow. **Client-side only**: no network calls, no persistence, no payment, nothing is sent.

## Prototype interactions
- **Gift AVA** buttons (nav, hero, closing section) smooth-scroll to `#personalize` (instant when the user has reduced motion turned on).
- **"What she's holding" grid**: toggles each item between "on her mind" and "handled"; shows a live count; "Hand them all over" / "Reset".
- **Personalize form** (`#personalize`): the live card on the right updates as you type.
- **Message starters**: three chips fill in the message textarea.
- **Preview gift** (form submit): opens a Radix dialog (`@/components/ui/dialog`) showing the personalized card, labeled "Design preview — no purchase made or gift sent". Closes with Esc, the close button, or "Keep editing".
- A persistent notice under the form says nothing is purchased or sent.

## Fields (local React state only)
| Field | State | Limit | Fallback in card |
|---|---|---|---|
| Recipient first name | `to` | 40 chars | "Her name" |
| Sender first name | `from` | 40 chars | "you" |
| Personal message | `msg` | 280 chars, live counter | "Your message will appear here." |

There are intentionally no recipient email, delivery date, or payment fields.

## Future integration points
1. **Validation**: add the shadcn `Form` + zod schema once requirements are final (required fields, profanity/length rules).
2. **Checkout**: replace the submit → preview step with preview → checkout (e.g. App Store offer codes or a web payment provider). Nothing is wired today.
3. **Delivery**: decide how the gift is delivered (sender shares a link, email, or printable card). Recipient contact fields would go here.
4. **Redemption**: the recipient lands on a redemption page that shows the card (reuse the `GiftCard` component) and gets them into the iPhone app.
5. **Analytics**: add events for preview opened and prompt chosen.

## Unconfirmed
Price, gift duration, delivery method, and redemption terms are **not confirmed**. The page deliberately avoids stating any of them. The FAQ describes the intended experience only.
