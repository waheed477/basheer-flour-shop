import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, Lock, LogOut, Plus, Trash2 } from "lucide-react";

// Initial products data
const initialProducts = [
  {
    id: 1,
    name: "Premium Wheat",
    nameUrdu: "پریمیم گندم",
    price: 3200,
    category: "wheat" as const,
    image: "/shop-images/wheat.jpg",
    stock: 50,
    description: "Premium quality wheat, perfect for homemade atta. Fresh from local farms.",
    unit: "Maan" as const
  },
  {
    id: 2,
    name: "Sharbati Wheat",
    nameUrdu: "شربتی گندم",
    price: 3500,
    category: "wheat" as const,
    image: "/shop-images/wheat1.jpg",
    stock: 30,
    description: "Special Sharbati wheat, soft and rich texture. Imported quality.",
    unit: "Maan" as const
  },
  {
    id: 3,
    name: "Fresh Chakki Atta",
    nameUrdu: "تازہ چکی آٹا",
    price: 900,
    category: "flour" as const,
    image: "/shop-images/atta.jpg",
    stock: 200,
    description: "Freshly ground atta, stone chakki processed. No preservatives added.",
    unit: "Kg" as const
  }
];

export default function SettingsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  const [nextId, setNextId] = useState(4);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Check if already logged in
  useEffect(() => {
    const savedLogin = localStorage.getItem("admin_authenticated");
    const savedProducts = localStorage.getItem("flour_shop_products");
    
    if (savedLogin === "true") {
      setIsAuthenticated(true);
    }
    
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        setProducts(parsedProducts);
        // Find max ID for next product
        const maxId = Math.max(...parsedProducts.map((p: any) => p.id));
        setNextId(maxId + 1);
      } catch (error) {
        console.error("Error loading saved products:", error);
      }
    }
  }, []);

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

  const updateProduct = (id: number, field: string, value: string | number) => {
    setProducts(prev => prev.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const addNewProduct = () => {
    const newProduct = {
      id: nextId,
      name: "New Product",
      nameUrdu: "نیا پروڈکٹ",
      price: 0,
      category: "flour" as const,
      image: "/shop-images/atta.jpg",
      stock: 0,
      description: "",
      unit: "Kg" as const
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

  const saveChanges = () => {
    localStorage.setItem("flour_shop_products", JSON.stringify(products));
    showNotification("✅ All changes saved successfully!", "success");
    
    // Reload page to reflect changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
            <p className="text-sm text-gray-500 mt-1">
              Current: {products.filter(p => p.category === 'wheat').length} Wheat, 
              {products.filter(p => p.category === 'flour').length} Flour products
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
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
              className="bg-green-600 hover:bg-green-700 gap-2"
            >
              <Save className="h-4 w-4" />
              Save All Changes
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
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/shop-images/atta.jpg";
                        }}
                      />
                    </div>
                    <div className="space-y-2">
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
                        Product ID: {product.id}
                      </div>
                    </div>
                  </div>

                  {/* Product Form */}
                  <div className="md:w-3/4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`name-${product.id}`}>Product Name (English)</Label>
                        <Input
                          id={`name-${product.id}`}
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Urdu Name */}
                      <div className="space-y-2">
                        <Label htmlFor={`nameUrdu-${product.id}`}>Product Name (Urdu)</Label>
                        <Input
                          id={`nameUrdu-${product.id}`}
                          value={product.nameUrdu}
                          onChange={(e) => updateProduct(product.id, "nameUrdu", e.target.value)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor={`price-${product.id}`}>
                          Price (Rs.) per {product.unit === "Maan" ? "Maan (40Kg)" : "Kg"}
                        </Label>
                        <Input
                          id={`price-${product.id}`}
                          type="number"
                          value={product.price}
                          onChange={(e) => updateProduct(product.id, "price", parseInt(e.target.value) || 0)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Stock */}
                      <div className="space-y-2">
                        <Label htmlFor={`stock-${product.id}`}>
                          Stock ({product.unit})
                        </Label>
                        <Input
                          id={`stock-${product.id}`}
                          type="number"
                          value={product.stock}
                          onChange={(e) => updateProduct(product.id, "stock", parseInt(e.target.value) || 0)}
                          className="h-11"
                        />
                      </div>
                      
                      {/* Category */}
                      <div className="space-y-2">
                        <Label htmlFor={`category-${product.id}`}>Category</Label>
                        <select
                          id={`category-${product.id}`}
                          value={product.category}
                          onChange={(e) => updateProduct(product.id, "category", e.target.value as "wheat" | "flour")}
                          className="w-full h-11 px-3 py-2 border rounded-md"
                        >
                          <option value="wheat">Wheat (Maan)</option>
                          <option value="flour">Flour (Kg)</option>
                        </select>
                      </div>
                      
                      {/* Unit */}
                      <div className="space-y-2">
                        <Label htmlFor={`unit-${product.id}`}>Unit</Label>
                        <select
                          id={`unit-${product.id}`}
                          value={product.unit}
                          onChange={(e) => updateProduct(product.id, "unit", e.target.value as "Kg" | "Maan")}
                          className="w-full h-11 px-3 py-2 border rounded-md"
                        >
                          <option value="Maan">Maan (40Kg)</option>
                          <option value="Kg">Kilogram (Kg)</option>
                        </select>
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
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor={`desc-${product.id}`}>Description</Label>
                      <Textarea
                        id={`desc-${product.id}`}
                        value={product.description || ""}
                        onChange={(e) => updateProduct(product.id, "description", e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Add product description"
                      />
                    </div>
                    
                    {/* Product Preview */}
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
                            <p className="font-bold">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              Rs {product.price} / {product.unit === "Maan" ? "Maan" : "Kg"} | 
                              Stock: {product.stock} {product.unit}
                            </p>
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

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg text-blue-800 mb-2">ℹ️ How to Use</h3>
            <ul className="space-y-1 text-blue-700 text-sm">
              <li>• <strong>Wheat Products:</strong> Set Category = "Wheat" and Unit = "Maan" (Price per 40Kg)</li>
              <li>• <strong>Flour Products:</strong> Set Category = "Flour" and Unit = "Kg" (Price per Kg)</li>
              <li>• Edit any field and click "Save All Changes"</li>
              <li>• Use image buttons to quickly assign images</li>
              <li>• Active image button shows in blue color</li>
              <li>• After saving, refresh the Products page to see updates</li>
              <li>• Password: <code>basheer123</code> (Change in code if needed)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}