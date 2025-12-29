import type { Express } from "express";
import { createServer, type Server } from "http";
import { productController } from "./controllers/productController";
import { authController } from "./controllers/authController";
import { settingsController } from "./controllers/settingsController";
import { contactController } from "./controllers/contactController";
import { authenticateJWT, requireAdmin } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // ===== PUBLIC ROUTES =====
  
  // Auth routes
  app.post("/api/auth/login", authController.login);
  
  // Public product routes
  app.get("/api/products", productController.getAll);
  app.get("/api/products/:id", productController.getById);
  
  // Public contact submission
  app.post("/api/contacts", contactController.create);
  
  // Public settings (read-only)
  app.get("/api/settings", settingsController.getAll);
  
  // ===== PROTECTED ADMIN ROUTES =====
  
  // Protected product routes
  app.post("/api/products", authenticateJWT, requireAdmin, productController.create);
  app.put("/api/products/:id", authenticateJWT, requireAdmin, productController.update);
  app.delete("/api/products/:id", authenticateJWT, requireAdmin, productController.delete);
  
  // Protected contact routes
  app.get("/api/contacts", authenticateJWT, requireAdmin, contactController.getAll);
  app.put("/api/contacts/:id/status", authenticateJWT, requireAdmin, contactController.updateStatus);
  app.delete("/api/contacts/:id", authenticateJWT, requireAdmin, contactController.delete);
  
  // Protected settings routes
  app.put("/api/settings", authenticateJWT, requireAdmin, settingsController.update);
  
  // Auth protected routes
  app.get("/api/auth/me", authenticateJWT, authController.getCurrentUser);
  app.post("/api/auth/logout", authenticateJWT, authController.logout);
  
  const httpServer = createServer(app);
  return httpServer;
}