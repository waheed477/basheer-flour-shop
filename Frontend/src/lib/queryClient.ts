import { QueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Create a custom query client with enhanced configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global query configuration
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh for 5 mins
      gcTime: 10 * 60 * 1000,   // 10 minutes - cache time (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
      
      // Global error handling for queries
      onError: (error: any) => {
        console.error('Query error:', error);
        
        // Show user-friendly error message
        const errorMessage = error?.response?.data?.message 
          || error?.message 
          || 'An error occurred while fetching data';
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
    },
    mutations: {
      // Global mutation configuration
      retry: 1, // Retry failed mutations once
      
      // Global error handling for mutations
      onError: (error: any) => {
        console.error('Mutation error:', error);
        
        // Show user-friendly error message
        const errorMessage = error?.response?.data?.message 
          || error?.message 
          || 'An error occurred while processing your request';
        
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      },
      
      // Global success handling for mutations
      onSuccess: (data: any, variables: any, context: any) => {
        // Show success message if mutation returns a success message
        if (data?.message) {
          toast({
            title: 'Success',
            description: data.message,
            variant: 'default',
          });
        }
      },
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.products.details(), id] as const,
  },
  contacts: {
    all: ['contacts'] as const,
    lists: () => [...queryKeys.contacts.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.contacts.lists(), { filters }] as const,
    detail: (id: number) => [...queryKeys.contacts.all, 'detail', id] as const,
  },
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  settings: {
    all: ['settings'] as const,
    current: () => [...queryKeys.settings.all, 'current'] as const,
  },
};

// Utility functions for query invalidation
export const invalidateQueries = {
  products: () => queryClient.invalidateQueries({ queryKey: queryKeys.products.all }),
  product: (id?: number) => {
    if (id) {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
  },
  contacts: () => queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all }),
  settings: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
};

// Reset all queries (useful for logout)
export const resetAllQueries = () => {
  queryClient.removeQueries();
};

// Prefetch helper
export const prefetchQuery = async (queryKey: any[], queryFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

export default queryClient;