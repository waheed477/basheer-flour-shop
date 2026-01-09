// src/hooks/use-settings-final.ts

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

// COMPLETELY SILENT - NO REACT QUERY
export function useSettings() {
  return {
    data: defaultSettings,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: true,
    status: 'success' as const,
  };
}

export function useUpdateSettings() {
  return {
    mutate: () => Promise.resolve(defaultSettings),
    isLoading: false,
    isError: false,
    isSuccess: true,
  };
}