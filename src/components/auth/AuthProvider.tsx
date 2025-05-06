
// This file is now just a proxy to maintain compatibility with existing imports
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

// Re-export everything from the main AuthContext and add console warning for deprecated usage
export { AuthProvider };

export const useAuth = () => {
  console.warn('Deprecated: Importing useAuth from components/auth/AuthProvider.tsx is deprecated. Please import from contexts/AuthContext.tsx instead.');
  return useAuth();
};
