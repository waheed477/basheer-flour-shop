import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { api } from "@/services/api";

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

  // Auto slide every 3 seconds
  useEffect(() => {
    if (images.length <= 1 || isHovering) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoSlideInterval);
    
    return () => clearInterval(interval);
  }, [images.length, isHovering, autoSlideInterval]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    const newDirection = index > currentIndex ? 1 : -1;
    setDirection(newDirection);
    setCurrentIndex(index);
  };

  // Filter valid images
  const validImages = images.filter(img => img && img.trim() !== '');
  if (validImages.length === 0) return null;

  // Right-to-left slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div 
      className={cn("relative w-full overflow-hidden bg-gray-50", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Slider Container */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.5 
              },
              opacity: { duration: 0.4 }
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={api.uploads.getImageUrl(validImages[currentIndex])}
              alt={`Shop Image ${currentIndex + 1}`}
              className="w-auto h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://via.placeholder.com/800x450/cccccc/666666?text=Image+${currentIndex+1}`;
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Auto Slide Indicator */}
        {!isHovering && validImages.length > 1 && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Auto</span>
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {showArrows && validImages.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 
                     bg-black/40 hover:bg-black/60 backdrop-blur-sm 
                     text-white border-0 
                     h-12 w-12 rounded-full shadow-xl hover:shadow-2xl
                     transition-all duration-300"
            onClick={prevSlide}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 
                     bg-black/40 hover:bg-black/60 backdrop-blur-sm 
                     text-white border-0 
                     h-12 w-12 rounded-full shadow-xl hover:shadow-2xl
                     transition-all duration-300"
            onClick={nextSlide}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && validImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
            {validImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 hover:scale-125",
                  idx === currentIndex 
                    ? "bg-white w-8" 
                    : "bg-white/50 hover:bg-white"
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {!isHovering && validImages.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: autoSlideInterval / 1000,
              ease: "linear" 
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
}