
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTenant } from '@/contexts/TenantContext';
import { Shield } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const { tenant } = useTenant();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <Shield className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Acesso negado</h2>
        <p className="text-lg text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <p className="text-md text-gray-500 mb-8">
          Se você acredita que deveria ter acesso, entre em contato com o administrador de {tenant.name}.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/dashboard">Ir para o Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
