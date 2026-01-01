import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { PrivateRoute } from "@/components/common/PrivateRoute";
import NotFound from "@/pages/not-found";

// CORRECT IMPORTS - Using your actual file names
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ContactPage from "@/pages/ContactPage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProductFormPage from "@/pages/admin/ProductFormPage";
import WebsiteSettings from "@/pages/admin/WebsiteSettings";

// ✅ ADD THIS IMPORT FOR SETTINGS PAGE
import SettingsPage from "@/pages/SettingsPage"; // Make sure this file exists

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/contact" component={ContactPage} />
      
      {/* ✅ ADD SETTINGS ROUTE HERE */}
      <Route path="/settings" component={SettingsPage} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <PrivateRoute path="/admin/dashboard" component={AdminDashboard} adminOnly />
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