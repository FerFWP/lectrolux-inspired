import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  X, 
  Edit, 
  Key, 
  Shield, 
  Eye, 
  History,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for users
const mockUsers = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@electrolux.com.br',
    profile: 'Admin',
    status: 'active',
    area: 'TI',
    lastAccess: '2024-01-15T10:30:00Z',
    createdAt: '2023-06-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@electrolux.com.br',
    profile: 'PMO',
    status: 'active',
    area: 'Projetos',
    lastAccess: '2024-01-14T16:45:00Z',
    createdAt: '2023-08-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@electrolux.com.br',
    profile: 'Gestor',
    status: 'inactive',
    area: 'Engenharia',
    lastAccess: '2024-01-10T14:20:00Z',
    createdAt: '2023-09-20T00:00:00Z'
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro.costa@electrolux.com.br',
    profile: 'Visualizador',
    status: 'active',
    area: 'Financeiro',
    lastAccess: '2024-01-15T09:15:00Z',
    createdAt: '2023-10-05T00:00:00Z'
  },
  {
    id: '5',
    name: 'Julia Ferreira',
    email: 'julia.ferreira@electrolux.com.br',
    profile: 'Gestor',
    status: 'active',
    area: 'Marketing',
    lastAccess: '2024-01-15T11:00:00Z',
    createdAt: '2023-11-10T00:00:00Z'
  }
];

// Mock data for user profiles/roles
const mockProfiles = [
  {
    id: 'admin',
    name: 'Admin',
    description: 'Acesso completo ao sistema',
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      projects: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true }
    },
    userCount: 1
  },
  {
    id: 'pmo',
    name: 'PMO',
    description: 'Gerenciamento de projetos e portfólio',
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      projects: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, export: true },
      settings: { view: false, edit: false }
    },
    userCount: 1
  },
  {
    id: 'gestor',
    name: 'Gestor',
    description: 'Gerenciamento de projetos da área',
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      projects: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false }
    },
    userCount: 2
  },
  {
    id: 'visualizador',
    name: 'Visualizador',
    description: 'Apenas visualização de dados',
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      projects: { view: true, create: false, edit: false, delete: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false }
    },
    userCount: 1
  }
];

// Mock audit logs
const mockAuditLogs = [
  {
    id: '1',
    userId: '2',
    userName: 'Carlos Santos',
    action: 'Projeto criado',
    details: 'Criou projeto "Sistema ERP"',
    timestamp: '2024-01-15T14:30:00Z',
    ipAddress: '192.168.1.100'
  },
  {
    id: '2',
    userId: '1',
    userName: 'Ana Silva',
    action: 'Usuário editado',
    details: 'Alterou perfil de Julia Ferreira para Gestor',
    timestamp: '2024-01-15T10:15:00Z',
    ipAddress: '192.168.1.101'
  },
  {
    id: '3',
    userId: '4',
    userName: 'Pedro Costa',
    action: 'Relatório exportado',
    details: 'Exportou relatório de portfólio',
    timestamp: '2024-01-15T09:45:00Z',
    ipAddress: '192.168.1.102'
  }
];

