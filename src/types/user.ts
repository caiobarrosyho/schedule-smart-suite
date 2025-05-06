
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: "super_admin" | "admin" | "professional" | "client" | "master";
  tenantId?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  specialty?: string;
  bio?: string;
  phone?: string;
  birthDate?: string;
  medicalNotes?: string;
  // Add user_metadata field for compatibility with Supabase Auth
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
  avatar?: string | null;
  createdAt?: string;
}

export type UserRole = "super_admin" | "admin" | "professional" | "client" | "master";
