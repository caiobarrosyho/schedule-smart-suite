
import React from "react";
import { useTenant } from "../contexts/TenantContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { Navigate } from "react-router-dom";
import { CalendarIcon, UsersIcon, Bell } from "lucide-react";

const Index: React.FC = () => {
  const { tenant, isLoading } = useTenant();
  const { user, loading: authLoading } = useAuth();

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-tenant mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Carregando...</h2>
        </div>
      </div>
    );
  }

  // Se o usuário estiver logado, redirecionar para o dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              {tenant.logo ? (
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 className="text-xl font-bold text-tenant">{tenant.name}</h1>
              )}
            </div>
            <div>
              <Button asChild className="mr-2">
                <Link to="/login">Entrar</Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="#contact">Contato</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-tenant/10 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Simplifique o agendamento da sua{" "}
              <span className="text-tenant">{tenant.theme === 'dental' ? 'clínica' : tenant.theme === 'barber' ? 'barbearia' : tenant.theme === 'salon' ? 'salão' : 'empresa'}</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Gerencie sua agenda, clientes e finanças em um só lugar com nosso sistema completo de agendamento e gestão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/login">Começar agora</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Conhecer recursos</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Recursos completos para sua gestão
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nossa plataforma foi desenvolvida para atender todas as necessidades de agendamento e gestão da sua {tenant.theme === 'dental' ? 'clínica' : tenant.theme === 'barber' ? 'barbearia' : tenant.theme === 'salon' ? 'salão' : 'empresa'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Agendamento Inteligente</h3>
              <p className="text-gray-600">
                Gerencie sua agenda com eficiência, evite conflitos de horários e configure intervalos personalizados para cada profissional.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Gestão de Clientes</h3>
              <p className="text-gray-600">
                Mantenha um cadastro completo dos seus clientes, incluindo histórico de atendimentos, preferências e documentos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="h-12 w-12 bg-tenant rounded-lg flex items-center justify-center mb-6">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Comunicação Automática</h3>
              <p className="text-gray-600">
                Envie lembretes e confirmações por WhatsApp e email automaticamente, reduzindo faltas e aumentando a satisfação.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-tenant py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para transformar sua gestão?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            Experimente gratuitamente por 30 dias e descubra como podemos ajudar a otimizar seus processos.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/login">Iniciar período de teste</Link>
          </Button>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fale conosco</h2>
            <p className="text-lg text-gray-600">
              Estamos à disposição para responder suas dúvidas e ajudar no que for preciso.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tenant focus:border-tenant"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tenant focus:border-tenant"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Assunto</label>
                <input
                  type="text"
                  id="subject"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tenant focus:border-tenant"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                <textarea
                  id="message"
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-tenant focus:border-tenant"
                ></textarea>
              </div>
              <div>
                <Button type="submit" className="w-full">Enviar mensagem</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{tenant.name}</h3>
              <p className="text-gray-400">
                Sistema completo de agendamento e gestão para {tenant.theme === 'dental' ? 'clínicas' : tenant.theme === 'barber' ? 'barbearias' : tenant.theme === 'salon' ? 'salões' : 'empresas'}.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Links rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <p className="text-gray-400">contato@sistema-agendamento.com</p>
              <p className="text-gray-400">(11) 9999-9999</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {tenant.name}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
