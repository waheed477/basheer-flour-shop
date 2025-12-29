import * as React from "react"
import { cn } from "@/lib/utils"
import { ResponsiveGrid, ResponsiveCardGrid } from "@/components/layout/ResponsiveGrid"
import { ProductCard } from "./ProductCard"
import type { Product } from "@shared/schema"
import { useBreakpoint } from "@/utils/responsive"

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  showCategoryFilter?: boolean
  itemsPerPage?: number
}

export function ProductGrid({
  className,
  products,
  loading = false,
  emptyMessage = "No products found",
  showCategoryFilter = false,
  itemsPerPage = 12,
  ...props
}: ProductGridProps) {
  const breakpoint = useBreakpoint()
  
  // Calculate items to show based on screen size
  const getItemsToShow = () => {
    if (breakpoint.isMobile()) return Math.min(4, itemsPerPage)
    if (breakpoint.isTablet()) return Math.min(8, itemsPerPage)
    return itemsPerPage
  }

  const displayedProducts = products.slice(0, getItemsToShow())

  if (loading) {
    return (
      <ResponsiveGrid type="products" className={cn("animate-pulse", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted rounded-lg"
            aria-label="Loading product"
          />
        ))}
      </ResponsiveGrid>
    )
  }

  if (displayedProducts.length === 0) {
    return (
      <div className={cn("text-center py-12", className)} {...props}>
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {showCategoryFilter && (
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm">
            All Products
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm">
            Wheat
          </button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm">
            Flour
          </button>
        </div>
      )}
      
      <ResponsiveCardGrid>
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="h-full"
          />
        ))}
      </ResponsiveCardGrid>
      
      {/* Load more button for mobile */}
      {products.length > displayedProducts.length && (
        <div className="text-center pt-6">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium touch-target">
            Load More Products
          </button>
        </div>
      )}
    </div>
  )
}

// Mobile-optimized product list
export function MobileProductList({
  products,
  className,
  ...props
}: Omit<ProductGridProps, 'loading' | 'emptyMessage'>) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {products.map((product) => (
        <div
          key={product.id}
          className="flex gap-4 p-4 bg-card rounded-lg border"
        >
          <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0">
            {/* Product image placeholder */}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.descriptionEn}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-primary">
                Rs {product.price} / {product.unit}
              </span>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm touch-target">
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid