
import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Index from './pages/Index';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { useAuth } from './contexts/AuthContext';

// Importar as novas páginas
import MyAppointments from './pages/MyAppointments';
import Documents from './pages/Documents';
import Payments from './pages/Payments';
import Profile from './pages/Profile';
import TenantManagement from './pages/TenantManagement';
import UserManagement from './pages/UserManagement';

import './App.css';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const { isLoading, user } = useAuth();
  
  useEffect(() => {
    console.log("App mounted, auth state:", { isLoading, user });
  }, [isLoading, user]);

  if (isLoading) {
    console.log("App - Auth is loading");
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Novas rotas protegidas */}
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <MyAppointments />
          </ProtectedRoute>
        } />
        
        <Route path="/documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        
        <Route path="/payments" element={
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Rota de gerenciamento de tenants - apenas para usuários master */}
        <Route path="/tenant-management" element={
          <RoleProtectedRoute allowedRoles={['master']}>
            <TenantManagement />
          </RoleProtectedRoute>
        } />

        {/* Nova rota de gerenciamento de usuários - apenas para usuários master */}
        <Route path="/user-management" element={
          <RoleProtectedRoute allowedRoles={['master']}>
            <UserManagement />
          </RoleProtectedRoute>
        } />
        
        {/* Fallback para rotas não encontradas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
