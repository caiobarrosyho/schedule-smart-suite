
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { AuthContextType, mockUsers } from "@/types/auth";
import { mapSupabaseUserToUser, cleanupAuthState } from "@/utils/authUtils";
import { useAuthMethods } from "@/hooks/useAuthMethods";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Extract authentication methods to a separate hook file
  const { login, logout, register } = useAuthMethods(setUser, setIsLoading, setError);

  // Check if user is already logged in (from Supabase or localStorage fallback)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Checking authentication state...");
        
        // First try to get authenticated user from Supabase
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        
        if (supabaseUser) {
          console.log("Found authenticated Supabase user:", supabaseUser);
          // If user is in Supabase, map to our User type
          const mappedUser = await mapSupabaseUserToUser(supabaseUser);
          setUser(mappedUser);
          localStorage.setItem("user", JSON.stringify(mappedUser));
        } else {
          // Fallback to localStorage for mock flow
          console.log("No Supabase user, checking localStorage...");
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            console.log("Found user in localStorage");
            const parsedUser = JSON.parse(storedUser);
            
            // Special handling for master user
            if (parsedUser.email === "master@system.com" && parsedUser.role === "master") {
              console.log("Found master user in localStorage, validating...");
              setUser(parsedUser);
            } else {
              // Validate stored user data
              if (!parsedUser.email || !parsedUser.role) {
                console.warn("Stored user data is invalid, logging out");
                localStorage.removeItem("user");
                setUser(null);
              } else {
                setUser(parsedUser);
              }
            }
          } else {
            console.log("No user found in localStorage");
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        setError("Session expired. Please login again.");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
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
