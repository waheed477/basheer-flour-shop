import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageSliderProps {
  images: string[];
  autoSlideInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export default function ImageSlider({
  images,
  autoSlideInterval = 3000,
  showDots = true,
  showArrows = true,
  className = "",
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Filter valid images
  const validImages = images.filter(img => img && img.trim() !== '');
  if (validImages.length === 0) return null;

  // Auto slide
  useEffect(() => {
    if (validImages.length <= 1 || isHovering) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [validImages.length, isHovering, autoSlideInterval]);

  // ... rest of the component (navigation functions)

  return (
    <div 
      className={cn("relative w-full overflow-hidden bg-gray-50 rounded-2xl", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image */}
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={validImages[currentIndex]}  // DIRECT PATH USE KARENGE
              alt={`Shop Image ${currentIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback placeholder
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x450/cccccc/666666?text=Shop+${currentIndex+1}`;
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Rest of the component (arrows, dots, etc.) */}
    </div>
  );
}
