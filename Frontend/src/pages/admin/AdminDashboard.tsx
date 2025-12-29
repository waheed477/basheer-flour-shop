import { Link, useLocation } from "wouter";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useContacts, useUpdateContactStatus } from "@/hooks/use-contacts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wheat, Plus, Trash2, Edit2, LogOut, Home, CheckCircle, Clock, MailOpen, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { QuickActions } from "@/components/admin/QuickActions";
import ProductForm from "../../components/admin/ProductForm";
import { type Product } from "@/shared/schema";

// Admin Layout Component with Back to Home
function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t, dir } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-bold text-base sm:text-lg">{t("admin.dashboard")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Back to Home Button */}
            <Link href="/">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>
            
            {/* Logout Button */}
            <Link href="/admin/login">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1 sm:gap-2 text-muted-foreground hover:text-red-500 transition-colors"
                onClick={() => {
                  localStorage.removeItem('admin_token');
                  localStorage.removeItem('admin_user');
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t("nav.logout")}</span>
                <span className="sm:hidden">{t("nav.logout")}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        {children}
      </div>
    </div>
  );
}

// Updated ProductDialog component using ProductForm
function ProductDialog({ product, open, onOpenChange }: { product?: Product, open: boolean, onOpenChange: (open: boolean) => void }) {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      const productData = {
        ...data,
        stock: parseInt(data.stock),
      };

      if (product) {
        // Update existing product
        await updateMutation.mutateAsync({ id: product.id, ...productData });
        toast({
          title: "Success",
          description: "Product updated successfully",
          variant: "default",
        });
      } else {
        // Create new product
        await createMutation.mutateAsync(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
          variant: "default",
        });
      }
      
      onOpenChange(false);
    } catch (error: any) {
      // Error is handled by mutation, but we can show a toast here too
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={createMutation.isPending || updateMutation.isPending}
          mode={product ? "edit" : "create"}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function Dashboard() {
  const { data: products } = useProducts();
  const { data: contacts } = useContacts();
  const deleteProduct = useDeleteProduct();
  const updateContact = useUpdateContactStatus();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = [
    { 
      label: t("admin.products"), 
      value: products?.length || 0, 
      icon: Package, 
      color: "text-primary" 
    },
    { 
      label: t("admin.contacts"), 
      value: contacts?.filter(c => c.status === 'new').length || 0, 
      icon: MailOpen, 
      color: "text-blue-500" 
    },
    { 
      label: "Low Stock Items", 
      value: products?.filter(p => p.stock < 10).length || 0, 
      icon: Clock, 
      color: "text-orange-500" 
    },
  ];

  return (
    <AdminLayout>
      {/* Responsive Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm md:text-base font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mt-1 md:mt-2">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-2 md:p-3 rounded-full bg-secondary/50 ${stat.color}`}>
                  <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="mb-6 md:mb-8">
        <QuickActions
          onAddFlour={() => setLocation("/admin/products/new?category=flour")}
          onAddWheat={() => setLocation("/admin/products/new?category=wheat")}
          onSettings={() => setLocation("/admin/settings")}
          onViewCustomers={() => {
            // Switch to contacts tab
            setActiveTab("contacts");
          }}
          onViewStats={() => {
            // Switch to products tab (where stats are visible)
            setActiveTab("products");
          }}
        />
      </div>

      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border mb-4 md:mb-6">
          <TabsTrigger value="products" className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
            {t("admin.products")}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2">
            {t("admin.contacts")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div>
                <CardTitle className="text-xl sm:text-2xl">{t("admin.products")}</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  {t("admin.products")} {t("admin.dashboard")}
                </CardDescription>
              </div>
              <Button 
                onClick={() => { setEditingProduct(undefined); setIsDialogOpen(true); }} 
                className="gap-2"
                size={isMobile ? "touch" : "default"}
              >
                <Plus className="h-4 w-4" /> 
                <span className="hidden sm:inline">{t("admin.create")}</span>
                <span className="sm:hidden">{t("admin.create")}</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm sm:text-base">Name</TableHead>
                        <TableHead className="text-sm sm:text-base">Category</TableHead>
                        <TableHead className="text-sm sm:text-base">Price</TableHead>
                        <TableHead className="text-sm sm:text-base">Stock</TableHead>
                        <TableHead className="text-sm sm:text-base text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="text-sm sm:text-base">{product.name}</div>
                            <div className="text-xs text-muted-foreground font-urdu">{product.nameUrdu}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="w-fit text-xs sm:text-sm">
                                {product.category === 'wheat' ? t("products.wheat") : t("products.flour")}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {product.unit === 'maan' ? t("products.unitMaan") : t("products.unitKg")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            {t("products.rs")} {product.price} / {product.unit === 'maan' ? t("products.unitMaan") : t("products.unitKg")}
                          </TableCell>
                          <TableCell className="text-sm sm:text-base">
                            <span className={product.stock < 10 ? "text-orange-500 font-semibold" : ""}>
                              {product.stock} {product.unit === 'maan' ? t("products.maanUnit") : "units"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right space-x-1 sm:space-x-2">
                            <Button 
                              variant="ghost" 
                              size={isMobile ? "touch" : "icon"} 
                              onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}
                              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                            >
                              <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size={isMobile ? "touch" : "icon"}
                              onClick={() => deleteProduct.mutate(product.id)}
                              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">{t("admin.contacts")}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {t("admin.contacts")} {t("admin.dashboard")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="min-w-full inline-block align-middle">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm sm:text-base">Customer</TableHead>
                        <TableHead className="text-sm sm:text-base hidden sm:table-cell">Message</TableHead>
                        <TableHead className="text-sm sm:text-base">Status</TableHead>
                        <TableHead className="text-sm sm:text-base text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts?.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell>
                            <div className="font-medium text-sm sm:text-base">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{contact.email}</div>
                            <div className="text-xs text-muted-foreground">{contact.phone}</div>
                            <div className="sm:hidden text-xs mt-2 text-muted-foreground line-clamp-2">
                              {contact.message}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-md truncate hidden sm:table-cell">
                            {contact.message}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={contact.status === 'new' ? 'destructive' : contact.status === 'read' ? 'outline' : 'default'}
                              className="text-xs sm:text-sm"
                            >
                              {contact.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1 sm:space-x-2">
                            {contact.status === 'new' && (
                              <Button 
                                size={isMobile ? "touch" : "sm"} 
                                variant="outline" 
                                onClick={() => updateContact.mutate({ id: contact.id, status: 'read' })}
                                className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                              >
                                {isMobile ? 'Read' : 'Mark Read'}
                              </Button>
                            )}
                            {contact.status !== 'replied' && (
                              <Button 
                                size={isMobile ? "touch" : "sm"} 
                                onClick={() => updateContact.mutate({ id: contact.id, status: 'replied' })}
                                className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                              >
                                {isMobile ? 'Reply' : 'Mark Replied'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProductDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        product={editingProduct} 
      />
    </AdminLayout>
  );
}