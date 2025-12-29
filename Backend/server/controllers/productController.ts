import { Request, Response } from "express";
import { Product } from "../models/Product";
import { productSchemaZod, type ProductInput } from "../models/Product";
import { ApiResponse } from "@shared/schema";

export const productController = {
  // Get all products
  async getAll(req: Request, res: Response) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      
      const response: ApiResponse = {
        success: true,
        data: products,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch products",
      };
      res.status(500).json(response);
    }
  },

  // Get single product
  async getById(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: "Product not found",
        };
        return res.status(404).json(response);
      }
      
      const response: ApiResponse = {
        success: true,
        data: product,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to fetch product",
      };
      res.status(500).json(response);
    }
  },

  // Create new product
  async create(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = productSchemaZod.parse(req.body);
      
      // Create product
      const product = await Product.create(validatedData);

      const response: ApiResponse = {
        success: true,
        message: "Product created successfully",
        data: product,
      };
      res.status(201).json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.errors?.[0]?.message || "Failed to create product",
      };
      res.status(400).json(response);
    }
  },

  // Update product
  async update(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: "Product not found",
        };
        return res.status(404).json(response);
      }

      // Validate and update
      const validatedData = productSchemaZod.partial().parse(req.body);
      Object.assign(product, validatedData);
      await product.save();

      const response: ApiResponse = {
        success: true,
        message: "Product updated successfully",
        data: product,
      };
      res.json(response);
    } catch (error: any) {
      const response: ApiResponse = {
        success: false,
        error: error.errors?.[0]?.message || "Failed to update product",
      };
      res.status(400).json(response);
    }
  },

  // Delete product
  async delete(req: Request, res: Response) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: "Product not found",
        };
        return res.status(404).json(response);
      }

      await product.deleteOne();

      const response: ApiResponse = {
        success: true,
        message: "Product deleted successfully",
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: "Failed to delete product",
      };
      res.status(500).json(response);
    }
  },
};