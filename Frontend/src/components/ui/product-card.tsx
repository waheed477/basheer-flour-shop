import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t, language } = useLanguage();
  const isUrdu = language === "ur";

  const whatsappNumber = "923001234567"; // Replace with actual shop number
  const phoneNumber = "+923001234567"; // Replace with actual shop number
  
  const productLabel = isUrdu ? product.nameUrdu : product.name;
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in buying ${productLabel} (Price: Rs. ${product.price}) from Basheer Flour Shop.`);

  // Determine price unit based on category
  const isWheat = product.category === "wheat";
  const priceUnit = isWheat ? "per Maan (40 Kg)" : "per Kg";
  const priceUnitUrdu = isWheat ? "فی من (40 کلو)" : "فی کلو";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col group">
        <div className="aspect-[4/3] overflow-hidden bg-secondary relative">
          <img 
            src={product.image || "https://placehold.co/600x400/e8dcb5/5c4033?text=Wheat+Product"} 
            alt={isUrdu ? product.nameUrdu : product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white shadow-sm backdrop-blur-sm">
            {isWheat ? t("products.wheat") : t("products.flour")}
          </Badge>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <div className="flex flex-col gap-1 mb-2">
            <h3 className={`text-xl font-bold ${isUrdu ? "font-urdu" : "font-display"}`}>
              {isUrdu ? product.nameUrdu : product.name}
            </h3>
            {isUrdu && (
              <span className="text-sm font-display text-muted-foreground">
                {product.name}
              </span>
            )}
            {!isUrdu && (
              <span className="text-sm font-urdu text-muted-foreground">
                {product.nameUrdu}
              </span>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-muted-foreground text-sm line-clamp-2">
              {isUrdu ? product.descriptionUrdu : product.descriptionEn}
            </p>
            {isWheat && (
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                {t("products.maanUnit")}
              </Badge>
            )}
          </div>

          {/* PRICE SECTION - Updated with proper units */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {t("products.rs")} {product.price}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{isUrdu ? priceUnitUrdu : priceUnit}</span>
            </div>
          </div>
        </CardContent>

        {/* BUTTONS - Simplified text */}
        <CardFooter className="p-5 pt-0 mt-auto grid grid-cols-2 gap-2">
          <Button 
            asChild
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-0"
          >
            <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
              <SiWhatsapp className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </Button>
          <Button 
            asChild
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
          >
            <a href={`tel:${phoneNumber}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}