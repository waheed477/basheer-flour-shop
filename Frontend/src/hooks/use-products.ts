import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Product, InsertProduct, UpdateProductRequest } from '@/shared/schema';
import { useToast } from './use-toast';

export function useProducts() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('📡 Fetching products from backend...');
      try {
        const products = await api.products.list();
        
        // DEBUG: Log raw data from API
        console.log('📦 Raw products from API:', products);
        
        // Transform data to match frontend
        const transformedProducts = products.map(product => {
          const productId = product._id || product.id;
          
          // Image URL handle karein
          let imageUrl = '';
          if (product.imageUrl) {
            // Backend ne full URL diya hai
            imageUrl = product.imageUrl;
          } else if (product.image) {
            // Agar sirf path hai to full URL banayein
            if (product.image.startsWith('http')) {
              imageUrl = product.image;
            } else if (product.image.startsWith('/uploads')) {
              // Local uploads folder se hai
              // FIXED: Use environment variable
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              imageUrl = `${API_URL}${product.image}`;
            } else {
              imageUrl = product.image;
            }
          }
          
          const transformed = {
            id: productId,
            name: product.name || '',
            nameUrdu: product.nameUrdu || '',
            descriptionEn: product.descriptionEn || '',
            descriptionUrdu: product.descriptionUrdu || '',
            price: product.price || '0',
            category: product.category || 'flour',
            unit: product.unit || 'kg',
            image: imageUrl,  // <-- Full URL dijiye
            stock: product.stock || 0,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          };
          
          console.log(`✅ Transformed product image:`, {
            originalImage: product.image,
            imageUrl: product.imageUrl,
            finalImage: transformed.image
          });
          
          return transformed;
        });
        
        console.log(`✅ Total ${transformedProducts.length} products transformed`);
        return transformedProducts;
      } catch (error: any) {
        console.error('❌ Failed to load products:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to load products",
        variant: "destructive",
      });
    },
  });
}

// Update the single product function similarly
export function useProduct(id: number) {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      console.log('📡 Fetching product ID:', id);
      try {
        const product = await api.products.get(id);
        
        // Image URL handle karein (same logic as above)
        let imageUrl = '';
        if (product.imageUrl) {
          // Backend ne full URL diya hai
          imageUrl = product.imageUrl;
        } else if (product.image) {
          // Agar sirf path hai to full URL banayein
          if (product.image.startsWith('http')) {
            imageUrl = product.image;
          } else if (product.image.startsWith('/uploads')) {
            // Local uploads folder se hai
            // FIXED: Use environment variable
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            imageUrl = `${API_URL}${product.image}`;
          } else {
            imageUrl = product.image;
          }
        }
        
        // Transform data to match frontend
        const transformedProduct = {
          id: product._id || product.id,
          name: product.name || '',
          nameUrdu: product.nameUrdu || '',
          descriptionEn: product.descriptionEn || '',
          descriptionUrdu: product.descriptionUrdu || '',
          price: product.price || '0',
          category: product.category || 'flour',
          unit: product.unit || 'kg',
          image: imageUrl,  // <-- Full URL dijiye
          stock: product.stock || 0,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        };
        
        console.log('✅ Product loaded:', transformedProduct.name);
        console.log('✅ Product image URL:', imageUrl);
        return transformedProduct;
      } catch (error: any) {
        console.error('❌ Failed to load product:', error);
        throw error;
      }
    },
    enabled: !!id,
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to load product",
        variant: "destructive",
      });
    },
  });
}

// The mutation functions are fine - they just need to send correct data
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertProduct) => {
      console.log('📡 Creating product:', data.name);
      console.log('📤 Sending product data:', data);
      try {
        const product = await api.products.create(data);
        console.log('✅ Product created:', product);
        return product;
      } catch (error: any) {
        console.error('❌ Failed to create product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to create product",
        variant: "destructive",
      });
    },
  });
}

// Update and Delete functions remain the same
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & UpdateProductRequest) => {
      console.log('📡 Updating product ID:', id);
      console.log('📤 Update data:', data);
      try {
        const product = await api.products.update(id, data);
        console.log('✅ Product updated:', product);
        return product;
      } catch (error: any) {
        console.error('❌ Failed to update product:', error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', variables.id] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to update product",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      console.log('📡 Deleting product ID:', id);
      try {
        await api.products.delete(id);
        console.log('✅ Product deleted');
      } catch (error: any) {
        console.error('❌ Failed to delete product:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to delete product",
        variant: "destructive",
      });
    },
  });
}