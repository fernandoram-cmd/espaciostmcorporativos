import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("Account Manager"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ticketPermissions = pgTable("ticket_permissions", {
  email: text("email").primaryKey(),
  allowed: boolean("allowed").notNull().default(false),
});

export type User = typeof users.$inferSelect;
export type TicketPermission = typeof ticketPermissions.$inferSelect;
