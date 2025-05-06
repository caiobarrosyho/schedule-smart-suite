
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  method?: string;
}

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    
    setTimeout(() => {
      // Dados de exemplo
      const mockPayments: Payment[] = [
        {
          id: '1',
          description: 'Consulta - Dr. Silva',
          amount: 150.00,
          date: '2025-04-15',
          status: 'paid',
          method: 'Cartão de Crédito'
        },
        {
          id: '2',
          description: 'Tratamento Capilar',
          amount: 200.00,
          date: '2025-04-20',
          status: 'pending'
        },
        {
          id: '3',
          description: 'Procedimento Estético',
          amount: 350.00,
          date: '2025-03-20',
          status: 'paid',
          method: 'PIX'
        },
        {
          id: '4',
          description: 'Consulta - Dra. Oliveira',
          amount: 180.00,
          date: '2025-02-10',
          status: 'overdue'
        }
      ];
      
      setPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">Atrasado</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
        </div>
      </AppLayout>
    );
  }

  // Calcular total pendente
  const pendingTotal = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Meus Pagamentos</h1>
          <p className="text-gray-500">Gerencie suas faturas e pagamentos</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 text-tenant mr-2" />
                  <div className="text-2xl font-bold">
                    {formatCurrency(pendingTotal)}
                  </div>
                </div>
                {pendingTotal > 0 && (
                  <Button size="sm">Pagar Agora</Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Último Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.filter(p => p.status === 'paid').length > 0 ? (
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-tenant mr-2" />
                  <div>
                    <div className="text-lg font-medium">
                      {formatCurrency(payments.find(p => p.status === 'paid')?.amount || 0)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(payments.find(p => p.status === 'paid')?.date || '').toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Nenhum pagamento realizado</div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-tenant" />
              Histórico de Pagamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Você não possui histórico de pagamentos.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Descrição</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Data</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Valor</th>
                      <th className="py-2 px-4 text-left font-medium text-gray-500">Status</th>
                      <th className="py-2 px-4 text-right font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {getStatusIcon(payment.status)}
                            <span className="ml-2">{payment.description}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(payment.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {payment.status !== 'paid' ? (
                            <Button size="sm">Pagar</Button>
                          ) : (
                            <Button variant="outline" size="sm">Recibo</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Payments;
