
import React, { createContext, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTenant } from "./TenantContext";

interface RouteContextType {
  navigateTo: (path: string) => void;
  getCurrentPath: () => string;
  getTenantPath: (path: string) => string;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant } = useTenant();

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const getCurrentPath = () => {
    return location.pathname;
  };

  // Helper to get a path for a specific tenant (useful for super admin switching between tenants)
  const getTenantPath = (path: string) => {
    // In a real multi-tenant app, we'd construct a subdomain URL here
    // For this demo, we'll just use a query parameter
    return `${path}?subdomain=${tenant.subdomain}`;
  };

  return (
    <RouteContext.Provider value={{ navigateTo, getCurrentPath, getTenantPath }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = () => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};
