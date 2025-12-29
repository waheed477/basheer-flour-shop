import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixProductSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop');
    console.log('✅ Connected to MongoDB');
    
    // Drop and recreate collection with correct schema
    await mongoose.connection.db.dropCollection('products');
    console.log('🗑️ Dropped old products collection');
    
    // Create new collection with correct schema
    const productSchema = new mongoose.Schema({
      name: { type: String, required: true },
      nameUrdu: { type: String, required: true },
      descriptionEn: { type: String, default: '' },
      descriptionUrdu: { type: String, default: '' },
      price: { type: String, required: true },
      category: { type: String, enum: ['wheat', 'flour'], required: true },
      unit: { type: String, enum: ['kg', 'maan', 'lb'], default: 'kg' },
      image: { type: String, default: '' },
      stock: { type: Number, default: 0, min: 0 },
    }, {
      timestamps: true,
    });
    
    const Product = mongoose.model('Product', productSchema);
    
    // Create sample products
    await Product.create([
      {
        name: 'Premium Wheat',
        nameUrdu: 'پریمیم گندم',
        descriptionEn: 'High-quality premium wheat with excellent baking properties',
        descriptionUrdu: 'اعلیٰ معیار کی پریمیم گندم، بہترین بیکنگ خصوصیات کے ساتھ',
        price: '4500',
        category: 'wheat',
        unit: 'maan',
        stock: 100,
      },
      {
        name: 'Fine Flour',
        nameUrdu: 'بہترین آٹا',
        descriptionEn: 'Finely ground flour perfect for chapati and naan',
        descriptionUrdu: 'باریک پسا ہوا آٹا، چپاتی اور نان کے لیے بہترین',
        price: '120',
        category: 'flour',
        unit: 'kg',
        stock: 500,
      }
    ]);
    
    console.log('✅ Created new products with correct schema');
    console.log('🎉 Schema fix complete!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Failed to fix schema:', error);
    process.exit(1);
  }
}

fixProductSchema();