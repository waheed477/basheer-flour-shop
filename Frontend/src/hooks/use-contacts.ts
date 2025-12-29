import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Contact, InsertContact } from '@/shared/schema';
import { useToast } from './use-toast';

export function useContacts() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      console.log('📡 Fetching contacts from backend...');
      try {
        const contacts = await api.contacts.list();
        
        // Transform data to match frontend schema
        const transformedContacts = contacts.map(contact => ({
          id: contact._id,
          name: contact.name || '',
          email: contact.email || '',
          phone: contact.phone || '',
          message: contact.message || '',
          status: contact.status || 'new',
          createdAt: contact.createdAt,
        }));
        
        console.log('✅ Contacts transformed:', transformedContacts.length, 'items');
        return transformedContacts;
      } catch (error: any) {
        console.error('❌ Failed to load contacts:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to load contacts",
        variant: "destructive",
      });
    },
  });
}

export function useCreateContact() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (data: InsertContact) => {
      console.log('📡 Creating contact from:', data.name);
      return api.contacts.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Message sent successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to send message",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'new' | 'read' | 'replied' }) => {
      console.log(`📡 Updating contact ${id} status to ${status}`);
      return await api.contacts.updateStatus(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Success",
        description: `Contact marked as ${variables.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to update contact status",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: number) => {
      console.log(`📡 Deleting contact ID: ${id}`);
      return api.contacts.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: "Success",
        description: "Contact deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.error || "Failed to delete contact",
        variant: "destructive",
      });
    },
  });
}