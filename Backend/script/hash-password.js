import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function hashAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop');
    console.log('✅ Connected to MongoDB');
    
    const userSchema = new mongoose.Schema({
      username: String,
      password: String,
      role: String
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Find admin user
    const adminUser = await User.findOne({ username: 'basheer000@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }
    
    // Check if password is already hashed
    const isHashed = adminUser.password.startsWith('$2b$');
    
    if (!isHashed) {
      console.log('🔄 Hashing password...');
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      adminUser.password = hashedPassword;
      await adminUser.save();
      console.log('✅ Password hashed successfully');
    } else {
      console.log('✅ Password is already hashed');
    }
    
    console.log('\n🔐 Admin user details:', {
      username: adminUser.username,
      password: adminUser.password.substring(0, 20) + '...',
      role: adminUser.role
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

hashAdminPassword();