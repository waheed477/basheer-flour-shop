"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
exports.authController = {
    // Admin login
    async login(req, res) {
        try {
            const { username, password } = req.body;
            // Validation
            if (!username || !password) {
                const response = {
                    success: false,
                    error: "Username and password are required",
                };
                return res.status(400).json(response);
            }
            // Find user
            const user = await User_1.User.findOne({ username }).select('+password');
            if (!user) {
                const response = {
                    success: false,
                    error: "Invalid credentials",
                };
                return res.status(401).json(response);
            }
            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                const response = {
                    success: false,
                    error: "Invalid credentials",
                };
                return res.status(401).json(response);
            }
            // Generate JWT token
            const token = jsonwebtoken_1.default.sign({
                id: user._id.toString(),
                username: user.username,
                role: user.role
            }, JWT_SECRET, { expiresIn: "24h" });
            // Remove password from response
            const userResponse = {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
            };
            const response = {
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: userResponse,
                },
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Login failed",
            };
            res.status(500).json(response);
        }
    },
    // Get current user
    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                const response = {
                    success: false,
                    error: "Not authenticated",
                };
                return res.status(401).json(response);
            }
            const response = {
                success: true,
                data: req.user,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to get user",
            };
            res.status(500).json(response);
        }
    },
};
//# sourceMappingURL=authController.js.map