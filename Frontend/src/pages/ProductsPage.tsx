import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/use-language";
import { products as defaultProducts } from "@/data/products";
import { ProductCard } from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, Grid, List, RefreshCw, Wheat, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";

// Updated Product Interface to match data/products.ts
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

export default function ProductsPage() {
  const { t, dir } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // ✅ FIXED: Hardcoded values
  const whatsappNumber = "923008666593";
  const phoneNumber = "+923008666593";
  const cleanWhatsappNumber = whatsappNumber.replace(/[+\s]/g, '');

  // Fix image paths function
  const fixImagePaths = (products: Product[]): Product[] => {
    return products.map(product => {
      let imagePath = product.image || '';
      
      if (!imagePath || imagePath.trim() === '') {
        if (product.category === "wheat") {
          imagePath = product.id % 2 === 0 ? '/shop-images/wheat.jpg' : '/shop-images/wheat1.jpg';
        } else {
          imagePath = '/shop-images/atta.jpg';
        }
      }
      
      if (!imagePath.startsWith('/shop-images/')) {
        if (product.category === "wheat") {
          imagePath = '/shop-images/wheat.jpg';
        } else {
          imagePath = '/shop-images/atta.jpg';
        }
      }
      
      const oldPaths = ['/shop-images/shop1.jpg', '/shop-images/shop2.jpg', '/shop-images/shop3.jpg', '/shop-images/shop4.jpg'];
      if (oldPaths.includes(imagePath)) {
        if (product.category === "wheat") {
          imagePath = product.id % 2 === 0 ? '/shop-images/wheat.jpg' : '/shop-images/wheat1.jpg';
        } else {
          imagePath = '/shop-images/atta.jpg';
        }
      }
      
      return {
        ...product,
        image: imagePath
      };
    });
  };

  // 🔧 ENHANCED: Load products from multiple storage sources
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        let loadedProducts = defaultProducts;
        let source = "default";
        
        // Try multiple storage sources
        const storageSources = [
          { name: "localStorage", getter: () => localStorage.getItem("flour_shop_products") },
          { name: "sessionStorage", getter: () => sessionStorage.getItem("flour_shop_products_backup") },
          { name: "cookies", getter: () => {
            const cookies = document.cookie.split(';');
            for (const cookie of cookies) {
              const [name, value] = cookie.trim().split('=');
              if (name === 'flour_shop_products' && value) {
                try {
                  return decodeURIComponent(value);
                } catch (e) {
                  console.log('Cookie decode error:', e);
                }
              }
            }
            return null;
          }}
        ];
        
        for (const sourceInfo of storageSources) {
          const savedData = sourceInfo.getter();
          if (savedData) {
            try {
              const parsedProducts = JSON.parse(savedData);
              if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                loadedProducts = parsedProducts;
                source = sourceInfo.name;
                break;
              }
            } catch (e) {
              console.log(`Error parsing ${sourceInfo.name}:`, e);
            }
          }
        }
        
        console.log(`🛒 ProductsPage loaded from ${source}:`, loadedProducts.length);
        
        // Fix image paths
        const fixedProducts = fixImagePaths(loadedProducts);
        
        // Save to localStorage if from backup source
        if (source !== "localStorage") {
          localStorage.setItem("flour_shop_products", JSON.stringify(fixedProducts));
        }
        
        // Save fixed products back if different
        if (JSON.stringify(loadedProducts) !== JSON.stringify(fixedProducts)) {
          localStorage.setItem("flour_shop_products", JSON.stringify(fixedProducts));
        }
        
        setAllProducts(fixedProducts);
        
      } catch (error) {
        console.error("Error loading products:", error);
        const fixedDefaultProducts = fixImagePaths(defaultProducts);
        setAllProducts(fixedDefaultProducts);
      } finally {
        setIsLoading(false);
      }
    };

    // Load immediately
    loadProducts();
    
    // Also load every 3 seconds to catch any updates from settings page
    const interval = setInterval(loadProducts, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Enhanced refresh with multiple sources
      try {
        const savedProducts = localStorage.getItem("flour_shop_products");
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          const fixedProducts = fixImagePaths(parsedProducts);
          setAllProducts(fixedProducts);
        } else {
          // Try sessionStorage backup
          const backupProducts = sessionStorage.getItem("flour_shop_products_backup");
          if (backupProducts) {
            const parsedBackup = JSON.parse(backupProducts);
            const fixedProducts = fixImagePaths(parsedBackup);
            setAllProducts(fixedProducts);
            localStorage.setItem("flour_shop_products", JSON.stringify(fixedProducts));
          }
        }
      } catch (error) {
        console.error("Refresh error:", error);
      }
      setIsLoading(false);
    }, 500);
  };

  const resetToDefault = () => {
    const fixedDefaultProducts = fixImagePaths(defaultProducts);
    setAllProducts(fixedDefaultProducts);
    
    // Save to multiple locations
    localStorage.setItem("flour_shop_products", JSON.stringify(fixedDefaultProducts));
    sessionStorage.setItem("flour_shop_products_backup", JSON.stringify(fixedDefaultProducts));
    
    alert("✅ Products reset to default with correct images!");
  };

  const wheatProducts = allProducts.filter(p => p.category === 'wheat');
  const flourProducts = allProducts.filter(p => p.category === 'flour');

  // Filter products for search
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameUr.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Auto-switch to list view on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode("list");
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  // Auto-refresh products when localStorage changes (from settings page)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flour_shop_products' && e.newValue) {
        try {
          const parsedProducts = JSON.parse(e.newValue);
          if (Array.isArray(parsedProducts)) {
            const fixedProducts = fixImagePaths(parsedProducts);
            setAllProducts(fixedProducts);
            console.log('🔄 Products updated from storage event');
          }
        } catch (error) {
          console.error('Error handling storage change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-background flex flex-col font-sans ${dir === 'rtl' ? 'font-urdu' : ''}`}>
      <Navbar />
      
      <main className="flex-grow py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 sm:mb-12" 
            dir={dir}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <div className="text-left mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-3 sm:mb-4 text-foreground">
                  {dir === 'ltr' ? 'Our Products' : 'ہماری مصنوعات'}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
                  {dir === 'ltr' 
                    ? "Browse our selection of high-quality grains and flour"
                    : "اعلیٰ معیار کے اناج اور آٹے کے ہمارے انتخاب کو براؤز کریں"
                  }
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                  Auto-sync: ON
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshProducts}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetToDefault}
                  className="gap-2 hidden sm:inline-flex"
                >
                  Reset Data
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                Total: {allProducts.length} products
              </div>
              <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                Wheat: {wheatProducts.length}
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Flour: {flourProducts.length}
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  placeholder={dir === 'ltr' ? "Search products..." : "مصنوعات تلاش کریں..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base w-full"
                  dir={dir}
                />
              </div>
              
              {/* View Toggle */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="gap-2 px-4 py-2"
                  >
                    <Grid className="h-4 w-4" />
                    {dir === 'ltr' ? 'Grid' : 'گریڈ'}
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="gap-2 px-4 py-2"
                  >
                    <List className="h-4 w-4" />
                    {dir === 'ltr' ? 'List' : 'فہرست'}
                  </Button>
                </div>
              )}
            </div>

            {/* Category Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px] text-sm sm:text-base py-2 sm:py-3">
                    <SelectValue placeholder={dir === 'ltr' ? "All Categories" : "تمام زمرے"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{dir === 'ltr' ? "All Products" : "تمام مصنوعات"}</SelectItem>
                    <SelectItem value="wheat">{dir === 'ltr' ? "Wheat" : "گندم"}</SelectItem>
                    <SelectItem value="flour">{dir === 'ltr' ? "Flour" : "آٹا"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Clear Filters Button */}
              {(searchQuery || categoryFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                  }}
                  className="text-sm sm:text-base"
                >
                  {dir === 'ltr' ? 'Clear Filters' : 'فلٹرز صاف کریں'}
                </Button>
              )}
            </div>
          </div>

          {/* Products Display - Tabs */}
          <Tabs defaultValue="all" className="w-full" dir={dir}>
            <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto">
              <TabsList className="bg-secondary/50 p-1 rounded-full border border-border min-w-max">
                <TabsTrigger 
                  value="all" 
                  className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {dir === 'ltr' ? 'All Products' : 'تمام مصنوعات'} ({allProducts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="wheat" 
                  className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {dir === 'ltr' ? 'Wheat' : 'گندم'} ({wheatProducts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="flour" 
                  className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {dir === 'ltr' ? 'Flour' : 'آٹا'} ({flourProducts.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Products Tab */}
            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {Array.from({ length: isMobile ? 3 : 6 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {filteredProducts.map(product => (
                    <div key={product.id} className="h-full">
                      <ProductCardWithButtons 
                        product={product} 
                        dir={dir} 
                        cleanWhatsappNumber={cleanWhatsappNumber}
                        phoneNumber={phoneNumber}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {dir === 'ltr' ? 'No products found' : 'کوئی مصنوعات نہیں ملیں'}
                  </p>
                </div>
              )}
            </TabsContent>
            
            {/* Wheat Products Tab */}
            <TabsContent value="wheat" className="mt-0">
              {isLoading ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {Array.from({ length: 3 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))}
                </div>
              ) : wheatProducts.length > 0 ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {wheatProducts.map(product => (
                    <div key={product.id} className="h-full">
                      <ProductCardWithButtons 
                        product={product} 
                        dir={dir} 
                        cleanWhatsappNumber={cleanWhatsappNumber}
                        phoneNumber={phoneNumber}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {dir === 'ltr' ? 'No wheat products found' : 'کوئی گندم کی مصنوعات نہیں ملیں'}
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Flour Products Tab */}
            <TabsContent value="flour" className="mt-0">
              {isLoading ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {Array.from({ length: 3 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))}
                </div>
              ) : flourProducts.length > 0 ? (
                <div className={viewMode === "grid" && !isMobile 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                  : "space-y-4 sm:space-y-6"
                } dir={dir}>
                  {flourProducts.map(product => (
                    <div key={product.id} className="h-full">
                      <ProductCardWithButtons 
                        product={product} 
                        dir={dir} 
                        cleanWhatsappNumber={cleanWhatsappNumber}
                        phoneNumber={phoneNumber}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {dir === 'ltr' ? 'No flour products found' : 'کوئی آٹے کی مصنوعات نہیں ملیں'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Storage Info Banner */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-800">🔄 Real-time Sync Active</h4>
                <p className="text-sm text-blue-600">
                  {dir === 'ltr' 
                    ? "Products update automatically when changed in Settings"
                    : "ترتیبات میں تبدیلی کرتے ہی مصنوعات خود بخود اپ ڈیٹ ہوجاتی ہیں"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                {dir === 'ltr' ? '← Back to Home' : '← ہوم پیج پر واپس جائیں'}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Product Card with WhatsApp & Call Buttons Component
function ProductCardWithButtons({ 
  product, 
  dir, 
  cleanWhatsappNumber, 
  phoneNumber 
}: { 
  product: Product; 
  dir: string; 
  cleanWhatsappNumber: string; 
  phoneNumber: string; 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      {/* Product Image */}
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-100">
        <img 
          src={product.image || (product.category === 'wheat' ? '/shop-images/wheat.jpg' : '/shop-images/atta.jpg')} 
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
              <span className="text-sm text-gray-500 font-normal">/{product.unit}</span>
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through">
                Rs {product.originalPrice}
              </div>
            )}
          </div>
          
          {/* Stock Info */}
          <div className="text-sm text-gray-600">
            {dir === 'ltr' ? 'Stock:' : 'اسٹاک:'} {product.stock} {product.unit}
          </div>
        </div>
        
        {/* WhatsApp & Call Buttons */}
        <div className="flex gap-2 mt-2">
          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
              dir === 'ltr'
                ? `Hi, I want to order ${product.nameEn} (Rs ${product.price}/${product.unit}). Please confirm availability.`
                : `السلام علیکم، میں ${product.nameUr} (${product.price} روپے/${product.unit}) آرڈر کرنا چاہتا ہوں۔ براہ کرم دستیابی کی تصدیق کریں۔`
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
  );
}

// ProductSkeleton component
function ProductSkeleton({ viewMode = "grid", isMobile = false }: { viewMode?: "grid" | "list"; isMobile?: boolean }) {
  if (viewMode === "list" || isMobile) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-card animate-pulse">
        <Skeleton className="h-32 sm:h-40 w-full sm:w-40 rounded-lg bg-secondary" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4 bg-secondary" />
          <Skeleton className="h-4 w-1/2 bg-secondary" />
          <Skeleton className="h-4 w-1/3 bg-secondary" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md bg-secondary" />
            <Skeleton className="h-10 w-24 rounded-md bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-48 sm:h-56 md:h-64 w-full rounded-xl bg-secondary" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-[200px] bg-secondary" />
        <Skeleton className="h-4 w-[150px] bg-secondary" />
        <Skeleton className="h-10 w-full rounded-md bg-secondary mt-4" />
      </div>
    </div>
  );
}