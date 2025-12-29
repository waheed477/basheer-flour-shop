import { connectDB } from '../server/db';
import { User } from '../server/models/User';
import { Product } from '../server/models/Product';
import { Setting, defaultSettings } from '../server/models/Setting';
import { Contact } from '../server/models/Contact';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  console.log('🌱 Seeding database...');
  
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data (optional - comment out if you want to keep data)
    // await User.deleteMany({});
    // await Product.deleteMany({});
    // await Setting.deleteMany({});
    // await Contact.deleteMany({});
    
    // Create admin user
    const adminExists = await User.findOne({ username: 'basheer000@gmail.com' });
    if (!adminExists) {
      await User.create({
        username: 'basheer000@gmail.com',
        password: 'basheer111', // Will be hashed automatically
        role: 'admin',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    // Create default settings
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { value: setting.value },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default settings created');
    
    // Create sample products if none exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
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
        },
        {
          name: 'Organic Wheat',
          nameUrdu: 'نامیاتی گندم',
          descriptionEn: '100% organic wheat grown without pesticides',
          descriptionUrdu: '100 فیصد نامیاتی گندم، بغیر کیڑے مار ادویات کے اگائی گئی',
          price: '5200',
          category: 'wheat',
          unit: 'maan',
          stock: 75,
        },
        {
          name: 'Super Fine Flour',
          nameUrdu: 'سپر فائن آٹا',
          descriptionEn: 'Super fine flour for premium baked goods',
          descriptionUrdu: 'سپر فائن آٹا، پریمیم بیکڈ اشیاء کے لیے',
          price: '140',
          category: 'flour',
          unit: 'kg',
          stock: 300,
        },
      ]);
      console.log('✅ Sample products created');
    } else {
      console.log(`✅ ${productCount} products already exist`);
    }
    
    console.log('🎉 Database seeding completed!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();