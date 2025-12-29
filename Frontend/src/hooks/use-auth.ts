// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { api } from '@/services/api';
// import type { LoginRequest } from '@/shared/schema';
// import { useToast } from './use-toast';

// export function useAuth() {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
  
//   const login = useMutation({
//     mutationFn: (data: LoginRequest) => api.auth.login(data),
//     onSuccess: (data) => {
//       // Token automatically save ho jayega api.ts mein
//       toast({
//         title: "Success",
//         description: "Login successful",
//       });
//       queryClient.invalidateQueries({ queryKey: ['auth'] });
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Error",
//         description: error?.error || "Login failed",
//         variant: "destructive",
//       });
//     },
//   });
  
//   const logout = useMutation({
//     mutationFn: () => {
//       // Simple logout - just remove token
//       localStorage.removeItem('admin_token');
//       return Promise.resolve();
//     },
//     onSuccess: () => {
//       toast({
//         title: "Success",
//         description: "Logged out successfully",
//       });
//       queryClient.invalidateQueries({ queryKey: ['auth'] });
//     },
//   });
  
//   const checkAuth = useQuery({
//     queryKey: ['auth'],
//     queryFn: () => {
//       // Simple check - agar token hai to authenticated hai
//       const token = localStorage.getItem('admin_token');
//       if (token) {
//         return Promise.resolve({ 
//           user: { 
//             id: 1, 
//             username: 'basheer000@gmail.com', 
//             role: 'admin' 
//           } 
//         });
//       }
//       throw new Error('Not authenticated');
//     },
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });
  
//   return {
//     login,
//     logout,
//     checkAuth,
//     isAuthenticated: !!localStorage.getItem('admin_token'),
//   };
// }



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { LoginRequest, User } from '@/shared/schema';
import { useToast } from './use-toast';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Helper functions
  const getToken = () => localStorage.getItem('admin_token');
  const setToken = (token: string) => localStorage.setItem('admin_token', token);
  const getUser = (): User | null => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  };
  const setUser = (user: User) => localStorage.setItem('admin_user', JSON.stringify(user));
  const clearStorage = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  const login = useMutation({
    mutationFn: (data: LoginRequest) => api.auth.login(data),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data.message || "Login successful",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || error?.message || "Login failed",
        variant: "destructive",
      });
    },
  });
  
  const logout = useMutation({
    mutationFn: async () => {
      try {
        await api.auth.logout();
      } finally {
        // Always clear storage even if API call fails
        clearStorage();
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged out successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      queryClient.clear(); // Clear all queries on logout
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || error?.message || "Logout failed",
        variant: "destructive",
      });
    },
  });
  
  const checkAuth = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const token = getToken();
      const userStr = localStorage.getItem('admin_user');
      
      if (!token || !userStr) {
        throw new Error('Not authenticated');
      }
      
      try {
        const user = JSON.parse(userStr);
        return { user };
      } catch {
        // Invalid JSON, clear storage
        clearStorage();
        throw new Error('Not authenticated');
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - Better than Infinity
    gcTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
  
  // Check authentication status (immediate, no loading)
  const isAuthenticated = !!getToken();
  
  // Get current user from localStorage (for immediate access)
  const currentUser = getUser();
  
  return {
    login,
    logout,
    checkAuth,
    isAuthenticated,
    currentUser,
    getToken,
    setToken,
    getUser,
    setUser,
    clearStorage,
  };
}

// Admin access check
export function useAdminAccess() {
  const { checkAuth, currentUser, isAuthenticated } = useAuth();
  
  const isAdmin = currentUser?.role === 'admin' || checkAuth.data?.user?.role === 'admin';
  const canAccessAdmin = isAuthenticated && isAdmin;
  
  return {
    canAccessAdmin,
    hasAccess: canAccessAdmin,
    isAdmin,
    isAuthenticated,
    isLoading: checkAuth.isLoading,
    isError: checkAuth.isError,
    user: currentUser || checkAuth.data?.user,
    checkAuth,
  };
}

// Hook for requiring authentication
export function useRequireAuth(options: { adminOnly?: boolean; redirectTo?: string } = {}) {
  const { adminOnly = false, redirectTo = '/admin/login' } = options;
  const { canAccessAdmin, isAuthenticated, isLoading } = useAdminAccess();
  const [location] = useState(() => window.location.pathname);
  
  const canAccess = adminOnly ? canAccessAdmin : isAuthenticated;
  
  useEffect(() => {
    if (!isLoading && !canAccess) {
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(location)}`;
      window.location.href = redirectUrl;
    }
  }, [isLoading, canAccess, redirectTo, location]);
  
  return {
    canAccess,
    isLoading,
    isAuthenticated,
    isAdmin: canAccessAdmin,
  };
}

// Hook for authentication headers
export function useAuthHeaders() {
  const { getToken } = useAuth();
  
  return {
    getHeaders: () => {
      const token = getToken();
      return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      } : {
        'Content-Type': 'application/json',
      };
    },
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { isAdmin, user } = useAdminAccess();
  
  return {
    // Admin permissions
    canCreate: isAdmin,
    canEdit: isAdmin,
    canDelete: isAdmin,
    canViewAdmin: isAdmin,
    canManageUsers: isAdmin,
    canManageProducts: isAdmin,
    canViewContacts: isAdmin,
    canManageSettings: isAdmin,
    
    // User info
    userRole: user?.role,
    userId: user?.id,
    userName: user?.username,
  };
}

// Hook for auto-login on app start
export function useAutoLogin() {
  const { checkAuth, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Auto-check auth when app loads
    if (isAuthenticated && !checkAuth.data) {
      checkAuth.refetch();
    }
  }, [isAuthenticated, checkAuth]);
  
  return {
    isChecking: checkAuth.isLoading,
    isLoggedIn: isAuthenticated && checkAuth.isSuccess,
  };
}