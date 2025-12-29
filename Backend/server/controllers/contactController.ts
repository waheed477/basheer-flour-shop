import { Request, Response } from "express";
import { Contact } from "../models/Contact";
import { contactSchemaZod, type ContactInput } from "../models/Contact";
import { ApiResponse, UpdateContactStatusRequest } from "@shared/schema";

export const contactController = {
  // Get all contacts with optional search
  async getAll(req: Request, res: Response) {
    try {
      const { search, status } = req.query;
      
      let query: any = {};
      
      // Apply search filter
      if (search) {
        const searchRegex = new RegExp(search as string, 'i');
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
      
      const contacts = await Contact.find(query).sort({ createdAt: -1 });
      
      const response: ApiResponse = {
        success: true,
        data: contacts,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch contacts",
      };
      res.status(500).json(response);
    }
  },

  // Create new contact (public)
  async create(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = contactSchemaZod.parse(req.body);
      
      // Create contact
      const contact = await Contact.create({
        ...validatedData,
        status: 'new'
      });

      const response: ApiResponse = {
        success: true,
        message: "Message sent successfully",
        data: contact,
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.errors?.[0]?.message || "Failed to send message",
      };
      res.status(400).json(response);
    }
  },

  // Update contact status
  async updateStatus(req: Request, res: Response) {
    try {
      const { status }: UpdateContactStatusRequest = req.body;
      
      const contact = await Contact.findById(req.params.id);
      
      if (!contact) {
        const response: ApiResponse = {
          success: false,
          error: "Contact not found",
        };
        return res.status(404).json(response);
      }

      contact.status = status;
      await contact.save();

      const response: ApiResponse = {
        success: true,
        message: "Contact status updated",
        data: contact,
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.errors?.[0]?.message || "Failed to update contact status",
      };
      res.status(400).json(response);
    }
  },

  // Delete contact
  async delete(req: Request, res: Response) {
    try {
      const contact = await Contact.findById(req.params.id);
      
      if (!contact) {
        const response: ApiResponse = {
          success: false,
          error: "Contact not found",
        };
        return res.status(404).json(response);
      }

      await contact.deleteOne();

      const response: ApiResponse = {
        success: true,
        message: "Contact deleted successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to delete contact",
      };
      res.status(500).json(response);
    }
  },
};