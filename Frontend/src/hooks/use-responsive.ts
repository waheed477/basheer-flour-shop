import { useState, useEffect } from "react"
import { breakpoints } from "@/utils/responsive"

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Set initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = windowSize.width < breakpoints.md
  const isTablet = windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg
  const isDesktop = windowSize.width >= breakpoints.lg
  const isWide = windowSize.width >= breakpoints.xl

  const currentBreakpoint = (() => {
    if (windowSize.width < breakpoints.sm) return 'xs'
    if (windowSize.width < breakpoints.md) return 'sm'
    if (windowSize.width < breakpoints.lg) return 'md'
    if (windowSize.width < breakpoints.xl) return 'lg'
    if (windowSize.width < breakpoints['2xl']) return 'xl'
    return '2xl'
  })()

  return {
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    isWide,
    breakpoint: currentBreakpoint,
    // Helper for conditional rendering
    render: {
      mobile: <T,>(mobile: T, other: T) => isMobile ? mobile : other,
      tablet: <T,>(tablet: T, other: T) => isTablet ? tablet : other,
      desktop: <T,>(desktop: T, other: T) => isDesktop ? desktop : other,
    }
  }
}

// Hook for touch device detection
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }

    checkTouch()
    window.addEventListener('touchstart', checkTouch)
    
    return () => window.removeEventListener('touchstart', checkTouch)
  }, [])

  return isTouch
}

// Hook for safe area insets (notch handling)
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    const updateSafeArea = () => {
      setSafeArea({
        top: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top')) || 0,
        bottom: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom')) || 0,
        left: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left')) || 0,
        right: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-right')) || 0,
      })
    }

    updateSafeArea()
    window.addEventListener('resize', updateSafeArea)
    
    return () => window.removeEventListener('resize', updateSafeArea)
  }, [])

  return safeArea
}