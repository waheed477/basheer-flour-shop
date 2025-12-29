import mongoose from 'mongoose';
import { z } from 'zod';

// Zod validation schema
export const contactSchemaZod = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export type ContactInput = z.infer<typeof contactSchemaZod>;

// Mongoose schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'replied'], 
    default: 'new' 
  },
}, {
  timestamps: true,
});

export const Contact = mongoose.model('Contact', contactSchema);