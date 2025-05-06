
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTenant } from "../../contexts/TenantContext";
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import {
  Calendar,
  Users,
  FileText,
  Settings,
  LogOut,
  User,
  CreditCard,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { Link, useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { tenant, isLoading } = useTenant();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-tenant border-t-transparent"></div>
          <p className="text-lg text-tenant">Carregando...</p>
        </div>
      </div>
    );
  }

  // Menu items based on user role
  const getMenuItems = () => {
    // Base menu items available to all logged in users
    const baseItems = [
      {
        name: "Agenda",
        path: "/dashboard",
        icon: Calendar,
      }
    ];

    // Additional menu items based on role
    if (user?.role === "super_admin") {
      return [
        ...baseItems,
        { name: "Clínicas", path: "/tenants", icon: Users },
        { name: "Usuários", path: "/users", icon: User },
        { name: "Relatórios", path: "/reports", icon: BarChart },
        { name: "Configurações", path: "/settings", icon: Settings },
      ];
    } else if (user?.role === "admin") {
      return [
        ...baseItems,
        { name: "Clientes", path: "/clients", icon: Users },
        { name: "Profissionais", path: "/professionals", icon: User },
        { name: "Financeiro", path: "/finance", icon: CreditCard },
        { name: "Relatórios", path: "/reports", icon: BarChart },
        { name: "Configurações", path: "/settings", icon: Settings },
      ];
    } else if (user?.role === "professional") {
      return [
        ...baseItems,
        { name: "Clientes", path: "/clients", icon: Users },
        { name: "Prontuários", path: "/medical-records", icon: FileText },
        { name: "Meu Perfil", path: "/profile", icon: User },
      ];
    } else {
      // Client
      return [
        ...baseItems,
        { name: "Minhas Consultas", path: "/my-appointments", icon: Calendar },
        { name: "Documentos", path: "/documents", icon: FileText },
        { name: "Pagamentos", path: "/payments", icon: CreditCard },
        { name: "Meu Perfil", path: "/profile", icon: User },
      ];
    }
  };
  
  const menuItems = getMenuItems();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen w-full">
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-64"}`}>
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                {tenant.logo ? (
                  <img
                    src={tenant.logo}
                    alt={tenant.name}
                    className="h-8 w-8 rounded"
                  />
                ) : (
                  <div className="h-8 w-8 rounded bg-tenant text-tenant-foreground flex items-center justify-center font-bold">
                    {tenant.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold">{tenant.name}</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8"
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </SidebarHeader>
          <SidebarContent className="py-4">
            <nav className="space-y-1 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm ${
                    isActive(item.path)
                      ? "bg-tenant text-tenant-foreground"
                      : "text-gray-700 hover:bg-gray-100"
                  } ${sidebarCollapsed ? "justify-center" : "space-x-3"}`}
                >
                  <item.icon className={`h-5 w-5 ${sidebarCollapsed ? "mr-0" : "mr-2"}`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              ))}
            </nav>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            {user && (
              <div className={`flex ${sidebarCollapsed ? "justify-center" : "items-center justify-between"}`}>
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-tenant text-tenant-foreground">
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700"
                  title="Sair"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
      </div>
      
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Toaster />
        <div className="container mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
