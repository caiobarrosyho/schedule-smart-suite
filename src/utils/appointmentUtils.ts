
import { AppointmentStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import React from 'react';

// Função para obter o badge de status com a cor apropriada
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

// Função para formatar a data
export const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit',
    year: 'numeric'
  });
};

// Função para formatar a hora
export const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
};

// Verifica se a data é no passado
export const isInPast = (isoString: string): boolean => {
  const date = new Date(isoString);
  return date < new Date();
};
