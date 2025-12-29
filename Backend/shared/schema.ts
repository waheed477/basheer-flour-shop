// Backend/shared/schema.ts - UPDATED VERSION
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameUrdu: text("name_urdu").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionUrdu: text("description_urdu").notNull(),
  price: numeric("price").notNull(),
  category: text("category", { enum: ["wheat", "flour"] }).notNull(),
  unit: text("unit", { enum: ["kg", "maan", "lb"] }).notNull().default("kg"),
  image: text("image").notNull(),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "replied"] }).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// NEW: Settings table for website configuration
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// NEW: Audit log for admin actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: integer("resource_id"),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertProductSchema = createInsertSchema(products).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export const insertContactSchema = createInsertSchema(contacts).omit({ 
  id: true, 
  createdAt: true, 
  status: true 
});
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});
export const insertSettingSchema = createInsertSchema(settings).omit({ 
  id: true, 
  updatedAt: true 
});

// === EXPLICIT API TYPES ===

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;

// Request Types
export type LoginRequest = { 
  username: string; 
  password: string; 
};

export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

export type UpdateContactStatusRequest = {
  status: "new" | "read" | "replied";
};

export type UpdateSettingsRequest = Record<string, string>;

// Response Types
export type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ProductsResponse = Product[];
export type ContactsResponse = Contact[];
export type SettingsResponse = Record<string, string>;