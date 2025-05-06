
import React from 'react';
import { Link } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { tenant } = useTenant();
  const { user } = useAuth();

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

      {/* Adicionar um link para a página de gerenciamento de tenants para usuários master */}
      {user?.role === 'master' && (
        <div className="mt-6 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Administração Master</h2>
          <p className="mb-4">Como usuário master, você tem acesso ao gerenciamento de tenants (lojas/clínicas) e usuários.</p>
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Link to="/tenant-management" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Gerenciar Tenants
            </Link>
            <Link to="/user-management" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Gerenciar Usuários
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
