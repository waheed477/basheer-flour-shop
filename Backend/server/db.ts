import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop';

// Connect to MongoDB with Atlas configuration
export async function connectDB() {
  try {
    // MongoDB Atlas connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(MONGODB_URI, options);
    console.log('✅ MongoDB Atlas connected successfully');
    
    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error);
    process.exit(1);
  }
}

// Check database connection
export async function testConnection() {
  try {
    const conn = mongoose.connection;
    if (conn.readyState === 1) {
      console.log('✅ MongoDB Atlas is connected');
      return true;
    }
    
    await connectDB();
    return true;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error);
    return false;
  }
}

// Close database connection
export async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB Atlas connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB Atlas connection:', error);
  }
}