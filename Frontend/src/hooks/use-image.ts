// src/hooks/use-image.ts
import { api } from '@/services/api';

export function useImage(filename: string) {
  if (!filename) return '';
  return api.uploads.getImageUrl(filename);
}
