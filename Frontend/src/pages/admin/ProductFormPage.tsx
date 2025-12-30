import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import { useProduct, useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { productFormSchema, type ProductFormValues } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function ProductFormPage() {
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const productId = params?.id;
  const isEditMode = !!productId;
  
  // Remove parseInt - useProduct now accepts string or number
  const { data: productData } = useProduct(productId);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const productData = {
        ...data,
        stock: parseInt(data.stock),
      };

      if (isEditMode && productId) {
        // Remove parseInt - updateMutation expects string id
        await updateMutation.mutateAsync({
          id: productId,
          ...productData,
        });
      } else {
        await createMutation.mutateAsync(productData);
      }
      
      // Navigate back to dashboard
      window.location.href = "/admin/dashboard";
    } catch (error) {
      // Error is handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      {/* Header */}
      <div className="container mx-auto mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
        </div>
      </div>

      {/* Product Form */}
      <div className="container mx-auto">
        <ProductForm
          initialData={productData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting || createMutation.isPending || updateMutation.isPending}
          mode={isEditMode ? "edit" : "create"}
        />
      </div>
    </div>
  );
}