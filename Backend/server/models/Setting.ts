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

// Default settings
export const defaultSettings = [
  { key: 'shop_name', value: 'Bashir Flour Shop' },
  { key: 'shop_name_urdu', value: 'بشیر آٹے کی دکان' },
  { key: 'whatsapp_number', value: '+923001234567' },
  { key: 'phone_number', value: '+92421234567' },
  { key: 'email', value: 'info@bashirflour.com' },
  { key: 'address_en', value: '123 Main Street, Lahore, Pakistan' },
  { key: 'address_urdu', value: '123 مرکزی سڑک، لاہور، پاکستان' },
  { key: 'working_hours', value: '9:00 AM - 10:00 PM (Monday - Sunday)' },
  { key: 'enable_whatsapp_button', value: 'true' },
  { key: 'enable_online_orders', value: 'false' },
  { key: 'maintenance_mode', value: 'false' },
];