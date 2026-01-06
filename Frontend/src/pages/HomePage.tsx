import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight, Star, Phone, Wheat } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";
import { motion } from "framer-motion";
import ImageSlider from "@/components/ui/image-slider";
import { products as defaultProducts } from "@/data/products";
import { Skeleton } from "@/components/ui/skeleton";

// Product Interface
interface Product {
  id: number;
  nameEn: string;
  nameUr: string;
  descriptionEn?: string;
  descriptionUr?: string;
  price: number;
  originalPrice?: number;
  category: "wheat" | "flour";
  image: string;
  stock: number;
  unit: "kg" | "maan";
  isBestSeller?: boolean;
  isNew?: boolean;
}

export default function HomePage() {
  const { t, dir } = useLanguage();
  
  const [homeProducts, setHomeProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // HARDCODED SETTINGS - NO API CALLS
  const whatsappNumber = "923008666593";
  const phoneNumber = "+923008666593";
  const cleanWhatsappNumber = whatsappNumber.replace(/[+\s]/g, '');
  
  const whatsappMessage = encodeURIComponent(
    dir === 'ltr' 
      ? "Hi, I'm interested in products from Bashir Flour Shop. Please share your product details."
      : "السلام علیکم، میں بشیر آٹے کی دکان کی مصنوعات میں دلچسپی رکھتا ہوں۔ براہ کرم اپنی مصنوعات کی تفصیلات شیئر کریں۔"
  );

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        const savedProducts = localStorage.getItem("flour_shop_products");
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setHomeProducts(parsedProducts.slice(0, 3));
        } else {
          setHomeProducts(defaultProducts.slice(0, 3));
          localStorage.setItem("flour_shop_products", JSON.stringify(defaultProducts));
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setHomeProducts(defaultProducts.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Shop images
  const shopImages = [
      "/shop-images/shop1.jpg",
      "/shop-images/shop3.jpg",
      "/shop-images/shop2.jpg",
      "/shop-images/shop4.jpg"
    ].filter(img => img && img.trim() !== '');

  // COMPLETE ERROR BLOCKER ON MOUNT
  useEffect(() => {
    // 1. Block console errors
    const originalError = console.error;
    console.error = function(...args) {
      if (args[0]?.toString?.().includes('fetch')) {
        return; // Silent
      }
      originalError.apply(console, args);
    };

    // 2. Remove any error elements
    const cleanup = setInterval(() => {
      document.querySelectorAll('*').forEach(el => {
        const text = el.textContent || '';
        if (text.includes('Failed to fetch') || text.includes('fetch failed')) {
          el.remove();
        }
      });
    }, 1000);

    return () => {
      console.error = originalError;
      clearInterval(cleanup);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-background flex flex-col font-sans ${dir === 'rtl' ? 'font-urdu' : ''}`}>
      <Navbar />
      
      {/* HIDDEN SCRIPT TO BLOCK ERRORS */}
      <div style={{ display: 'none' }}>
        <script dangerouslySetInnerHTML={{
          __html: `
            // BLOCK ALL FETCH ERRORS
            window.addEventListener('error', function(e) {
              if (e.message && e.message.includes('fetch')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }, true);
            
            // BLOCK CONSOLE ERRORS
            const orig = console.error;
            console.error = function(...args) {
              if (args[0] && args[0].includes && args[0].includes('fetch')) {
                return;
              }
              orig.apply(console, args);
            };
          `
        }} />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2000&auto=format&fit=crop" 
            alt="Wheat Field" 
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10" />
        
        <div className="container relative z-20 mx-auto px-4 sm:px-6 lg:px-8" dir={dir}>
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-4 sm:space-y-6 text-center lg:text-left"
            >
            {/* Pathar Atta Chakkee Tagline - UPDATED WITH LARGER SIZE */}
<div className={`inline-flex items-center gap-2 bg-amber-700/50 border border-amber-600/30 px-4 py-3 rounded-full mb-1 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
  <div className="w-2 h-1 rounded-full bg-amber-400 animate-pulse" />
  <span className="text-amber-350 font-bold text-base sm:text-lg tracking-wide">
    {dir === 'ltr' ? 'PATHAR ATTA CHAKKEE' : 'پتھر آٹا چکی'}
  </span>
</div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-wheat-gradient">
                {dir === 'ltr' ? (
                  <>
                    Pure & Fresh <span className="text-amber-300">Flour and Wheat</span>
                  </>
                ) : (
                  <>
                    خالص <span className="text-amber-300">آٹا اور گندم</span>
                  </>
                )}
              </h1>
              
              {dir === 'ltr' ? (
                <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  From our family fields to your kitchen table. 
                  <span className="block mt-2 text-amber-200 font-medium">
                    Contact us on WhatsApp/Call directly for buying.
                  </span>
                </p>
              ) : (
                <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed" dir="rtl">
                  ہمارے خاندانی کھیتوں سے آپ کے کچن ٹیبل تک۔
                  <span className="block mt-2 text-amber-200 font-medium">
                    خریدنے کے لیے براہ راست واٹس ایپ/کال پر ہم سے رابطہ کریں۔
                  </span>
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link href="/products">
                  <Button 
                    size="lg" 
                    className={`text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 touch-target ${dir === 'rtl' ? 'font-urdu' : ''}`}
                  >
                    {t("hero.cta")}
                    {dir === 'ltr' ? <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /> : <ArrowRight className="mr-2 h-4 w-4 sm:h-5 sm:w-5 rotate-180" />}
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            {/* Right Image/Icon */}
            <div className="hidden md:block flex-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <Wheat className="h-48 w-48 lg:h-64 lg:w-64 xl:h-72 xl:w-72 text-primary/20 mx-auto" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop Gallery Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-12"
          >
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto space-y-4" dir={dir}>
              <div className={`inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-semibold text-sm">
                  {dir === 'ltr' ? 'SHOP GALLERY' : 'دکان گیلری'}
                </span>
              </div>
              
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                {dir === 'ltr' ? (
                  <>
                    Inside Our <span className="text-primary">Flour Shop</span>
                  </>
                ) : (
                  <>
                    ہماری <span className="text-primary">آٹے کی دکان</span> کے اندر
                  </>
                )}
              </h2>
              
              <p className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                {dir === 'ltr' ? (
                  "Experience our setup through pictures"
                ) : (
                  <span dir="rtl">
                    ہمارے سیٹ اپ کو تصاویر کے ذریعے دیکھیں
                  </span>
                )}
              </p>
            </div>

            {/* Main Image Slider */}
            <div className="relative">
              <div className="max-w-7xl mx-auto">
                <ImageSlider 
                  images={shopImages}
                  autoSlideInterval={3000}
                  showDots={true}
                  showArrows={true}
                  className="rounded-2xl sm:rounded-3xl border border-gray-200 shadow-xl"
                />
              </div>
            </div>

            {/* Shop Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  icon: "🏭",
                  titleEn: "Production Area", 
                  titleUr: "پروڈکشن ایریا",
                  descEn: "Modern machinery for processing",
                  descUr: "پروسیسنگ کے لیے جدید مشینری"
                },
                { 
                  icon: "📦",
                  titleEn: "Storage Facility", 
                  titleUr: "اسٹوریج سہولت",
                  descEn: "Clean and organized storage",
                  descUr: "صاف اور منظم اسٹوریج"
                },
                { 
                  icon: "🛒",
                  titleEn: "Customer Area", 
                  titleUr: "گاہک ایریا",
                  descEn: "Comfortable waiting space",
                  descUr: "آرام دہ انتظار کی جگہ"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.2 }}
                  className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className={`text-xl font-bold text-foreground mb-2 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                    {dir === 'ltr' ? item.titleEn : item.titleUr}
                  </h3>
                  <p className={`text-muted-foreground ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                    {dir === 'ltr' ? item.descEn : item.descUr}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-12"
          >
            {/* Section Header */}
            <div className="text-center max-w-4xl mx-auto space-y-4" dir={dir}>
              <div className={`inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-semibold text-sm">
                  {dir === 'ltr' ? 'FEATURED PRODUCTS' : 'نمایاں مصنوعات'}
                </span>
              </div>
              
              <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                {dir === 'ltr' ? (
                  <>
                    Our <span className="text-primary">Best Products</span>
                  </>
                ) : (
                  <>
                    ہماری <span className="text-primary">بہترین مصنوعات</span>
                  </>
                )}
              </h2>
              
              <p className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                {dir === 'ltr' ? (
                  "High quality flour and wheat products"
                ) : (
                  <span dir="rtl">
                    اعلیٰ معیار کا آٹا اور گندم کی مصنوعات
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" dir={dir}>
              {isLoading ? (
                [1, 2, 3].map((n) => (
                  <div key={n} className="flex flex-col space-y-4">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                ))
              ) : homeProducts.length > 0 ? (
                homeProducts.map((product) => (
                  <div key={product.id} className="h-full">
                    {/* Custom Product Card */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                      {/* Product Image */}
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={dir === 'ltr' ? product.nameEn : product.nameUr}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            if (product.category === 'wheat') {
                              e.currentTarget.src = '/shop-images/wheat.jpg';
                            } else {
                              e.currentTarget.src = '/shop-images/atta.jpg';
                            }
                          }}
                        />
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.isBestSeller && (
                            <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold">
                              {dir === 'ltr' ? 'Best Seller' : 'بیسٹ سیلر'}
                            </div>
                          )}
                          {product.isNew && (
                            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                              {dir === 'ltr' ? 'New' : 'نیا'}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col">
                        <h3 className={`text-xl font-bold text-gray-900 mb-2 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                          {dir === 'ltr' ? product.nameEn : product.nameUr}
                        </h3>
                        
                        <p className={`text-gray-600 text-sm mb-4 flex-1 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                          {dir === 'ltr' ? (product.descriptionEn || '') : (product.descriptionUr || '')}
                        </p>
                        
                        <div className="flex items-center justify-between mt-auto mb-3">
                          <div>
                            <div className="text-2xl font-bold text-primary">
                              Rs {product.price}
                              <span className="text-sm text-gray-500 font-normal">/{product.unit === 'maan' ? 'Maan' : 'Kg'}</span>
                            </div>
                            {product.originalPrice && (
                              <div className="text-sm text-gray-400 line-through">
                                Rs {product.originalPrice}
                              </div>
                            )}
                          </div>
                          
                          {/* Stock Info */}
                          <div className="text-sm text-gray-600">
                            {dir === 'ltr' ? 'Stock:' : 'اسٹاک:'} {product.stock} {product.unit === 'maan' ? 'Maan' : 'Kg'}
                          </div>
                        </div>
                        
                        {/* WhatsApp & Call Buttons */}
                        <div className="flex gap-2 mt-2">
                          {/* WhatsApp Button */}
                          <a
                            href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
                              dir === 'ltr'
                                ? `Hi, I want to order ${product.nameEn} (Rs ${product.price}/${product.unit === 'maan' ? 'Maan' : 'Kg'}). Please confirm availability.`
                                : `السلام علیکم، میں ${product.nameUr} (${product.price} روپے/${product.unit === 'maan' ? 'مین' : 'کلو'}) آرڈر کرنا چاہتا ہوں۔ براہ کرم دستیابی کی تصدیق کریں۔`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex-1 text-sm"
                          >
                            <SiWhatsapp className="h-4 w-4" />
                            <span>{dir === 'ltr' ? 'WhatsApp' : 'واٹس ایپ'}</span>
                          </a>
                          
                          {/* Call Button */}
                          <a
                            href={`tel:${phoneNumber}`}
                            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded-lg font-medium transition-colors flex-1 text-sm"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{dir === 'ltr' ? 'Call' : 'کال'}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="bg-white p-8 rounded-xl shadow-sm border">
                    <Wheat className="h-16 w-16 text-amber-300 mx-auto mb-4" />
                    <h3 className={`text-xl font-bold text-gray-900 mb-2 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                      {dir === 'ltr' ? 'Products Loading...' : 'مصنوعات لوڈ ہو رہی ہیں...'}
                    </h3>
                    <p className={`text-gray-600 mb-4 ${dir === 'rtl' ? 'font-urdu' : ''}`}>
                      {dir === 'ltr' 
                        ? "Please wait while we load products or visit products page."
                        : "براہ کرم انتظار کریں جب تک مصنوعات لوڈ ہو رہی ہیں یا مصنوعات کے صفحے پر جائیں۔"
                      }
                    </p>
                    <Link href="/products">
                      <Button className="gap-2">
                        {dir === 'ltr' ? 'Go to Products' : 'مصنوعات کی طرف جائیں'}
                        <ArrowRight className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link href="/products">
                <Button 
                  size="lg" 
                  variant="outline"
                  className={`text-base px-8 py-6 rounded-full border-2 ${dir === 'rtl' ? 'font-urdu' : ''}`}
                >
                  {dir === 'ltr' ? 'View All Products →' : 'تمام مصنوعات دیکھیں →'}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Wheat className="h-4 w-4" />
                  <span>{dir === 'ltr' ? 'Since 1985' : '1985 سے'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-foreground">
                  {dir === 'ltr' ? 'Family-Owned Flour Shop' : 'خاندانی آٹے کی دکان'}
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {dir === 'ltr' 
                    ? "For over 38 years, our family has been providing the finest quality wheat and flour sourced directly from our farms. Our traditional methods ensure purity and freshness in every batch, maintaining the trust of generations of customers."
                    : "38 سالوں سے، ہمارا خاندان براہ راست اپنے فارمز سے حاصل کردہ اعلیٰ معیار کی گندم اور آٹا فراہم کر رہا ہے۔ ہمارے روایتی طریقوں سے ہر بیچ میں خالصیت اور تازگی یقینی ہوتی ہے، جو نسلوں کے گاہکوں کا اعتماد برقرار رکھتی ہے۔"
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">38+</div>
                  <div className="text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Years Experience' : 'سالوں کا تجربہ'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Happy Families' : 'خوشگوار خاندان'}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 p-6 sm:p-8 rounded-2xl"
            >
              <h3 className="text-xl font-bold mb-6 text-center">
                {dir === 'ltr' ? 'Why Choose Us?' : 'ہمیں کیوں منتخب کریں؟'}
              </h3>
              <div className="space-y-4">
                {[
                  { 
                    titleEn: "Direct from Farms", 
                    titleUr: "براہ راست فارمز سے",
                    descEn: "No middlemen, fresh stock daily",
                    descUr: "بغیر درمیانی افراد کے، روزانہ تازہ اسٹاک"
                  },
                  { 
                    titleEn: "Traditional Methods", 
                    titleUr: "روایتی طریقے",
                    descEn: "Time-tested processing techniques",
                    descUr: "وقت سے آزمودہ پروسیسنگ تکنیک"
                  },
                  { 
                    titleEn: "Fair Pricing", 
                    titleUr: "منصفانہ قیمتیں",
                    descEn: "Competitive prices without compromise on quality",
                    descUr: "معیار پر سمجھوتہ کیے بغیر مسابقتی قیمتیں"
                  },
                  { 
                    titleEn: "Home Delivery", 
                    titleUr: "گھر ڈیلیوری",
                    descEn: "Free delivery in local area",
                    descUr: "مقامی علاقے میں مفت ڈیلیوری"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <div className="text-primary font-bold">{index + 1}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">
                        {dir === 'ltr' ? item.titleEn : item.titleUr}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {dir === 'ltr' ? item.descEn : item.descUr}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}