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
import ImageSlider from "@/components/ui/image-slider"; // ✅ NEW IMPORT

export default function HomePage() {
  const { t, dir } = useLanguage();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: settings, isLoading: settingsLoading } = useSettings();

  const featuredProducts = products?.slice(0, 3) || [];
  
  // Shop images - Update these with your actual image filenames from uploads folder
  const shopImages = [
    "one (1).jpeg",  // Replace with your image names
    "one (3).jpeg",
    "one (2).jpeg", 
    "one (4).jpeg"
  ];

  const whatsappNumber = settings?.whatsappNumber || "923001234567";
  const phoneNumber = settings?.phoneNumber || "+923001234567";
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

      {/* ✅ NEW: Shop Images Slider Section - Replaces Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="space-y-8"
          >
            {/* Title Section - Premium Quality */}
            <div className="text-center max-w-3xl mx-auto space-y-4" dir={dir}>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4" />
                <span>{dir === 'ltr' ? 'Our Shop Gallery' : 'ہماری دکان کی گیلری'}</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-foreground">
                {dir === 'ltr' ? (
                  <>
                    <span className="text-primary">Premium Quality</span> Flour
                  </>
                ) : (
                  <>
                    <span className="text-primary">اعلیٰ معیار</span> کا آٹا
                  </>
                )}
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {dir === 'ltr' ? (
                  "Hand-picked grains processed with care to ensure the finest quality for your family."
                ) : (
                  <span className="font-urdu" dir="rtl">
                    ہاتھ سے چنے ہوئے اناج جو آپ کے خاندان کے لیے بہترین معیار کو یقینی بنانے کے لیے احتیاط سے پروسیس کیا جاتا ہے۔
                  </span>
                )}
              </p>
            </div>

            {/* Image Slider */}
            <div className="px-4 sm:px-0">
              <ImageSlider 
                images={shopImages}
                autoSlideInterval={3000}
                showDots={true}
                showArrows={true}
                className="max-w-6xl mx-auto"
              />
              
              {/* Caption */}
              <p className="text-center text-sm text-muted-foreground mt-6 px-4">
                {dir === 'ltr' 
                  ? "Scroll through our shop images to see our setup and quality products"
                  : "ہماری دکان کی تصاویر دیکھنے کے لیے سکرول کریں"
                }
              </p>
            </div>

            {/* Quality Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              {[
                { 
                  labelEn: "Fresh Grains", 
                  labelUr: "تازہ اناج", 
                  descEn: "Daily sourced", 
                  descUr: "روزانہ حاصل کردہ" 
                },
                { 
                  labelEn: "Clean Process", 
                  labelUr: "صاف پروسیس", 
                  descEn: "Hygienic setup", 
                  descUr: "صاف ستھرا سیٹ اپ" 
                },
                { 
                  labelEn: "Quality Check", 
                  labelUr: "معیار چیک", 
                  descEn: "Tested in lab", 
                  descUr: "لیب میں ٹیسٹ شدہ" 
                },
                { 
                  labelEn: "Family Business", 
                  labelUr: "خاندانی کاروبار", 
                  descEn: "Since 1985", 
                  descUr: "1985 سے" 
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="bg-card p-4 rounded-xl border border-border/50 text-center hover:shadow-md transition-shadow"
                >
                  {dir === 'ltr' ? (
                    <>
                      <h4 className="font-bold text-foreground mb-1">{item.labelEn}</h4>
                      <p className="text-sm text-muted-foreground">{item.descEn}</p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-bold text-foreground mb-1 font-urdu" dir="rtl">{item.labelUr}</h4>
                      <p className="text-sm text-muted-foreground font-urdu" dir="rtl">{item.descUr}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12" dir={dir}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display mb-3 sm:mb-4">{t("products.title")}</h2>
            <div className="h-1 w-16 sm:w-20 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" dir={dir}>
            {isLoading ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 sm:h-56 md:h-64 w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/products">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/5 touch-target px-6 sm:px-8"
              >
                {dir === 'ltr' ? 'View All Products' : 'تمام مصنوعات دیکھیں'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-card rounded-none sm:rounded-2xl m-0 sm:mx-4 md:mx-6 lg:mx-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                {dir === 'ltr' ? 'About Our Shop' : 'ہماری دکان کے بارے میں'}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8">
                {dir === 'ltr' 
                  ? "Family-owned since 1985, we provide the finest quality wheat and flour sourced directly from our farms. Our traditional methods ensure purity and freshness in every batch."
                  : "خاندانی ملکیت میں 1985 سے، ہم براہ راست اپنے فارمز سے حاصل کردہ اعلیٰ معیار کی گندم اور آٹا فراہم کرتے ہیں۔ ہمارے روایتی طریقوں سے ہر بیچ میں خالصیت اور تازگی یقینی ہوتی ہے۔"
                }
              </p>
            </div>
            <div className="bg-secondary/50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">38+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Years Experience' : 'سالوں کا تجربہ'}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">5000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Happy Customers' : 'خوشگاہک'}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">100%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Pure Quality' : 'خالص معیار'}
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {dir === 'ltr' ? 'Delivery' : 'ڈیلیوری'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}