import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'; 
import multer from 'multer'; 
import path from 'path';
import fs from 'fs'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'basheer-flour-shop-secret-key-2024';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://*.netlify.app',  // Netlify
    'https://*.vercel.app'    // Vercel
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure Multer for file uploads
const __dirname = path.resolve();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ✅ Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('📁 Serving static files from:', path.join(__dirname, 'uploads'));

// ===== MONGOOSE MODELS (Create Once) =====
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

// ===== SETTING MODEL =====
const settingSchema = new mongoose.Schema({
  key: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
  },
  value: { type: String, required: true },
}, {
  timestamps: { createdAt: false, updatedAt: 'updatedAt' },
});

const Setting = mongoose.model('Setting', settingSchema);

// ===== CONTACT MODEL =====
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, {
  timestamps: true,
});

const Contact = mongoose.model('Contact', contactSchema);

// Connect to MongoDB
async function connectDB() {
  try {
    // MongoDB Atlas connection options
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flourshop', options);
     console.log('✅ MongoDB Atlas connected successfully');
    
    // Seed initial data if needed
    await seedDatabase();
   } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error);
    process.exit(1);
  }
}

// Seed database with initial data
async function seedDatabase() {
  try {
    // Check if admin user exists
    const User = mongoose.model('User', new mongoose.Schema({
      username: String,
      password: String,
      role: String,
    }));
    
    const adminExists = await User.findOne({ username: 'basheer000@gmail.com' });
    if (!adminExists) {
      // Simple password for now - in production, use bcrypt
      await User.create({
        username: 'basheer000@gmail.com',
        password: 'basheer111',
        role: 'admin',
      });
      console.log('✅ Admin user created');
    }
    
    // Check if products exist
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
      ]);
      console.log('✅ Sample products created');
    }
    
    // Check if any contacts exist
    const contactCount = await Contact.countDocuments();
    if (contactCount === 0) {
      console.log('📝 No contacts found in database');
    } else {
      console.log(`📝 Found ${contactCount} contacts in database`);
    }
    
  } catch (error) {
    console.log('Note: Database seeding may need proper models setup');
  }
}

// ===== API ROUTES =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Bashir Flour Shop API is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// ===== AUTH ROUTES =====
// Simple Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username aur password required hain",
      });
    }

    // Sirf yeh credentials accept karo
    if (username === 'basheer000@gmail.com' && password === 'basheer111') {
      // ✅ Permanent token (no expiry)
      const token = jwt.sign(
        { 
          id: '1', 
          username: 'basheer000@gmail.com', 
          role: 'admin' 
        },
        JWT_SECRET
        // ✅ No expiresIn - token never expires
      );
      
      return res.json({
        success: true,
        message: "Login successful",
        data: {
          token: token, // ✅ Permanent token
          user: {
            id: '1',
            username: 'basheer000@gmail.com',
            role: 'admin',
          },
        },
      });
    }

    // Agar credentials galat hain
    res.status(401).json({
      success: false,
      error: "Galat username ya password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// ✅ Added: Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Token required",
      });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      res.json({
        success: true,
        data: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
        },
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get user",
    });
  }
});

// ✅ Added: Logout endpoint
app.post('/api/auth/logout', async (req, res) => {
  try {
    // Client-side storage clear karega, server-side kuch nahi karna
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Logout failed",
    });
  }
});

// ===== PRODUCT ROUTES =====
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch products",
    });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and category are required",
      });
    }

    const product = await Product.create(productData);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: "Failed to create product",
    });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: "Failed to update product",
    });
  }
});

// Line ~250-280 - DELETE route UPDATE:
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔄 DELETE Request received - ID:', id);
    console.log('ID Type:', typeof id);
    console.log('ID Length:', id.length);
    
    // Check if product exists first
    const productExists = await Product.findById(id);
    console.log('Product found:', productExists ? 'Yes' : 'No');
    
    if (!productExists) {
      // Get all products for debugging
      const allProducts = await Product.find({}, '_id name');
      console.log('All products in DB:', allProducts);
      
      return res.status(404).json({
        success: false,
        error: `Product with ID ${id} not found. Total products: ${allProducts.length}`,
      });
    }
    
    const product = await Product.findByIdAndDelete(id);
    
    console.log('✅ Product deleted:', product?.name);
    
    res.json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: "Failed to delete product: " + error.message,
    });
  }
});

