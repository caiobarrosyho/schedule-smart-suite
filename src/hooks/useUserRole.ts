
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/user';

interface UseUserRoleResult {
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  tenantId: string | null;
}

export const useUserRole = (tenantId?: string): UseUserRoleResult => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userTenantId, setUserTenantId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("useUserRole - Starting to fetch role for user:", user.id);
        setIsLoading(true);
        
        // Se o usuário já tem uma role definida no objeto user, use-a
        if (user.role) {
          console.log("useUserRole - User already has role defined:", user.role);
          setRole(user.role as UserRole);
          setUserTenantId(user.tenantId || null);
          setIsLoading(false);
          return;
        }
        
        // Query para encontrar o papel do usuário no tenant específico ou em qualquer tenant
        let query = supabase
          .from('user_roles')
          .select('role, tenant_id')
          .eq('user_id', user.id);
        
        // Se um tenantId foi fornecido, filtre por ele
        if (tenantId) {
          query = query.eq('tenant_id', tenantId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Se o tenantId não foi especificado, pegamos o primeiro papel encontrado
          console.log("useUserRole - Found role from database:", data[0].role);
          setRole(data[0].role as UserRole);
          setUserTenantId(data[0].tenant_id);
        } else {
          // Se não encontramos papel para este usuário, usamos o que está no objeto user
          console.log("useUserRole - Using default role from user object:", user.role || 'client');
          setRole((user.role as UserRole) || 'client');
          setUserTenantId(user.tenantId || null);
        }
        
      } catch (err: any) {
        console.error('useUserRole - Erro ao buscar papel do usuário:', err);
        setError(err.message || 'Falha ao carregar informações do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, tenantId]);

  return { role, isLoading, error, tenantId: userTenantId };
};
