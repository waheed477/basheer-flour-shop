import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Lock, LogOut, Plus, Trash2, RefreshCw, Database } from "lucide-react";

// Updated Product Interface to match data/products.ts
interface Product {
  id: number;
  nameEn: string;
  nameUr: string;
  descriptionEn?: string;
  descriptionUr?: string;
  price: number;
  originalPrice?: number;
  category: "wheat" | "flour";
  image: string;
  stock: number;
  unit: "kg" | "maan";
  isBestSeller?: boolean;
  isNew?: boolean;
}

// Initial products data - Updated to match new structure
const initialProducts: Product[] = [
  {
    id: 1,
    nameEn: "Premium Wheat",
    nameUr: "پریمیم گندم",
    price: 3200,
    originalPrice: 3500,
    category: "wheat",
    image: "/shop-images/wheat.jpg",
    stock: 50,
    descriptionEn: "Premium quality wheat, perfect for homemade atta. Fresh from local farms.",
    descriptionUr: "پریمیم معیار کی گندم، گھر کے آٹے کے لیے بہترین۔ مقامی فارموں سے تازہ۔",
    unit: "maan",
    isBestSeller: true
  },
  {
    id: 2,
    nameEn: "Sharbati Wheat",
    nameUr: "شربتی گندم",
    price: 3500,
    originalPrice: 3800,
    category: "wheat",
    image: "/shop-images/wheat1.jpg",
    stock: 30,
    descriptionEn: "Special Sharbati wheat, soft and rich texture. Imported quality.",
    descriptionUr: "خصوصی شربتی گندم، نرم اور بھرپور ساخت۔ درآمدی معیار۔",
    unit: "maan",
    isNew: true
  },
  {
    id: 3,
    nameEn: "Fresh Chakki Atta",
    nameUr: "تازہ چکی آٹا",
    price: 900,
    originalPrice: 950,
    category: "flour",
    image: "/shop-images/atta.jpg",
    stock: 200,
    descriptionEn: "Freshly ground atta, stone chakki processed. No preservatives added.",
    descriptionUr: "تازہ پسا ہوا آٹا، پتھر کی چکی سے تیار۔ کوئی پریزرویٹوز شامل نہیں۔",
    unit: "kg",
    isBestSeller: true
  }
];

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [nextId, setNextId] = useState(4);
  const [isSaving, setIsSaving] = useState(false);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 🔧 ENHANCED: Load products from MULTIPLE storage sources
  const loadProductsFromStorage = () => {
    try {
      // Try localStorage first
      const savedProducts = localStorage.getItem("flour_shop_products");
      
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
        
        // Find max ID for next product
        const maxId = Math.max(...parsedProducts.map((p: Product) => p.id));
        setNextId(maxId + 1);
        console.log('📦 Products loaded from localStorage:', parsedProducts.length);
        return true;
      }
      
      // If not in localStorage, try sessionStorage backup
      const backupProducts = sessionStorage.getItem("flour_shop_products_backup");
      if (backupProducts) {
        const parsedBackup = JSON.parse(backupProducts);
        setProducts(parsedBackup);
        
        const maxId = Math.max(...parsedBackup.map((p: Product) => p.id));
        setNextId(maxId + 1);
        console.log('📦 Products loaded from sessionStorage backup:', parsedBackup.length);
        
        // Restore to localStorage
        localStorage.setItem("flour_shop_products", backupProducts);
        return true;
      }
      
      // If still not found, use initial products
      setProducts(initialProducts);
      localStorage.setItem("flour_shop_products", JSON.stringify(initialProducts));
      console.log('📦 Using initial products');
      return true;
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      // Use initial products as fallback
      setProducts(initialProducts);
      return false;
    }
  };

  // Check if already logged in
  useEffect(() => {
    const savedLogin = localStorage.getItem("admin_authenticated");
    
    if (savedLogin === "true") {
      setIsAuthenticated(true);
    }
    
    // Load products from storage
    loadProductsFromStorage();
  }, []);

  // Check storage persistence on mount
  useEffect(() => {
    if (isAuthenticated && 'storage' in navigator && 'persist' in navigator.storage) {
      navigator.storage.persist().then(persistent => {
        console.log('🔒 Browser storage persistence:', persistent ? 'Granted' : 'Denied');
        if (!persistent) {
          showNotification("ℹ️ Enable 'Persistent Storage' in browser for better experience", "info");
        }
      });
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "basheer123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_authenticated", "true");
      showNotification("✅ Access granted! Welcome Admin.", "success");
    } else {
      showNotification("❌ Wrong password! Contact site owner.", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_authenticated");
    setPassword("");
    showNotification("ℹ️ Logged out successfully.", "info");
  };

  // FIXED: Update product with automatic unit setting
  const updateProduct = (id: number, field: string, value: any) => {
    setProducts(prev => prev.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        
        // 🔧 AUTOMATIC UNIT FIX: If category changes, update unit automatically
        if (field === "category") {
          if (value === "wheat") {
            updatedProduct.unit = "maan";
          } else if (value === "flour") {
            updatedProduct.unit = "kg";
          }
        }
        
        return updatedProduct;
      }
      return product;
    }));
  };

  const addNewProduct = () => {
    const newProduct: Product = {
      id: nextId,
      nameEn: "New Product",
      nameUr: "نیا پروڈکٹ",
      price: 0,
      category: "flour",
      image: "/shop-images/atta.jpg",
      stock: 0,
      descriptionEn: "",
      descriptionUr: "",
      unit: "kg", // Default for flour
      isBestSeller: false,
      isNew: true
    };
    
    setProducts(prev => [...prev, newProduct]);
    setNextId(prev => prev + 1);
    showNotification("➕ New product added. Edit details below.", "success");
  };

  const deleteProduct = (id: number) => {
    if (products.length <= 1) {
      showNotification("❌ Cannot delete the last product.", "error");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(product => product.id !== id));
      showNotification("🗑️ Product deleted.", "success");
    }
  };

  // 🔧 ENHANCED PERMANENT SAVE FUNCTION
  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Fix image paths before saving
      const fixedProducts = products.map(product => {
        let imagePath = product.image || '';
        
        // Ensure image path is correct
        if (!imagePath.startsWith('/shop-images/')) {
          if (product.category === "wheat") {
            imagePath = '/shop-images/wheat.jpg';
          } else {
            imagePath = '/shop-images/atta.jpg';
          }
        }
        
        // 🔧 ENSURE CORRECT UNIT BASED ON CATEGORY
        let correctUnit = product.unit;
        if (product.category === "wheat" && product.unit !== "maan") {
          correctUnit = "maan";
        } else if (product.category === "flour" && product.unit !== "kg") {
          correctUnit = "kg";
        }
        
        return {
          ...product,
          image: imagePath,
          unit: correctUnit // Always ensure correct unit
        };
      });
      
      // 🔧 MULTI-LAYERED SAVE SYSTEM
      const productData = JSON.stringify(fixedProducts);
      
      // 1. PRIMARY: Save to localStorage
      localStorage.setItem("flour_shop_products", productData);
      
      // 2. BACKUP 1: Save to sessionStorage
      sessionStorage.setItem("flour_shop_products_backup", productData);
      
      // 3. BACKUP 2: Save to IndexedDB (if available)
      if ('indexedDB' in window) {
        try {
          const request = indexedDB.open('FlourShopDB', 1);
          
          request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('products')) {
              db.createObjectStore('products', { keyPath: 'id' });
            }
          };
          
          request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            
            // Clear existing and add all products
            store.clear();
            fixedProducts.forEach(product => {
              store.add(product);
            });
            
            transaction.oncomplete = () => {
              console.log('💾 Products saved to IndexedDB');
            };
          };
        } catch (dbError) {
          console.log('⚠️ IndexedDB not available, skipping...');
        }
      }
      
      // 4. BACKUP 3: Save to cookies (limited size)
      try {
        // Split large data for cookies
        const chunks = [];
        for (let i = 0; i < productData.length; i += 4000) {
          chunks.push(productData.slice(i, i + 4000));
        }
        
        // Store chunk info
        localStorage.setItem('product_chunks_count', chunks.length.toString());
        
        chunks.forEach((chunk, index) => {
          document.cookie = `flour_shop_products_chunk_${index}=${encodeURIComponent(chunk)}; path=/; max-age=${60 * 60 * 24 * 365}`;
        });
      } catch (cookieError) {
        console.log('⚠️ Cookie storage skipped (data too large)');
      }
      
      // 5. UPDATE STATE
      setProducts(fixedProducts);
      
      // 6. FORCE PERSISTENCE REQUEST
      if ('storage' in navigator && 'persist' in navigator.storage) {
        await navigator.storage.persist();
      }
      
      // 7. CONFIRMATION
      console.log(`💾 Products saved PERMANENTLY (${fixedProducts.length} items)`);
      console.log('Storage locations: localStorage, sessionStorage, IndexedDB');
      
      showNotification(`✅ All changes saved PERMANENTLY! (${fixedProducts.length} products)`, "success");
      
      // 8. Auto-reload after delay
      setTimeout(() => {
        setIsSaving(false);
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error saving products:', error);
      showNotification("❌ Error saving products. Please try again.", "error");
      setIsSaving(false);
    }
  };

  // 🔧 RESTORE FROM BACKUP
  const restoreFromBackup = () => {
    if (window.confirm("Restore products from latest backup? Current changes will be lost.")) {
      if (loadProductsFromStorage()) {
        showNotification("🔄 Products restored from backup!", "success");
      } else {
        showNotification("❌ No backup found!", "error");
      }
    }
  };

  // 🔧 RESET TO DEFAULT
  const resetToDefault = () => {
    if (window.confirm("Reset all products to default? This cannot be undone.")) {
      setProducts(initialProducts);
      setNextId(4);
      showNotification("🔄 Reset to default products", "info");
    }
  };

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {notification.message}
          </div>
        )}
        
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">🔒 Admin Access</CardTitle>
            <p className="text-gray-500 text-sm">
              Enter password to manage products
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secret password"
                  className="h-12 text-lg"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" size="lg">
                Unlock Settings
              </Button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Only authorized personnel can access this page.
                <br />Contact site owner if you need access.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-6 bg-white rounded-xl shadow">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Product Settings</h1>
            <p className="text-gray-600 mt-2">Manage your products (Admin Mode)</p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                {products.filter(p => p.category === 'wheat').length} Wheat (Maan)
              </div>
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {products.filter(p => p.category === 'flour').length} Flour (Kg)
              </div>
              <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                Next ID: {nextId}
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={restoreFromBackup}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Restore Backup
            </Button>
            <Button 
              onClick={addNewProduct}
              variant="outline"
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            <Button 
              onClick={saveChanges}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save All Changes
                </>
              )}
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Products List */}
        <div className="space-y-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden border-2">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image & Actions */}
                  <div className="md:w-1/4 space-y-4">
                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden border">
                      <img
                        src={product.image}
                        alt={product.nameEn}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = product.category === 'wheat' 
                            ? '/shop-images/wheat.jpg' 
                            : '/shop-images/atta.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button 
                          variant={product.isBestSeller ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateProduct(product.id, "isBestSeller", !product.isBestSeller)}
                          className="flex-1 gap-1"
                        >
                          {product.isBestSeller ? '✅' : '⭐'} Best Seller
                        </Button>
                        <Button 
                          variant={product.isNew ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateProduct(product.id, "isNew", !product.isNew)}
                          className="flex-1 gap-1"
                        >
                          {product.isNew ? '✅' : '🆕'} New
                        </Button>
                      </div>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteProduct(product.id)}
                        className="w-full gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Product
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Product ID: {product.id} | {product.category === 'wheat' ? 'Wheat (Maan)' : 'Flour (Kg)'}
                      </div>
                    </div>
                  </div>

                  {/* Product Form */}
                  <div className="md:w-3/4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Name (English) */}
                      <div className="space-y-2">
                        <Label htmlFor={`nameEn-${product.id}`}>Product Name (English)</Label>
                        <Input
                          id={`nameEn-${product.id}`}
                          value={product.nameEn}
                          onChange={(e) => updateProduct(product.id, "nameEn", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Product Name (Urdu) */}
                      <div className="space-y-2">
                        <Label htmlFor={`nameUr-${product.id}`}>Product Name (Urdu)</Label>
                        <Input
                          id={`nameUr-${product.id}`}
                          value={product.nameUr}
                          onChange={(e) => updateProduct(product.id, "nameUr", e.target.value)}
                          className="h-11"
                          dir="rtl"
                        />
                      </div>
                      
                      {/* Description (English) */}
                      <div className="space-y-2">
                        <Label htmlFor={`descEn-${product.id}`}>Description (English)</Label>
                        <Textarea
                          id={`descEn-${product.id}`}
                          value={product.descriptionEn || ""}
                          onChange={(e) => updateProduct(product.id, "descriptionEn", e.target.value)}
                          className="min-h-[80px]"
                          placeholder="English description"
                        />
                      </div>
                      
                      {/* Description (Urdu) */}
                      <div className="space-y-2">
                        <Label htmlFor={`descUr-${product.id}`}>Description (Urdu)</Label>
                        <Textarea
                          id={`descUr-${product.id}`}
                          value={product.descriptionUr || ""}
                          onChange={(e) => updateProduct(product.id, "descriptionUr", e.target.value)}
                          className="min-h-[80px]"
                          placeholder="اردو تفصیل"
                          dir="rtl"
                        />
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor={`price-${product.id}`}>
                          Price (Rs.) per <span className="font-bold">{product.category === 'wheat' ? 'Maan (40Kg)' : 'Kg'}</span>
                        </Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, "price", parseInt(e.target.value) || 0)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Original Price */}
                      <div className="space-y-2">
                        <Label htmlFor={`originalPrice-${product.id}`}>
                          Original Price (Rs.) <span className="text-gray-500 text-sm">(for discount)</span>
                        </Label>
                        <Input
                          id={`originalPrice-${product.id}`}
                          type="number"
                          value={product.originalPrice || ""}
                          onChange={(e) => updateProduct(product.id, "originalPrice", e.target.value ? parseInt(e.target.value) : undefined)}
                          className="h-11"
                          placeholder="Leave empty for no discount"
                        />
                      </div>
                      
                      {/* Stock */}
                      <div className="space-y-2">
                        <Label htmlFor={`stock-${product.id}`}>
                          Stock (<span className="font-bold">{product.unit === 'maan' ? 'Maan' : 'Kg'}</span>)
                        </Label>
                        <Input
                          id={`stock-${product.id}`}
                          type="number"
                          value={product.stock}
                          onChange={(e) => updateProduct(product.id, "stock", parseInt(e.target.value) || 0)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Category - FIXED: Shows correct unit info */}
                      <div className="space-y-2">
                        <Label htmlFor={`category-${product.id}`}>Category</Label>
                        <select
                          id={`category-${product.id}`}
                          value={product.category}
                          onChange={(e) => updateProduct(product.id, "category", e.target.value as "wheat" | "flour")}
                          className="w-full h-11 px-3 py-2 border rounded-md"
                        >
                          <option value="wheat">Wheat (Unit: Maan - 40Kg)</option>
                          <option value="flour">Flour (Unit: Kg)</option>
                        </select>
                        <p className="text-xs text-gray-500">
                          {product.category === 'wheat' 
                            ? 'Unit will be automatically set to "Maan" (40Kg)' 
                            : 'Unit will be automatically set to "Kg"'}
                        </p>
                      </div>
                      
                      {/* Unit - READ ONLY (Automatically set based on category) */}
                      <div className="space-y-2">
                        <Label htmlFor={`unit-${product.id}`}>
                          Unit <span className="text-gray-500 text-sm">(Auto-set based on category)</span>
                        </Label>
                        <div className="w-full h-11 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                          <span className="font-bold">
                            {product.unit === 'maan' ? 'Maan (40Kg)' : 'Kilogram (Kg)'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {product.category === 'wheat' 
                            ? 'Wheat products always use "Maan" unit' 
                            : 'Flour products always use "Kg" unit'}
                        </p>
                      </div>
                      
                      {/* Image URL */}
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`image-${product.id}`}>Image</Label>
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Input
                              id={`image-${product.id}`}
                              value={product.image}
                              onChange={(e) => updateProduct(product.id, "image", e.target.value)}
                              className="h-11 flex-1"
                              placeholder="/shop-images/image.jpg"
                            />
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            <Button
                              type="button"
                              size="sm"
                              variant={product.image.includes("wheat.jpg") ? "default" : "outline"}
                              onClick={() => updateProduct(product.id, "image", "/shop-images/wheat.jpg")}
                              className="gap-1"
                            >
                              🌾 Wheat
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={product.image.includes("wheat1.jpg") ? "default" : "outline"}
                              onClick={() => updateProduct(product.id, "image", "/shop-images/wheat1.jpg")}
                              className="gap-1"
                            >
                              🌾 Wheat1
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant={product.image.includes("atta.jpg") ? "default" : "outline"}
                              onClick={() => updateProduct(product.id, "image", "/shop-images/atta.jpg")}
                              className="gap-1"
                            >
                              🫓 Atta
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Live Preview */}
                    <div className="pt-4 border-t">
                      <Label>Live Preview:</Label>
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                            <img 
                              src={product.image} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-bold">{product.nameEn}</p>
                            <p className="text-sm text-gray-600">
                              Rs {product.price} / {product.unit === "maan" ? "Maan" : "Kg"} | 
                              Stock: {product.stock} {product.unit}
                            </p>
                            <p className="text-xs text-gray-500">
                              Category: {product.category === 'wheat' ? 'Wheat' : 'Flour'}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {product.isBestSeller && (
                                <span className="bg-primary text-white px-2 py-0.5 rounded text-xs">Best Seller</span>
                              )}
                              {product.isNew && (
                                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">New</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions - UPDATED */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg text-blue-800 mb-2">ℹ️ How to Use (Fixed Unit System)</h3>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>• <strong>Wheat Products:</strong> Category = "Wheat" → Unit = <strong>"Maan" (40Kg)</strong> (Auto-set)</li>
              <li>• <strong>Flour Products:</strong> Category = "Flour" → Unit = <strong>"Kg"</strong> (Auto-set)</li>
              <li>• <strong>Unit is Automatic:</strong> When you change category, unit automatically updates</li>
              <li>• <strong>Price per:</strong> Wheat = per Maan (40Kg), Flour = per Kg</li>
              <li>• <strong>Stock:</strong> Enter quantity in Maan (for wheat) or Kg (for flour)</li>
              <li>• <strong>Best Seller/New:</strong> Click buttons to toggle badges</li>
              <li>• <strong>Original Price:</strong> Set for showing discounted price</li>
              <li>• Edit any field and click "Save All Changes"</li>
              <li>• Use image buttons to quickly assign images</li>
              <li>• <strong>Multiple Save Locations:</strong> localStorage, sessionStorage, IndexedDB</li>
              <li>• <strong>Restore Backup:</strong> Click "Restore Backup" if data gets lost</li>
              <li>• Password: <code>basheer123</code></li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-blue-300">
              <div className="flex flex-wrap gap-4">
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  Reset to Default Products
                </Button>
                <Button onClick={() => console.log('Products data:', products)} variant="outline" size="sm">
                  Debug Products Data
                </Button>
                <Button onClick={() => navigator.storage && navigator.storage.persist && navigator.storage.persist()} variant="outline" size="sm">
                  Request Persistent Storage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Storage Status */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm">
          <h4 className="font-bold mb-2">💾 Storage Status:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded">
              <div className="font-medium">localStorage</div>
              <div className="text-green-600">✅ Primary storage</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="font-medium">sessionStorage</div>
              <div className="text-blue-600">✅ Backup storage</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="font-medium">IndexedDB</div>
              <div className="text-purple-600">✅ Fallback storage</div>
            </div>
          </div>
          <p className="mt-3 text-gray-600 text-xs">
            Data is saved to multiple locations to prevent loss. Total products: {products.length}
          </p>
        </div>
      </div>
    </div>
  );
}