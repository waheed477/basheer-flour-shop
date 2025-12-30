import mongoose from 'mongoose';

// Mongoose schema for settings
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

export const Setting = mongoose.model('Setting', settingSchema);

// Default settings with camelCase keys (frontend compatible)
export const defaultSettings = [
  { key: 'shopName', value: 'Bashir Flour Shop' },
  { key: 'shopNameUrdu', value: 'بشیر آٹے کی دکان' },
  { key: 'whatsappNumber', value: '+923001234567' },
  { key: 'phoneNumber', value: '+92421234567' },
  { key: 'email', value: 'info@bashirflour.com' },
  { key: 'addressEn', value: '123 Main Street, Lahore, Pakistan' },
  { key: 'addressUrdu', value: '123 مرکزی سڑک، لاہور، پاکستان' },
  { key: 'workingHours', value: '9:00 AM - 10:00 PM (Monday - Sunday)' },
  { key: 'enableWhatsAppButton', value: 'true' },
  { key: 'enableOnlineOrders', value: 'false' },
  { key: 'maintenanceMode', value: 'false' },
];

// Helper function to ensure default settings exist
export const ensureDefaultSettings = async () => {
  try {
    for (const setting of defaultSettings) {
      await Setting.findOneAndUpdate(
        { key: setting.key },
        { value: setting.value },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Default settings ensured');
  } catch (error) {
    console.error('❌ Error ensuring default settings:', error);
  }
};