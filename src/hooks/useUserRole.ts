
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

type UserRole = 'super_admin' | 'admin' | 'professional' | 'client' | null;

interface UseUserRoleResult {
  role: UserRole;
  isLoading: boolean;
  error: string | null;
  tenantId: string | null;
}

export const useUserRole = (tenantId?: string): UseUserRoleResult => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
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
        setIsLoading(true);
        
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
          setRole(data[0].role as UserRole);
          setUserTenantId(data[0].tenant_id);
        } else {
          // Se não encontramos papel para este usuário, vamos assumir 'client' por padrão
          setRole('client');
        }
        
      } catch (err: any) {
        console.error('Erro ao buscar papel do usuário:', err);
        setError(err.message || 'Falha ao carregar informações do usuário');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user, tenantId]);

  return { role, isLoading, error, tenantId: userTenantId };
};
