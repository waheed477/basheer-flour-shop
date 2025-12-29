"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = exports.contactSchemaZod = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
// Zod validation schema
exports.contactSchemaZod = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    phone: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1, 'Message is required'),
});
// Mongoose schema
const contactSchema = new mongoose_1.default.Schema({
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
exports.Contact = mongoose_1.default.model('Contact', contactSchema);
//# sourceMappingURL=Contact.js.map