// ===== SETTINGS ROUTES =====
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find();
    
    // Convert to object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});
    
    console.log('📊 Settings from DB:', settingsObj);
    
    // If no settings exist, return empty object
    // Don't create defaults here - let frontend handle empty state
    
    res.json({
      success: true,
      data: settingsObj,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch settings",
    });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    
    console.log('📥 Received settings update request');
    console.log('🔑 Request body keys:', Object.keys(updates));
    console.log('📝 Request data:', JSON.stringify(updates, null, 2));
    
    if (!updates || Object.keys(updates).length === 0) {
      console.log('❌ No settings provided');
      return res.status(400).json({
        success: false,
        error: "No settings provided",
      });
    }

    // Map camelCase to snake_case if needed
    const keyMappings = {
      shopName: 'shop_name',
      shopNameUrdu: 'shop_name_urdu',
      whatsappNumber: 'whatsapp_number',
      phoneNumber: 'phone_number',
      email: 'email',
      addressEn: 'address_en',
      addressUrdu: 'address_urdu',
      workingHours: 'working_hours',
      enableWhatsAppButton: 'enable_whatsapp_button',
      enableOnlineOrders: 'enable_online_orders',
      maintenanceMode: 'maintenance_mode'
    };
    
    const processedUpdates = {};
    const receivedKeys = Object.keys(updates);
    
    // Convert camelCase to snake_case for database
    receivedKeys.forEach(key => {
      const dbKey = keyMappings[key] || key;
      processedUpdates[dbKey] = updates[key].toString();
      console.log(`  ${key} → ${dbKey}: ${processedUpdates[dbKey]}`);
    });
    
    console.log('🔧 Processed for DB:', processedUpdates);

    const updatedSettings = {};
    const now = new Date();
    
    console.log('🔄 Starting database updates...');
    
    // Update each setting in database
    for (const [key, value] of Object.entries(processedUpdates)) {
      console.log(`  Processing: ${key} = ${value}`);
      
      try {
        const setting = await Setting.findOneAndUpdate(
          { key },
          { 
            value: value.toString(),
            updatedAt: now 
          },
          { 
            upsert: true,
            new: true,
            setDefaultsOnInsert: true 
          }
        );
        updatedSettings[key] = setting.value;
        console.log(`  ✅ Saved: ${key} = ${setting.value}`);
      } catch (dbError) {
        console.error(`  ❌ Failed to save ${key}:`, dbError.message);
        throw dbError;
      }
    }
    
    console.log('✅ All settings saved successfully');
    
    // Return the saved data in snake_case format
    res.json({
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: "Failed to update settings: " + error.message,
    });
  }
});

// ===== CONTACT ROUTES =====
app.get('/api/contacts', async (req, res) => {
  try {
    console.log('📡 Fetching contacts from database...');
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    console.log(`✅ Found ${contacts.length} contacts`);
    
    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch contacts",
    });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    console.log('📥 New contact submission:', { name, email });
    
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: req.body.phone || '',
      message,
      status: 'new',
    });

    console.log('✅ Contact created:', contact._id);
    
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    res.status(500).json({
      success: false,
      error: "Failed to send message",
    });
  }
});

app.put('/api/contacts/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`📡 Updating contact ${id} status to ${status}`);
    
    if (!status || !['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Valid status is required",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      console.log(`❌ Contact ${id} not found`);
      return res.status(404).json({
        success: false,
        error: "Contact not found",
      });
    }

    console.log(`✅ Contact ${id} status updated to ${status}`);
    
    res.json({
      success: true,
      message: "Contact status updated",
      data: contact,
    });
  } catch (error) {
    console.error(`❌ Error updating contact status ${id}:`, error);
    res.status(500).json({
      success: false,
      error: "Failed to update contact status",
    });
  }
});

// ===== DEBUG ENDPOINTS =====
app.get('/api/debug/settings', async (req, res) => {
  try {
    const allSettings = await Setting.find();
    const settingsCount = await Setting.countDocuments();
    
    res.json({
      success: true,
      data: {
        count: settingsCount,
        documents: allSettings,
        rawData: allSettings.map(s => ({ key: s.key, value: s.value, updatedAt: s.updatedAt }))
      }
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/debug/reset-settings', async (req, res) => {
  try {
    await Setting.deleteMany({});
    console.log('✅ All settings deleted');
    
    res.json({
      success: true,
      message: 'Settings reset successful'
    });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ===== FILE UPLOAD ROUTES =====
app.post('/api/uploads', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Construct the full URL for the uploaded file
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded successfully:', req.file.filename);
    console.log('📁 File URL:', fileUrl);
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        path: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('❌ File upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed'
    });
  }
});

// ✅ Multiple file upload endpoint (optional)
app.post('/api/uploads/multiple', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      path: `/uploads/${file.filename}`
    }));

    console.log(`✅ ${files.length} files uploaded successfully`);
    
    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: files
    });
  } catch (error) {
    console.error('❌ Multiple file upload error:', error);
    res.status(500).json({
      success: false,
      error: 'File upload failed'
    });
  }
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📡 Health check: http://localhost:${PORT}/health`);
      console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`);
      console.log(`📁 File uploads: http://localhost:${PORT}/uploads/`);
      console.log(`📁 File upload endpoint: POST http://localhost:${PORT}/api/uploads`);
      console.log(`\n📋 Available API Endpoints:`);
      console.log(`   POST   /api/auth/login          - Admin login`);
      console.log(`   GET    /api/auth/me            - Get current user ✅`);
      console.log(`   POST   /api/auth/logout        - Logout ✅`);
      console.log(`   GET    /api/products           - Get all products`);
      console.log(`   POST   /api/products           - Create product`);
      console.log(`   PUT    /api/products/:id       - Update product`);
      console.log(`   DELETE /api/products/:id       - Delete product`);
      console.log(`   GET    /api/settings           - Get settings`);
      console.log(`   PUT    /api/settings           - Update settings`);
      console.log(`   GET    /api/contacts           - Get contacts ✅ (Using Contact Model)`);
      console.log(`   POST   /api/contacts           - Create contact ✅ (Using Contact Model)`);
      console.log(`   PUT    /api/contacts/:id/status - Update contact status ✅ (Using Contact Model)`);
      console.log(`   POST   /api/uploads           - Upload single file ✅`);
      console.log(`   POST   /api/uploads/multiple  - Upload multiple files ✅`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();