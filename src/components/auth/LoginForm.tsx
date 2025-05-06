
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const formSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});

type FormData = z.infer<typeof formSchema>;

export const LoginForm: React.FC = () => {
  const { signIn, loading, error } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    await signIn(data.email, data.password);
  };

  const formSignUp = useForm<FormData & { first_name: string; last_name: string }>({
    resolver: zodResolver(formSchema.extend({
      first_name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres' }),
      last_name: z.string().min(2, { message: 'Sobrenome deve ter pelo menos 2 caracteres' }),
    })),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
    },
  });

  const onSignUp = async (data: FormData & { first_name: string; last_name: string }) => {
    const { email, password, first_name, last_name } = data;
    await signIn(email, password);
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      {!showSignUp ? (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Entrar na sua conta</h2>
            <p className="mt-2 text-gray-600">Digite seus dados para acessar o sistema</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <Link to="/reset-password" className="text-sm font-medium text-tenant">
                  Esqueceu a senha?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Button
                variant="link"
                onClick={() => setShowSignUp(true)}
                className="p-0 font-medium text-tenant"
              >
                Cadastre-se
              </Button>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Criar nova conta</h2>
            <p className="mt-2 text-gray-600">Preencha seus dados para se cadastrar</p>
          </div>
          <Form {...formSignUp}>
            <form onSubmit={formSignUp.handleSubmit(onSignUp)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={formSignUp.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formSignUp.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={formSignUp.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formSignUp.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Sua senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Button
                variant="link"
                onClick={() => setShowSignUp(false)}
                className="p-0 font-medium text-tenant"
              >
                Fazer login
              </Button>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
