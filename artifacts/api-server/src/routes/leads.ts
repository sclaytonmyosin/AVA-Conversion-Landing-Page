import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import { CreateLeadBody, CreateLeadResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const attempts = new Map<string, { count: number; expires: number }>();
const windowMs = 15 * 60 * 1000;
const cleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.expires <= now) attempts.delete(key);
  }
}, windowMs);
cleanup.unref();

router.post("/leads", async (req, res): Promise<void> => {
  const key = req.ip ?? "unknown";
  const now = Date.now();
  let attempt = attempts.get(key);
  if (!attempt || attempt.expires <= now) {
    attempt = { count: 0, expires: now + windowMs };
    attempts.set(key, attempt);
  }
  attempt.count++;
  if (attempt.count > 20) {
    res.setHeader("Retry-After", Math.ceil((attempt.expires - now) / 1000));
    res.status(429).json({ error: "Too many attempts. Please try again later." });
    return;
  }

  const parsed = CreateLeadBody.safeParse(req.body);
  if (!parsed.success || parsed.data.consent !== true) {
    res.status(400).json({ error: "Enter a valid email and agree to receive AVA emails." });
    return;
  }
  const { email, consent, source, medium, campaign } = parsed.data;
  try {
    await db.insert(leadsTable).values({
      email: email.trim().toLowerCase(),
      consent,
      consentText: "I agree to receive AVA product updates, offers, and news. I can unsubscribe at any time.",
      source,
      medium,
      campaign,
    }).onConflictDoNothing({ target: leadsTable.email });
    res.status(201).json(CreateLeadResponse.parse({
      success: true,
      downloadUrl: "https://apps.apple.com/app/id6746447344",
    }));
  } catch {
    req.log.error("Lead could not be saved");
    res.status(503).json({ error: "We couldn't save your email. Please try again." });
  }
});

export default router;
