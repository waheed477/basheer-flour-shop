import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiResponse, LoginRequest, LoginResponse } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authController = {
  // Admin login
  async login(req: Request, res: Response) {
    try {
      const { username, password }: LoginRequest = req.body;
      
      // Validation
      if (!username || !password) {
        const response: ApiResponse = {
          success: false,
          error: "Username and password are required",
        };
        return res.status(400).json(response);
      }

      // Find user
      const user = await User.findOne({ username }).select('+password');
      
      if (!user) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid credentials",
        };
        return res.status(401).json(response);
      }

      // Verify password
      const isValidPassword = await user.comparePassword(password);
      
      if (!isValidPassword) {
        const response: ApiResponse = {
          success: false,
          error: "Invalid credentials",
        };
        return res.status(401).json(response);
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id.toString(), 
          username: user.username, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Remove password from response
      const userResponse = {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      };

      const response: ApiResponse<LoginResponse> = {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: userResponse,
        },
      };
      
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Login failed",
      };
      res.status(500).json(response);
    }
  },

  // Get current user
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: "Not authenticated",
        };
        return res.status(401).json(response);
      }

      const response: ApiResponse = {
        success: true,
        data: req.user,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to get user",
      };
      res.status(500).json(response);
    }
  },
};