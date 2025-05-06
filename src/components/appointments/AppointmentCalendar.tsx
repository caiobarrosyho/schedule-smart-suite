
import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/pt-br";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Appointment } from "../../types";
import { useTenant } from "../../contexts/TenantContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";

// Set up the localizer
moment.locale("pt-br");
const localizer = momentLocalizer(moment);

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAppointmentSelect?: (appointment: Appointment) => void;
  onCreateAppointment?: (start: Date, end: Date) => void;
  view?: "day" | "week" | "month" | "agenda";
  defaultDate?: Date;
  professional?: { id: string; name: string };
  readOnly?: boolean;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAppointmentSelect,
  onCreateAppointment,
  view = "week",
  defaultDate = new Date(),
  professional,
  readOnly = false,
}) => {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<"day" | "week" | "month" | "agenda">(view);
  const [currentDate, setCurrentDate] = useState<Date>(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Transform appointments for the calendar
  const calendarEvents = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.title || "Agendamento",
    start: new Date(appointment.startTime),
    end: new Date(appointment.endTime),
    resource: appointment,
    status: appointment.status,
  }));

  // Event style customization
  const eventStyleGetter = (event: any) => {
    let backgroundColor = "bg-tenant";
    let textColor = "text-tenant-foreground";
    let borderColor = "border-transparent";
    
    if (event.status === "cancelled") {
      backgroundColor = "bg-gray-300";
      textColor = "text-gray-600";
    } else if (event.status === "in_progress") {
      backgroundColor = "bg-yellow-500";
    } else if (event.status === "completed") {
      backgroundColor = "bg-green-500";
    } else if (event.status === "no_show") {
      backgroundColor = "bg-red-500";
    } else if (event.status === "waiting_list") {
      backgroundColor = "bg-purple-500";
      borderColor = "border-dashed border-purple-700";
    }
    
    return {
      className: `${backgroundColor} ${textColor} ${borderColor} rounded-md shadow overflow-hidden p-1`,
      style: {
        borderRadius: "4px",
      },
    };
  };

  // Slot selection handler
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    if (readOnly || !user || (user.role !== "admin" && user.role !== "professional")) return;
    
    // Ensure minimum duration based on tenant settings
    const minDuration = tenant.settings.appointmentDuration;
    const duration = moment.duration(moment(end).diff(moment(start))).asMinutes();
    
    if (duration < minDuration) {
      end = moment(start).add(minDuration, "minutes").toDate();
    }
    
    setSelectedSlot({ start, end });
    setShowCreateDialog(true);
  };

  // Handle appointment click
  const handleSelectEvent = (event: any) => {
    if (onAppointmentSelect) {
      onAppointmentSelect(event.resource);
    }
  };

  // Handle create appointment
  const handleCreateAppointment = () => {
    if (selectedSlot && onCreateAppointment) {
      onCreateAppointment(selectedSlot.start, selectedSlot.end);
      setShowCreateDialog(false);
      setSelectedSlot(null);
    } else {
      toast.error("Não foi possível criar o agendamento. Tente novamente.");
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm relative">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView={currentView}
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        onView={(view: any) => setCurrentView(view)}
        selectable={!readOnly}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        step={15}
        timeslots={4}
        min={moment().hour(tenant.settings.workingHours.start.split(':')[0] as unknown as number).minute(tenant.settings.workingHours.start.split(':')[1] as unknown as number).toDate()}
        max={moment().hour(tenant.settings.workingHours.end.split(':')[0] as unknown as number).minute(tenant.settings.workingHours.end.split(':')[1] as unknown as number).toDate()}
        formats={{
          timeGutterFormat: "HH:mm",
          selectRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
          eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
            `${localizer?.format(start, "HH:mm", culture)} - ${localizer?.format(end, "HH:mm", culture)}`,
        }}
        messages={{
          today: "Hoje",
          previous: "Anterior",
          next: "Próximo",
          month: "Mês",
          week: "Semana",
          day: "Dia",
          agenda: "Agenda",
          date: "Data",
          time: "Hora",
          event: "Agendamento",
          allDay: "Dia todo",
          noEventsInRange: "Não há agendamentos neste período",
        }}
      />
      
      {professional && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-white px-3 py-1 text-sm">
            Profissional: {professional.name}
          </Badge>
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Agendamento</DialogTitle>
            <DialogDescription>
              {selectedSlot && (
                <div className="py-4">
                  <p>
                    Data: {moment(selectedSlot.start).format("DD/MM/YYYY")}
                  </p>
                  <p>
                    Horário: {moment(selectedSlot.start).format("HH:mm")} - {moment(selectedSlot.end).format("HH:mm")}
                  </p>
                  {professional && (
                    <p>
                      Profissional: {professional.name}
                    </p>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-tenant text-tenant-foreground hover:bg-tenant/90" onClick={handleCreateAppointment}>
              Criar Agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
