"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = void 0;
const Setting_1 = require("../models/Setting");
exports.settingsController = {
    // Get all settings
    async getAll(req, res) {
        try {
            const allSettings = await Setting_1.Setting.find({});
            // Convert array to object
            const settingsObj = allSettings.reduce((acc, setting) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {});
            // Ensure all default settings exist
            for (const defaultSetting of Setting_1.defaultSettings) {
                if (!settingsObj[defaultSetting.key]) {
                    settingsObj[defaultSetting.key] = defaultSetting.value;
                }
            }
            const response = {
                success: true,
                data: settingsObj,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to fetch settings",
            };
            res.status(500).json(response);
        }
    },
    // Update settings
    async update(req, res) {
        try {
            const updates = req.body;
            if (!updates || Object.keys(updates).length === 0) {
                const response = {
                    success: false,
                    error: "No settings provided",
                };
                return res.status(400).json(response);
            }
            const updatedSettings = {};
            // Update each setting
            for (const [key, value] of Object.entries(updates)) {
                const updated = await Setting_1.Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
                updatedSettings[key] = updated.value;
            }
            const response = {
                success: true,
                message: "Settings updated successfully",
                data: updatedSettings,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to update settings",
            };
            res.status(500).json(response);
        }
    },
};
//# sourceMappingURL=settingsController.js.map