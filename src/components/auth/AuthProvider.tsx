
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metaData?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Configurar listener para alterações no estado de autenticação
  useEffect(() => {
    // Primeiro configurar o listener de eventos
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Para debug
        console.log('Auth event:', event);
      }
    );

    // Depois verificar sessão existente
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Erro ao recuperar sessão:', err);
      setError('Falha ao verificar login');
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Limpar qualquer estado de auth existente
      cleanupAuthState();
      
      // Tentar signout global para garantir estado limpo
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continuar mesmo se falhar
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success(`Bem-vindo, ${data.user.email}`);
        // Forçar recarregamento para garantir estado limpo
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Erro de login:', error);
      setError(error.message || 'Falha ao fazer login');
      toast.error(error.message || 'Falha ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const signUp = async (email: string, password: string, metaData?: { first_name?: string; last_name?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Limpar qualquer estado de auth existente
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metaData,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      toast.success('Conta criada com sucesso! Verifique seu email.', {
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setError(error.message || 'Falha ao criar conta');
      toast.error(error.message || 'Falha ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const signOut = async () => {
    try {
      setLoading(true);
      
      // Primeiro limpar o estado local
      cleanupAuthState();
      
      // Depois fazer signout global
      await supabase.auth.signOut({ scope: 'global' });
      
      // Forçar recarregamento para garantir estado limpo
      window.location.href = '/';
      
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  // Função de reset de senha
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Email de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      setError(error.message || 'Falha ao enviar email de recuperação');
      toast.error(error.message || 'Falha ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
