import { z } from "zod";

// ===== PRODUCT SCHEMAS =====
export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  nameUrdu: z.string(),
  descriptionEn: z.string(),
  descriptionUrdu: z.string(),
  price: z.string().or(z.number()),
  category: z.enum(["wheat", "flour"]),
  unit: z.enum(["kg", "maan", "lb"]),
  image: z.string(),
  stock: z.number(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  nameUrdu: z.string().min(1, "Urdu name is required"),
  descriptionEn: z.string().optional(),
  descriptionUrdu: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.enum(["wheat", "flour"]),
  unit: z.enum(["kg", "maan", "lb"]).default("kg"),
  image: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(0),
});

export const updateProductSchema = insertProductSchema.partial();

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

// ===== PRODUCT FORM SCHEMA =====
export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  nameUrdu: z.string().min(1, "Urdu name is required"),
  category: z.enum(["flour", "wheat"]),
  price: z.string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format. Use numbers only"),
  stock: z.string()
    .min(1, "Stock is required")
    .regex(/^\d+$/, "Stock must be a whole number"),
  descriptionEn: z.string().optional(),
  descriptionUrdu: z.string().optional(),
  image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

// ===== CONTACT SCHEMAS =====
export const contactSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  message: z.string(),
  status: z.enum(["new", "read", "replied"]),
  createdAt: z.string().or(z.date()).optional(),
});

export const insertContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const updateContactSchema = z.object({
  status: z.enum(["new", "read", "replied"]),
});

export type Contact = z.infer<typeof contactSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type UpdateContact = z.infer<typeof updateContactSchema>;

// ===== SETTINGS SCHEMAS =====
export const settingsSchema = z.object({
  shopName: z.string(),
  shopNameUrdu: z.string(),
  whatsappNumber: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  addressEn: z.string(),
  addressUrdu: z.string(),
  workingHours: z.string(),
  enableWhatsAppButton: z.boolean(),
  enableOnlineOrders: z.boolean(),
  maintenanceMode: z.boolean(),
});

export const updateSettingsSchema = settingsSchema.partial();

export type Settings = z.infer<typeof settingsSchema>;
export type UpdateSettings = z.infer<typeof updateSettingsSchema>;

// ===== SETTINGS FORM SCHEMA =====
export const settingsFormSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  shopNameUrdu: z.string().min(1, "Urdu shop name is required"),
  whatsappNumber: z.string()
    .min(1, "WhatsApp number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  phoneNumber: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  addressEn: z.string().min(1, "Address is required"),
  addressUrdu: z.string().min(1, "Urdu address is required"),
  workingHours: z.string().min(1, "Working hours are required"),
  enableWhatsAppButton: z.boolean().default(true),
  enableOnlineOrders: z.boolean().default(false),
  maintenanceMode: z.boolean().default(false),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// ===== USER/AUTH SCHEMAS =====
export const userSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  role: z.string(),
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type User = z.infer<typeof userSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type LoginResponse = {
  token: string;
  user: User;
};

// ===== API RESPONSE SCHEMAS =====
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema>;

// ===== HELPER TYPES =====
export type ProductCategory = "wheat" | "flour";
export type ContactStatus = "new" | "read" | "replied";
export type ProductUnit = "kg" | "maan" | "lb";

// ===== REQUEST TYPES =====
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = UpdateProduct;
export type UpdateContactStatusRequest = {
  status: ContactStatus;
};
export type UpdateSettingsRequest = Record<string, string>;