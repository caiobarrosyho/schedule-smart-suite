
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Rota não encontrada:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-tenant mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
        <div className="space-y-4">
          <p className="max-w-md mx-auto text-gray-500">
            A página que você está procurando não existe ou foi movida para outro endereço.
          </p>
          <Button 
            className="bg-tenant text-tenant-foreground hover:bg-tenant/90"
            onClick={() => window.location.href = "/"}
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
