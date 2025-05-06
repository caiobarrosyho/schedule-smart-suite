
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Appointment } from '@/types/appointment';
import { formatDate, formatTime, getStatusBadgeProps } from '@/utils/appointmentUtils';
import { AppointmentStatusIcon } from './AppointmentStatusIcon';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const badgeProps = getStatusBadgeProps(appointment.status);
  
  return (
    <div 
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center space-x-4">
        <AppointmentStatusIcon startTime={appointment.startTime} />
        <div>
          <h3 className="font-medium">{appointment.title}</h3>
          <p className="text-sm text-gray-500">
            {formatDate(appointment.startTime)} às {formatTime(appointment.startTime)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge className={badgeProps.className}>{badgeProps.label}</Badge>
        <Button variant="outline" size="sm">
          Detalhes
        </Button>
      </div>
    </div>
  );
};
