
// This file is now just a proxy to maintain compatibility with existing imports
import { AuthProvider as MainAuthProvider } from '@/contexts/AuthContext';
import { useAuth as useMainAuth } from '@/contexts/AuthContext';

// Re-export the AuthProvider from the main context
export const AuthProvider = MainAuthProvider;

// Create a wrapper function with a console warning
export const useAuth = () => {
  console.warn('Deprecated: Importing useAuth from components/auth/AuthProvider.tsx is deprecated. Please import from contexts/AuthContext.tsx instead.');
  return useMainAuth();
};
