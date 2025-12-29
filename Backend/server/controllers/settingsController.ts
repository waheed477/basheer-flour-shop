import { Request, Response } from "express";
import { Setting, defaultSettings } from "../models/Setting";
import { ApiResponse, UpdateSettingsRequest } from "@shared/schema";

export const settingsController = {
  // Get all settings
  async getAll(req: Request, res: Response) {
    try {
      const allSettings = await Setting.find({});
      
      // Convert array to object
      const settingsObj = allSettings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, string>);

      // Ensure all default settings exist
      for (const defaultSetting of defaultSettings) {
        if (!settingsObj[defaultSetting.key]) {
          settingsObj[defaultSetting.key] = defaultSetting.value;
        }
      }

      const response: ApiResponse = {
        success: true,
        data: settingsObj,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch settings",
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
        const updated = await Setting.findOneAndUpdate(
          { key },
          { value },
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
      const response: ApiResponse = {
        success: false,
        error: "Failed to update settings",
      };
      res.status(500).json(response);
    }
  },
};