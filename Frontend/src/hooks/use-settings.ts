// src/hooks/use-settings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Settings } from '@/shared/schema';
import { useToast } from './use-toast';

export function useSettings() {
  const { toast } = useToast();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      console.log('📡 Fetching settings...');
      try {
        const settings = await api.settings.get();
        console.log('✅ Settings loaded:', settings);
        return settings;
      } catch (error: any) {
        console.error('❌ Failed to load settings:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Settings, any, Partial<Settings>>({
    mutationFn: async (data: Partial<Settings>) => {
      console.log('📡 Updating settings:', data);
      return api.settings.update(data);
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
