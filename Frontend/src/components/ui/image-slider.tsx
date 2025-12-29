"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ImageSliderProps {
  images: string[];
  autoSlideInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  showZoomControls?: boolean;
  className?: string;
  fitMode?: "cover" | "contain" | "fill";
}

export default function ImageSlider({
  images,
  autoSlideInterval = 3000,
  showDots = true,
  showArrows = true,
  showZoomControls = true,
  className = "",
  fitMode = "contain", // ✅ Changed from "cover" to "contain" for full image view
}: ImageSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // ✅ Added zoom control

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;

    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlideInterval, isPaused]);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
return `${baseUrl}/uploads/${imagePath}`;
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 1));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div 
      className={cn("relative w-full overflow-hidden rounded-2xl shadow-2xl group", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      onDoubleClick={resetZoom} // Double click to reset zoom
    >
      {/* Zoom Controls */}
      {showZoomControls && (
        <div className="absolute top-4 left-4 bg-black/60 text-white rounded-full flex items-center gap-1 px-3 py-2 z-20">
          <button
            onClick={zoomOut}
            className="p-1 hover:bg-white/20 rounded-full"
            aria-label="Zoom Out"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm px-2 cursor-pointer" onClick={resetZoom}>
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-1 hover:bg-white/20 rounded-full"
            aria-label="Zoom In"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Slider Container */}
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900">
        {images.length === 0 ? (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-gray-400">No images available</p>
          </div>
        ) : (
          images.map((image, index) => {
            const imageUrl = getImageUrl(image);
            
            return (
              <motion.div
                key={index}
                className={cn(
                  "absolute inset-0 w-full h-full transition-all duration-500 ease-in-out flex items-center justify-center",
                  index === currentSlide ? "opacity-100" : "opacity-0"
                )}
                initial={false}
                animate={{
                  x: index === currentSlide ? 0 : index > currentSlide ? "100%" : "-100%",
                  opacity: index === currentSlide ? 1 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.img
                    src={imageUrl}
                    alt={`Shop Image ${index + 1}`}
                    className={cn(
                      "transition-transform duration-300",
                      fitMode === "cover" && "object-cover",
                      fitMode === "contain" && "object-contain", // ✅ Full image view
                      fitMode === "fill" && "object-fill"
                    )}
                    style={{
                      transform: `scale(${zoomLevel})`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: fitMode === "contain" ? "auto" : "100%",
                      height: fitMode === "contain" ? "auto" : "100%",
                    }}
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${imageUrl}`);
                      e.currentTarget.src = `https://via.placeholder.com/800x600/333333/666666?text=Image+${index+1}`;
                    }}
                  />
                  {/* Gradient Overlay - Lighter for better visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            );
          })
        )}

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {currentSlide + 1} / {images.length}
        </div>

        {/* Arrows */}
        {showArrows && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Slide hint for mobile */}
        <div className="md:hidden absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 text-sm z-10">
          ← Swipe →
        </div>
      </div>

      {/* Dots Navigation */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index === currentSlide 
                  ? "bg-white w-6" 
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}