
import { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { AppointmentStatus } from '@/types';
import { generateMockAppointments } from '@/utils/mockAppointmentGenerator';

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

  useEffect(() => {
    // Simular carregamento de dados
    setIsLoading(true);
    
    setTimeout(() => {
      setAppointments(generateMockAppointments(user, tenant));
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
