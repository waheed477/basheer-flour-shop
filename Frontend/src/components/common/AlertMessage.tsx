import * as React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export type AlertVariant = "success" | "error" | "warning" | "info" | "destructive"

export interface AlertMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  description?: string
  dismissible?: boolean
  onDismiss?: () => void
  showIcon?: boolean
  action?: React.ReactNode
  autoDismiss?: number // milliseconds
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800 [&>svg]:text-green-500",
    iconClassName: "text-green-500",
  },
  error: {
    icon: XCircle,
    className: "bg-red-50 border-red-200 text-red-800 [&>svg]:text-red-500",
    iconClassName: "text-red-500",
  },
  warning: {
    icon: AlertCircle,
    className: "bg-amber-50 border-amber-200 text-amber-800 [&>svg]:text-amber-500",
    iconClassName: "text-amber-500",
  },
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800 [&>svg]:text-blue-500",
    iconClassName: "text-blue-500",
  },
  destructive: {
    icon: XCircle,
    className: "bg-destructive/10 border-destructive/20 text-destructive-foreground [&>svg]:text-destructive",
    iconClassName: "text-destructive",
  },
}

export function AlertMessage({
  className,
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
  showIcon = true,
  action,
  autoDismiss,
  children,
  ...props
}: AlertMessageProps) {
  const [isVisible, setIsVisible] = React.useState(true)
  const config = variantConfig[variant]
  const Icon = config.icon

  React.useEffect(() => {
    if (autoDismiss && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onDismiss?.()
      }, autoDismiss)
      return () => clearTimeout(timer)
    }
  }, [autoDismiss, isVisible, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div
      role="alert"
      className={cn(
        "relative rounded-lg border p-4",
        config.className,
        className
      )}
      aria-live={variant === "error" || variant === "destructive" ? "assertive" : "polite"}
      aria-atomic="true"
      {...props}
    >
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon
            className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconClassName)}
            aria-hidden="true"
          />
        )}
        <div className="flex-1 space-y-1">
          {title && (
            <h5 className="font-semibold leading-none tracking-tight">
              {title}
            </h5>
          )}
          {description && (
            <p className="text-sm [&_p]:leading-relaxed">{description}</p>
          )}
          {children}
        </div>
        {(dismissible || action) && (
          <div className="flex items-center gap-2">
            {action}
            {dismissible && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 -mr-2 -mt-2 text-current hover:bg-current/10"
                onClick={handleDismiss}
                aria-label="Dismiss alert"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Toast-style alert (floating)
export function ToastAlert({
  variant = "info",
  title,
  description,
  onDismiss,
  className,
}: Omit<AlertMessageProps, "dismissible" | "showIcon">) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-full max-w-sm animate-in slide-in-from-bottom-full",
        className
      )}
      role="alert"
    >
      <AlertMessage
        variant={variant}
        title={title}
        description={description}
        dismissible
        onDismiss={onDismiss}
        showIcon
      />
    </div>
  )
}

// Inline alert for form validation
export function InlineAlert({
  variant = "error",
  message,
  className,
}: {
  variant?: AlertVariant
  message?: string
  className?: string
}) {
  if (!message) return null

  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-sm rounded-md px-3 py-2",
        config.className,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}

// Banner alert (full width)
export function BannerAlert({
  variant = "info",
  title,
  description,
  action,
  className,
}: Omit<AlertMessageProps, "dismissible" | "showIcon">) {
  const config = variantConfig[variant]

  return (
    <div
      className={cn(
        "w-full border-y py-3",
        config.className,
        className
      )}
      role="banner"
      aria-label={`${variant} banner`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <config.icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              {title && (
                <p className="font-semibold">{title}</p>
              )}
              {description && (
                <p className="text-sm opacity-90">{description}</p>
              )}
            </div>
          </div>
          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertMessage