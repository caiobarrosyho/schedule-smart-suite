
import { User, UserRole } from "./user";
import { Tenant } from "../contexts/TenantContext";

// Appointment status type
export type AppointmentStatus = 
  | "scheduled"   // Default state when created
  | "confirmed"   // Client confirmed they're coming
  | "in_progress" // Currently happening
  | "completed"   // Successfully finished
  | "cancelled"   // Cancelled by client
  | "no_show"     // Client didn't show up
  | "rescheduled" // Appointment was rescheduled to another time
  | "waiting_list"; // On waiting list for a slot

// Payment status type
export type PaymentStatus =
  | "pending"
  | "paid"
  | "partially_paid"
  | "refunded"
  | "cancelled";

// Payment method type
export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "cash"
  | "pix"
  | "bank_transfer"
  | "other";

// Notification type
export type NotificationType =
  | "welcome"
  | "appointment_reminder"
  | "appointment_confirmation"
  | "appointment_cancellation"
  | "appointment_rescheduled"
  | "payment_due"
  | "payment_received";

// Notification channel
export type NotificationChannel =
  | "email"
  | "whatsapp"
  | "sms"
  | "push";

// Appointment interface
export interface Appointment {
  id: string;
  tenantId: string;
  clientId: string; // references User with role "client"
  professionalId: string; // references User with role "professional"
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: AppointmentStatus;
  title?: string;
  notes?: string;
  serviceId?: string; // references Service
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledBy?: string; // userId who cancelled
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
    interval: number; // Every X days/weeks/months
    endDate: string; // ISO date string
  };
}

// Payment interface
export interface Payment {
  id: string;
  tenantId: string;
  appointmentId?: string;
  clientId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  refundedAt?: string;
  installments?: number;
  receiptUrl?: string;
  notes?: string;
}

// Service interface (e.g., haircut, dental cleaning)
export interface Service {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
}

// Service Category interface
export interface ServiceCategory {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

// Working Hours interface
export interface WorkingHours {
  id: string;
  tenantId: string;
  professionalId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  isWorking: boolean; // If false, professional doesn't work this day
  createdAt: string;
  updatedAt: string;
}

// Break Hours interface (lunch breaks, etc.)
export interface BreakHours {
  id: string;
  tenantId: string;
  professionalId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Holiday interface
export interface Holiday {
  id: string;
  tenantId: string;
  name: string;
  date: string; // ISO date string
  isRecurring: boolean; // Repeats every year?
  createdAt: string;
  updatedAt: string;
}

// Client document/photo interface
export interface ClientDocument {
  id: string;
  tenantId: string;
  clientId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  category: "medical_record" | "identity" | "insurance" | "other";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Client tag interface (for segmentation)
export interface ClientTag {
  id: string;
  tenantId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

// Notification interface
export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  content: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  status: "pending" | "sent" | "delivered" | "failed";
  errorMessage?: string;
}

// Tenant Subscription interface
export interface TenantSubscription {
  id: string;
  tenantId: string;
  planId: string;
  status: "active" | "trial" | "cancelled" | "past_due";
  startDate: string;
  endDate?: string;
  trialEndsAt?: string;
  cancelledAt?: string;
  paymentMethod: PaymentMethod;
  paymentProviderId?: string; // ID in payment provider (e.g., Stripe)
  amount: number;
  currency: string;
  isAnnual: boolean;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

// Professional schedule availability
export interface Availability {
  professionalId: string;
  date: string; // ISO date (just the date part)
  availableSlots: TimeSlot[];
}

// Time slot for scheduling
export interface TimeSlot {
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  isAvailable: boolean;
}
