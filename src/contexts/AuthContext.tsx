
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from "@/types/user";
import { AuthContextType, mockUsers } from "@/types/auth";
import { mapSupabaseUserToUser, cleanupAuthState } from "@/utils/authUtils";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from Supabase or localStorage fallback)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to get authenticated user from Supabase
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          // If user is in Supabase, map to our User type
          const mappedUser = await mapSupabaseUserToUser(supabaseUser);
          setUser(mappedUser);
          localStorage.setItem("user", JSON.stringify(mappedUser));
        } else {
          // Fallback to localStorage for mock flow
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        setError("Session expired. Please login again.");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        if (event === 'SIGNED_IN' && session?.user) {
          const mappedUser = await mapSupabaseUserToUser(session.user);
          setUser(mappedUser);
          localStorage.setItem("user", JSON.stringify(mappedUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem("user");
        }
        setIsLoading(false);
      }
    );

    checkAuth();
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Extract authentication methods to a separate hook file
  const { login, logout, register } = useAuthMethods(setUser, setIsLoading, setError);

  // Aliases for compatibility with AuthProvider.tsx
  const signIn = login;
  const signOut = logout;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      loading: isLoading, // For compatibility
      error, 
      login, 
      logout,
      signIn, // Alias for login
      signOut, // Alias for logout 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Import the auth methods
import { useAuthMethods } from "@/hooks/useAuthMethods";
