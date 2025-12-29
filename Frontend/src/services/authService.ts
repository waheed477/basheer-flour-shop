import { api } from './api';
import type { LoginRequest } from '@shared/schema';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  user: User;
}

class AuthService {
  private currentUser: User | null = null;

  // Login user
  async login(credentials: LoginRequest): Promise<User> {
    try {
      const response = await api.auth.login(credentials);
      this.currentUser = response.data.user;
      
      // Store user in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return this.currentUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid username or password');
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.auth.logout();
      this.currentUser = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async checkAuth(): Promise<User | null> {
    // Return cached user if available
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        return this.currentUser;
      }
    }

    // Check with server
    try {
      const response = await api.auth.check();
      this.currentUser = response.data.user;
      
      // Update localStorage
      if (this.currentUser && typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return this.currentUser;
    } catch (error) {
      // Not authenticated
      this.currentUser = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      return null;
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Get authentication status
  isAuthenticated(): boolean {
    if (this.currentUser) return true;
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    
    return false;
  }

  // Initialize auth state on app load
  initialize(): void {
    if (typeof window === 'undefined') return;
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Initialize on import
if (typeof window !== 'undefined') {
  authService.initialize();
}

export default authService;