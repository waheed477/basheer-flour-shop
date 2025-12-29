import { Link } from "wouter";
import { Wheat, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";

interface ShopSettings {
  shopName: string;
  address: string;
  phoneNumber: string;
  email: string;
  workingHours: string;
}

export function Footer() {
  const { t, dir } = useLanguage();
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback to default settings
      setSettings({
        shopName: 'Basheer Atta Chakkee',
        address: 'Near Sitara Gold Colony Faisalabad, Pakistan',
        phoneNumber: '+92 300 8666593',
        email: 'info@basheerflour.com',
        workingHours: 'Mon - Sat, 9am - 8pm'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!settings?.phoneNumber) return;
    window.open(`https://wa.me/${settings.phoneNumber.replace(/\D/g, '')}`, '_blank');
  };

  const handleCallClick = () => {
    if (!settings?.phoneNumber) return;
    window.location.href = `tel:${settings.phoneNumber.replace(/\D/g, '')}`;
  };

  const handleEmailClick = () => {
    if (!settings?.email) return;
    window.location.href = `mailto:${settings.email}`;
  };

  if (loading) {
    return (
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800" dir={dir}>
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wheat className="h-6 w-6 text-primary" />
              <span className="font-display font-bold text-2xl text-stone-100">
                {settings?.shopName || 'Basheer Atta'}<span className="text-primary"></span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t("hero.subtitle") || "Premium quality flour and wheat products since 1990"}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-100">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/" className="hover:text-primary transition-colors">{t("nav.home")}</Link>
              <Link href="/products" className="hover:text-primary transition-colors">{t("nav.products")}</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link>
              <Link href="/admin/login" className="hover:text-primary transition-colors">{t("nav.admin")}</Link>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-100">Business Hours</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm leading-relaxed">{settings?.workingHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-stone-100">{t("nav.contact")}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{settings?.address}</span>
              </div>
              <button 
                onClick={handleCallClick}
                className="flex items-center gap-3 hover:text-primary transition-colors w-full text-left"
              >
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>{settings?.phoneNumber}</span>
              </button>
              <button 
                onClick={handleEmailClick}
                className="flex items-center gap-3 hover:text-primary transition-colors w-full text-left"
              >
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>{settings?.email}</span>
              </button>
              <button 
                onClick={handleWhatsAppClick}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors w-full"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.507 14.307l-.009.075c-.266 1.278-.9 2.373-2.078 3.402-.898.777-1.976 1.297-3.362 1.536-.41.07-.814.106-1.214.106-2.97 0-5.426-1.117-7.313-3.349C1.602 14.388 0 11.26 0 7.51 0 5.5.428 3.67 1.285 2.02 2.14.373 3.393.066 4.984.066c.36 0 .706.056 1.015.177.388.15.7.503.863.878.155.356.273.763.353 1.214.055.332.408.632.798.632.165 0 .315-.048.44-.135.232-.137.577-.403.991-.403.23 0 .456.069.646.2.195.135.374.314.533.55.259.38.516.987.517 1.78 0 .215-.03.457-.087.706-.255.868-.997 2.106-2.137 2.106-.178 0-.354-.045-.523-.134-.26-.137-.543-.263-.834-.379-.263-.108-.528-.175-.794-.202-.441-.036-.886.116-1.24.383-.265.201-.464.462-.58.762-.13.333-.196.684-.196 1.037 0 .353.066.692.196 1.004.117.283.31.518.561.705.253.188.553.306.886.356.335.05.676.03 1.004-.056.342-.091.672-.241.99-.452.44-.29.945-.64 1.515-1.048.226-.16.49-.305.788-.429.465-.195.939-.276 1.406-.276.31 0 .603.037.867.111.264.074.494.183.684.328.188.144.336.318.44.52.104.202.155.426.155.669 0 .405-.168.932-.502 1.572z"/>
                </svg>
                Message on WhatsApp
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
          <p>&copy; {new Date().getFullYear()} {settings?.shopName || 'Basheer Atta Chakkee'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}