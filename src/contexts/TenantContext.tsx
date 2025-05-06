
import React, { createContext, useContext, useState, useEffect } from "react";

// Types for our tenant data
export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo: string | null;
  theme: "default" | "dental" | "barber" | "salon" | "custom";
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  features: {
    whatsappNotifications: boolean;
    emailNotifications: boolean;
    financialModule: boolean;
    waitingList: boolean;
    recurrentAppointments: boolean;
  };
  settings: {
    appointmentDuration: number; // default duration in minutes
    workingHours: {
      start: string; // Format: "HH:MM"
      end: string;   // Format: "HH:MM"
    };
    workingDays: number[]; // 0 = Sunday, 6 = Saturday
    cancellationPolicy: {
      timeBeforeInHours: number;
      penaltyPercentage: number;
    };
  };
  subscriptionStatus: "trial" | "active" | "past_due" | "cancelled";
  trialEndsAt: string | null;
}

// Mock data for demonstration
const defaultTenant: Tenant = {
  id: "default",
  name: "Demo Clinic",
  subdomain: "demo",
  logo: null,
  theme: "default",
  features: {
    whatsappNotifications: true,
    emailNotifications: true,
    financialModule: true,
    waitingList: true,
    recurrentAppointments: true,
  },
  settings: {
    appointmentDuration: 30,
    workingHours: {
      start: "09:00",
      end: "18:00",
    },
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    cancellationPolicy: {
      timeBeforeInHours: 24,
      penaltyPercentage: 50,
    },
  },
  subscriptionStatus: "trial",
  trialEndsAt: "2025-06-06T00:00:00Z",
};

// Mock tenants for different clinic types
const mockTenants: Record<string, Tenant> = {
  "demo": {
    ...defaultTenant
  },
  "dental": {
    ...defaultTenant,
    id: "dental-clinic",
    name: "Smile Dental Clinic",
    subdomain: "dental",
    logo: null,
    theme: "dental",
    settings: {
      ...defaultTenant.settings,
      appointmentDuration: 60,
    }
  },
  "barber": {
    ...defaultTenant,
    id: "barber-shop",
    name: "Classic Barber Shop",
    subdomain: "barber",
    logo: null,
    theme: "barber",
    settings: {
      ...defaultTenant.settings,
      appointmentDuration: 45,
      workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    }
  },
  "salon": {
    ...defaultTenant,
    id: "beauty-salon",
    name: "Glamour Beauty Salon",
    subdomain: "salon",
    logo: null,
    theme: "salon",
    settings: {
      ...defaultTenant.settings,
      appointmentDuration: 90,
      workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    }
  },
};

interface TenantContextType {
  tenant: Tenant;
  isLoading: boolean;
  error: string | null;
  setTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant>(defaultTenant);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectTenant = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, we'd detect the subdomain from window.location.hostname
        // and fetch tenant data from an API
        const hostname = window.location.hostname;
        let subdomain = 'demo'; // Default
        
        // Extract subdomain from hostname (e.g., clinic.domain.com -> clinic)
        if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          const parts = hostname.split('.');
          if (parts.length > 2) {
            subdomain = parts[0];
          }
        }

        // For development, allow subdomain in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const paramSubdomain = urlParams.get('subdomain');
        if (paramSubdomain) {
          subdomain = paramSubdomain;
        }

        // Find tenant by subdomain in mock data
        const foundTenant = mockTenants[subdomain] || defaultTenant;
        
        // Apply theme class to body
        document.body.classList.remove('theme-dental', 'theme-barber', 'theme-salon');
        if (foundTenant.theme !== 'default' && foundTenant.theme !== 'custom') {
          document.body.classList.add(`theme-${foundTenant.theme}`);
        }
        
        // Apply custom colors if available
        if (foundTenant.theme === 'custom' && foundTenant.customColors) {
          const root = document.documentElement;
          root.style.setProperty('--tenant-primary', foundTenant.customColors.primary);
          root.style.setProperty('--tenant-secondary', foundTenant.customColors.secondary);
          root.style.setProperty('--tenant-accent', foundTenant.customColors.accent);
        }
        
        setTenant(foundTenant);
        setError(null);
      } catch (err) {
        console.error("Failed to load tenant:", err);
        setError("Failed to load clinic configuration");
      } finally {
        setIsLoading(false);
      }
    };

    detectTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};
