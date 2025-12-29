import * as React from "react"
import { cn } from "@/lib/utils"
import { responsiveClasses, responsiveLayouts } from "@/utils/responsive"

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: {
    mobile?: number
    tablet?: number
    desktop?: number
    wide?: number
  }
  gap?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
  type?: 'products' | 'admin' | 'cards' | 'auto'
  autoFit?: boolean
  minItemWidth?: string
}

export function ResponsiveGrid({
  className,
  children,
  cols,
  gap = { mobile: '4', tablet: '6', desktop: '8' },
  type = 'products',
  autoFit = false,
  minItemWidth = '250px',
  ...props
}: ResponsiveGridProps) {
  // Use predefined layouts based on type
  const layoutCols = cols || (() => {
    switch (type) {
      case 'products':
        return {
          mobile: responsiveLayouts.productGrid.mobile,
          tablet: responsiveLayouts.productGrid.tablet,
          desktop: responsiveLayouts.productGrid.desktop,
          wide: responsiveLayouts.productGrid.wide,
        }
      case 'admin':
        return {
          mobile: responsiveLayouts.adminGrid.mobile,
          tablet: responsiveLayouts.adminGrid.tablet,
          desktop: responsiveLayouts.adminGrid.desktop,
          wide: responsiveLayouts.adminGrid.wide,
        }
      case 'cards':
        return {
          mobile: 1,
          tablet: 2,
          desktop: 3,
          wide: 4,
        }
      default:
        return {
          mobile: 1,
          tablet: 2,
          desktop: 3,
          wide: 4,
        }
    }
  })()

  const gridClasses = autoFit
    ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-fit`
    : responsiveClasses.gridCols(layoutCols)

  const gapClasses = responsiveClasses.spacing(gap)

  return (
    <div
      className={cn(
        "grid w-full",
        gridClasses,
        gapClasses,
        autoFit && `auto-fit-grid`,
        className
      )}
      style={
        autoFit
          ? {
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  )
}

// Stack layout for mobile
export function ResponsiveStack({
  className,
  children,
  direction = { mobile: 'col', tablet: 'row', desktop: 'row' },
  gap = { mobile: '4', tablet: '6', desktop: '8' },
  ...props
}: Omit<ResponsiveGridProps, 'cols' | 'type' | 'autoFit'> & {
  direction?: {
    mobile?: 'row' | 'col'
    tablet?: 'row' | 'col'
    desktop?: 'row' | 'col'
  }
}) {
  const directionClasses = responsiveClasses.flexDirection(direction)
  const gapClasses = responsiveClasses.spacing(gap)

  return (
    <div
      className={cn("flex w-full", directionClasses, gapClasses, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Responsive card container
export function ResponsiveCardGrid({
  className,
  children,
  ...props
}: ResponsiveGridProps) {
  return (
    <ResponsiveGrid
      type="cards"
      gap={{ mobile: '4', tablet: '6', desktop: '8' }}
      className={cn("auto-rows-fr", className)}
      {...props}
    >
      {children}
    </ResponsiveGrid>
  )
}

// Touch-friendly container with safe areas
export function SafeAreaContainer({
  className,
  children,
  includeSafeAreas = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  includeSafeAreas?: boolean
}) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        includeSafeAreas && "safe-area-padding",
        "px-4 sm:px-6 md:px-8 lg:px-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default ResponsiveGrid