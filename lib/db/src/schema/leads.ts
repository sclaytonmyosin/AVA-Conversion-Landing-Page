import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("ava_leads", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  consent: boolean("consent").notNull(),
  consentText: text("consent_text").notNull(),
  source: text("source"),
  medium: text("medium"),
  campaign: text("campaign"),
  offer: text("offer").notNull().default("14-day-trial"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
