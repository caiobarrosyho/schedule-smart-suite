
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppointmentStatus } from '@/types';
import { Appointment } from '@/types/appointment';
import { Button } from '@/components/ui/button';

const MyAppointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Função para mapear dados brutos para o formato Appointment
  const mapToAppointment = (raw: any): Appointment => ({
    id: raw.id,
    clientId: raw.clientId,
    professionalId: raw.professionalId,
    startTime: raw.startTime,
    endTime: raw.endTime,
    status: raw.status,
    title: raw.title,
    createdAt: raw.createdAt,
    tenantId: raw.tenantId,
    updatedAt: raw.updatedAt || raw.createdAt,
    rescheduleCount: raw.rescheduleCount || 0
  });

  // Função para gerar dados de exemplo
  const generateMockAppointments = () => {
    if (!user) return [];
    
    const now = new Date();
    const rawAppointments: any[] = [];
    
    // Criar alguns agendamentos passados
    for (let i = 0; i < 3; i++) {
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - (i + 1));
      pastDate.setHours(9 + i, 0, 0);
      
      const endDate = new Date(pastDate);
      endDate.setMinutes(pastDate.getMinutes() + 60);
      
      rawAppointments.push({
        id: `past-${i}`,
        clientId: user.id,
        professionalId: `prof-${i}`,
        startTime: pastDate.toISOString(),
        endTime: endDate.toISOString(),
        status: i === 0 ? 'completed' : i === 1 ? 'cancelled' : 'no_show',
        title: ['Corte de Cabelo', 'Manicure', 'Consulta Dentária'][i % 3],
        createdAt: new Date(pastDate.getTime() - 86400000).toISOString(),
        tenantId: user.tenantId || 'default',
      });
    }
    
    // Criar alguns agendamentos futuros
    for (let i = 0; i < 4; i++) {
      const futureDate = new Date();
      futureDate.setDate(now.getDate() + i);
      futureDate.setHours(14 + (i % 3), 0, 0);
      
      const endDate = new Date(futureDate);
      endDate.setMinutes(futureDate.getMinutes() + 60);
      
      rawAppointments.push({
        id: `future-${i}`,
        clientId: user.id,
        professionalId: `prof-${i + 3}`,
        startTime: futureDate.toISOString(),
        endTime: endDate.toISOString(),
        status: i === 0 ? 'scheduled' : 'confirmed',
        title: ['Consulta Dentária', 'Corte de Cabelo', 'Manicure', 'Coloração'][i % 4],
        createdAt: new Date(futureDate.getTime() - 86400000).toISOString(),
        tenantId: user.tenantId || 'default',
      });
    }
    
    return rawAppointments.map(mapToAppointment);
  };

  useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    
    setTimeout(() => {
      setAppointments(generateMockAppointments());
      setIsLoading(false);
    }, 1000);
  }, [user]);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Agendado</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmado</Badge>;
      case 'completed':
        return <Badge className="bg-purple-500">Finalizado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelado</Badge>;
      case 'no_show':
        return <Badge className="bg-yellow-500">Não Compareceu</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
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

  // Separar agendamentos futuros e passados
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate >= today;
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  const pastAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate < today;
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Consultas</h1>
          <p className="text-gray-500">Visualize e gerencie seus agendamentos</p>
        </div>
        
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-tenant" />
                Próximos Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Você não possui agendamentos futuros.
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-tenant/10 p-3 rounded-full">
                          <Clock className="h-5 w-5 text-tenant" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.startTime)} às {formatTime(appointment.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-tenant" />
                Histórico de Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pastAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Você não possui histórico de agendamentos.
                </div>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <Clock className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.title}</h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.startTime)} às {formatTime(appointment.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(appointment.status)}
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

// Funções auxiliares
const getStatusBadge = (status: AppointmentStatus) => {
  switch (status) {
    case 'scheduled':
      return <Badge className="bg-blue-500">Agendado</Badge>;
    case 'confirmed':
      return <Badge className="bg-green-500">Confirmado</Badge>;
    case 'completed':
      return <Badge className="bg-purple-500">Finalizado</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Cancelado</Badge>;
    case 'no_show':
      return <Badge className="bg-yellow-500">Não Compareceu</Badge>;
    default:
      return <Badge className="bg-gray-500">{status}</Badge>;
  }
};

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

export default MyAppointments;
