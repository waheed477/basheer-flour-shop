import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { productFormSchema, type ProductFormValues } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Upload, Image as ImageIcon, X, Package, Scale, Loader2 } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}

export default function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = "create",
}: ProductFormProps) {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      nameUrdu: "",
      category: "flour",
      price: "",
      stock: "0",
      descriptionEn: "",
      descriptionUrdu: "",
      image: "",
    },
  });

  const selectedCategory = form.watch("category");

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      console.log("📦 Initial data loaded:", initialData);
      
      form.reset({
        name: initialData.name || "",
        nameUrdu: initialData.nameUrdu || "",
        category: initialData.category || "flour",
        price: initialData.price?.toString() || "",
        stock: initialData.stock?.toString() || "0",
        descriptionEn: initialData.descriptionEn || "",
        descriptionUrdu: initialData.descriptionUrdu || "",
        image: initialData.image || "",
      });
      
      if (initialData.image) {
        // Check if image already has full URL, if not, add base URL
        let imageUrl = initialData.image;
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:')) {
          imageUrl = `http://localhost:5000${imageUrl}`;
        }
        setImagePreview(imageUrl);
      }
    }
  }, [initialData, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("📸 File selected:", file.name, file.type, file.size);

    // Validate file size (5MB max - matches backend)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file (JPG, PNG, WebP, etc.)",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    console.log("✅ Preview created:", previewUrl);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    form.setValue("image", "");
  };

  // Function to upload image to server
  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      console.log("📤 Uploading image:", file.name);
      
      const formData = new FormData();
      formData.append("image", file);
      
      // Use fetch to upload the image
      const response = await fetch("http://localhost:5000/api/uploads", {
        method: "POST",
        body: formData,
      });

      console.log("📥 Upload response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error response:", errorText);
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Upload response data:", data);
      
      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      // Return the path from server response
      const imagePath = data.data?.path || `/uploads/${data.data?.filename}`;
      console.log("✅ Image uploaded successfully, path:", imagePath);
      
      return imagePath;
    } catch (error: any) {
      console.error("❌ Image upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      let imagePath = data.image;
      
      // If a new image was selected
      if (selectedImage) {
        try {
          console.log("🔄 Uploading new image before form submission...");
          imagePath = await uploadImage(selectedImage);
          form.setValue("image", imagePath);
          console.log("✅ Image uploaded, path set to:", imagePath);
        } catch (error) {
          // Upload failed, don't proceed with form submission
          console.log("❌ Form submission cancelled due to upload failure");
          return;
        }
      }
      
      // Prepare final data with image path
      const finalData = {
        ...data,
        image: imagePath,
      };
      
      console.log("🚀 Submitting form data:", finalData);
      await onSubmit(finalData);
      
      // Clean up blob URL if created
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    } catch (error) {
      console.error("❌ Form submission error:", error);
      // Error is handled by parent component
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {mode === "create" ? "Add New Product" : "Edit Product"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Product Category *</Label>
              <RadioGroup
                value={selectedCategory}
                onValueChange={(value) => form.setValue("category", value as "flour" | "wheat")}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="flour" id="flour" />
                  <Label htmlFor="flour" className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Flour Product</div>
                      <div className="text-sm text-muted-foreground">PKR per kg</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 hover:bg-accent/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="wheat" id="wheat" />
                  <Label htmlFor="wheat" className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Scale className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">Wheat Product</div>
                      <div className="text-sm text-muted-foreground">PKR per Maan</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Product Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name (English) *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Premium Atta" 
                        {...field} 
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameUrdu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name (Urdu) *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="مثلاً، پریمیم آٹا" 
                        dir="rtl" 
                        className="font-urdu h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Price * ({selectedCategory === "flour" ? "PKR/kg" : "PKR/Maan"})
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="e.g., 150.00" 
                        className="h-11"
                        {...field} 
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter price without currency symbol
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity *</FormLabel>
                    <FormControl>
                      <Input 
                        type="text" 
                        placeholder="e.g., 100" 
                        className="h-11"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Available quantity in {selectedCategory === "flour" ? "kg" : "Maan"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Image Upload Section - SIMPLIFIED */}
            <div className="space-y-4">
              <FormLabel>Product Image</FormLabel>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                <div className="flex flex-col items-center justify-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-48 h-48 mx-auto">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted rounded-full">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* SIMPLE FILE INPUT */}
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-primary file:text-white
                        hover:file:bg-primary/90
                        cursor-pointer"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: 500x500px, JPG/PNG/WebP, Max 5MB
                    </p>
                    {isUploading && (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <p className="text-sm text-blue-600">
                          Uploading image...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input type="hidden" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Description Tabs */}
            <div className="space-y-4">
              <Label>Description</Label>
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="urdu">Urdu</TabsTrigger>
                </TabsList>
                <TabsContent value="english" className="space-y-2 pt-4">
                  <FormField
                    control={form.control}
                    name="descriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your product in English..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Provide details about the product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="urdu" className="space-y-2 pt-4">
                  <FormField
                    control={form.control}
                    name="descriptionUrdu"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="...اردو میں اپنی مصنوعات کی تفصیل بتائیں"
                            dir="rtl"
                            className="min-h-[120px] font-urdu"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional: Provide details in Urdu
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="submit"
                className="sm:flex-1 py-3 h-12 text-base"
                disabled={isLoading || isUploading}
              >
                {isLoading || isUploading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Saving..."}
                  </>
                ) : mode === "create" ? (
                  "Save Product"
                ) : (
                  "Update Product"
                )}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto py-3 h-12 text-base"
                  onClick={onCancel}
                  disabled={isLoading || isUploading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}