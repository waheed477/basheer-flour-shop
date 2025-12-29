import { type Product, type InsertProduct, type UpdateProductRequest, type Contact, type InsertContact, type User, type InsertUser } from "@shared/schema";
export interface IStorage {
    getProducts(): Promise<Product[]>;
    getProduct(id: number): Promise<Product | undefined>;
    createProduct(product: InsertProduct): Promise<Product>;
    updateProduct(id: number, product: UpdateProductRequest): Promise<Product | undefined>;
    deleteProduct(id: number): Promise<void>;
    createContact(contact: InsertContact): Promise<Contact>;
    getContacts(): Promise<Contact[]>;
    updateContactStatus(id: number, status: "new" | "read" | "replied"): Promise<Contact | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    getUser(id: number): Promise<User | undefined>;
}
export declare class DatabaseStorage implements IStorage {
    getProducts(): Promise<Product[]>;
    getProduct(id: number): Promise<Product | undefined>;
    createProduct(insertProduct: InsertProduct): Promise<Product>;
    updateProduct(id: number, updateProduct: UpdateProductRequest): Promise<Product | undefined>;
    deleteProduct(id: number): Promise<void>;
    createContact(insertContact: InsertContact): Promise<Contact>;
    getContacts(): Promise<Contact[]>;
    updateContactStatus(id: number, status: "new" | "read" | "replied"): Promise<Contact | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    createUser(insertUser: InsertUser): Promise<User>;
    getUser(id: number): Promise<User | undefined>;
}
export declare const storage: DatabaseStorage;
//# sourceMappingURL=storage.d.ts.map