"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.productSchemaZod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// Zod validation schema
exports.productSchemaZod = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Product name is required'),
    nameUrdu: zod_1.z.string().min(1, 'Urdu name is required'),
    descriptionEn: zod_1.z.string().default(''),
    descriptionUrdu: zod_1.z.string().default(''),
    price: zod_1.z.string().min(1, 'Price is required'),
    category: zod_1.z.enum(['wheat', 'flour']),
    unit: zod_1.z.enum(['kg', 'maan', 'lb']).default('kg'),
    image: zod_1.z.string().default(''),
    stock: zod_1.z.number().min(0).default(0),
});
// Mongoose schema
const productSchema = new mongoose_1.default.Schema({
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
exports.Product = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=Product.js.map