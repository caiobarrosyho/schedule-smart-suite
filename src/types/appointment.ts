
import { AppointmentStatus, Payment } from './index';

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  professionalId: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  title?: string;
  notes?: string;
  serviceId?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  rescheduleCount: number;
  previousAppointment?: {
    startTime: string;
    endTime: string;
    changedAt: string;
    changedBy: string;
  };
  payment?: Payment;
  recurrence?: {
    pattern: "daily" | "weekly" | "monthly";
    interval: number;
    endDate: string;
  };
}
