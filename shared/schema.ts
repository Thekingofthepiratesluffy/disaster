import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ========== Resources ==========
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  skillLevel: text("skill_level").notNull(),
  type: text("type").notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 1 }).notNull(),
  reviewCount: integer("review_count").notNull(),
  lastUpdated: text("last_updated").notNull(),
  readingTime: integer("reading_time").notNull(),
  implementationTime: text("implementation_time").notNull(),
  prerequisites: text("prerequisites").array().notNull(),
});

export const resourceSchema = createInsertSchema(resources);
export type ResourceType = typeof resources.$inferSelect;
export type InsertResourceType = z.infer<typeof resourceSchema>;

// ========== Strategy Comparisons ==========
export const strategyComparisons = pgTable("strategy_comparisons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rto: text("rto").notNull(),
  rpo: text("rpo").notNull(),
  cost: integer("cost").notNull(),
  complexity: integer("complexity").notNull(),
});

export const strategyComparisonSchema = createInsertSchema(strategyComparisons);
export type StrategyComparisonType = typeof strategyComparisons.$inferSelect;
export type InsertStrategyComparisonType = z.infer<typeof strategyComparisonSchema>;

// ========== Downloadable Resources ==========
export const downloadableResources = pgTable("downloadable_resources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  downloadUrl: text("download_url").notNull(),
});

export const downloadableResourceSchema = createInsertSchema(downloadableResources);
export type DownloadableResourceType = typeof downloadableResources.$inferSelect;
export type InsertDownloadableResourceType = z.infer<typeof downloadableResourceSchema>;

// ========== Testimonials ==========
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  date: text("date").notNull(),
});

export const testimonialSchema = createInsertSchema(testimonials);
export type TestimonialType = typeof testimonials.$inferSelect;
export type InsertTestimonialType = z.infer<typeof testimonialSchema>;

// ========== Contact Form ==========
export const contactForms = pgTable("contact_forms", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  areaOfInterest: text("area_of_interest").notNull(),
  message: text("message").notNull(),
  agreeToReceiveInfo: boolean("agree_to_receive_info").notNull(),
  createdAt: text("created_at").notNull(),
});

export const contactFormSchema = createInsertSchema(contactForms);
export type ContactFormType = typeof contactForms.$inferSelect;
export type InsertContactFormType = z.infer<typeof contactFormSchema>;

// ========== Strategy Request ==========
export const strategyRequestSchema = z.object({
  organizationSize: z.string(),
  dataVolume: z.number(),
  recoveryTimeObjective: z.string(),
  budget: z.string(),
});

export type StrategyRequestType = z.infer<typeof strategyRequestSchema>;

// ========== Strategy Response ==========
export const strategyResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  estimatedCost: z.string(),
  implementationTime: z.string(),
  complexity: z.string(),
  recommendations: z.array(z.string()),
});

export type StrategyResponseType = z.infer<typeof strategyResponseSchema>;
