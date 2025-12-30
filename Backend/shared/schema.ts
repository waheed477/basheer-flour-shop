// === EXPLICIT API TYPES ===

// Check your Product type definition:
export interface Product {
  id: string; // Make sure this exists
  _id?: string; // Optional, for backend response
  name: string;
  nameUrdu: string;
  descriptionEn: string;
  descriptionUrdu: string;
  price: string;
  category: 'flour' | 'wheat';
  unit: 'kg' | 'maan' | 'lb'; // Added 'lb' from your table definition
  image: string;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

// Keep the Drizzle inferred type for backend use
export type DbProduct = typeof products.$inferSelect;
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