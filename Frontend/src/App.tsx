import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"; // ✅ Correct - file exists
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language"; // ✅ Correct - .tsx file (no extension needed)
import { PrivateRoute } from "@/components/common/PrivateRoute"; // ✅ Added import
import NotFound from "@/pages/not-found";

// CORRECT IMPORTS - Using your actual file names
import HomePage from "@/pages/HomePage"; // ✅ Correct - file is HomePage.tsx
import ProductsPage from "@/pages/ProductsPage"; // ✅ Correct - file is ProductsPage.tsx
import ContactPage from "@/pages/ContactPage"; // ✅ Correct - file is ContactPage.tsx
import AdminLogin from "@/pages/admin/AdminLogin"; // ✅ Correct - file is AdminLogin.tsx
import AdminDashboard from "@/pages/admin/AdminDashboard"; // ✅ Correct - file is AdminDashboard.tsx
import ProductFormPage from "@/pages/admin/ProductFormPage"; // ✅ to be created
import WebsiteSettings from "@/pages/admin/WebsiteSettings"; // ✅ to be created

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} /> {/* Changed from Home to HomePage */}
      <Route path="/products" component={ProductsPage} /> {/* Changed from Products to ProductsPage */}
      <Route path="/contact" component={ContactPage} /> {/* Changed from Contact to ContactPage */}
      <Route path="/admin/login" component={AdminLogin} /> {/* Changed from Login to AdminLogin */}
      <PrivateRoute path="/admin/dashboard" component={AdminDashboard} adminOnly /> {/* ✅ Updated to use PrivateRoute */}
      {/* Add these new routes */}
      <PrivateRoute path="/admin/products/new" component={ProductFormPage} adminOnly />
      <PrivateRoute path="/admin/products/edit/:id" component={ProductFormPage} adminOnly />
      <PrivateRoute path="/admin/settings" component={WebsiteSettings} adminOnly />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;