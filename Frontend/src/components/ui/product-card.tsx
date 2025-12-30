import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";
import { Phone, Package, Star } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, language, dir } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const isUrdu = language === "ur";

  const whatsappNumber = "923001234567";
  const phoneNumber = "+923001234567";
  
  const productLabel = isUrdu ? product.nameUrdu : product.name;
  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in buying ${productLabel} (Price: Rs. ${product.price}) from Basheer Flour Shop.`
  );

  const isWheat = product.category === "wheat";
  const priceUnit = isWheat ? "per Maan (40 Kg)" : "per Kg";
  const priceUnitUrdu = isWheat ? "فی من (40 کلو)" : "فی کلو";

  // FIXED: Image URL handler
  const getImageUrl = () => {
    // If no image or error, return placeholder
    if (imageError || !product.image || product.image.trim() === '' || product.image === '/uploads/') {
      // Category-based placeholder
      if (isWheat) {
        return "https://placehold.co/600x600/FEF3C7/D97706?text=Wheat+Product&font=source-sans-pro";
      } else {
        return "https://placehold.co/600x600/DBEAFE/1D4ED8?text=Flour+Product&font=source-sans-pro";
      }
    }
    
    // If it's already a full URL
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    // If it starts with /uploads/, make it absolute URL
    if (product.image.startsWith('/uploads/')) {
      const filename = product.image.replace('/uploads/', '');
      return `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;
    }
    
    // Default: Try direct uploads path
    return `http://localhost:5000/uploads/${encodeURIComponent(product.image)}`;
  };

  const imageUrl = getImageUrl();

  // Check if we should show placeholder
  const shouldShowPlaceholder = imageError || !product.image || product.image.trim() === '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group bg-gradient-to-b from-white to-gray-50">
        
        {/* Image Container - PERFECT SQUARE (Width = Height) */}
        <div className="relative w-full aspect-square overflow-hidden">
          {shouldShowPlaceholder ? (
            <div 
              className="w-full h-full flex flex-col items-center justify-center p-8"
              style={{
                background: isWheat 
                  ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' 
                  : 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
              }}
            >
              {isWheat ? (
                <>
                  <div className="text-5xl mb-3">🌾</div>
                  <p className="text-gray-700 font-semibold text-center">
                    {isUrdu ? "گندم" : "Wheat"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1 text-center">
                    {isUrdu ? "اعلیٰ معیار" : "Premium Quality"}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">🥖</div>
                  <p className="text-gray-700 font-semibold text-center">
                    {isUrdu ? "آٹا" : "Flour"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1 text-center">
                    {isUrdu ? "تازہ اور خالص" : "Fresh & Pure"}
                  </p>
                </>
              )}
              
              {/* Decorative elements */}
              <div className="absolute top-3 right-3 opacity-20">
                {isWheat ? "🌾" : "🥖"}
              </div>
              <div className="absolute bottom-3 left-3 opacity-20">
                {isWheat ? "🌾" : "🥖"}
              </div>
            </div>
          ) : (
            <>
              <img 
                src={imageUrl}
                alt={isUrdu ? product.nameUrdu : product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  setImageError(true);
                  // Set fallback based on category
                  if (isWheat) {
                    e.currentTarget.src = "https://placehold.co/600x600/FEF3C7/D97706?text=Wheat+Product";
                  } else {
                    e.currentTarget.src = "https://placehold.co/600x600/DBEAFE/1D4ED8?text=Flour+Product";
                  }
                }}
                onLoad={() => console.log('Image loaded successfully:', product.name)}
                loading="lazy"
              />
              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </>
          )}
          
          {/* Category Badge - Top Right */}
          <Badge className={cn(
            "absolute top-3 right-3 font-semibold shadow-lg border-0 px-3 py-1",
            isWheat 
              ? "bg-amber-500 hover:bg-amber-600 text-white" 
              : "bg-primary hover:bg-primary/90 text-white"
          )}>
            {isWheat ? t("products.wheat") : t("products.flour")}
          </Badge>
          
          {/* Stock Indicator - Top Left */}
          <div className={cn(
            "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm",
            product.stock > 10 
              ? "bg-green-500/90 text-white border border-green-600/30"
              : product.stock > 0
              ? "bg-amber-500/90 text-white border border-amber-600/30"
              : "bg-red-500/90 text-white border border-red-600/30"
          )}>
            {product.stock} {isWheat ? t("products.maanUnit") : "units"}
          </div>
          
          {/* Favorite/Star Button - Bottom Right */}
          <button className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:shadow-lg transition-all">
            <Star className="h-4 w-4 text-amber-500" />
          </button>
        </div>
        
        {/* Content Area */}
        <CardContent className="p-5 flex-grow space-y-4">
          {/* Product Name Section */}
          <div className="space-y-3">
            <h3 className={cn(
              "text-xl font-bold line-clamp-1",
              isUrdu ? "font-urdu" : "font-display",
              dir === 'rtl' && "text-right"
            )}>
              {isUrdu ? product.nameUrdu : product.name}
            </h3>
            
            {/* Alternate Language Name */}
            <p className={cn(
              "text-sm text-gray-500 line-clamp-1",
              isUrdu ? "font-display" : "font-urdu",
              dir === 'rtl' && "text-right"
            )}>
              {isUrdu ? product.name : product.nameUrdu}
            </p>
          </div>
          
          {/* Description */}
          <div className="min-h-[60px]">
            <p className={cn(
              "text-sm text-gray-600 line-clamp-3",
              isUrdu && "font-urdu leading-relaxed",
              dir === 'rtl' && "text-right"
            )}>
              {isUrdu ? product.descriptionUrdu : product.descriptionEn || 
                (isUrdu 
                  ? "اعلیٰ معیار کا تازہ پروڈکٹ۔ خاندانی کاروبار سے براہ راست۔"
                  : "Premium quality fresh product. Direct from family business."
                )
              }
            </p>
          </div>
          
          {/* Unit and Details Row */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <Package className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {product.unit === 'maan' ? t("products.unitMaan") : t("products.unitKg")}
              </span>
            </div>
            
            {/* Quality Badge */}
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              <Star className="h-3 w-3 mr-1" />
              {isUrdu ? "اعلیٰ معیار" : "Premium"}
            </Badge>
          </div>

          {/* Price Section - Prominent */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {t("products.rs")} {product.price}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <span className={cn(isUrdu && "font-urdu", dir === 'rtl' && "text-right")}>
                    {isUrdu ? priceUnitUrdu : priceUnit}
                  </span>
                </div>
              </div>
              
              {/* Discount/Special Tag if any */}
              {product.price && parseInt(product.price) > 100 && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  {isUrdu ? "خاص پیشکش" : "Special Offer"}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons - Fixed at bottom */}
        <CardFooter className="p-5 pt-0 mt-auto grid grid-cols-2 gap-3">
          <Button 
            asChild
            className="w-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#0daa66] text-white shadow-md hover:shadow-lg transition-all duration-300"
            size="lg"
          >
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <SiWhatsapp className="mr-2 h-5 w-5" />
              <span className="font-semibold">
                {isUrdu ? "واٹس ایپ" : "WhatsApp"}
              </span>
            </a>
          </Button>
          
          <Button 
            asChild
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300"
            size="lg"
          >
            <a 
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center"
            >
              <Phone className="mr-2 h-5 w-5" />
              <span className="font-semibold">
                {isUrdu ? "کال کریں" : "Call Now"}
              </span>
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}