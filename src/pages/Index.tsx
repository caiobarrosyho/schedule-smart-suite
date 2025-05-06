
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

const Index: React.FC = () => {
  const { tenant } = useTenant();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    // Enhanced debugging for user authentication
    console.log("Index page - Authentication state:", { user, isLoading });
    console.log("User details:", user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name || user.user_metadata?.full_name
    } : 'Not logged in');
  }, [user, isLoading]);

  // Show a loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
        <span className="ml-3">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à Plataforma</h1>
      <p className="text-gray-700 mb-4">
        Esta é a página inicial da nossa plataforma. Explore os recursos e funcionalidades
        disponíveis para você.
      </p>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Informações da Clínica</h2>
        <p>Nome: {tenant.name}</p>
        <p>Subdomínio: {tenant.subdomain}</p>
        <p>Tema: {tenant.theme}</p>
      </div>

      {user && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Informações do Usuário</h3>
          <p>ID: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Nome: {user.name || user.user_metadata?.full_name || 'N/A'}</p>
          <p>Função: {user.role || 'N/A'}</p>
        </div>
      )}

      {/* Seção de administração master com links para gerenciamento */}
      {user && (user.role === 'master') && (
        <div className="mt-6 p-6 border rounded-lg bg-blue-50">
          <h2 className="text-2xl font-bold mb-4">Administração Master</h2>
          <p className="mb-4">Como usuário master, você tem acesso ao gerenciamento de tenants (lojas/clínicas) e usuários.</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Link to="/tenant-management" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Gerenciar Tenants
            </Link>
            <Link to="/user-management" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Gerenciar Usuários
            </Link>
          </div>
        </div>
      )}

      {/* Login link if not authenticated */}
      {!user && (
        <div className="mt-6 p-6 border rounded-lg bg-blue-50">
          <h2 className="text-2xl font-bold mb-4">Acesso ao Sistema</h2>
          <p className="mb-4">Faça login para acessar todas as funcionalidades da plataforma.</p>
          <Link to="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Fazer Login
          </Link>
          <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
            <p className="text-sm font-medium text-amber-800">
              Para testar como usuário master: use "master" ou "admin" como email e "masterpassword" como senha.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
