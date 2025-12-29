import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Settings } from '@/shared/schema';
import { useToast } from './use-toast';

export function useSettings() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      console.log('📡 Fetching settings from backend...');
      try {
        const settings = await api.settings.get();
        console.log('✅ Settings loaded:', settings);
        return settings;
      } catch (error: any) {
        console.error('❌ Failed to load settings:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // Retry failed requests
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to load settings",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: Partial<Settings>) => {
      console.log('📡 Updating settings:', data);
      try {
        // DEBUG: Log what we're sending
        console.log('📤 Sending to API:', data);
        
        const updatedSettings = await api.settings.update(data);
        
        // DEBUG: Log what we received
        console.log('📥 Received from API:', updatedSettings);
        
        return updatedSettings;
      } catch (error: any) {
        console.error('❌ Failed to update settings:', error);
        throw error;
      }
    },
    onSuccess: (updatedData) => {
      // Update the cache directly with new data
      queryClient.setQueryData(['settings'], updatedData);
      
      // Also invalidate to refetch in background
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to update settings",
        variant: "destructive",
      });
    },
  });
}