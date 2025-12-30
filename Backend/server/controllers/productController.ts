import { Request, Response } from "express";
import { Product } from "../models/Product";
import { productSchemaZod } from "../models/Product";
import { ApiResponse } from "@shared/schema";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const productController = {
  // ===== GET ALL PRODUCTS =====
  async getAll(req: Request, res: Response) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      const response: ApiResponse = { success: true, data: products };
      res.json(response);
    } catch (error) {
      console.error("❌ Get all products error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch products" });
    }
  },

  // ===== GET SINGLE PRODUCT =====
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid product ID" });
    }

    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });
      res.json({ success: true, data: product });
    } catch (error) {
      console.error("❌ Get product error:", error);
      res.status(500).json({ success: false, error: "Failed to fetch product" });
    }
  },

  // ===== CREATE PRODUCT =====
  async create(req: Request, res: Response) {
    try {
      const validatedData = productSchemaZod.parse(req.body);
      const product = await Product.create(validatedData);
      res.status(201).json({ success: true, message: "Product created successfully", data: product });
    } catch (error: any) {
      console.error("❌ Create product error:", error);
      res.status(400).json({ success: false, error: error.errors?.[0]?.message || "Failed to create product" });
    }
  },

  // ===== UPDATE PRODUCT =====
  async update(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid product ID" });
    }

    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      const validatedData = productSchemaZod.partial().parse(req.body);
      Object.assign(product, validatedData);
      await product.save();

      res.json({ success: true, message: "Product updated successfully", data: product });
    } catch (error: any) {
      console.error("❌ Update product error:", error);
      res.status(400).json({ success: false, error: error.errors?.[0]?.message || "Failed to update product" });
    }
  },

  // ===== DELETE PRODUCT =====
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid product ID" });
    }

    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ success: false, error: "Product not found" });

      // If product has an image stored locally, remove it
      if (product.image) {
        const imagePath = path.join(__dirname, "../uploads", product.image); // adjust if your images are elsewhere
        fs.unlink(imagePath, (err) => {
          if (err) console.warn("⚠️ Failed to delete image:", err);
        });
      }

      await product.deleteOne();
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("❌ Delete product error:", error);
      res.status(500).json({ success: false, error: "Server error while deleting product" });
    }
  },
};
