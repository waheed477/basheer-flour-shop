"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSettings = exports.Setting = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Mongoose schema for settings
const settingSchema = new mongoose_1.default.Schema({
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
exports.Setting = mongoose_1.default.model('Setting', settingSchema);
// Default settings
exports.defaultSettings = [
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
//# sourceMappingURL=Setting.js.map