import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "primary" | "secondary" | "white"
  text?: string
  fullScreen?: boolean
  overlay?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
}

const variantClasses = {
  default: "text-primary",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  white: "text-white",
}

export function LoadingSpinner({
  className,
  size = "md",
  variant = "default",
  text,
  fullScreen = false,
  overlay = false,
  ...props
}: LoadingSpinnerProps) {
  const spinner = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "min-h-screen",
        overlay && "absolute inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <Loader2
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          "animate-spin"
        )}
        aria-hidden="true"
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse" aria-live="polite">
          {text}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  )

  return spinner
}

// Inline spinner for buttons and small spaces
export function InlineSpinner({ className, size = "sm", variant = "default" }: Omit<LoadingSpinnerProps, "text" | "fullScreen" | "overlay">) {
  return (
    <Loader2
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        "animate-spin",
        className
      )}
      aria-label="Loading"
    />
  )
}

// Page loader with progress bar
export function PageLoader({ progress, message }: { progress?: number; message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Loading...</span>
            {progress !== undefined && (
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            )}
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            {progress !== undefined && (
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            )}
          </div>
        </div>
        {message && (
          <p className="text-center text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

// Skeleton loader for content placeholders
export function SkeletonLoader({
  className,
  count = 1,
  height = "h-4",
  width = "w-full",
}: {
  className?: string
  count?: number
  height?: string
  width?: string
}) {
  return (
    <div className="space-y-3" aria-label="Loading content" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-md bg-muted",
            height,
            width,
            className
          )}
        />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

export default LoadingSpinner