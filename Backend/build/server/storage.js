"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
const db_1 = require("./db");
const schema_1 = require("@shared/schema");
const drizzle_orm_1 = require("drizzle-orm");
class DatabaseStorage {
    // Products
    async getProducts() {
        return await db_1.db.select().from(schema_1.products).orderBy((0, drizzle_orm_1.desc)(schema_1.products.id));
    }
    async getProduct(id) {
        const [product] = await db_1.db.select().from(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
        return product;
    }
    async createProduct(insertProduct) {
        const [product] = await db_1.db.insert(schema_1.products).values(insertProduct).returning();
        return product;
    }
    async updateProduct(id, updateProduct) {
        const [product] = await db_1.db.update(schema_1.products)
            .set(updateProduct)
            .where((0, drizzle_orm_1.eq)(schema_1.products.id, id))
            .returning();
        return product;
    }
    async deleteProduct(id) {
        await db_1.db.delete(schema_1.products).where((0, drizzle_orm_1.eq)(schema_1.products.id, id));
    }
    // Contacts
    async createContact(insertContact) {
        const [contact] = await db_1.db.insert(schema_1.contacts).values(insertContact).returning();
        return contact;
    }
    async getContacts() {
        return await db_1.db.select().from(schema_1.contacts).orderBy((0, drizzle_orm_1.desc)(schema_1.contacts.createdAt));
    }
    async updateContactStatus(id, status) {
        const [contact] = await db_1.db.update(schema_1.contacts)
            .set({ status })
            .where((0, drizzle_orm_1.eq)(schema_1.contacts.id, id))
            .returning();
        return contact;
    }
    // Users
    async getUserByUsername(username) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username));
        return user;
    }
    async createUser(insertUser) {
        const [user] = await db_1.db.insert(schema_1.users).values(insertUser).returning();
        return user;
    }
    async getUser(id) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        return user;
    }
}
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
//# sourceMappingURL=storage.js.map