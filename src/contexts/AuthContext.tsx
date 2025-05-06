
import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "super_admin" | "admin" | "professional" | "client";

export interface User {
  id: string;
  name: string;  // Adicionado name explicitamente
  email: string;
  role: UserRole;
  tenantId: string;
  avatar?: string | null;
  createdAt: string;
  // Professional specific fields
  specialty?: string;
  bio?: string;
  // Client specific fields
  phone?: string;
  birthDate?: string;
  medicalNotes?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loading: boolean; // Adicionado para compatibilidade com AuthProvider.tsx
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<void>; // Alias para login
  signOut: () => void; // Alias para logout
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
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to restore session:", err);
        setError("Session expired. Please login again.");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email (in a real app, this would be an API call)
      const foundUser = mockUsers.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      // In a real app, you'd verify the password here
      if (password !== "password") { // Using "password" for all mock users
        throw new Error("Invalid email or password");
      }
      
      // Save user to state and localStorage
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    } catch (err) {
      console.error("Login failed:", err);
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const register = async (data: Partial<User> & { email: string; password: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === data.email)) {
        throw new Error("Email already in use");
      }
      
      // In a real app, you'd send this data to an API endpoint for registration
      // For demo, just log it
      console.log("Register user:", data);
      
      // Create a mock user and log them in
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || "New User",
        email: data.email,
        role: data.role || "client",
        tenantId: data.tenantId || "demo",
        createdAt: new Date().toISOString(),
        ...data
      };
      
      mockUsers.push(newUser);
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Aliases para manter compatibilidade com AuthProvider.tsx
  const signIn = login;
  const signOut = logout;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      loading: isLoading, // Para compatibilidade
      error, 
      login, 
      logout,
      signIn, // Alias para login
      signOut, // Alias para logout 
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
