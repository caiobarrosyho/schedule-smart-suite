
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppointmentsData } from '@/hooks/useAppointmentsData';
import { AppointmentList } from '@/components/appointments/AppointmentList';

const MyAppointments: React.FC = () => {
  const { upcomingAppointments, pastAppointments, isLoading } = useAppointmentsData();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Minhas Consultas</h1>
          <p className="text-gray-500">Visualize e gerencie seus agendamentos</p>
        </div>
        
        <div className="space-y-8">
          <AppointmentList
            title="Próximos Agendamentos"
            icon="upcoming"
            appointments={upcomingAppointments}
            emptyMessage="Você não possui agendamentos futuros."
          />
          
          <AppointmentList
            title="Histórico de Agendamentos"
            icon="past"
            appointments={pastAppointments}
            emptyMessage="Você não possui histórico de agendamentos."
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default MyAppointments;
