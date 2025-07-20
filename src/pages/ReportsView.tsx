import React, { useState, useEffect } from 'react';
import { Search, Star, StarOff, TrendingUp, Calendar, Building, DollarSign, BarChart3, PieChart, LineChart, Activity, Target, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface Report {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route: string;
  category: 'financial' | 'operational' | 'strategic';
  lastUpdated: string;
  isNew?: boolean;
  previewData?: {
    value: string;
    trend: 'up' | 'down' | 'stable';
    percentage: string;
  };
}

const reports: Report[] = [
  {
    id: 'bu-analysis',
    name: 'BU Analysis',
    description: 'Análise detalhada de Business Units com comparativo YTD e desvios',
    icon: BarChart3,
    route: '/vmo-latam/capex-meeting',
    category: 'financial',
    lastUpdated: 'Hoje',
    isNew: true,
    previewData: { value: 'R$ 12.5M', trend: 'up', percentage: '+5.2%' }
  },
  {
    id: 'sop-assertiveness',
    name: 'Assertividade SOP',
    description: 'Análise de assertividade dos processos Sales & Operations Planning',
    icon: Target,
    route: '/vmo-latam/dashboard',
    category: 'operational',
    lastUpdated: 'Ontem',
    previewData: { value: '87.3%', trend: 'up', percentage: '+2.1%' }
  },
  {
    id: 'portfolio',
    name: 'Portfólio',
    description: 'Visão completa do portfólio de projetos e investimentos',
    icon: PieChart,
    route: '/vmo-latam/dashboard',
    category: 'strategic',
    lastUpdated: 'Hoje',
    previewData: { value: '142 projetos', trend: 'stable', percentage: '0%' }
  },
  {
    id: 'area-analysis',
    name: 'Análise por Área',
    description: 'Performance financeira segmentada por áreas de negócio',
    icon: Building,
    route: '/vmo-latam/dashboard',
    category: 'financial',
    lastUpdated: '2 dias',
    previewData: { value: 'R$ 8.9M', trend: 'down', percentage: '-1.3%' }
  },
  {
    id: 'multi-currency',
    name: 'Multi-moeda',
    description: 'Consolidação financeira em múltiplas moedas com taxas atualizadas',
    icon: Globe,
    route: '/vmo-latam/multi-moeda',
    category: 'financial',
    lastUpdated: 'Hoje',
    isNew: true,
    previewData: { value: 'USD 2.3M', trend: 'up', percentage: '+3.7%' }
  },
  {
    id: 'governance',
    name: 'Governança',
    description: 'Indicadores de governança corporativa e compliance',
    icon: Activity,
    route: '/vmo-latam/governanca',
    category: 'strategic',
    lastUpdated: 'Hoje',
    previewData: { value: '94.1%', trend: 'up', percentage: '+1.8%' }
  }
];

export default function ReportsView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorite-reports');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentReports, setRecentReports] = useState<string[]>(() => {
    const saved = localStorage.getItem('recent-reports');
    return saved ? JSON.parse(saved) : ['bu-analysis', 'portfolio'];
  });
  const [hoveredReport, setHoveredReport] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('favorite-reports', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('recent-reports', JSON.stringify(recentReports));
  }, [recentReports]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteReports = reports.filter(report => favorites.includes(report.id));
  const recentReportsData = reports.filter(report => recentReports.includes(report.id));

  const toggleFavorite = (reportId: string) => {
    setFavorites(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
    toast({
      title: favorites.includes(reportId) ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      duration: 2000
    });
  };

  const accessReport = (report: Report) => {
    setRecentReports(prev => {
      const updated = [report.id, ...prev.filter(id => id !== report.id)].slice(0, 5);
      return updated;
    });
    navigate(report.route);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
      default: return <div className="w-3 h-3 rounded-full bg-muted" />;
    }
  };

  const ReportCard = ({ report }: { report: Report }) => {
    const Icon = report.icon;
    const isFavorite = favorites.includes(report.id);
    const isHovered = hoveredReport === report.id;

    return (
      <Card 
        className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer group ${
          isFavorite ? 'ring-2 ring-primary/20 bg-primary/5' : ''
        }`}
        onMouseEnter={() => setHoveredReport(report.id)}
        onMouseLeave={() => setHoveredReport(null)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {report.name}
                  {report.isNew && <Badge variant="secondary" className="text-xs">Novo</Badge>}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Atualizado {report.lastUpdated}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(report.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isFavorite ? (
                <Star className="w-4 h-4 fill-primary text-primary" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <CardDescription className="mb-4">{report.description}</CardDescription>
          
          {isHovered && report.previewData && (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Preview</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(report.previewData.trend)}
                  <span className={`text-sm font-medium ${
                    report.previewData.trend === 'up' ? 'text-green-600' : 
                    report.previewData.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {report.previewData.percentage}
                  </span>
                </div>
              </div>
              <div className="text-xl font-bold mt-1">{report.previewData.value}</div>
            </div>
          )}
          
          <Button 
            onClick={() => accessReport(report)}
            className="w-full"
          >
            Acessar Relatório
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Relatórios Financeiros</h1>
          <p className="text-muted-foreground">
            Centro de relatórios e análises financeiras para tomada de decisão
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
              <SelectItem value="strategic">Estratégico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos ({favorites.length})</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
            <TabsTrigger value="new">Novos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {favoriteReports.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Relatórios Favoritos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {favoriteReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Todos os Relatórios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum relatório favorito</h3>
                <p className="text-muted-foreground">
                  Marque relatórios como favoritos para acesso rápido
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentReportsData.map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.filter(report => report.isNew).map(report => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}