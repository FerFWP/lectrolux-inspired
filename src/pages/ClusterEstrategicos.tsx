import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Filter, Search } from 'lucide-react';

const CLUSTER_COLORS = {
  'ESG': '#22c55e',
  'Inovação': '#3b82f6',
  'Digital': '#8b5cf6',
  'Eficiência': '#f59e0b',
  'Compliance': '#ef4444',
  'Expansão': '#06b6d4'
};

const clustersData = [
  {
    name: 'ESG',
    budget: 45000000,
    realized: 32000000,
    projects: 12,
    roi: 18.5,
    eva: 8500000,
    npv: 12500000,
    priority: 'Prioridade Corporativa 2025',
    growth: 15.2
  },
  {
    name: 'Inovação',
    budget: 38000000,
    realized: 28000000,
    projects: 8,
    roi: 22.3,
    eva: 9200000,
    npv: 15200000,
    priority: 'Estratégico',
    growth: 12.8
  },
  {
    name: 'Digital',
    budget: 42000000,
    realized: 35000000,
    projects: 15,
    roi: 19.7,
    eva: 7800000,
    npv: 13800000,
    priority: 'Prioridade Corporativa 2025',
    growth: 20.1
  },
  {
    name: 'Eficiência',
    budget: 28000000,
    realized: 25000000,
    projects: 18,
    roi: 16.2,
    eva: 6200000,
    npv: 9800000,
    priority: 'Operacional',
    growth: 8.5
  },
  {
    name: 'Compliance',
    budget: 22000000,
    realized: 20000000,
    projects: 10,
    roi: 12.1,
    eva: 4200000,
    npv: 6500000,
    priority: 'Mandatório',
    growth: 5.2
  },
  {
    name: 'Expansão',
    budget: 35000000,
    realized: 24000000,
    projects: 6,
    roi: 25.8,
    eva: 11200000,
    npv: 18500000,
    priority: 'Estratégico',
    growth: 18.9
  }
];

const projectsByCluster = {
  'ESG': [
    { name: 'Neutralidade Carbônica', progress: 75, leader: 'Ana Silva', country: 'Brasil', status: 'Em andamento' },
    { name: 'Economia Circular', progress: 60, leader: 'João Santos', country: 'México', status: 'Em andamento' },
    { name: 'Energia Renovável', progress: 90, leader: 'Maria Costa', country: 'Argentina', status: 'Finalizado' }
  ],
  'Inovação': [
    { name: 'Smart Home Platform', progress: 85, leader: 'Carlos Lima', country: 'Brasil', status: 'Em andamento' },
    { name: 'IoT Refrigerators', progress: 70, leader: 'Ana Rodriguez', country: 'México', status: 'Em andamento' }
  ],
  'Digital': [
    { name: 'Digital Commerce', progress: 65, leader: 'Pedro Oliveira', country: 'Brasil', status: 'Em andamento' },
    { name: 'AI Analytics', progress: 80, leader: 'Sofia Martinez', country: 'Colômbia', status: 'Em andamento' }
  ]
};

const ClusterEstrategicos: React.FC = () => {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'Prioridade Corporativa 2025': return 'destructive';
      case 'Estratégico': return 'default';
      case 'Operacional': return 'secondary';
      case 'Mandatório': return 'outline';
      default: return 'secondary';
    }
  };

  const totalBudget = clustersData.reduce((sum, cluster) => sum + cluster.budget, 0);
  const totalRealized = clustersData.reduce((sum, cluster) => sum + cluster.realized, 0);
  const totalProjects = clustersData.reduce((sum, cluster) => sum + cluster.projects, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clusters Estratégicos</h1>
          <p className="text-muted-foreground">Distribuição estratégica de investimentos e projetos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'pie' ? 'default' : 'outline'}
            onClick={() => setViewMode('pie')}
            size="sm"
          >
            Pizza
          </Button>
          <Button
            variant={viewMode === 'bar' ? 'default' : 'outline'}
            onClick={() => setViewMode('bar')}
            size="sm"
          >
            Barras
          </Button>
        </div>
      </div>

      {/* Métricas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Realizado</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRealized)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Projetos</p>
                <p className="text-2xl font-bold">{totalProjects}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Execução</p>
                <p className="text-2xl font-bold">{Math.round((totalRealized / totalBudget) * 100)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Orçamento por Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {viewMode === 'pie' ? (
                <PieChart>
                  <Pie
                    data={clustersData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="budget"
                  >
                    {clustersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              ) : (
                <BarChart data={clustersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="budget" fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orçamento vs Realizado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clustersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" name="Orçamento" />
                <Bar dataKey="realized" fill="#22c55e" name="Realizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Clusters Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clustersData.map((cluster) => (
          <Card 
            key={cluster.name} 
            className={`cursor-pointer transition-all hover:shadow-lg ${selectedCluster === cluster.name ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCluster(selectedCluster === cluster.name ? null : cluster.name)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{cluster.name}</CardTitle>
                <Badge variant={getPriorityBadgeVariant(cluster.priority)}>
                  {cluster.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Orçamento:</span>
                <span className="font-medium">{formatCurrency(cluster.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Realizado:</span>
                <span className="font-medium">{formatCurrency(cluster.realized)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Projetos:</span>
                <span className="font-medium">{cluster.projects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">ROI:</span>
                <span className="font-medium text-green-600">{cluster.roi}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">NPV:</span>
                <span className="font-medium">{formatCurrency(cluster.npv)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Crescimento:</span>
                <div className="flex items-center gap-1">
                  {cluster.growth > 10 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-medium ${cluster.growth > 10 ? 'text-green-600' : 'text-red-600'}`}>
                    {cluster.growth}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detalhes do Cluster Selecionado */}
      {selectedCluster && projectsByCluster[selectedCluster] && (
        <Card>
          <CardHeader>
            <CardTitle>Projetos do Cluster: {selectedCluster}</CardTitle>
            <CardDescription>Detalhamento dos projetos em andamento</CardDescription>
            
            {/* Filtros */}
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar projetos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Brasil">Brasil</SelectItem>
                  <SelectItem value="México">México</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="Colômbia">Colômbia</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectsByCluster[selectedCluster]
                .filter(project => 
                  project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                  (countryFilter === '' || project.country === countryFilter) &&
                  (statusFilter === '' || project.status === statusFilter)
                )
                .map((project, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant={project.status === 'Finalizado' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Líder: {project.leader}</span>
                    <span>País: {project.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Progresso:</span>
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClusterEstrategicos;