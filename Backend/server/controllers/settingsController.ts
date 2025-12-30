import { Request, Response } from "express";
import { Setting, defaultSettings, ensureDefaultSettings } from "../models/Setting";
import { ApiResponse, UpdateSettingsRequest } from "@shared/schema";

export const settingsController = {
  // Get all settings
  async getAll(req: Request, res: Response) {
    try {
      // Ensure default settings exist
      await ensureDefaultSettings();
      
      const allSettings = await Setting.find({});
      
      // Convert array to object
      const settingsObj = allSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      // Parse boolean values
      const parsedSettings = {
        ...settingsObj,
        enableWhatsAppButton: settingsObj.enableWhatsAppButton === 'true',
        enableOnlineOrders: settingsObj.enableOnlineOrders === 'true',
        maintenanceMode: settingsObj.maintenanceMode === 'true',
      };

      const response: ApiResponse = {
        success: true,
        data: parsedSettings,
      };
      res.json(response);
    } catch (error) {
      console.error('Error fetching settings:', error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch settings",
        data: {} // Return empty object instead of failing
      };
      res.status(500).json(response);
    }
  },

  // Update settings
  async update(req: Request, res: Response) {
    try {
      const updates: UpdateSettingsRequest = req.body;
      
      if (!updates || Object.keys(updates).length === 0) {
        const response: ApiResponse = {
          success: false,
          error: "No settings provided",
        };
        return res.status(400).json(response);
      }

      const updatedSettings: Record<string, string> = {};
      
      // Update each setting
      for (const [key, value] of Object.entries(updates)) {
        // Convert boolean to string for storage
        const stringValue = typeof value === 'boolean' ? value.toString() : value;
        
        const updated = await Setting.findOneAndUpdate(
          { key },
          { value: stringValue },
          { upsert: true, new: true }
        );
        updatedSettings[key] = updated.value;
      }

      const response: ApiResponse = {
        success: true,
        message: "Settings updated successfully",
        data: updatedSettings,
      };
      res.json(response);
    } catch (error) {
      console.error('Error updating settings:', error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to update settings",
      };
      res.status(500).json(response);
    }
  },
};