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
import { Filter, Search, Grid, List, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  nameUrdu: string;
  price: number;
  category: "wheat" | "flour";
  image: string;
  stock: number;
  description?: string;
  unit: "Kg" | "Maan";
}

export default function ProductsPage() {
  const { t, dir } = useLanguage();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fix image paths function
  const fixImagePaths = (products: Product[]): Product[] => {
    return products.map(product => {
      let imagePath = product.image;
      
      // If image path doesn't start with /shop-images/, fix it
      if (!imagePath.startsWith('/shop-images/')) {
        // Determine which image to use based on product
        if (product.category === "wheat") {
          // Alternate between wheat.jpg and wheat1.jpg for wheat products
          imagePath = product.id % 2 === 1 ? '/shop-images/wheat.jpg' : '/shop-images/wheat1.jpg';
        } else {
          imagePath = '/shop-images/atta.jpg';
        }
      }
      
      // Also fix any old paths
      const oldPaths = ['/shop-images/shop1.jpg', '/shop-images/shop2.jpg', '/shop-images/shop3.jpg', '/shop-images/shop4.jpg'];
      if (oldPaths.includes(imagePath)) {
        if (product.category === "wheat") {
          imagePath = product.id % 2 === 1 ? '/shop-images/wheat.jpg' : '/shop-images/wheat1.jpg';
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

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      setIsLoading(true);
      try {
        const savedProducts = localStorage.getItem("flour_shop_products");
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          const fixedProducts = fixImagePaths(parsedProducts);
          setAllProducts(fixedProducts);
          
          // Save fixed products back (only if different)
          if (JSON.stringify(parsedProducts) !== JSON.stringify(fixedProducts)) {
            localStorage.setItem("flour_shop_products", JSON.stringify(fixedProducts));
          }
        } else {
          // Use default products
          const fixedDefaultProducts = fixImagePaths(defaultProducts);
          setAllProducts(fixedDefaultProducts);
          localStorage.setItem("flour_shop_products", JSON.stringify(fixedDefaultProducts));
        }
      } catch (error) {
        console.error("Error loading products:", error);
        const fixedDefaultProducts = fixImagePaths(defaultProducts);
        setAllProducts(fixedDefaultProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const refreshProducts = () => {
    setIsLoading(true);
    setTimeout(() => {
      const savedProducts = localStorage.getItem("flour_shop_products");
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        const fixedProducts = fixImagePaths(parsedProducts);
        setAllProducts(fixedProducts);
      }
      setIsLoading(false);
    }, 500);
  };

  const resetToDefault = () => {
    const fixedDefaultProducts = fixImagePaths(defaultProducts);
    setAllProducts(fixedDefaultProducts);
    localStorage.setItem("flour_shop_products", JSON.stringify(fixedDefaultProducts));
    alert("✅ Products reset to default with correct images!");
  };

  const wheatProducts = allProducts.filter(p => p.category === 'wheat');
  const flourProducts = allProducts.filter(p => p.category === 'flour');

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameUrdu.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredWheatProducts = wheatProducts.filter(product =>
    searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFlourProducts = flourProducts.filter(product =>
    searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
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
                  {t("products.title")}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl">
                  {dir === 'ltr' 
                    ? "Browse our selection of high-quality grains and flour"
                    : "اعلیٰ معیار کے اناج اور آٹے کے ہمارے انتخاب کو براؤز کریں"
                  }
                </p>
              </div>
              <div className="flex gap-2">
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
                  className="gap-2"
                >
                  Reset Data
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {allProducts.length} products available | 
              Wheat: {wheatProducts.length} | 
              Flour: {flourProducts.length}
            </p>
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
                    <SelectItem value="wheat">{t("products.wheat")}</SelectItem>
                    <SelectItem value="flour">{t("products.flour")}</SelectItem>
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
                  {t("products.title")} ({allProducts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="wheat" 
                  className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t("products.wheat")} ({wheatProducts.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="flour" 
                  className="rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {t("products.flour")} ({flourProducts.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* All Products Tab */}
            <TabsContent value="all" className="mt-0">
              <div className={viewMode === "grid" && !isMobile 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                : "space-y-4 sm:space-y-6"
              } dir={dir}>
                {isLoading ? (
                  Array.from({ length: isMobile ? 3 : 6 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))
                ) : filteredProducts && filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {dir === 'ltr' ? 'No products found' : 'کوئی مصنوعات نہیں ملیں'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Wheat Products Tab */}
            <TabsContent value="wheat" className="mt-0">
              <div className={viewMode === "grid" && !isMobile 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                : "space-y-4 sm:space-y-6"
              } dir={dir}>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))
                ) : filteredWheatProducts && filteredWheatProducts.length > 0 ? (
                  filteredWheatProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {dir === 'ltr' ? 'No wheat products found' : 'کوئی گندم کی مصنوعات نہیں ملیں'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Flour Products Tab */}
            <TabsContent value="flour" className="mt-0">
              <div className={viewMode === "grid" && !isMobile 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" 
                : "space-y-4 sm:space-y-6"
              } dir={dir}>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, n) => (
                    <ProductSkeleton key={n} viewMode={viewMode} isMobile={isMobile} />
                  ))
                ) : filteredFlourProducts && filteredFlourProducts.length > 0 ? (
                  filteredFlourProducts.map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {dir === 'ltr' ? 'No flour products found' : 'کوئی آٹے کی مصنوعات نہیں ملیں'}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Debug Info (Remove after testing) */}
          {!isLoading && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs">
              <p className="font-bold">Image Debug:</p>
              {allProducts.map(p => (
                <div key={p.id} className="flex items-center gap-2">
                  <span>{p.name}:</span>
                  <span className="text-blue-600">{p.image}</span>
                  <img 
                    src={p.image} 
                    alt="test" 
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      console.error("Failed to load:", p.image);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
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