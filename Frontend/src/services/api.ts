import type { 
  InsertProduct, 
  InsertContact, 
  LoginRequest, 
  Product, 
  Contact,
  Settings,
  ApiResponse,
  LoginResponse,
  UpdateContactStatusRequest
} from '@/shared/schema';

// Base URL configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get authorization headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Handle different error statuses
    switch (response.status) {
      case 401:
        // Clear token and redirect to login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
        break;
      case 403:
        console.error('Forbidden: Admin access required');
        break;
      case 404:
        console.error('Resource not found');
        break;
      case 500:
        console.error('Server error: Please try again later');
        break;
    }
    
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.error || errorData?.message || `Error ${response.status}: ${response.statusText}`;
    
    throw new Error(errorMessage);
  }
  
  const apiResponse: ApiResponse<T> = await response.json();
  
  if (apiResponse.success && apiResponse.data !== undefined) {
    return apiResponse.data;
  }
  
  throw new Error(apiResponse.error || 'Unknown error occurred');
};

// Helper function for making API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
    credentials: 'include',
  };
  
  const requestOptions: RequestInit = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, requestOptions);
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API request failed: ${error.message}`);
      throw error;
    }
    console.error('Network error: Please check your connection');
    throw new Error('Network error: Please check your connection');
  }
};

// API endpoints
export const api = {
  // Authentication
  auth: {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
      console.log('🔐 Attempting login to:', `${API_BASE}/api/auth/login`);
      
      try {
        const result = await apiRequest<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        
        // Save token and user data
        localStorage.setItem('admin_token', result.token);
        localStorage.setItem('admin_user', JSON.stringify(result.user));
        
        console.log('✅ Login successful');
        return result;
      } catch (error) {
        console.error('❌ Login failed:', error);
        throw error;
      }
    },
    
    logout: async (): Promise<void> => {
      try {
        await apiRequest<void>('/api/auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.warn('Logout API call failed, clearing local storage anyway');
      } finally {
        // Always clear local storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    },
    
    getCurrentUser: async () => {
      try {
        return await apiRequest('/api/auth/me');
      } catch (error) {
        console.error('Failed to get current user:', error);
        throw error;
      }
    },
  },

  // Products
  products: {
    list: async (): Promise<Product[]> => {
      console.log('📡 Fetching products from API...');
      try {
        const products = await apiRequest<Product[]>('/api/products');
        console.log(`✅ Loaded ${products.length} products`);
        return products;
      } catch (error) {
        console.error('❌ Failed to fetch products:', error);
        throw error;
      }
    },
    
    get: async (id: number): Promise<Product> => {
      console.log(`📡 Fetching product ID: ${id}`);
      try {
        const product = await apiRequest<Product>(`/api/products/${id}`);
        console.log(`✅ Loaded product: ${product.name}`);
        return product;
      } catch (error) {
        console.error(`❌ Failed to fetch product ${id}:`, error);
        throw error;
      }
    },
    
    create: async (data: InsertProduct): Promise<Product> => {
      console.log('📡 Creating new product:', data.name);
      try {
        const product = await apiRequest<Product>('/api/products', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        console.log(`✅ Product created: ${product.name}`);
        return product;
      } catch (error) {
        console.error('❌ Failed to create product:', error);
        throw error;
      }
    },
    
    update: async (id: number, data: Partial<InsertProduct>): Promise<Product> => {
      console.log(`📡 Updating product ID: ${id}`);
      try {
        const product = await apiRequest<Product>(`/api/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        console.log(`✅ Product updated: ${product.name}`);
        return product;
      } catch (error) {
        console.error(`❌ Failed to update product ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: number): Promise<void> => {
      console.log(`📡 Deleting product ID: ${id}`);
      try {
        await apiRequest<void>(`/api/products/${id}`, {
          method: 'DELETE',
        });
        console.log(`✅ Product ${id} deleted`);
      } catch (error) {
        console.error(`❌ Failed to delete product ${id}:`, error);
        throw error;
      }
    },
  },

  // Contacts
  contacts: {
    list: async (): Promise<Contact[]> => {
      console.log('📡 Fetching contacts from API...');
      try {
        const contacts = await apiRequest<Contact[]>('/api/contacts');
        console.log(`✅ Loaded ${contacts.length} contacts`);
        return contacts;
      } catch (error) {
        console.error('❌ Failed to fetch contacts:', error);
        throw error;
      }
    },
    
    create: async (data: InsertContact): Promise<Contact> => {
      console.log('📡 Creating new contact from:', data.name);
      try {
        const contact = await apiRequest<Contact>('/api/contacts', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        console.log(`✅ Contact created from ${contact.name}`);
        return contact;
      } catch (error) {
        console.error('❌ Failed to create contact:', error);
        throw error;
      }
    },
    
    updateStatus: async (id: number, status: 'new' | 'read' | 'replied'): Promise<Contact> => {
      console.log(`📡 Updating contact status ID: ${id} to ${status}`);
      try {
        const contact = await apiRequest<Contact>(`/api/contacts/${id}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        });
        console.log(`✅ Contact ${id} status updated to ${status}`);
        return contact;
      } catch (error) {
        console.error(`❌ Failed to update contact status ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: number): Promise<void> => {
      console.log(`📡 Deleting contact ID: ${id}`);
      try {
        await apiRequest<void>(`/api/contacts/${id}`, {
          method: 'DELETE',
        });
        console.log(`✅ Contact ${id} deleted`);
      } catch (error) {
        console.error(`❌ Failed to delete contact ${id}:`, error);
        throw error;
      }
    },
  },

  // Settings
  settings: {
    get: async (): Promise<Settings> => {
      console.log('📡 Fetching settings from API...');
      try {
        const settingsData = await apiRequest<Record<string, string>>('/api/settings');
        
        console.log('📡 Raw settings from backend:', settingsData);
        
        // Convert from snake_case key-value to camelCase typed settings
        const transformedSettings = {
          shopName: settingsData.shop_name || '',
          shopNameUrdu: settingsData.shop_name_urdu || '',
          whatsappNumber: settingsData.whatsapp_number || '',
          phoneNumber: settingsData.phone_number || '',
          email: settingsData.email || '',
          addressEn: settingsData.address_en || '',
          addressUrdu: settingsData.address_urdu || '',
          workingHours: settingsData.working_hours || '',
          enableWhatsAppButton: settingsData.enable_whatsapp_button === 'true',
          enableOnlineOrders: settingsData.enable_online_orders === 'true',
          maintenanceMode: settingsData.maintenance_mode === 'true',
        };
        
        console.log('✅ Settings loaded and transformed');
        return transformedSettings;
      } catch (error) {
        console.error('❌ Failed to fetch settings:', error);
        throw error;
      }
    },
    
    update: async (data: Partial<Settings>): Promise<Settings> => {
      console.log('📡 Updating settings via API...');
      console.log('📤 Frontend sending data:', data);
      
      // Define mapping between frontend camelCase and backend snake_case
      const keyMappings: Record<string, string> = {
        shopName: 'shop_name',
        shopNameUrdu: 'shop_name_urdu', 
        whatsappNumber: 'whatsapp_number',
        phoneNumber: 'phone_number',
        email: 'email',
        addressEn: 'address_en',
        addressUrdu: 'address_urdu',
        workingHours: 'working_hours',
        enableWhatsAppButton: 'enable_whatsapp_button',
        enableOnlineOrders: 'enable_online_orders',
        maintenanceMode: 'maintenance_mode'
      };
      
      // Convert from camelCase to snake_case for backend
      const settingsMap: Record<string, string> = {};
      
      Object.entries(data).forEach(([frontendKey, value]) => {
        const backendKey = keyMappings[frontendKey];
        if (backendKey && value !== undefined) {
          settingsMap[backendKey] = value.toString();
          console.log(`  ${frontendKey} → ${backendKey}: ${settingsMap[backendKey]}`);
        }
      });
      
      console.log('🔧 Final payload to backend:', settingsMap);
      
      try {
        console.log('🚀 Sending PUT request to /api/settings');
        const updatedSettings = await apiRequest<Record<string, string>>('/api/settings', {
          method: 'PUT',
          body: JSON.stringify(settingsMap),
        });
        
        console.log('✅ Parsed settings from backend:', updatedSettings);
        
        // Convert back to camelCase typed settings
        const transformedResponse = {
          shopName: updatedSettings.shop_name || '',
          shopNameUrdu: updatedSettings.shop_name_urdu || '',
          whatsappNumber: updatedSettings.whatsapp_number || '',
          phoneNumber: updatedSettings.phone_number || '',
          email: updatedSettings.email || '',
          addressEn: updatedSettings.address_en || '',
          addressUrdu: updatedSettings.address_urdu || '',
          workingHours: updatedSettings.working_hours || '',
          enableWhatsAppButton: updatedSettings.enable_whatsapp_button === 'true',
          enableOnlineOrders: updatedSettings.enable_online_orders === 'true',
          maintenanceMode: updatedSettings.maintenance_mode === 'true',
        };
        
        console.log('🔄 Final transformed response:', transformedResponse);
        return transformedResponse;
      } catch (error) {
        console.error('❌ Failed to update settings:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
        throw error;
      }
    },
  },
};

// Export types
export type { InsertProduct, InsertContact, LoginRequest };
export type CreateProductRequest = InsertProduct;
export type UpdateProductRequest = Partial<InsertProduct>;

// For backward compatibility
export const apiClient = {
  get: async <T>(url: string) => apiRequest<T>(url),
  post: async <T>(url: string, data: any) => apiRequest<T>(url, { method: 'POST', body: JSON.stringify(data) }),
  put: async <T>(url: string, data: any) => apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async <T>(url: string) => apiRequest<T>(url, { method: 'DELETE' }),
};

export default apiClient;