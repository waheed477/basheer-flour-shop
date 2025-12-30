// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('API error:', text);
      throw new Error(text || `API request failed: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }

    return res.text() as unknown as T;
  } catch (err: any) {
    console.error('Fetch error:', err);
    throw new Error(err.message || 'Network error');
  }
}

export const api = {
  settings: {
    get: () => apiRequest('/api/settings'),
    update: (data: any) =>
      apiRequest('/api/settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  products: {
    // Update the products.list() method:
    list: async () => {
      const response = await apiRequest('/api/products');
      // Extract data from the response structure
      return response.data || [];
    },
    getById: async (id: string) => {
      const response = await apiRequest(`/api/products/${id}`);
      return response.data; // Extract data field
    },
    create: async (data: any) => {
      const response = await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.data; // Extract data field
    },
    update: async (id: string, data: any) => {
      const response = await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.data; // Extract data field
    },
    delete: async (id: string) => {
      const response = await apiRequest(`/api/products/${id}`, {
        method: 'DELETE',
      });
      return response.data || {}; // Extract data field
    },
  },
  uploads: {
    getImageUrl: (filename: string) =>
      `${API_BASE_URL}/uploads/${encodeURIComponent(filename)}`,
  },
};