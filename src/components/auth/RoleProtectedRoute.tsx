
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Skeleton } from '@/components/ui/skeleton';
import { UserRole } from '@/types/user';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  tenantId?: string;
  fallbackPath?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  tenantId,
  fallbackPath = '/unauthorized',
}) => {
  const { user, isLoading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole(tenantId);
  
  const isLoading = authLoading || roleLoading;

  // Adicionamos logs para depuração
  console.log("RoleProtectedRoute - Auth state:", { user, authLoading, role, roleLoading, allowedRoles });

  if (isLoading) {
    return (
      <div className="p-8 w-full max-w-screen-xl mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("RoleProtectedRoute - User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Master user always has access to everything
  if (user.role === 'master') {
    console.log("RoleProtectedRoute - Master user detected, allowing access");
    return <>{children}</>;
  }

  // Check if user has required role
  if (!role || !allowedRoles.includes(role as UserRole)) {
    console.log("RoleProtectedRoute - User doesn't have required role:", { role, allowedRoles });
    return <Navigate to={fallbackPath} replace />;
  }

  console.log("RoleProtectedRoute - Auth passed, rendering children");
  return <>{children}</>;
};
