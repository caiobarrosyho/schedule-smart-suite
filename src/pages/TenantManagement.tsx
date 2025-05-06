
import React, { useState, useEffect } from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { mockTenants } from '@/contexts/TenantContext';
import { Tenant } from '@/contexts/TenantContext';
import { Plus, Edit, Trash } from 'lucide-react';
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';

const TenantManagement: React.FC = () => {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Record<string, Tenant>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
    name: '',
    subdomain: '',
    theme: 'default'
  });
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    // In a real app, this would fetch from the API/database
    setTenants(mockTenants);
  }, []);

  if (user?.role !== 'master') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>Você não tem permissão para acessar esta página.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleCreateTenant = () => {
    if (!newTenant.name || !newTenant.subdomain) {
      toast.error("Nome e subdomínio são obrigatórios.");
      return;
    }

    const tenantId = newTenant.subdomain as string;
    
    // Check if subdomain already exists
    if (tenants[tenantId]) {
      toast.error("Este subdomínio já está em uso.");
      return;
    }

    const newTenantObj: Tenant = {
      id: tenantId,
      name: newTenant.name,
      subdomain: newTenant.subdomain as string,
      logo: null,
      theme: newTenant.theme as "default" | "dental" | "barber" | "salon" | "custom",
      features: {
        whatsappNotifications: true,
        emailNotifications: true,
        financialModule: true,
        waitingList: true,
        recurrentAppointments: true,
      },
      settings: {
        appointmentDuration: 30,
        workingHours: {
          start: "09:00",
          end: "18:00",
        },
        workingDays: [1, 2, 3, 4, 5],
        cancellationPolicy: {
          timeBeforeInHours: 24,
          penaltyPercentage: 50,
        },
      },
      subscriptionStatus: "trial",
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // In a real app, this would be an API call
    setTenants(prev => ({
      ...prev,
      [tenantId]: newTenantObj
    }));
    
    toast.success("Tenant criado com sucesso!");
    setIsCreating(false);
    setNewTenant({
      name: '',
      subdomain: '',
      theme: 'default'
    });
  };

  const handleUpdateTenant = () => {
    if (!editingTenant) return;
    
    setTenants(prev => ({
      ...prev,
      [editingTenant.subdomain]: editingTenant
    }));
    
    toast.success("Tenant atualizado com sucesso!");
    setEditingTenant(null);
  };

  const handleDeleteTenant = (subdomain: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o tenant ${tenants[subdomain].name}?`)) {
      const newTenants = {...tenants};
      delete newTenants[subdomain];
      setTenants(newTenants);
      toast.success("Tenant excluído com sucesso!");
    }
  };

  return (
    <div className="p-8 w-full max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Tenants</h1>
          <p className="text-muted-foreground">Gerencie as lojas/clínicas na plataforma</p>
        </div>
        <Sheet open={isCreating} onOpenChange={setIsCreating}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} /> Novo Tenant
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Criar Novo Tenant</SheetTitle>
              <SheetDescription>
                Preencha as informações para criar uma nova loja/clínica na plataforma.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Nome da loja/clínica"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomínio</Label>
                <Input
                  id="subdomain"
                  placeholder="subdominio"
                  value={newTenant.subdomain}
                  onChange={(e) => setNewTenant({...newTenant, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                />
                <p className="text-xs text-muted-foreground">Apenas letras minúsculas e números, sem espaços ou caracteres especiais.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Tema</Label>
                <select
                  id="theme"
                  className="w-full rounded-md border border-input px-3 py-2"
                  value={newTenant.theme}
                  onChange={(e) => setNewTenant({...newTenant, theme: e.target.value as any})}
                >
                  <option value="default">Padrão</option>
                  <option value="dental">Dental</option>
                  <option value="barber">Barbearia</option>
                  <option value="salon">Salão</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
              <Button onClick={handleCreateTenant}>Criar Tenant</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(tenants).map(tenant => (
          <Card key={tenant.id} className="overflow-hidden">
            <CardHeader className={`bg-${tenant.theme === 'default' ? 'primary' : tenant.theme} text-white`}>
              <CardTitle>{tenant.name}</CardTitle>
              <CardDescription className="text-white opacity-90">{tenant.subdomain}.example.com</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <span className="text-sm">{tenant.subscriptionStatus === 'trial' ? 'Período de Teste' : tenant.subscriptionStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Tema:</span>
                  <span className="text-sm capitalize">{tenant.theme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Período de Teste:</span>
                  <span className="text-sm">
                    {tenant.trialEndsAt ? new Date(tenant.trialEndsAt).toLocaleDateString('pt-BR') : 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end gap-2 py-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => setEditingTenant(tenant)}>
                    <Edit size={14} /> Editar
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  {editingTenant && (
                    <>
                      <SheetHeader>
                        <SheetTitle>Editar Tenant</SheetTitle>
                        <SheetDescription>
                          Atualize as informações deste tenant.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nome</Label>
                          <Input
                            id="edit-name"
                            value={editingTenant.name}
                            onChange={(e) => setEditingTenant({...editingTenant, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-theme">Tema</Label>
                          <select
                            id="edit-theme"
                            className="w-full rounded-md border border-input px-3 py-2"
                            value={editingTenant.theme}
                            onChange={(e) => setEditingTenant({...editingTenant, theme: e.target.value as any})}
                          >
                            <option value="default">Padrão</option>
                            <option value="dental">Dental</option>
                            <option value="barber">Barbearia</option>
                            <option value="salon">Salão</option>
                            <option value="custom">Personalizado</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-status">Status da Assinatura</Label>
                          <select
                            id="edit-status"
                            className="w-full rounded-md border border-input px-3 py-2"
                            value={editingTenant.subscriptionStatus}
                            onChange={(e) => setEditingTenant({...editingTenant, subscriptionStatus: e.target.value as any})}
                          >
                            <option value="trial">Período de Teste</option>
                            <option value="active">Ativo</option>
                            <option value="past_due">Pagamento Atrasado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setEditingTenant(null)}>Cancelar</Button>
                        <Button onClick={handleUpdateTenant}>Atualizar</Button>
                      </div>
                    </>
                  )}
                </SheetContent>
              </Sheet>
              <Button variant="destructive" size="sm" className="flex items-center gap-1" onClick={() => handleDeleteTenant(tenant.subdomain)}>
                <Trash size={14} /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TenantManagement;
