import mongoose from 'mongoose';
import { z } from 'zod';

// Zod validation schema
export const productSchemaZod = z.object({
  name: z.string().min(1, 'Product name is required'),
  nameUrdu: z.string().min(1, 'Urdu name is required'),
  descriptionEn: z.string().default(''),
  descriptionUrdu: z.string().default(''),
  price: z.string().min(1, 'Price is required'),
  category: z.enum(['wheat', 'flour']),
  unit: z.enum(['kg', 'maan', 'lb']).default('kg'),
  image: z.string().default(''),
  stock: z.number().min(0).default(0),
});

export type ProductInput = z.infer<typeof productSchemaZod>;

// Mongoose schema
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

export const Product = mongoose.model('Product', productSchema);