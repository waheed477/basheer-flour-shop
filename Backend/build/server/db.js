"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.testConnection = testConnection;
exports.closeDB = closeDB;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop';
// Connect to MongoDB with Atlas configuration
async function connectDB() {
    try {
        // MongoDB Atlas connection options
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        await mongoose_1.default.connect(MONGODB_URI, options);
        console.log('✅ MongoDB Atlas connected successfully');
        // Connection events
        mongoose_1.default.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('❌ MongoDB disconnected');
        });
        return mongoose_1.default.connection;
    }
    catch (error) {
        console.error('❌ MongoDB Atlas connection failed:', error);
        process.exit(1);
    }
}
// Check database connection
async function testConnection() {
    try {
        const conn = mongoose_1.default.connection;
        if (conn.readyState === 1) {
            console.log('✅ MongoDB Atlas is connected');
            return true;
        }
        await connectDB();
        return true;
    }
    catch (error) {
        console.error('❌ MongoDB Atlas connection failed:', error);
        return false;
    }
}
// Close database connection
async function closeDB() {
    try {
        await mongoose_1.default.connection.close();
        console.log('✅ MongoDB Atlas connection closed');
    }
    catch (error) {
        console.error('❌ Error closing MongoDB Atlas connection:', error);
    }
}
//# sourceMappingURL=db.js.map