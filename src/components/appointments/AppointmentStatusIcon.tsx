
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { isInPast } from '@/utils/appointmentUtils';

interface AppointmentStatusIconProps {
  startTime: string;
  isPast?: boolean;
}

export const AppointmentStatusIcon: React.FC<AppointmentStatusIconProps> = ({ 
  startTime,
  isPast = isInPast(startTime)
}) => {
  return (
    <div className={`${isPast ? 'bg-gray-100' : 'bg-tenant/10'} p-3 rounded-full`}>
      {isPast ? (
        <AlertCircle className="h-5 w-5 text-gray-500" />
      ) : (
        <Clock className="h-5 w-5 text-tenant" />
      )}
    </div>
  );
};
