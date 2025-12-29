import * as React from "react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, ButtonProps } from "@/components/ui/button"
import { LoadingSpinner } from "./LoadingSpinner"
import { AlertCircle, Trash2, LogOut, XCircle, AlertTriangle } from "lucide-react"

export type ConfirmVariant = "delete" | "warning" | "info" | "danger" | "success"

export interface ConfirmDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => Promise<void> | void
  onCancel?: () => void
  variant?: ConfirmVariant
  loading?: boolean
  disabled?: boolean
  destructive?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  confirmButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  icon?: React.ReactNode
  requireTyping?: boolean // Require user to type something to confirm
  confirmationText?: string // Text user must type to confirm
}

const variantConfig = {
  delete: {
    icon: Trash2,
    confirmColor: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    iconColor: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    confirmColor: "bg-amber-500 text-amber-50 hover:bg-amber-500/90",
    iconColor: "text-amber-500",
  },
  info: {
    icon: AlertCircle,
    confirmColor: "bg-blue-500 text-blue-50 hover:bg-blue-500/90",
    iconColor: "text-blue-500",
  },
  danger: {
    icon: XCircle,
    confirmColor: "bg-red-500 text-red-50 hover:bg-red-500/90",
    iconColor: "text-red-500",
  },
  success: {
    icon: AlertCircle, // Using AlertCircle for success as well
    confirmColor: "bg-green-500 text-green-50 hover:bg-green-500/90",
    iconColor: "text-green-500",
  },
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  variant = "delete",
  loading = false,
  disabled = false,
  destructive = true,
  open,
  onOpenChange,
  className,
  confirmButtonProps,
  cancelButtonProps,
  icon,
  requireTyping = false,
  confirmationText = "DELETE",
  ...props
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [typedText, setTypedText] = React.useState("")
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen

  const config = variantConfig[variant]
  const Icon = icon || config.icon

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
    
    if (!newOpen) {
      setTypedText("") // Reset typed text when dialog closes
      onCancel?.()
    }
  }

  const handleConfirm = async () => {
    if (requireTyping && typedText !== confirmationText) {
      return
    }
    
    try {
      await onConfirm()
      handleOpenChange(false)
    } catch (error) {
      // Error handling is up to the parent component
      console.error("Confirm action failed:", error)
    }
  }

  const canConfirm = !requireTyping || typedText === confirmationText

  return (
    <AlertDialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className={cn("max-w-md", className)} {...props}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", config.iconColor, "bg-opacity-10")}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">{title}</AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {requireTyping && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type <code className="px-2 py-1 bg-muted rounded text-destructive font-mono">{confirmationText}</code> to confirm:
            </p>
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder={`Type "${confirmationText}"`}
              aria-label="Confirmation text input"
            />
            {typedText && typedText !== confirmationText && (
              <p className="text-sm text-destructive" role="alert">
                Text does not match
              </p>
            )}
          </div>
        )}

        <AlertDialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <AlertDialogCancel asChild onClick={onCancel} {...cancelButtonProps}>
            <Button variant="outline" disabled={loading}>
              {cancelText || "Cancel"}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild onClick={handleConfirm} disabled={loading || disabled || !canConfirm}>
            <Button
              className={cn(
                destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                !destructive && config.confirmColor
              )}
              {...confirmButtonProps}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" variant="white" className="mr-2" />
                  Processing...
                </>
              ) : (
                confirmText || (variant === "delete" ? "Delete" : "Confirm")
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Quick delete confirmation dialog
export function DeleteConfirm({
  itemName,
  onConfirm,
  trigger,
  ...props
}: Omit<ConfirmDialogProps, "title" | "description" | "variant"> & {
  itemName: string
}) {
  return (
    <ConfirmDialog
      trigger={trigger}
      title={`Delete ${itemName}`}
      description={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      variant="delete"
      confirmText="Delete"
      destructive
      onConfirm={onConfirm}
      {...props}
    />
  )
}

// Logout confirmation dialog
export function LogoutConfirm({
  onConfirm,
  trigger,
  ...props
}: Omit<ConfirmDialogProps, "title" | "description" | "variant" | "icon">) {
  return (
    <ConfirmDialog
      trigger={trigger}
      title="Log Out"
      description="Are you sure you want to log out? You'll need to log in again to access admin features."
      variant="warning"
      icon={LogOut}
      confirmText="Log Out"
      onConfirm={onConfirm}
      {...props}
    />
  )
}

// Danger zone confirmation (for critical actions)
export function DangerZoneConfirm({
  title,
  description,
  onConfirm,
  trigger,
  requireTyping = true,
  confirmationText = "CONFIRM",
  ...props
}: ConfirmDialogProps) {
  return (
    <ConfirmDialog
      trigger={trigger}
      title={title}
      description={description}
      variant="danger"
      confirmText="Proceed"
      destructive
      requireTyping={requireTyping}
      confirmationText={confirmationText}
      onConfirm={onConfirm}
      {...props}
    />
  )
}

// Hook for using confirm dialog programmatically
export function useConfirm() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState<Partial<ConfirmDialogProps>>({})
  const [resolvePromise, setResolvePromise] = React.useState<((value: boolean) => void) | null>(null)

  const confirm = (config: Partial<ConfirmDialogProps>): Promise<boolean> => {
    setConfig(config)
    setIsOpen(true)
    
    return new Promise((resolve) => {
      setResolvePromise(() => resolve)
    })
  }

  const handleConfirm = async () => {
    if (config.onConfirm) {
      await config.onConfirm()
    }
    resolvePromise?.(true)
    setIsOpen(false)
    setConfig({})
  }

  const handleCancel = () => {
    config.onCancel?.()
    resolvePromise?.(false)
    setIsOpen(false)
    setConfig({})
  }

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={<span />} // Hidden trigger
      title={config.title || "Confirm Action"}
      description={config.description || "Are you sure you want to proceed?"}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      variant={config.variant}
      loading={config.loading}
      disabled={config.disabled}
    />
  )

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent,
  }
}

export default ConfirmDialog