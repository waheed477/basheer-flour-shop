"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSettingSchema = exports.insertUserSchema = exports.insertContactSchema = exports.insertProductSchema = exports.auditLogs = exports.settings = exports.users = exports.contacts = exports.products = void 0;
// Backend/shared/schema.ts - UPDATED VERSION
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
// === TABLE DEFINITIONS ===
exports.products = (0, pg_core_1.pgTable)("products", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    nameUrdu: (0, pg_core_1.text)("name_urdu").notNull(),
    descriptionEn: (0, pg_core_1.text)("description_en").notNull(),
    descriptionUrdu: (0, pg_core_1.text)("description_urdu").notNull(),
    price: (0, pg_core_1.numeric)("price").notNull(),
    category: (0, pg_core_1.text)("category", { enum: ["wheat", "flour"] }).notNull(),
    unit: (0, pg_core_1.text)("unit", { enum: ["kg", "maan", "lb"] }).notNull().default("kg"),
    image: (0, pg_core_1.text)("image").notNull(),
    stock: (0, pg_core_1.integer)("stock").notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
exports.contacts = (0, pg_core_1.pgTable)("contacts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.text)("name").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    phone: (0, pg_core_1.text)("phone"),
    message: (0, pg_core_1.text)("message").notNull(),
    status: (0, pg_core_1.text)("status", { enum: ["new", "read", "replied"] }).default("new").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    role: (0, pg_core_1.text)("role").default("admin").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// NEW: Settings table for website configuration
exports.settings = (0, pg_core_1.pgTable)("settings", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    key: (0, pg_core_1.text)("key").notNull().unique(),
    value: (0, pg_core_1.text)("value").notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at").defaultNow(),
});
// NEW: Audit log for admin actions
exports.auditLogs = (0, pg_core_1.pgTable)("audit_logs", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id),
    action: (0, pg_core_1.text)("action").notNull(),
    resource: (0, pg_core_1.text)("resource").notNull(),
    resourceId: (0, pg_core_1.integer)("resource_id"),
    details: (0, pg_core_1.text)("details"),
    ipAddress: (0, pg_core_1.text)("ip_address"),
    userAgent: (0, pg_core_1.text)("user_agent"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// === SCHEMAS ===
exports.insertProductSchema = (0, drizzle_zod_1.createInsertSchema)(exports.products).omit({
    id: true,
    createdAt: true,
    updatedAt: true
});
exports.insertContactSchema = (0, drizzle_zod_1.createInsertSchema)(exports.contacts).omit({
    id: true,
    createdAt: true,
    status: true
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).omit({
    id: true,
    createdAt: true
});
exports.insertSettingSchema = (0, drizzle_zod_1.createInsertSchema)(exports.settings).omit({
    id: true,
    updatedAt: true
});
//# sourceMappingURL=schema.js.map