import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "../contexts/TenantContext";
import { AppointmentCalendar } from "../components/appointments/AppointmentCalendar";
import { AppLayout } from "../components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Appointment, AppointmentStatus } from "../types";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Mock data for appointments
const generateMockAppointments = (userId: string, tenantId: string, userRole: string): Appointment[] => {
  const now = new Date();
  const appointments: Appointment[] = [];
  const statuses: AppointmentStatus[] = [
    "scheduled", 
    "confirmed", 
    "completed", 
    "cancelled", 
    "no_show", 
    "rescheduled"
  ];
  
  // Generate appointments for the past week, current week and next week
  for (let day = -7; day <= 14; day++) {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    // Generate 2-5 appointments per day
    const appointmentsPerDay = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < appointmentsPerDay; i++) {
      // Start time between 9 AM and 5 PM
      const startHour = 9 + Math.floor(Math.random() * 8);
      const startMinute = Math.random() < 0.5 ? 0 : 30;
      
      const startTime = new Date(date);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      // Duration between 30 and 90 minutes
      const durationMinutes = (Math.floor(Math.random() * 3) + 1) * 30;
      
      const endTime = new Date(startTime);
      endTime.setMinutes(startTime.getMinutes() + durationMinutes);
      
      // For past appointments, assign a completed/cancelled status
      // For future appointments, assign a scheduled/confirmed status
      let status: AppointmentStatus;
      if (startTime < now) {
        status = Math.random() < 0.8 
          ? "completed" 
          : (Math.random() < 0.5 ? "cancelled" : "no_show");
      } else {
        status = Math.random() < 0.7 ? "scheduled" : "confirmed";
      }
      
      const clientId = userRole === "client" ? userId : `client-${Math.floor(Math.random() * 10) + 1}`;
      const professionalId = userRole === "professional" ? userId : `professional-${Math.floor(Math.random() * 5) + 1}`;
      
      appointments.push({
        id: `apt-${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        clientId,
        professionalId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status,
        title: ["Consulta Regular", "Avaliação", "Retorno", "Procedimento"][Math.floor(Math.random() * 4)],
        notes: Math.random() < 0.3 ? "Observações sobre este agendamento." : undefined,
        createdAt: new Date(startTime.getTime() - 86400000 * (Math.floor(Math.random() * 10) + 1)).toISOString(),
        updatedAt: new Date(startTime.getTime() - 86400000 * Math.floor(Math.random() * 5)).toISOString(),
        rescheduleCount: Math.floor(Math.random() * 2),
      });
    }
  }
  
  return appointments;
};

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const { tenant } = useTenant();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month" | "agenda">("week");

  useEffect(() => {
    // Load appointments (mock data for now)
    if (user) {
      const mockAppointments = generateMockAppointments(user.id, tenant.id, user.role);
      setAppointments(mockAppointments);
      setIsLoading(false);
    }
  }, [user, tenant.id]);

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate >= today && aptDate < tomorrow;
  });

  const upcomingAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.startTime);
    return aptDate >= today && apt.status !== "cancelled";
  });

  const completedAppointments = appointments.filter(apt => apt.status === "completed");
  
  const cancelledAppointments = appointments.filter(apt => apt.status === "cancelled");
  
  const cancellationRate = appointments.length > 0 
    ? Math.round((cancelledAppointments.length / appointments.length) * 100) 
    : 0;
  
  const handleCreateAppointment = (start: Date, end: Date) => {
    // In a real app, this would open a form to create an appointment
    toast.success("Formulário de agendamento seria aberto aqui");
    console.log("Create appointment:", { start, end });
  };

  const handleAppointmentSelect = (appointment: Appointment) => {
    // In a real app, this would show appointment details
    toast.info(`Selecionado: ${appointment.title || "Agendamento"}`);
    console.log("Selected appointment:", appointment);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tenant"></div>
      </div>
    );
  }

  if (!user) {
    return null;  // This should not happen because of ProtectedRoute, but just in case
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Bem-vindo, {user?.name || 'Usuário'}!</p>
          </div>
          <Button className="bg-tenant text-tenant-foreground hover:bg-tenant/90">
            Novo Agendamento
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Agendamentos Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Calendar className="h-6 w-6 text-tenant mr-2" />
                <div className="text-2xl font-bold">{todayAppointments.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Próximos Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-tenant mr-2" />
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Consultas Realizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-tenant mr-2" />
                <div className="text-2xl font-bold">{completedAppointments.length}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Taxa de Cancelamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <XCircle className="h-6 w-6 text-tenant mr-2" />
                <div className="text-2xl font-bold">{cancellationRate}%</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle>Calendário de Agendamentos</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView('day')}
                      className={calendarView === 'day' ? 'bg-tenant text-tenant-foreground' : ''}
                    >
                      Dia
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView('week')}
                      className={calendarView === 'week' ? 'bg-tenant text-tenant-foreground' : ''}
                    >
                      Semana
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCalendarView('month')}
                      className={calendarView === 'month' ? 'bg-tenant text-tenant-foreground' : ''}
                    >
                      Mês
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-0">
                {isLoading ? (
                  <div className="h-[500px] flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-tenant border-t-transparent"></div>
                      <p className="text-lg text-tenant">Carregando...</p>
                    </div>
                  </div>
                ) : (
                  <AppointmentCalendar 
                    appointments={appointments}
                    onAppointmentSelect={handleAppointmentSelect}
                    onCreateAppointment={handleCreateAppointment}
                    view={calendarView}
                    defaultDate={selectedDate}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="today" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos de Hoje</CardTitle>
                <CardDescription>
                  {todayAppointments.length} agendamentos para {new Date().toLocaleDateString("pt-BR")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Não há agendamentos para hoje.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayAppointments.map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAppointmentSelect(appointment)}
                      >
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Clock className="h-6 w-6 text-tenant" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.title || "Agendamento"}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.startTime).toLocaleTimeString("pt-BR", { 
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {new Date(appointment.endTime).toLocaleTimeString("pt-BR", { 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div>
                          {appointment.status === "scheduled" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Agendado
                            </span>
                          )}
                          {appointment.status === "confirmed" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Confirmado
                            </span>
                          )}
                          {appointment.status === "in_progress" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Em Progresso
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximos Agendamentos</CardTitle>
                <CardDescription>
                  {upcomingAppointments.length} agendamentos futuros
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Não há agendamentos futuros.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 5).map(appointment => (
                      <div 
                        key={appointment.id} 
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleAppointmentSelect(appointment)}
                      >
                        <div className="flex items-center">
                          <div className="mr-4">
                            <Calendar className="h-6 w-6 text-tenant" />
                          </div>
                          <div>
                            <h3 className="font-medium">{appointment.title || "Agendamento"}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.startTime).toLocaleDateString("pt-BR")} às {" "}
                              {new Date(appointment.startTime).toLocaleTimeString("pt-BR", { 
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div>
                          {appointment.status === "scheduled" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              Agendado
                            </span>
                          )}
                          {appointment.status === "confirmed" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Confirmado
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {upcomingAppointments.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="ghost">Ver todos os {upcomingAppointments.length} agendamentos</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
