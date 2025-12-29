"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = void 0;
const Contact_1 = require("../models/Contact");
const Contact_2 = require("../models/Contact");
exports.contactController = {
    // Get all contacts with optional search
    async getAll(req, res) {
        try {
            const { search, status } = req.query;
            let query = {};
            // Apply search filter
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                query.$or = [
                    { name: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                    { message: searchRegex },
                ];
            }
            // Apply status filter
            if (status) {
                query.status = status;
            }
            const contacts = await Contact_1.Contact.find(query).sort({ createdAt: -1 });
            const response = {
                success: true,
                data: contacts,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to fetch contacts",
            };
            res.status(500).json(response);
        }
    },
    // Create new contact (public)
    async create(req, res) {
        try {
            // Validate input
            const validatedData = Contact_2.contactSchemaZod.parse(req.body);
            // Create contact
            const contact = await Contact_1.Contact.create({
                ...validatedData,
                status: 'new'
            });
            const response = {
                success: true,
                message: "Message sent successfully",
                data: contact,
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error.errors?.[0]?.message || "Failed to send message",
            };
            res.status(400).json(response);
        }
    },
    // Update contact status
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const contact = await Contact_1.Contact.findById(req.params.id);
            if (!contact) {
                const response = {
                    success: false,
                    error: "Contact not found",
                };
                return res.status(404).json(response);
            }
            contact.status = status;
            await contact.save();
            const response = {
                success: true,
                message: "Contact status updated",
                data: contact,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error.errors?.[0]?.message || "Failed to update contact status",
            };
            res.status(400).json(response);
        }
    },
    // Delete contact
    async delete(req, res) {
        try {
            const contact = await Contact_1.Contact.findById(req.params.id);
            if (!contact) {
                const response = {
                    success: false,
                    error: "Contact not found",
                };
                return res.status(404).json(response);
            }
            await contact.deleteOne();
            const response = {
                success: true,
                message: "Contact deleted successfully",
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to delete contact",
            };
            res.status(500).json(response);
        }
    },
};
//# sourceMappingURL=contactController.js.map