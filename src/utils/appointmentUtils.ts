
import { AppointmentStatus } from '@/types';

// Função para obter as propriedades do badge de status
export const getStatusBadgeProps = (status: AppointmentStatus) => {
  switch (status) {
    case 'scheduled':
      return { className: "bg-blue-500", label: "Agendado" };
    case 'confirmed':
      return { className: "bg-green-500", label: "Confirmado" };
    case 'completed':
      return { className: "bg-purple-500", label: "Finalizado" };
    case 'cancelled':
      return { className: "bg-red-500", label: "Cancelado" };
    case 'no_show':
      return { className: "bg-yellow-500", label: "Não Compareceu" };
    default:
      return { className: "bg-gray-500", label: status };
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