export default function UserAdministration() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [profileFilter, setProfileFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showProfilesModal, setShowProfilesModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    profile: '',
    area: '',
    status: 'active'
  });

  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProfile = profileFilter === 'all' || user.profile.toLowerCase() === profileFilter.toLowerCase();
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesArea = areaFilter === 'all' || user.area === areaFilter;
      
      return matchesSearch && matchesProfile && matchesStatus && matchesArea;
    });
  }, [searchTerm, profileFilter, statusFilter, areaFilter]);

  const areas = [...new Set(mockUsers.map(user => user.area))];

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
    }
    return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Inativo</Badge>;
  };

  const getProfileBadge = (profile: string) => {
    const colors = {
      'Admin': 'bg-purple-100 text-purple-800',
      'PMO': 'bg-blue-100 text-blue-800',
      'Gestor': 'bg-orange-100 text-orange-800',
      'Visualizador': 'bg-gray-100 text-gray-800'
    };
    return <Badge className={colors[profile as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{profile}</Badge>;
  };

  const formatLastAccess = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const handleUserAction = (action: string, user: any) => {
    switch (action) {
      case 'edit':
        setSelectedUser(user);
        setShowAddUserModal(true);
        break;
      case 'reset-password':
        toast({
          title: 'Senha redefinida',
          description: `Nova senha temporária enviada para ${user.email}`,
        });
        break;
      case 'toggle-status':
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toast({
          title: 'Status alterado',
          description: `${user.name} foi ${newStatus === 'active' ? 'ativado' : 'desativado'}`,
        });
        break;
      case 'view-logs':
        setSelectedUser(user);
        setShowAuditModal(true);
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setProfileFilter('all');
    setStatusFilter('all');
    setAreaFilter('all');
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.profile || !newUser.area) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive'
      });
      return;
    }
    
    toast({
      title: 'Usuário criado',
      description: `${newUser.name} foi adicionado ao sistema`,
    });
    
    setNewUser({ name: '', email: '', profile: '', area: '', status: 'active' });
    setShowAddUserModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administração</h1>
              <p className="text-muted-foreground">Gestão de usuários, perfis e permissões</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="profiles">Perfis</TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[300px]"
                  />
                </div>
                
                <Select value={profileFilter} onValueChange={setProfileFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os perfis</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pmo">PMO</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                    <SelectItem value="visualizador">Visualizador</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchTerm || profileFilter !== 'all' || statusFilter !== 'all' || areaFilter !== 'all') && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Limpar filtros
                  </Button>
                )}
              </div>

              <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Adicionar usuário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedUser ? 'Editar usuário' : 'Adicionar novo usuário'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          placeholder="Digite o nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail corporativo *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          placeholder="usuario@electrolux.com.br"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="profile">Perfil de acesso *</Label>
                        <Select value={newUser.profile} onValueChange={(value) => setNewUser({...newUser, profile: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o perfil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="PMO">PMO</SelectItem>
                            <SelectItem value="Gestor">Gestor</SelectItem>
                            <SelectItem value="Visualizador">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Área *</Label>
                        <Select value={newUser.area} onValueChange={(value) => setNewUser({...newUser, area: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a área" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map(area => (
                              <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="status"
                        checked={newUser.status === 'active'}
                        onCheckedChange={(checked) => setNewUser({...newUser, status: checked ? 'active' : 'inactive'})}
                      />
                      <Label htmlFor="status">Usuário ativo</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowAddUserModal(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddUser}>
                        {selectedUser ? 'Salvar alterações' : 'Criar usuário'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Users Table */}
            <Card>
              <CardContent className="p-0">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-muted-foreground">
                      Tente ajustar os filtros ou adicionar novos usuários ao sistema.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail</TableHead>
                          <TableHead>Perfil</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Área</TableHead>
                          <TableHead>Último acesso</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell className="text-muted-foreground">{user.email}</TableCell>
                            <TableCell>{getProfileBadge(user.profile)}</TableCell>
                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                            <TableCell>{user.area}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatLastAccess(user.lastAccess)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUserAction('edit', user)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Editar usuário</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Key className="w-4 h-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Redefinir senha</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Uma nova senha temporária será enviada para o e-mail do usuário {user.name}. 
                                              O usuário deverá alterar a senha no primeiro acesso.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleUserAction('reset-password', user)}>
                                              Redefinir senha
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TooltipTrigger>
                                    <TooltipContent>Redefinir senha</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Shield className={`w-4 h-4 ${user.status === 'active' ? 'text-red-500' : 'text-green-500'}`} />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              {user.status === 'active' ? 'Bloquear usuário' : 'Desbloquear usuário'}
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              {user.status === 'active' 
                                                ? `${user.name} será bloqueado e perderá acesso imediato ao sistema.`
                                                : `${user.name} será desbloqueado e poderá acessar o sistema novamente.`
                                              }
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleUserAction('toggle-status', user)}>
                                              {user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {user.status === 'active' ? 'Bloquear usuário' : 'Desbloquear usuário'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUserAction('view-logs', user)}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Visualizar logs</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProfiles.map((profile) => (
                <Card key={profile.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{profile.name}</CardTitle>
                      <Badge variant="outline">{profile.userCount} usuários</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{profile.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                        <div className="space-y-1 text-xs">
                          {Object.entries(profile.permissions).map(([module, perms]) => (
                            <div key={module} className="flex justify-between">
                              <span className="capitalize">{module}:</span>
                              <span className="text-muted-foreground">
                                {Object.entries(perms).filter(([_, allowed]) => allowed).map(([perm]) => perm).join(', ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="w-3 h-3 mr-1" />
                        Editar permissões
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Log de auditoria</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar logs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Detalhes</TableHead>
                        <TableHead>IP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAuditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="font-medium">{log.userName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{log.details}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {log.ipAddress}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Logs Modal */}
        <Dialog open={showAuditModal} onOpenChange={setShowAuditModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Logs de atividade - {selectedUser?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Histórico de ações realizadas por este usuário nos últimos 30 dias.
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data/Hora</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Detalhes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAuditLogs
                      .filter(log => log.userId === selectedUser?.id)
                      .map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs">
                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{log.action}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{log.details}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}