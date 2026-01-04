// src/hooks/use-settings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

// Default settings
const defaultSettings = {
  whatsappNumber: '923008666593',
  phoneNumber: '+923008666593',
  shopName: 'Bashir Flour Shop',
  shopAddress: 'Lahore, Pakistan',
  shopTimings: '9:00 AM - 9:00 PM',
  deliveryArea: 'Local Area',
  minOrderAmount: 1000,
  deliveryCharges: 0,
};

export type Settings = typeof defaultSettings;

export function useSettings() {
  const { toast } = useToast();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      console.log('📡 Loading settings from localStorage...');
      
      // Try to get settings from localStorage
      try {
        const savedSettings = localStorage.getItem('flour_shop_settings');
        
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          console.log('✅ Settings loaded from localStorage:', parsedSettings);
          return { ...defaultSettings, ...parsedSettings };
        }
        
        // If no settings in localStorage, use defaults
        console.log('✅ Using default settings');
        return defaultSettings;
        
      } catch (error: any) {
        console.error('❌ Error loading settings:', error);
        // Return defaults if error
        return defaultSettings;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 0, // No retries since we're using localStorage
    onError: (error: any) => {
      // Don't show error toast for settings fetch failure
      console.log('Settings fetch failed, using defaults:', error.message);
      // Silent error - don't show toast
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Settings, any, Partial<Settings>>({
    mutationFn: async (data: Partial<Settings>) => {
      console.log('💾 Saving settings to localStorage:', data);
      
      // Get current settings
      const currentSettings = localStorage.getItem('flour_shop_settings');
      let mergedSettings = defaultSettings;
      
      if (currentSettings) {
        mergedSettings = { ...defaultSettings, ...JSON.parse(currentSettings) };
      }
      
      // Merge with new data
      const updatedSettings = { ...mergedSettings, ...data };
      
      // Save to localStorage
      localStorage.setItem('flour_shop_settings', JSON.stringify(updatedSettings));
      
      return updatedSettings;
    },
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(['settings'], updatedSettings);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    },
  });
}