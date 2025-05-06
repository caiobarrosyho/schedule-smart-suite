
import React, { useEffect } from "react";
import { useTenant } from "../contexts/TenantContext";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { Button } from "@/components/ui/button";

const Index: React.FC = () => {
  const { tenant, isLoading } = useTenant();
  const { user } = useAuth();

  useEffect(() => {
    document.title = tenant.name || "Sistema de Agendamentos";
  }, [tenant.name]);

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-tenant-secondary to-tenant">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center">
            {tenant.logo ? (
              <img src={tenant.logo} alt={tenant.name} className="h-10" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-tenant-foreground text-tenant flex items-center justify-center font-bold text-lg">
                {tenant.name.charAt(0)}
              </div>
            )}
            <span className="ml-3 text-2xl font-bold text-white">{tenant.name}</span>
          </div>
          <nav>
            <Button 
              className="bg-white text-tenant hover:bg-gray-100"
              onClick={() => window.location.href = "/login"}
            >
              Entrar
            </Button>
          </nav>
        </header>
      
        <main className="my-16 flex flex-col-reverse md:flex-row items-center">
          <div className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Sistema completo de agendamentos para sua clínica
            </h1>
            <p className="text-lg md:text-xl text-white opacity-90 mb-8">
              Gerencie seus agendamentos, clientes e profissionais em um só lugar.
              Otimize seu tempo e aumente a satisfação de seus clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-tenant hover:bg-gray-100"
                onClick={() => window.location.href = "/register"}
              >
                Comece seu período de testes
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                Saiba mais
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center mb-12 md:mb-0">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-tenant-accent-foreground mb-6 text-center">
                  Acesse sua conta
                </h2>
                <LoginForm />
              </div>
            </div>
          </div>
        </main>

        <div className="mt-24 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Funcionalidades principais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Agendamento Inteligente</h3>
              <p className="text-gray-600">
                Configure slots de disponibilidade por profissional, faça agendamentos recorrentes e mantenha uma fila de espera para maximizar sua agenda.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Gestão de Clientes</h3>
              <p className="text-gray-600">
                Mantenha fichas completas de seus clientes, com histórico de atendimento, documentos e preferências personalizadas.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Notificações Automáticas</h3>
              <p className="text-gray-600">
                Envie lembretes por e-mail e WhatsApp automaticamente, reduza faltas e mantenha seus clientes informados.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-tenant-foreground text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Sobre nós</h3>
              <p className="text-white/70">
                Sistema de agendamento multitenancy para diversos tipos de clínicas e serviços.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Links rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white">Funcionalidades</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Planos</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Suporte</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">Política de Privacidade</a></li>
                <li><a href="#" className="text-white/70 hover:text-white">LGPD</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="text-white/70">contato@exemplo.com</li>
                <li className="text-white/70">(11) 99999-9999</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/50">
            <p>© {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
