
import { AppointmentStatus, Payment } from './index';

export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string;
  professionalId: string;
  serviceId?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  title?: string;
  notes?: string;
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

// Interface para criação de agendamentos
export interface AppointmentCreate {
  clientId: string;
  professionalId: string;
  serviceId?: string;
  startTime: string;
  endTime: string;
  title?: string;
  notes?: string;
}

// Interface para atualização de agendamentos
export interface AppointmentUpdate {
  serviceId?: string;
  startTime?: string;
  endTime?: string;
  status?: AppointmentStatus;
  title?: string;
  notes?: string;
}

// Interface para resposta de agendamentos com dados de cliente e profissional
export interface AppointmentWithRelations extends Appointment {
  client?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  professional?: {
    id: string;
    name: string;
    specialty?: string;
    avatar?: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
}
