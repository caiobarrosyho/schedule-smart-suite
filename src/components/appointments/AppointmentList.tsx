
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Appointment } from '@/types/appointment';
import { AppointmentCard } from './AppointmentCard';
import { Calendar, AlertCircle } from 'lucide-react';
import { EmptyAppointments } from './EmptyAppointments';

interface AppointmentListProps {
  title: string;
  icon: 'upcoming' | 'past';
  appointments: Appointment[];
  emptyMessage: string;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  title,
  icon,
  appointments,
  emptyMessage,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {icon === 'upcoming' ? (
            <Calendar className="mr-2 h-5 w-5 text-tenant" />
          ) : (
            <AlertCircle className="mr-2 h-5 w-5 text-tenant" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <EmptyAppointments message={emptyMessage} />
        ) : (
          <div className="space-y-4">
            {appointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
