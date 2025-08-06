
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const videoProjectsTable = pgTable('video_projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// TypeScript types for the table schema
export type VideoProject = typeof videoProjectsTable.$inferSelect;
export type NewVideoProject = typeof videoProjectsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { videoProjects: videoProjectsTable };
