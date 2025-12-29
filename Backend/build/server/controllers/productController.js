"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const Product_1 = require("../models/Product");
const Product_2 = require("../models/Product");
exports.productController = {
    // Get all products
    async getAll(req, res) {
        try {
            const products = await Product_1.Product.find().sort({ createdAt: -1 });
            const response = {
                success: true,
                data: products,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to fetch products",
            };
            res.status(500).json(response);
        }
    },
    // Get single product
    async getById(req, res) {
        try {
            const product = await Product_1.Product.findById(req.params.id);
            if (!product) {
                const response = {
                    success: false,
                    error: "Product not found",
                };
                return res.status(404).json(response);
            }
            const response = {
                success: true,
                data: product,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to fetch product",
            };
            res.status(500).json(response);
        }
    },
    // Create new product
    async create(req, res) {
        try {
            // Validate input
            const validatedData = Product_2.productSchemaZod.parse(req.body);
            // Create product
            const product = await Product_1.Product.create(validatedData);
            const response = {
                success: true,
                message: "Product created successfully",
                data: product,
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error.errors?.[0]?.message || "Failed to create product",
            };
            res.status(400).json(response);
        }
    },
    // Update product
    async update(req, res) {
        try {
            const product = await Product_1.Product.findById(req.params.id);
            if (!product) {
                const response = {
                    success: false,
                    error: "Product not found",
                };
                return res.status(404).json(response);
            }
            // Validate and update
            const validatedData = Product_2.productSchemaZod.partial().parse(req.body);
            Object.assign(product, validatedData);
            await product.save();
            const response = {
                success: true,
                message: "Product updated successfully",
                data: product,
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: error.errors?.[0]?.message || "Failed to update product",
            };
            res.status(400).json(response);
        }
    },
    // Delete product
    async delete(req, res) {
        try {
            const product = await Product_1.Product.findById(req.params.id);
            if (!product) {
                const response = {
                    success: false,
                    error: "Product not found",
                };
                return res.status(404).json(response);
            }
            await product.deleteOne();
            const response = {
                success: true,
                message: "Product deleted successfully",
            };
            res.json(response);
        }
        catch (error) {
            const response = {
                success: false,
                error: "Failed to delete product",
            };
            res.status(500).json(response);
        }
    },
};
//# sourceMappingURL=productController.js.map