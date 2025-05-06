
import React from 'react';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types/appointment';
import { formatDate, formatTime, getStatusBadge } from '@/utils/appointmentUtils';
import { AppointmentStatusIcon } from './AppointmentStatusIcon';

interface AppointmentCardProps {
  appointment: Appointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
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
        {getStatusBadge(appointment.status)}
        <Button variant="outline" size="sm">
          Detalhes
        </Button>
      </div>
    </div>
  );
};
