import * as React from "react"
import { useLocation } from "wouter"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Wheat, 
  Package, // ✅ Used for flour
  Settings, 
  Plus, 
  Home // ✅ For compact version
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language"

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  variant: "default" | "secondary" | "outline" | "destructive"
  onClick: () => void
  color: string
}

export interface QuickActionsProps {
  className?: string
  onAddFlour?: () => void
  onAddWheat?: () => void
  onSettings?: () => void
}

export function QuickActions({
  className,
  onAddFlour,
  onAddWheat,
  onSettings,
}: QuickActionsProps) {
  const { t, dir } = useLanguage()
  const [, setLocation] = useLocation()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Default handlers that use navigation
  const handleAddFlour = onAddFlour || (() => setLocation("/admin/products/new?category=flour"))
  const handleAddWheat = onAddWheat || (() => setLocation("/admin/products/new?category=wheat"))
  const handleSettings = onSettings || (() => setLocation("/admin/settings"))

  const actions: QuickAction[] = [
    {
      id: "add-flour",
      title: t("products.flour"),
      description: dir === 'ltr' ? "Add new flour product" : "نئی آٹے کی مصنوعات شامل کریں",
      icon: <Package className="h-5 w-5" />, // ✅ Package for flour
      variant: "default",
      onClick: handleAddFlour,
      color: "bg-blue-500",
    },
    {
      id: "add-wheat",
      title: t("products.wheat"),
      description: dir === 'ltr' ? "Add new wheat product" : "نئی گندم کی مصنوعات شامل کریں",
      icon: <Wheat className="h-5 w-5" />,
      variant: "default",
      onClick: handleAddWheat,
      color: "bg-amber-500",
    },
    {
      id: "settings",
      title: dir === 'ltr' ? "Settings" : "ترتیبات",
      description: dir === 'ltr' ? "Update shop information" : "دکان کی معلومات اپ ڈیٹ کریں",
      icon: <Settings className="h-5 w-5" />,
      variant: "secondary",
      onClick: handleSettings,
      color: "bg-purple-500",
    }
  ]

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          {dir === 'ltr' ? 'Quick Actions' : 'فوری اقدامات'}
        </CardTitle>
        <CardDescription>
          {dir === 'ltr' 
            ? 'Frequently used actions for managing your shop' 
            : 'اپنی دکان کے انتظام کے لیے اکثر استعمال ہونے والے اقدامات'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"
        )}>
          {actions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              onClick={action.onClick}
              className={cn(
                "h-auto py-4 px-4 justify-start gap-3 touch-target",
                "text-left normal-case transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                isMobile ? "min-h-[80px]" : "min-h-[100px]"
              )}
            >
              <div className={cn(
                "p-2 rounded-full",
                action.variant === "default" ? "bg-white/20" : "bg-muted"
              )}>
                {action.icon}
              </div>
              <div className="flex-1 text-left" dir={dir}>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.description}
                </div>
              </div>
              <Plus className={cn(
                "h-4 w-4 opacity-50",
                dir === 'rtl' ? "mr-auto ml-0" : "ml-auto mr-0"
              )} />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Compact version for smaller spaces
export function CompactQuickActions({
  className,
  onAddFlour,
  onAddWheat,
  onSettings,
}: Pick<QuickActionsProps, 'className' | 'onAddFlour' | 'onAddWheat' | 'onSettings'>) {
  const { t, dir } = useLanguage()
  const [, setLocation] = useLocation()
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleAddFlour = onAddFlour || (() => setLocation("/admin/products/new?category=flour"))
  const handleAddWheat = onAddWheat || (() => setLocation("/admin/products/new?category=wheat"))
  const handleSettings = onSettings || (() => setLocation("/admin/settings"))

  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      isMobile ? "justify-center" : "justify-start",
      className
    )}>
      <Button
        onClick={handleAddFlour}
        size={isMobile ? "default" : "sm"}
        className="gap-2 touch-target"
      >
        <Package className="h-4 w-4" /> {/* ✅ Package for flour */}
        <span className={isMobile ? "" : "hidden lg:inline"}>
          {dir === 'ltr' ? 'Add Flour' : 'آٹا شامل کریں'}
        </span>
      </Button>
      <Button
        onClick={handleAddWheat}
        size={isMobile ? "default" : "sm"}
        className="gap-2 touch-target"
        variant="secondary"
      >
        <Wheat className="h-4 w-4" />
        <span className={isMobile ? "" : "hidden lg:inline"}>
          {dir === 'ltr' ? 'Add Wheat' : 'گندم شامل کریں'}
        </span>
      </Button>
      <Button
        onClick={handleSettings}
        size={isMobile ? "default" : "sm"}
        className="gap-2 touch-target"
        variant="outline"
      >
        <Settings className="h-4 w-4" />
        <span className={isMobile ? "" : "hidden lg:inline"}>
          {dir === 'ltr' ? 'Settings' : 'ترتیبات'}
        </span>
      </Button>
    </div>
  )
}

export default QuickActions