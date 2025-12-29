"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const http_1 = require("http");
const productController_1 = require("./controllers/productController");
const authController_1 = require("./controllers/authController");
const settingsController_1 = require("./controllers/settingsController");
const contactController_1 = require("./controllers/contactController");
const auth_1 = require("./middleware/auth");
async function registerRoutes(app) {
    // ===== PUBLIC ROUTES =====
    // Auth routes
    app.post("/api/auth/login", authController_1.authController.login);
    // Public product routes
    app.get("/api/products", productController_1.productController.getAll);
    app.get("/api/products/:id", productController_1.productController.getById);
    // Public contact submission
    app.post("/api/contacts", contactController_1.contactController.create);
    // Public settings (read-only)
    app.get("/api/settings", settingsController_1.settingsController.getAll);
    // ===== PROTECTED ADMIN ROUTES =====
    // Protected product routes
    app.post("/api/products", auth_1.authenticateJWT, auth_1.requireAdmin, productController_1.productController.create);
    app.put("/api/products/:id", auth_1.authenticateJWT, auth_1.requireAdmin, productController_1.productController.update);
    app.delete("/api/products/:id", auth_1.authenticateJWT, auth_1.requireAdmin, productController_1.productController.delete);
    // Protected contact routes
    app.get("/api/contacts", auth_1.authenticateJWT, auth_1.requireAdmin, contactController_1.contactController.getAll);
    app.put("/api/contacts/:id/status", auth_1.authenticateJWT, auth_1.requireAdmin, contactController_1.contactController.updateStatus);
    app.delete("/api/contacts/:id", auth_1.authenticateJWT, auth_1.requireAdmin, contactController_1.contactController.delete);
    // Protected settings routes
    app.put("/api/settings", auth_1.authenticateJWT, auth_1.requireAdmin, settingsController_1.settingsController.update);
    // Auth protected routes
    app.get("/api/auth/me", auth_1.authenticateJWT, authController_1.authController.getCurrentUser);
    app.post("/api/auth/logout", auth_1.authenticateJWT, authController_1.authController.logout);
    const httpServer = (0, http_1.createServer)(app);
    return httpServer;
}
//# sourceMappingURL=routes.js.map