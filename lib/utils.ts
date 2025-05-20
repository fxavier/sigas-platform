import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Institution } from './constants';
import { INSTITUTIONS } from './constants';
import { format, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate random string for tokens
export function generateRandomString(length: number = 20): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format date using date-fns
export function formatDate(dateString: string, formatString: string = 'PPP') {
  try {
    return format(parseISO(dateString), formatString);
  } catch (error) {
    return dateString;
  }
}

// Map tenant ID to institution
export function getInstitutionByTenantId(tenantId: string): Institution {
  // First try direct mapping by ID
  if (INSTITUTIONS[tenantId]) {
    return INSTITUTIONS[tenantId];
  }

  // Default to AIAS if not found
  // In a real application, you might want to handle this differently
  return INSTITUTIONS['aias'];
}
