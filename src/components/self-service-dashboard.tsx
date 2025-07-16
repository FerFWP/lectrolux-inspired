import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Portal } from "@/components/ui/portal";
import { 
  Filter, 
  Save, 
  Star, 
  StarOff, 
  Eye, 
  Settings, 
  Layout,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Target,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Download,
  RefreshCw
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart as RechartsLineChart, Line } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface DashboardView {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  filters: {
    area: string[];
    status: string[];
    dateRange: {
      start: string;
      end: string;
    };
    budgetRange: {
      min: number;
      max: number;
    };
    currency: string[];
    category: string[];
  };
  widgets: {
    id: string;
    type: 'metric' | 'chart' | 'table' | 'progress';
    title: string;
    position: { x: number; y: number; width: number; height: number };
    config: any;
  }[];
  createdAt: Date;
  lastModified: Date;
}

interface SelfServiceDashboardProps {
  onViewChange?: (view: DashboardView) => void;
}

export function SelfServiceDashboard({ onViewChange }: SelfServiceDashboardProps) {
  const [views, setViews] = useState<DashboardView[]>([]);
  const [currentView, setCurrentView] = useState<DashboardView | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [newViewDescription, setNewViewDescription] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    area: [] as string[],
    status: [] as string[],
    dateRange: { start: "", end: "" },
    budgetRange: { min: 0, max: 5000000 },
    currency: [] as string[],
    category: [] as string[]
  });
  const [availableWidgets, setAvailableWidgets] = useState([
    { id: 'total-budget', type: 'metric', title: 'Orçamento Total', icon: DollarSign },
    { id: 'projects-count', type: 'metric', title: 'Total de Projetos', icon: Target },
    { id: 'critical-projects', type: 'metric', title: 'Projetos Críticos', icon: AlertTriangle },
    { id: 'budget-utilization', type: 'progress', title: 'Utilização do Orçamento', icon: TrendingUp },
    { id: 'area-distribution', type: 'chart', title: 'Distribuição por Área', icon: PieChart },
    { id: 'monthly-trend', type: 'chart', title: 'Tendência Mensal', icon: LineChart },
    { id: 'status-overview', type: 'chart', title: 'Status dos Projetos', icon: BarChart3 },
    { id: 'recent-projects', type: 'table', title: 'Projetos Recentes', icon: Calendar }
  ]);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedViews();
  }, []);

  const loadSavedViews = () => {
    // Mock data - in real app, load from API
    const mockViews: DashboardView[] = [
      {
        id: "1",
        name: "Visão Executiva",
        description: "Dashboard principal para executivos",
        isFavorite: true,
        filters: {
          area: [],
          status: [],
          dateRange: { start: "2025-01-01", end: "2025-12-31" },
          budgetRange: { min: 0, max: 5000000 },
          currency: [],
          category: []
        },
        widgets: [
          {
            id: "1",
            type: "metric",
            title: "Orçamento Total",
            position: { x: 0, y: 0, width: 3, height: 2 },
            config: { value: 2500000, currency: "BRL", change: "+12%" }
          },
          {
            id: "2",
            type: "chart",
            title: "Distribuição por Área",
            position: { x: 3, y: 0, width: 6, height: 4 },
            config: { chartType: "pie" }
          }
        ],
        createdAt: new Date(2025, 0, 1),
        lastModified: new Date(2025, 0, 15)
      },
      {
        id: "2",
        name: "Análise Financeira",
        description: "Foco em métricas financeiras",
        isFavorite: false,
        filters: {
          area: ["TI", "Marketing"],
          status: ["Em Andamento", "Crítico"],
          dateRange: { start: "2025-01-01", end: "2025-06-30" },
          budgetRange: { min: 100000, max: 1000000 },
          currency: ["BRL"],
          category: ["CAPEX", "OPEX"]
        },
        widgets: [
          {
            id: "3",
            type: "metric",
            title: "Projetos Críticos",
            position: { x: 0, y: 0, width: 3, height: 2 },
            config: { value: 3, trend: "up", color: "red" }
          }
        ],
        createdAt: new Date(2025, 0, 5),
        lastModified: new Date(2025, 0, 10)
      }
    ];

    setViews(mockViews);
    setCurrentView(mockViews[0]);
  };

  const handleCreateView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, insira um nome para a nova visão",
        variant: "destructive"
      });
      return;
    }

    const newView: DashboardView = {
      id: Date.now().toString(),
      name: newViewName,
      description: newViewDescription,
      isFavorite: false,
      filters: activeFilters,
      widgets: [],
      createdAt: new Date(),
      lastModified: new Date()
    };

    setViews(prev => [...prev, newView]);
    setCurrentView(newView);
    setNewViewName("");
    setNewViewDescription("");
    setShowCreateDialog(false);

    toast({
      title: "Visão criada",
      description: `Nova visão "${newView.name}" criada com sucesso`,
    });
  };

  const handleToggleFavorite = (viewId: string) => {
    setViews(prev => prev.map(view => 
      view.id === viewId ? { ...view, isFavorite: !view.isFavorite } : view
    ));
  };

  const handleSaveView = () => {
    if (!currentView) return;

    const updatedView = {
      ...currentView,
      filters: activeFilters,
      lastModified: new Date()
    };

    setViews(prev => prev.map(view => 
      view.id === currentView.id ? updatedView : view
    ));

    setCurrentView(updatedView);
    setIsEditing(false);

    toast({
      title: "Visão salva",
      description: "Alterações salvas com sucesso",
    });
  };

  const handleDeleteView = (viewId: string) => {
    setViews(prev => prev.filter(view => view.id !== viewId));
    if (currentView?.id === viewId) {
      setCurrentView(views.find(v => v.id !== viewId) || null);
    }

    toast({
      title: "Visão removida",
      description: "Visão removida com sucesso",
    });
  };

  const handleExportView = () => {
    if (!currentView) return;

    toast({
      title: "Exportando dashboard",
      description: "Preparando exportação em PDF...",
    });

    // Simulate export
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: "Dashboard exportado com sucesso",
      });
    }, 2000);
  };

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case 'metric':
        return (
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{widget.title}</p>
                  <p className="text-2xl font-bold">
                    {widget.config.currency ? 
                      `R$ ${widget.config.value.toLocaleString('pt-BR')}` : 
                      widget.config.value.toLocaleString('pt-BR')}
                  </p>
                  {widget.config.change && (
                    <p className="text-xs text-muted-foreground">{widget.config.change}</p>
                  )}
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        );

      case 'chart':
        const chartData = [
          { name: 'TI', value: 35 },
          { name: 'Marketing', value: 25 },
          { name: 'Operações', value: 20 },
          { name: 'Financeiro', value: 20 }
        ];

        return (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="h-full">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Widget: {widget.title}</p>
            </CardContent>
          </Card>
        );
    }
  };

  const FilterSection = () => (
    <div className="space-y-4">
      <div>
        <Label>Áreas</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['TI', 'Marketing', 'Operações', 'Financeiro', 'RH'].map(area => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox 
                id={area}
                checked={activeFilters.area.includes(area)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setActiveFilters(prev => ({ ...prev, area: [...prev.area, area] }));
                  } else {
                    setActiveFilters(prev => ({ ...prev, area: prev.area.filter(a => a !== area) }));
                  }
                }}
              />
              <Label htmlFor={area}>{area}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Status</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Em Andamento', 'Planejado', 'Concluído', 'Crítico'].map(status => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox 
                id={status}
                checked={activeFilters.status.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setActiveFilters(prev => ({ ...prev, status: [...prev.status, status] }));
                  } else {
                    setActiveFilters(prev => ({ ...prev, status: prev.status.filter(s => s !== status) }));
                  }
                }}
              />
              <Label htmlFor={status}>{status}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Data Início</Label>
          <Input
            type="date"
            value={activeFilters.dateRange.start}
            onChange={(e) => setActiveFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, start: e.target.value }
            }))}
          />
        </div>
        <div>
          <Label>Data Fim</Label>
          <Input
            type="date"
            value={activeFilters.dateRange.end}
            onChange={(e) => setActiveFilters(prev => ({
              ...prev,
              dateRange: { ...prev.dateRange, end: e.target.value }
            }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b">
        <div className="flex-1">
          <h3 className="text-2xl font-bold">Dashboard Self-Service</h3>
          <p className="text-muted-foreground">Crie e customize suas próprias visões</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Sair da Edição' : 'Editar'}
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4" />
            Nova Visão
          </Button>
          
          {/* Custom Modal for "Nova Visão" */}
          {showCreateDialog && (
            <Portal>
              <div 
                className="fixed inset-0 bg-black/80 z-[10001] flex items-center justify-center p-4 animate-fade-in"
                onClick={() => setShowCreateDialog(false)}
              >
                <div 
                  className="bg-background border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-scale-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Criar Nova Visão</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowCreateDialog(false)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18" />
                          <path d="M6 6l12 12" />
                        </svg>
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Nome da Visão</Label>
                        <Input
                          value={newViewName}
                          onChange={(e) => setNewViewName(e.target.value)}
                          placeholder="Ex: Visão Executiva"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input
                          value={newViewDescription}
                          onChange={(e) => setNewViewDescription(e.target.value)}
                          placeholder="Descrição da visão"
                          className="mt-1"
                        />
                      </div>
                      <Separator />
                      <div>
                        <Label>Filtros</Label>
                        <div className="mt-2">
                          <FilterSection />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleCreateView}>Criar Visão</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Portal>
          )}
        </div>
      </div>

      {/* Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-thin">
        {/* Saved Views */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Visões Salvas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 md:flex-nowrap md:overflow-x-auto pb-2">
              {views.map(view => (
                <Card 
                  key={view.id} 
                  className={`cursor-pointer transition-all hover:shadow-md min-w-[280px] md:min-w-[320px] ${
                    currentView?.id === view.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setCurrentView(view)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{view.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{view.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(view.id);
                        }}
                      >
                        {view.isFavorite ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Modificado: {view.lastModified.toLocaleDateString('pt-BR')}</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteView(view.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current View */}
        {currentView && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {currentView.name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={handleExportView}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Atualizar
                  </Button>
                  {isEditing && (
                    <Button size="sm" onClick={handleSaveView}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-4">Filtros da Visão</h4>
                  <FilterSection />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentView.widgets.map(widget => (
                  <div key={widget.id} className="relative">
                    {renderWidget(widget)}
                    {isEditing && (
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="mt-6 p-4 border-2 border-dashed border-muted rounded-lg">
                  <h4 className="font-medium mb-4">Adicionar Widget</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {availableWidgets.map(widget => (
                      <Button
                        key={widget.id}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2"
                        onClick={() => console.log('Add widget', widget.id)}
                      >
                        <widget.icon className="h-4 w-4" />
                        {widget.title}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}