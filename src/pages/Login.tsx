
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTenant } from '@/contexts/TenantContext';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const Login: React.FC = () => {
  const { tenant } = useTenant();
  const { user, loading: isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {tenant.logo ? (
          <img
            src={tenant.logo}
            alt={tenant.name}
            className="mx-auto h-16 w-auto"
          />
        ) : (
          <h1 className="text-center text-3xl font-bold text-tenant">{tenant.name}</h1>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
