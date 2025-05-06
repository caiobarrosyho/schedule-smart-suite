
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading } = useAuth();

  // Adicionamos logs para depuração
  console.log("ProtectedRoute - Auth state:", { user, loading, requiredRole });

  if (loading) {
    // Show loading state while checking authentication
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
    </div>;
  }

  if (!user) {
    console.log("ProtectedRoute - User not authenticated, redirecting to login");
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    console.log("ProtectedRoute - User doesn't have required role:", requiredRole);
    // Redirect to unauthorized if user doesn't have required role
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and authorized
  console.log("ProtectedRoute - Auth passed, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
