import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { en: "Home", ur: "ہوم" },
  "nav.products": { en: "Products", ur: "مصنوعات" },
  "nav.contact": { en: "Contact", ur: "رابطہ" },
  "nav.admin": { en: "Admin", ur: "ایڈمن" },
  "nav.login": { en: "Login", ur: "لاگ ان" },
  "nav.logout": { en: "Logout", ur: "لاگ آؤٹ" },

  // Hero
  "hero.title": { en: "Pure & Fresh Flour", ur: "خالص اور تازہ آٹا" },
  "hero.subtitle": { en: "From our family fields to your kitchen table. Experience the taste of tradition with Basheer Flour Shop.", ur: "ہمارے خاندانی کھیتوں سے آپ کے کچن تک۔ بشیر فلور شاپ کے ساتھ روایت کا ذائقہ چکھیں۔" },
  "hero.cta": { en: "Shop Now", ur: "ابھی خریدیں" },

  // Products
  "products.title": { en: "Our Products", ur: "ہماری مصنوعات" },
  "products.wheat": { en: "Wheat", ur: "گندم" },
  "products.flour": { en: "Flour", ur: "آٹا" },
  "products.price": { en: "Price", ur: "قیمت" },
  "products.stock": { en: "Stock", ur: "اسٹاک" },
  "products.maanUnit": { en: "Maan (40 Kg)", ur: "من (40 کلو)" },
  "products.unitMaan": { en: "/ Maan (40 Kg)", ur: "/ من (40 کلو)" },
  "products.unitKg": { en: "/ Kg", ur: "/ کلو" },
  "products.rs": { en: "Rs", ur: "روپیے" },
  "products.pricePerMaan": { en: "Price per Maan", ur: "قیمت فی من" },
  "products.pricePerKg": { en: "Price per Kg", ur: "قیمت فی کلو" },
  "products.buyWhatsapp": { en: "WhatsApp", ur: "واٹس ایپ" },

  // Contact
  "contact.title": { en: "Get in Touch", ur: "رابطہ کریں" },
  "contact.name": { en: "Name", ur: "نام" },
  "contact.email": { en: "Email", ur: "ای میل" },
  "contact.phone": { en: "Phone", ur: "فون" },
  "contact.message": { en: "Message", ur: "پیغام" },
  "contact.submit": { en: "Send Message", ur: "پیغام بھیجیں" },
  "contact.success": { en: "Message sent successfully!", ur: "پیغام کامیابی سے بھیج دیا گیا!" },

  // Admin
  "admin.dashboard": { en: "Dashboard", ur: "ڈیش بورڈ" },
  "admin.products": { en: "Manage Products", ur: "مصنوعات کا انتظام" },
  "admin.contacts": { en: "Inquiries", ur: "استفسارات" },
  "admin.create": { en: "Add Product", ur: "نئی مصنوعات شامل کریں" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) setLanguageState(saved);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const dir = language === "ur" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
