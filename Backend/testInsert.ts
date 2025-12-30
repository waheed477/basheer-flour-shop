// testInsert.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './server/models/Product';

dotenv.config();

async function testInsert() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop';
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Create a sample product
    const newProduct = {
      name: 'Test Flour',
      nameUrdu: 'ٹیسٹ آٹا',
      descriptionEn: 'High quality wheat flour',
      descriptionUrdu: 'اعلی معیار کا گندم کا آٹا',
      price: '120',
      category: 'flour',
      unit: 'kg',
      stock: 10,
      image: '',
    };

    const product = await Product.create(newProduct);
    console.log('✅ Product inserted:', product);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to insert product:', error);
    process.exit(1);
  }
}

testInsert();
