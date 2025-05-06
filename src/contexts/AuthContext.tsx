import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Added for compatibility with AuthProvider.tsx
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>; // Alias for login
  signOut: () => void; // Alias for logout
  register: (data: Partial<User> & { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Super Admin",
    email: "super@example.com",
    role: "super_admin",
    tenantId: "default",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Clinic Admin",
    email: "admin@example.com",
    role: "admin",
    tenantId: "demo",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Dr. Smith",
    email: "doctor@example.com",
    role: "professional",
    tenantId: "demo",
    createdAt: "2023-01-01T00:00:00Z",
    specialty: "Dentist",
    bio: "Experienced dentist specializing in cosmetic procedures.",
  },
  {
    id: "4",
    name: "Jane Doe",
    email: "client@example.com",
    role: "client",
    tenantId: "demo",
    createdAt: "2023-01-01T00:00:00Z",
    phone: "+5511999999999",
    birthDate: "1990-01-01",
    medicalNotes: "No allergies",
  },
  {
    id: "5",
    name: "Master Admin",
    email: "master@example.com",
    role: "master",
    tenantId: "default",
    createdAt: "2023-01-01T00:00:00Z",
  }
];

// Helper function to convert Supabase User to our User interface
const mapSupabaseUserToUser = async (sbUser: SupabaseUser): Promise<User> => {
  // Try to get user role from database
  let role: UserRole = "client"; // Default role
  let tenantId = "default"; // Default tenant
  
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role, tenant_id')
      .eq('user_id', sbUser.id)
      .single();
    
    if (data && !error) {
      role = data.role as UserRole;
      tenantId = data.tenant_id;
    }
  } catch (e) {
    console.error("Error fetching user role:", e);
  }
  
  // Try to get profile data
  let profileData: Record<string, any> = {};
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sbUser.id)
      .single();
    
    if (data && !error) {
      profileData = data;
    }
  } catch (e) {
    console.error("Error fetching user profile:", e);
  }
  
  // Build user object
  const user: User = {
    id: sbUser.id,
    name: sbUser.user_metadata?.full_name || 
          (profileData?.first_name && profileData?.last_name ? 
            `${profileData.first_name} ${profileData.last_name}` : 
            sbUser.email?.split('@')[0] || ''),
    email: sbUser.email || '',
    role: role,
    tenantId: tenantId,
    createdAt: sbUser.created_at || new Date().toISOString(),
    avatar: sbUser.user_metadata?.avatar_url || profileData?.avatar_url || null,
    // Include first_name and last_name for compatibility
    first_name: profileData?.first_name || sbUser.user_metadata?.first_name,
    last_name: profileData?.last_name || sbUser.user_metadata?.last_name,
    avatar_url: profileData?.avatar_url || sbUser.user_metadata?.avatar_url,
    // Include user_metadata for compatibility
    user_metadata: sbUser.user_metadata || {},
    ...profileData
  };
  
  return user;
};

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

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
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
    // Clear localStorage first
    localStorage.removeItem("user");
    
    // Then try Supabase signout
    try {
      await supabase.auth.signOut();
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
