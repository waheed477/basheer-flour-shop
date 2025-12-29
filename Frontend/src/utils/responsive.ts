/**
 * Responsive breakpoints and utilities for Flour Shop
 */

// Breakpoint values (must match tailwind.config.ts)
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Responsive layout configurations
export const responsiveLayouts = {
  // Product grid columns
  productGrid: {
    mobile: 1,      // Stack on mobile
    tablet: 2,      // 2 columns on tablet
    desktop: 3,     // 3 columns on desktop
    wide: 4,        // 4 columns on wide screens
  },
  
  // Admin dashboard columns
  adminGrid: {
    mobile: 1,
    tablet: 1,
    desktop: 2,
    wide: 3,
  },
  
  // Form layouts
  formLayout: {
    mobile: 'stacked',   // All fields stacked
    tablet: 'split',     // Split 2-column for larger fields
    desktop: 'grid',     // Grid layout
  },
  
  // Navigation
  navigation: {
    mobile: 'drawer',    // Hamburger menu
    tablet: 'compact',   // Compact nav
    desktop: 'full',     // Full navigation
  },
} as const;

// Touch-friendly dimensions
export const touchSizes = {
  minHeight: 44,    // Minimum touch target height (px)
  minWidth: 44,     // Minimum touch target width (px)
  padding: 12,      // Minimum touch target padding (px)
  margin: 8,        // Minimum spacing between touch targets (px)
};

// Responsive CSS class generators
export const responsiveClasses = {
  // Grid columns
  gridCols: (cols: { mobile?: number; tablet?: number; desktop?: number; wide?: number }) => {
    return [
      cols.mobile && `grid-cols-${cols.mobile}`,
      cols.tablet && `md:grid-cols-${cols.tablet}`,
      cols.desktop && `lg:grid-cols-${cols.desktop}`,
      cols.wide && `xl:grid-cols-${cols.wide}`,
    ].filter(Boolean).join(' ');
  },
  
  // Flex direction
  flexDirection: (dir: { mobile?: string; tablet?: string; desktop?: string }) => {
    return [
      dir.mobile && `flex-${dir.mobile}`,
      dir.tablet && `md:flex-${dir.tablet}`,
      dir.desktop && `lg:flex-${dir.desktop}`,
    ].filter(Boolean).join(' ');
  },
  
  // Spacing
  spacing: (size: { mobile?: string; tablet?: string; desktop?: string }) => {
    return [
      size.mobile && `gap-${size.mobile}`,
      size.tablet && `md:gap-${size.tablet}`,
      size.desktop && `lg:gap-${size.desktop}`,
    ].filter(Boolean).join(' ');
  },
  
  // Text sizes
  textSize: (size: { mobile?: string; tablet?: string; desktop?: string }) => {
    return [
      size.mobile && `text-${size.mobile}`,
      size.tablet && `md:text-${size.tablet}`,
      size.desktop && `lg:text-${size.desktop}`,
    ].filter(Boolean).join(' ');
  },
};

// Hook to detect screen size
export function useBreakpoint() {
  // This would be implemented with a useEffect and resize listener
  // For now, returns a mock implementation
  return {
    isMobile: () => window.innerWidth < breakpoints.md,
    isTablet: () => window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg,
    isDesktop: () => window.innerWidth >= breakpoints.lg,
    isWide: () => window.innerWidth >= breakpoints.xl,
    current: 'desktop' as Breakpoint, // This would be dynamic
  };
}

// Touch-friendly button classes
export const touchButtonClasses = `
  min-h-[44px] 
  min-w-[44px] 
  px-4 
  py-2 
  md:px-3 
  md:py-1.5 
  lg:px-4 
  lg:py-2
  active:scale-95 
  transition-transform
  touch-manipulation
`;

// Responsive container classes
export const responsiveContainer = `
  container 
  mx-auto 
  px-4 
  sm:px-6 
  md:px-8 
  lg:px-12 
  xl:px-16
`;

// Mobile-first utility classes
export const mobileFirst = {
  hideOnMobile: 'hidden sm:block',
  hideOnTablet: 'hidden md:block',
  hideOnDesktop: 'hidden lg:block',
  showOnMobile: 'block sm:hidden',
  showOnTablet: 'block md:hidden',
  showOnDesktop: 'block lg:hidden',
};

export default {
  breakpoints,
  responsiveLayouts,
  touchSizes,
  responsiveClasses,
  useBreakpoint,
  touchButtonClasses,
  responsiveContainer,
  mobileFirst,
};