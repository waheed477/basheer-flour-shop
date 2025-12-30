import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Product } from '@/shared/schema';
import { useToast } from './use-toast';

export function useProducts() {
  const { toast } = useToast();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await api.products.list();
        
        // Ensure we always return an array
        if (!Array.isArray(response)) {
          console.error('Products response is not array:', response);
          return [];
        }
        
        // Transform the data to match your frontend schema
        const transformedProducts = response.map(product => ({
          id: product._id || product.id,
          name: product.name,
          nameUrdu: product.nameUrdu,
          descriptionEn: product.descriptionEn,
          descriptionUrdu: product.descriptionUrdu,
          price: product.price,
          category: product.category,
          unit: product.unit,
          image: product.image,
          stock: product.stock,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        
        return transformedProducts;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to load products",
          variant: "destructive",
        });
        return []; // Return empty array to prevent crashes
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

// Also update useProduct hook:
export function useProduct(id?: string | number) {
  const { toast } = useToast();

  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        if (!id) {
          throw new Error('Product ID is required');
        }
        const response = await api.products.getById(String(id));
        
        // Transform the data
        return {
          id: response._id || response.id,
          name: response.name,
          nameUrdu: response.nameUrdu,
          descriptionEn: response.descriptionEn,
          descriptionUrdu: response.descriptionUrdu,
          price: response.price,
          category: response.category,
          unit: response.unit,
          image: response.image,
          stock: response.stock,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt
        };
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to load product",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      try {
        const created = await api.products.create(data);
        return created;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to create product",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (newProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Product> & { id: string }) => {
      try {
        const updated = await api.products.update(id, data);
        return updated;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to update product",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] }); // Also invalidate single product cache
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.products.delete(id);
        return id;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error?.message || "Failed to delete product",
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', deletedId] }); // Also invalidate single product cache
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
  });
}