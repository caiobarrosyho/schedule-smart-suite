
import { User, UserRole } from "./user";
import { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthContextType {
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

// Mock users for demonstration
export const mockUsers: User[] = [
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
