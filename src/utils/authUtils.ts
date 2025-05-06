
import { User, UserRole } from "@/types/user";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";

// Helper function to convert Supabase User to our User interface
export const mapSupabaseUserToUser = async (sbUser: SupabaseUser): Promise<User> => {
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

// Function to clean up auth state
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('user');
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};
