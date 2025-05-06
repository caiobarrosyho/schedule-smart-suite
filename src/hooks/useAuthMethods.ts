import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { mockUsers } from "@/types/auth";
import { mapSupabaseUserToUser, cleanupAuthState } from "@/utils/authUtils";

export const useAuthMethods = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Clean up existing state for a clean login attempt
      cleanupAuthState();
      
      // Try to sign out globally first to avoid auth conflicts
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.warn("Pre-login signout failed, continuing:", err);
      }
      
      // Special handling for master user - simplified for easier testing
      if (email === "master@example.com" || email === "master") {
        console.log("Master user login detected");
        const masterUser = mockUsers.find(u => u.role === "master");
        
        if (masterUser) {
          console.log("Found master user in mock data:", masterUser);
          
          // Add user_metadata for compatibility
          const enhancedUser: User = {
            ...masterUser,
            user_metadata: {
              full_name: masterUser.name,
              avatar_url: masterUser.avatar || null
            }
          };
          
          // Save user to state and localStorage
          setUser(enhancedUser);
          localStorage.setItem("user", JSON.stringify(enhancedUser));
          setIsLoading(false);
          return;
        }
      }
      
      // Try Supabase login first
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (supabaseError) {
        // If Supabase login fails, try mock users as fallback
        console.warn("Supabase login failed, trying mock system:", supabaseError.message);
        
        // Find user by email (in mock system)
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (!foundUser) {
          throw new Error("Invalid email or password");
        }
        
        // In a real app, you'd verify the password here
        if (password !== "password" && password !== "masterpassword") { // Using "password" for all mock users, "masterpassword" for master
          throw new Error("Invalid email or password");
        }
        
        // Add user_metadata for compatibility
        const enhancedUser: User = {
          ...foundUser,
          user_metadata: {
            full_name: foundUser.name,
            avatar_url: foundUser.avatar || null
          }
        };
        
        console.log("Logging in with mock user:", enhancedUser);
        
        // Save user to state and localStorage
        setUser(enhancedUser);
        localStorage.setItem("user", JSON.stringify(enhancedUser));
      } else if (data.user) {
        // Supabase login successful
        const mappedUser = await mapSupabaseUserToUser(data.user);
        setUser(mappedUser);
        localStorage.setItem("user", JSON.stringify(mappedUser));
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Clean up auth state first
    cleanupAuthState();
    
    // Then try Supabase signout
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (e) {
      console.error("Error signing out of Supabase:", e);
    }
    
    // Always set user to null at the end
    setUser(null);
  };

  const register = async (data: Partial<User> & { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try Supabase registration first
      const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: `${data.name || ''}`,
            avatar_url: data.avatar || null
          }
        }
      });
      
      if (supabaseError) {
        // If Supabase registration fails, fall back to mock system
        console.warn("Supabase registration failed, using mock system:", supabaseError.message);
        
        // Check if email already exists
        if (mockUsers.some(u => u.email === data.email)) {
          throw new Error("Email already in use");
        }
        
        // Create a mock user and log them in
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: data.name || "New User",
          email: data.email,
          role: data.role || "client",
          tenantId: data.tenantId || "demo",
          createdAt: new Date().toISOString(),
          ...data,
          user_metadata: {
            full_name: data.name,
            avatar_url: data.avatar || null
          }
        };
        
        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
      } else if (supabaseData.user) {
        // Supabase registration successful
        const mappedUser = await mapSupabaseUserToUser(supabaseData.user);
        setUser(mappedUser);
        localStorage.setItem("user", JSON.stringify(mappedUser));
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register };
};
