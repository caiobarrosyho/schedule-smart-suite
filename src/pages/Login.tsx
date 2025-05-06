
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTenant } from "../contexts/TenantContext";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

const Login: React.FC = () => {
  const { user } = useAuth();
  const { tenant, isLoading } = useTenant();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm onSuccess={() => {}} />
      </div>
    </div>
  );
};

export default Login;
