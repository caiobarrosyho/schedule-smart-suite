
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTenant } from "../../contexts/TenantContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const { tenant } = useTenant();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast.success("Login efetuado com sucesso!");
      if (onSuccess) onSuccess();
    } catch (err) {
      // The error handling is already in the AuthContext
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4">
          {tenant.logo ? (
            <img src={tenant.logo} alt={tenant.name} className="h-12" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-tenant text-tenant-foreground flex items-center justify-center text-xl font-bold">
              {tenant.name.charAt(0)}
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-center">{tenant.name}</CardTitle>
        <CardDescription className="text-center">
          Entre com sua conta para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="focus:border-tenant focus:ring-tenant"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <a href="/forgot-password" className="text-sm text-tenant hover:underline">
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-tenant focus:ring-tenant"
            />
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-tenant hover:bg-tenant/90 text-tenant-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner h-4 w-4 animate-spin rounded-full border-2 border-t-transparent mr-2"></span>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-6">
        <p className="text-sm text-gray-600">
          Não tem uma conta?{" "}
          <a href="/register" className="text-tenant hover:underline">
            Registre-se
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
