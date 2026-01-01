import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { ArrowRight, Star, Phone, Wheat } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/use-settings";
import ImageSlider from "@/components/ui/image-slider";
import { products as defaultProducts } from "@/data/products";

export default function HomePage() {
  const { t, dir } = useLanguage();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: settings, isLoading: settingsLoading } = useSettings();
  
  const [homeProducts, setHomeProducts] = useState(defaultProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem("flour_shop_products");
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setHomeProducts(parsedProducts.slice(0, 3)); // Show only 3 on homepage
      } catch (error) {
        console.error("Error loading products for homepage:", error);
      }
    }
  }, []);

  const featuredProducts = products?.slice(0, 3) || [];
  
  // Shop images - Update these with your actual image filenames from uploads folder
  const shopImages = [
      "/shop-images/shop1.jpg",
      "/shop-images/shop3.jpg",
      "/shop-images/shop2.jpg",
      "/shop-images/shop4.jpg"
    ].filter(img => img && img.trim() !== '');

    const whatsappNumber = settings?.whatsappNumber || "923008666593";
    const phoneNumber = settings?.phoneNumber || "+923008666593";
  const cleanWhatsappNumber = whatsappNumber.replace(/[+\s]/g, '');
  
  const whatsappMessage = encodeURIComponent(
    dir === 'ltr' 
      ? "Hi, I'm interested in products from Bashir Flour Shop. Please share your product details."
      : "السلام علیکم، میں بشیر آٹے کی دکان کی مصنوعات میں دلچسپی رکھتا ہوں۔ براہ کرم اپنی مصنوعات کی تفصیلات شیئر کریں۔"
  );

  const isLoading = productsLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      {/* Floating Contact Icons */}
      <div className="fixed z-50 flex flex-col gap-3 sm:gap-4" dir={dir}>
        {/* Mobile: Bottom center */}
        <div className="sm:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
          <a 
            href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group relative touch-target"
            aria-label="Contact on WhatsApp"
          >
            <SiWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group relative touch-target"
            aria-label="Call Us"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
          </a>
        </div>
        
        {/* Desktop: Bottom right */}
        <div className="hidden sm:flex flex-col gap-4 fixed bottom-6 right-6">
          <a 
            href={`https://wa.me/${cleanWhatsappNumber}?text=${whatsappMessage}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-500 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group relative touch-target"
            aria-label="Contact on WhatsApp"
          >
            <SiWhatsapp className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden lg:inline absolute right-full mr-3 bg-white text-stone-900 px-2 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border">
              {dir === 'ltr' ? 'WhatsApp Us' : 'واٹس ایپ کریں'}
            </span>
          </a>
          <a 
            href={`tel:${phoneNumber}`} 
            className="bg-primary text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 flex items-center justify-center group relative touch-target"
            aria-label="Call Us"
          >
            <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="hidden lg:inline absolute right-full mr-3 bg-white text-stone-900 px-2 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border">
              {dir === 'ltr' ? 'Call Us' : 'کال کریں'}
            </span>
          </a>
        </div>
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight text-wheat-gradient">
                {dir === 'ltr' ? (
                  <>
                    Pure & Fresh <span className="text-amber-300">Flour and Wheat</span>
                  </>
                ) : (
                  <>
                        خالص  <span className="text-amber-300">آٹا اور گندم</span>
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
                <p className="text-base sm:text-lg md:text-xl text-stone-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-urdu" dir="rtl">
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
                    className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 touch-target"
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
              <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-6 py-3 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-semibold text-sm">
                  {dir === 'ltr' ? 'SHOP GALLERY' : 'دکان گیلری'}
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display">
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
              
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                {dir === 'ltr' ? (
                  "Experience our setup through pictures"
                ) : (
                  <span className="font-urdu" dir="rtl">
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
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {dir === 'ltr' ? item.titleEn : item.titleUr}
                  </h3>
                  <p className="text-muted-foreground">
                    {dir === 'ltr' ? item.descEn : item.descUr}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

     {/* Featured Products Section */}
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
  ) : featuredProducts.length > 0 ? (
    featuredProducts.map((product) => (
      <div key={product.id} className="h-full">
        <ProductCard product={product} />
      </div>
    ))
  ) : (
    <div className="col-span-3 text-center py-12">
      <p className="text-lg text-muted-foreground">
        {dir === 'ltr' 
          ? "No products available yet. Check back soon!"
          : "ابھی تک کوئی مصنوعات دستیاب نہیں ہیں۔ جلد ہی دوبارہ چیک کریں!"
        }
      </p>
    </div>
  )}
</div>

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