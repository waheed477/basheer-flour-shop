import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Wheat, Menu, X, Globe, Phone, ShoppingBag, LogIn } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Settings } from "lucide-react"; // Add this import
export function Navbar() {
  const { t, language, setLanguage, dir } = useLanguage();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const NavLinks = () => (
    <>
      <Link href="/" className={`text-base font-medium transition-colors hover:text-primary ${isActive("/") ? "text-primary font-bold" : "text-foreground/80"}`}>
        {t("nav.home")}
      </Link>
      <Link href="/products" className={`text-base font-medium transition-colors hover:text-primary ${isActive("/products") ? "text-primary font-bold" : "text-foreground/80"}`}>
        {t("nav.products")}
      </Link>
      <Link href="/contact" className={`text-base font-medium transition-colors hover:text-primary ${isActive("/contact") ? "text-primary font-bold" : "text-foreground/80"}`}>
        {t("nav.contact")}
      </Link>
      <Link href="/settings" className={`text-base font-medium transition-colors hover:text-primary ${isActive("/settings") ? "text-primary font-bold" : "text-foreground/80"}`}>
      <Settings className="h-4 w-4 inline mr-1" />
      Settings
    </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
              <Wheat className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              Basheer Atta <span className="text-primary">Chakkee</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8" dir={dir}>
            <NavLinks />
            <div className="h-6 w-px bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ur" : "en")}
              className="gap-2 font-medium touch-target"
              aria-label={`Switch to ${language === "en" ? "Urdu" : "English"}`}
            >
              <Globe className="h-4 w-4" />
              {language === "en" ? "Urdu" : "English"}
            </Button>
            <Link href="/admin/login">
              <Button variant="outline" size="sm" className="gap-2 touch-target">
                <LogIn className="h-4 w-4" />
                {t("nav.admin")}
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden items-center gap-2">
            {/* Language Switcher - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "ur" : "en")}
              className="gap-1 touch-target"
              aria-label={`Switch to ${language === "en" ? "Urdu" : "English"}`}
            >
              <Globe className="h-4 w-4" />
              <span className="font-bold text-sm">{language === "en" ? "UR" : "EN"}</span>
            </Button>
            
            {/* Mobile Menu Button */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="touch-target"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side={dir === "rtl" ? "right" : "left"} 
                className="w-full max-w-[85vw] sm:max-w-[400px] safe-area-padding"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center gap-2 mb-8 pt-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Wheat className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight text-foreground">
                      Basheer<span className="text-primary">Flour</span>
                    </span>
                  </div>
                  
                  {/* Mobile Menu Links */}
                  <div className="flex flex-col gap-4 flex-1" dir={dir}>
                    <Link 
                      href="/" 
                      onClick={() => setIsMobileOpen(false)} 
                      className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${isActive("/") ? "bg-primary/10 text-primary" : "hover:bg-secondary/50"}`}
                    >
                      {t("nav.home")}
                    </Link>
                    <Link 
                      href="/products" 
                      onClick={() => setIsMobileOpen(false)} 
                      className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${isActive("/products") ? "bg-primary/10 text-primary" : "hover:bg-secondary/50"}`}
                    >
                      {t("nav.products")}
                    </Link>
                    <Link 
                      href="/contact" 
                      onClick={() => setIsMobileOpen(false)} 
                      className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${isActive("/contact") ? "bg-primary/10 text-primary" : "hover:bg-secondary/50"}`}
                    >
                      {t("nav.contact")}
                    </Link>
                    
                    {/* Divider */}
                    <div className="h-px bg-border my-4" />
                    
                    {/* Admin Login - Mobile */}
                    <Link 
                      href="/admin/login" 
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      {t("nav.admin")}
                    </Link>
                    <Link 
  href="/settings" 
  onClick={() => setIsMobileOpen(false)} 
  className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${isActive("/settings") ? "bg-primary/10 text-primary" : "hover:bg-secondary/50"}`}
>
  <Settings className="h-5 w-5 inline mr-2" />
  Settings
</Link>
                  </div>
                  
                  {/* Language Switcher - Mobile Menu */}
                  <div className="pt-4 mt-auto border-t">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setLanguage(language === "en" ? "ur" : "en");
                        setIsMobileOpen(false);
                      }}
                      className="w-full justify-center gap-3 touch-target"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="font-medium">
                        {language === "en" ? "Switch to Urdu" : "English میں تبدیل کریں"}
                      </span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}