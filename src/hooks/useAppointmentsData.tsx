
import { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { AppointmentStatus } from '@/types';

// Função para mapear dados brutos para o formato Appointment
export const mapToAppointment = (raw: any): Appointment => ({
  id: raw.id,
  tenantId: raw.tenantId,
  clientId: raw.clientId,
  professionalId: raw.professionalId,
  serviceId: raw.serviceId,
  startTime: raw.startTime,
  endTime: raw.endTime,
  status: raw.status,
  title: raw.title || '',
  notes: raw.notes,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt || raw.createdAt,
  cancelledAt: raw.cancelledAt,
  cancelledBy: raw.cancelledBy,
  cancellationReason: raw.cancellationReason,
  rescheduleCount: raw.rescheduleCount || 0,
  previousAppointment: raw.previousAppointment,
  payment: raw.payment,
  recurrence: raw.recurrence
});

export const useAppointmentsData = () => {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        serviceId: `service-${i}`,
        startTime: pastDate.toISOString(),
        endTime: endDate.toISOString(),
        status: i === 0 ? 'completed' : i === 1 ? 'cancelled' : 'no_show' as AppointmentStatus,
        title: ['Corte de Cabelo', 'Manicure', 'Consulta Dentária'][i % 3],
        notes: i === 1 ? 'Cliente solicitou cancelamento' : undefined,
        createdAt: new Date(pastDate.getTime() - 86400000).toISOString(),
        tenantId: tenant.id || user.tenantId || 'default',
        cancelledAt: i === 1 ? new Date(pastDate.getTime() - 43200000).toISOString() : undefined,
        cancelledBy: i === 1 ? user.id : undefined,
        cancellationReason: i === 1 ? 'Compromisso de trabalho' : undefined,
        rescheduleCount: i === 2 ? 1 : 0,
        payment: i === 0 ? {
          id: `payment-${i}`,
          status: 'completed',
          amount: 50 + (i * 10),
          method: 'credit_card'
        } : undefined
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
        serviceId: `service-${i + 3}`,
        startTime: futureDate.toISOString(),
        endTime: endDate.toISOString(),
        status: i === 0 ? 'scheduled' : 'confirmed' as AppointmentStatus,
        title: ['Consulta Dentária', 'Corte de Cabelo', 'Manicure', 'Coloração'][i % 4],
        createdAt: new Date(futureDate.getTime() - 86400000).toISOString(),
        tenantId: tenant.id || user.tenantId || 'default',
        rescheduleCount: 0
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
  }, [user, tenant]);
  
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
  
  return {
    upcomingAppointments,
    pastAppointments,
    isLoading
  };
};
