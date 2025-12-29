import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop');
    console.log('✅ Connected to MongoDB');
    
    // Define User schema
    const userSchema = new mongoose.Schema({
      username: { type: String, unique: true, required: true },
      password: { type: String, required: true },
      role: { type: String, default: 'admin' }
    }, { timestamps: true });
    
    const User = mongoose.model('User', userSchema);
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ username: 'basheer000@gmail.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists:', existingAdmin);
      
      // Update role to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
      
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash('basheer111', 10);
      const adminUser = await User.create({
        username: 'basheer000@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created:', { 
        username: adminUser.username, 
        role: adminUser.role 
      });
    }
    
    // List all users
    const allUsers = await User.find({}, { password: 0 });
    console.log('\n📋 All users in database:', allUsers);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();