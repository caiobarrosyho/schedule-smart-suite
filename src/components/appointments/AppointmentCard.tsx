
import React from 'react';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppointmentStatus } from '@/types';
import { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <div 
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center space-x-4">
        <div className={`${appointment.startTime < new Date().toISOString() ? 'bg-gray-100' : 'bg-tenant/10'} p-3 rounded-full`}>
          <Clock className={`h-5 w-5 ${appointment.startTime < new Date().toISOString() ? 'text-gray-500' : 'text-tenant'}`} />
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
  );
};

// Funções auxiliares
export const getStatusBadge = (status: AppointmentStatus) => {
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

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};
