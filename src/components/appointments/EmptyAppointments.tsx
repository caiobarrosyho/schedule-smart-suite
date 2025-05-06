
import React from 'react';

interface EmptyAppointmentsProps {
  message: string;
}

export const EmptyAppointments: React.FC<EmptyAppointmentsProps> = ({ message }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      {message}
    </div>
  );
};
