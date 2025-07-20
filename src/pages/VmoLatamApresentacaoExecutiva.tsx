import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, User, FileText, TrendingUp, TrendingDown, Minus, Upload, X, Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Presentation, Maximize2, Target, CheckCircle2, ArrowUpDown, Star, BarChart3, Eye, Copy, Filter, RotateCcw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function VmoLatamApresentacaoExecutiva() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");
  const [selectedMonth, setSelectedMonth] = useState("December");
  const [selectedProject, setSelectedProject] = useState("All");
  const [showOptionalColumns, setShowOptionalColumns] = useState(false);
  const [chartView, setChartView] = useState("monthly");
  const [selectedBaseline, setSelectedBaseline] = useState("current");
  const [compareBaseline, setCompareBaseline] = useState("none");
  const [showComparison, setShowComparison] = useState(false);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState("");
  const [draggedDimension, setDraggedDimension] = useState<string | null>(null);
  const [pivotRows, setPivotRows] = useState<string[]>([]);
  const [pivotColumns, setPivotColumns] = useState<string[]>([]);
  const [pivotFilters, setPivotFilters] = useState({
    ano: "2024",
    area: "All",
    projeto: "All"
  });
  const [presentationMode, setPresentationMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projectDetailModal, setProjectDetailModal] = useState({ open: false, projectId: "" });
  const [baselineComparison, setBaselineComparison] = useState({ open: false, baseline1: "", baseline2: "" });
  const [showSlideNavigation, setShowSlideNavigation] = useState(false);
  const [finalComments, setFinalComments] = useState("");
  const [selectedPieSlice, setSelectedPieSlice] = useState<string | null>(null);

  const totalSlides = 11;

  // Dados simulados para as tabelas
  const comparativeData = [
    { area: "BRM", target: 15000, acSop: 16200, var: 1200, goGet: 800, ajusteManual: 200 },
    { area: "Business Excellence", target: 12000, acSop: 11500, var: -500, goGet: 300, ajusteManual: -100 },
    { area: "Group Solutions", target: 18000, acSop: 18900, var: 900, goGet: 600, ajusteManual: 150 },
    { area: "DP&D", target: 22000, acSop: 21800, var: -200, goGet: 400, ajusteManual: -50 },
  ];

  const totalRow = {
    area: "TOTAL",
    target: comparativeData.reduce((sum, item) => sum + item.target, 0),
    acSop: comparativeData.reduce((sum, item) => sum + item.acSop, 0),
    var: comparativeData.reduce((sum, item) => sum + item.var, 0),
    goGet: comparativeData.reduce((sum, item) => sum + item.goGet, 0),
    ajusteManual: comparativeData.reduce((sum, item) => sum + item.ajusteManual, 0),
  };

  const ytdData = [
    { area: "BRM", acYtd: 14500, targetYtd: 13750, var: 750 },
    { area: "Business Excellence", acYtd: 10200, targetYtd: 11000, var: -800 },
    { area: "Group Solutions", acYtd: 17800, targetYtd: 16500, var: 1300 },
    { area: "DP&D", acYtd: 20100, targetYtd: 20150, var: -50 },
  ];

  const assertivenessData = [
    { area: "BRM", sopMes: 1800, acMes: 1950, var: 150, assertividade: 108.3 },
    { area: "Business Excellence", sopMes: 1200, acMes: 980, var: -220, assertividade: 81.7 },
    { area: "Group Solutions", sopMes: 2100, acMes: 2180, var: 80, assertividade: 103.8 },
    { area: "DP&D", sopMes: 2500, acMes: 2300, var: -200, assertividade: 92.0 },
  ];

  const chartData = [
    { month: "Jan", target: -25, acSop: 2100, bu: 1800, ac: 1950, realizados: 1200, planejados: 750 },
    { month: "Fev", target: -22, acSop: 4200, bu: 3600, ac: 3900, realizados: 2400, planejados: 1500 },
    { month: "Mar", target: -20, acSop: 6300, bu: 5400, ac: 5850, realizados: 3600, planejados: 2250 },
    { month: "Abr", target: -18, acSop: 8400, bu: 7200, ac: 7800, realizados: 4800, planejados: 3000 },
    { month: "Mai", target: -15, acSop: 10500, bu: 9000, ac: 9750, realizados: 6000, planejados: 3750 },
    { month: "Jun", target: -12, acSop: 12600, bu: 10800, ac: 11700, realizados: 7200, planejados: 4500 },
    { month: "Jul", target: -10, acSop: 14700, bu: 12600, ac: 13650, realizados: 8400, planejados: 5250 },
    { month: "Ago", target: -8, acSop: 16800, bu: 14400, ac: 15600, realizados: 9600, planejados: 6000 },
    { month: "Set", target: -5, acSop: 18900, bu: 16200, ac: 17550, realizados: 10800, planejados: 6750 },
    { month: "Out", target: -3, acSop: 21000, bu: 18000, ac: 19500, realizados: 12000, planejados: 7500 },
    { month: "Nov", target: -1, acSop: 23100, bu: 19800, ac: 21450, realizados: 13200, planejados: 8250 },
    { month: "Dez", target: 0, acSop: 25200, bu: 21600, ac: 23400, realizados: 14400, planejados: 9000 },
  ];

  const clusterProjects = [
    { id: "P001", name: "Sistema ERP Integrado", sop: 2500, ac: 2650, target: 2400, var: 150, assertividade: 106.0, status: "on-track" },
    { id: "P002", name: "Automação Fábrica 4.0", sop: 1800, ac: 1720, target: 1850, var: -130, assertividade: 95.6, status: "attention" },
    { id: "P003", name: "Modernização IT Infrastructure", sop: 3200, ac: 3100, target: 3150, var: -50, assertividade: 96.9, status: "on-track" },
  ];

  const timelineData = [
    { 
      id: 1, 
      type: "baseline", 
      title: "Baseline atualizada", 
      date: "15/12/2024", 
      user: "Admin User", 
      description: "Ajuste de +200 SEK kr no target devido a novo projeto aprovado",
      icon: FileText,
      isActive: true
    },
    { 
      id: 2, 
      type: "baseline", 
      title: "Baseline Q4", 
      date: "01/10/2024", 
      user: "Manager User", 
      description: "Revisão trimestral com corte de -300 SEK kr",
      icon: FileText,
      isActive: false
    },
    { 
      id: 3, 
      type: "baseline", 
      title: "Baseline Q3", 
      date: "01/07/2024", 
      user: "Admin User", 
      description: "Incorporação de novos projetos de eficiência",
      icon: FileText,
      isActive: false
    }
  ];

  // Dados mais realistas para a tabela dinâmica
  const pivotDimensions = [
    { id: "area", name: "Área", type: "dimension" },
    { id: "projeto", name: "Projeto", type: "dimension" },
    { id: "status", name: "Status", type: "dimension" },
    { id: "mes", name: "Mês", type: "dimension" },
    { id: "ano", name: "Ano", type: "dimension" },
    { id: "responsavel", name: "Responsável", type: "dimension" },
    { id: "categoria", name: "Categoria", type: "dimension" },
  ];

  const pivotMetrics = [
    { id: "target", name: "Target", type: "metric" },
    { id: "acSop", name: "AC+SOP", type: "metric" },
    { id: "variacao", name: "Variação", type: "metric" },
    { id: "assertividade", name: "Assertividade", type: "metric" },
    { id: "goget", name: "Go-get", type: "metric" },
  ];

  const pivotSourceData = [
    { area: "BRM", projeto: "ERP System", status: "On Track", mes: "Jan", ano: "2024", responsavel: "João Silva", categoria: "IT", target: 1500, acSop: 1620, variacao: 120, assertividade: 108, goget: 80 },
    { area: "BRM", projeto: "CRM Update", status: "At Risk", mes: "Jan", ano: "2024", responsavel: "Maria Santos", categoria: "Sales", target: 800, acSop: 750, variacao: -50, assertividade: 94, goget: 30 },
    { area: "Business Excellence", projeto: "Process Optimization", status: "On Track", mes: "Jan", ano: "2024", responsavel: "Pedro Lima", categoria: "Operations", target: 1200, acSop: 1150, variacao: -50, assertividade: 96, goget: 25 },
    { area: "Group Solutions", projeto: "Cloud Migration", status: "Completed", mes: "Jan", ano: "2024", responsavel: "Ana Costa", categoria: "IT", target: 2000, acSop: 2100, variacao: 100, assertividade: 105, goget: 60 },
    { area: "DP&D", projeto: "R&D Innovation", status: "Planning", mes: "Jan", ano: "2024", responsavel: "Carlos Oliveira", categoria: "Research", target: 1800, acSop: 1750, variacao: -50, assertividade: 97, goget: 40 },
    { area: "BRM", projeto: "ERP System", status: "On Track", mes: "Fev", ano: "2024", responsavel: "João Silva", categoria: "IT", target: 1500, acSop: 1680, variacao: 180, assertividade: 112, goget: 90 },
    { area: "BRM", projeto: "CRM Update", status: "On Track", mes: "Fev", ano: "2024", responsavel: "Maria Santos", categoria: "Sales", target: 800, acSop: 820, variacao: 20, assertividade: 102, goget: 40 },
    { area: "Business Excellence", projeto: "Process Optimization", status: "On Track", mes: "Fev", ano: "2024", responsavel: "Pedro Lima", categoria: "Operations", target: 1200, acSop: 1200, variacao: 0, assertividade: 100, goget: 35 },
    { area: "Group Solutions", projeto: "Cloud Migration", status: "Completed", mes: "Fev", ano: "2024", responsavel: "Ana Costa", categoria: "IT", target: 2000, acSop: 2150, variacao: 150, assertividade: 107, goget: 70 },
    { area: "DP&D", projeto: "R&D Innovation", status: "On Track", mes: "Fev", ano: "2024", responsavel: "Carlos Oliveira", categoria: "Research", target: 1800, acSop: 1800, variacao: 0, assertividade: 100, goget: 50 },
  ];

  // Dados simulados para baselines
  const baselineData = {
    current: {
      name: "Baseline Atual (Dez 2024)",
      comment: "Ajustes realizados conforme revisão trimestral. Inclusão de 3 novos projetos estratégicos e reavaliação de timelines devido a mudanças de prioridade de negócio.",
      date: "15/12/2024",
      user: "Admin User",
      data: comparativeData
    },
    nov2024: {
      name: "Baseline Nov 2024",
      comment: "Revisão mensal com ajustes de cronograma devido a atrasos em fornecedores internacionais.",
      date: "15/11/2024",
      user: "Maria Silva",
      data: [
        { area: "BRM", target: 14800, acSop: 15900, var: 1100, goGet: 750, ajusteManual: 150 },
        { area: "Business Excellence", target: 11800, acSop: 11200, var: -600, goGet: 250, ajusteManual: -150 },
        { area: "Group Solutions", target: 17800, acSop: 18600, var: 800, goGet: 550, ajusteManual: 100 },
        { area: "DP&D", target: 21800, acSop: 21500, var: -300, goGet: 350, ajusteManual: -100 },
      ]
    },
    oct2024: {
      name: "Baseline Out 2024",
      comment: "Baseline aprovada em comitê executivo com novos investimentos em digitalização.",
      date: "15/10/2024",
      user: "João Santos",
      data: [
        { area: "BRM", target: 14500, acSop: 15600, var: 1100, goGet: 700, ajusteManual: 100 },
        { area: "Business Excellence", target: 11500, acSop: 10900, var: -600, goGet: 200, ajusteManual: -200 },
        { area: "Group Solutions", target: 17500, acSop: 18300, var: 800, goGet: 500, ajusteManual: 50 },
        { area: "DP&D", target: 21500, acSop: 21200, var: -300, goGet: 300, ajusteManual: -150 },
      ]
    }
  };

  // Dados simulados para tabela dinâmica com informações mais realistas
  const pivotTableData = [
    {
      ano: 2024,
      area: "BRM",
      projeto: "ERP Implementation",
      mes: "Janeiro",
      target: 1500000,
      ac: 1450000,
      sop: 1480000,
      status: "Em andamento",
      responsavel: "João Silva",
      departamento: "TI"
    },
    {
      ano: 2024,
      area: "BRM",
      projeto: "Process Automation",
      mes: "Janeiro",
      target: 800000,
      ac: 750000,
      sop: 780000,
      status: "Concluído",
      responsavel: "Maria Santos",
      departamento: "Operações"
    },
    {
      ano: 2024,
      area: "Business Excellence",
      projeto: "Lean Manufacturing",
      mes: "Janeiro",
      target: 1200000,
      ac: 1180000,
      sop: 1200000,
      status: "Em andamento",
      responsavel: "Carlos Lima",
      departamento: "Produção"
    },
    {
      ano: 2024,
      area: "Business Excellence",
      projeto: "Quality Improvement",
      mes: "Janeiro",
      target: 900000,
      ac: 920000,
      sop: 915000,
      status: "Concluído",
      responsavel: "Ana Costa",
      departamento: "Qualidade"
    },
    {
      ano: 2024,
      area: "Group Solutions",
      projeto: "IT Infrastructure",
      mes: "Janeiro",
      target: 2000000,
      ac: 1980000,
      sop: 1990000,
      status: "Em andamento",
      responsavel: "Pedro Oliveira",
      departamento: "TI"
    },
    {
      ano: 2024,
      area: "Group Solutions",
      projeto: "Digital Transformation",
      mes: "Janeiro",
      target: 1500000,
      ac: 1520000,
      sop: 1510000,
      status: "Em andamento",
      responsavel: "Lucia Torres",
      departamento: "Digital"
    },
    {
      ano: 2024,
      area: "Supply Chain",
      projeto: "Logistics Optimization",
      mes: "Janeiro",
      target: 1100000,
      ac: 1080000,
      sop: 1090000,
      status: "Em andamento",
      responsavel: "Roberto Mendes",
      departamento: "Logística"
    },
    {
      ano: 2024,
      area: "Supply Chain",
      projeto: "Vendor Management",
      mes: "Janeiro",
      target: 750000,
      ac: 770000,
      sop: 760000,
      status: "Concluído",
      responsavel: "Sandra Ribeiro",
      departamento: "Compras"
    },
    // Dados para Fevereiro
    {
      ano: 2024,
      area: "BRM",
      projeto: "ERP Implementation",
      mes: "Fevereiro",
      target: 1500000,
      ac: 1480000,
      sop: 1490000,
      status: "Em andamento",
      responsavel: "João Silva",
      departamento: "TI"
    },
    {
      ano: 2024,
      area: "Business Excellence",
      projeto: "Lean Manufacturing",
      mes: "Fevereiro",
      target: 1200000,
      ac: 1220000,
      sop: 1210000,
      status: "Em andamento",
      responsavel: "Carlos Lima",
      departamento: "Produção"
    },
    {
      ano: 2024,
      area: "Group Solutions",
      projeto: "IT Infrastructure",
      mes: "Fevereiro",
      target: 2000000,
      ac: 2020000,
      sop: 2010000,
      status: "Em andamento",
      responsavel: "Pedro Oliveira",
      departamento: "TI"
    },
    // Dados para diferentes anos
    {
      ano: 2023,
      area: "BRM",
      projeto: "Legacy System Upgrade",
      mes: "Dezembro",
      target: 1300000,
      ac: 1250000,
      sop: 1280000,
      status: "Concluído",
      responsavel: "João Silva",
      departamento: "TI"
    }
  ];

  const availableDimensions = [
    { id: "ano", label: "Ano", description: "Filtrar por ano fiscal" },
    { id: "area", label: "Área", description: "Área ou cluster organizacional" },
    { id: "projeto", label: "Projeto", description: "Projeto específico" },
    { id: "mes", label: "Mês", description: "Mês de referência" },
    { id: "tipo", label: "Tipo de Valor", description: "Target, AC, SOP, etc." },
    { id: "status", label: "Status", description: "Status do projeto" },
    { id: "responsavel", label: "Responsável", description: "Responsável pelo projeto" },
    { id: "departamento", label: "Departamento", description: "Departamento responsável" }
  ];

  // Estados para drag and drop
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value * 1000);
  };

  const getVariationIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getVariationColor = (value: number) => {
    if (value > 0) return "text-green-600 bg-green-50";
    if (value < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusBadge = (assertividade: number) => {
    if (assertividade >= 100) {
      return { color: "bg-green-100 text-green-800 border-green-200", text: "Acima", icon: "✅" };
    } else if (assertividade >= 95) {
      return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Atenção", icon: "⚠️" };
    } else {
      return { color: "bg-red-100 text-red-800 border-red-200", text: "Crítico", icon: "❌" };
    }
  };

  const KPICard = ({ title, value, icon, tooltip, type = "default" }: any) => {
    let colorClass = "border-l-blue-500";
    let valueColor = "text-blue-600";
    
    if (type === "positive") {
      colorClass = "border-l-green-500";
      valueColor = "text-green-600";
    } else if (type === "negative") {
      colorClass = "border-l-red-500";
      valueColor = "text-red-600";
    } else if (type === "warning") {
      colorClass = "border-l-yellow-500";
      valueColor = "text-yellow-600";
    }

    return (
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <Card className={`${colorClass} border-l-4 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
                  </div>
                  <div className="text-4xl opacity-80">{icon}</div>
                </div>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{tooltip}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    );
  };

  // Presentation Mode navigation
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!presentationMode) return;
      
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          setPresentationMode(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [presentationMode, currentSlide]);

  // Função para gerar dados da tabela dinâmica
  const generatePivotData = () => {
    if (pivotRows.length === 0 && pivotColumns.length === 0) return [];

    const filteredData = pivotSourceData.filter(item => {
      return (!pivotFilters.ano || pivotFilters.ano === "All" || item.ano === pivotFilters.ano) &&
             (!pivotFilters.area || pivotFilters.area === "All" || item.area === pivotFilters.area) &&
             (!pivotFilters.projeto || pivotFilters.projeto === "All" || item.projeto === pivotFilters.projeto);
    });

    // Lógica simplificada para agrupamento
    const grouped: { [key: string]: any } = {};
    
    filteredData.forEach(item => {
      let rowKey = pivotRows.map(row => item[row as keyof typeof item]).join(' | ') || 'Total';
      let colKey = pivotColumns.map(col => item[col as keyof typeof item]).join(' | ') || 'Total';
      
      const key = `${rowKey}___${colKey}`;
      
      if (!grouped[key]) {
        grouped[key] = {
          rowKey,
          colKey,
          target: 0,
          acSop: 0,
          variacao: 0,
          assertividade: 0,
          count: 0
        };
      }
      
      grouped[key].target += item.target;
      grouped[key].acSop += item.acSop;
      grouped[key].variacao += item.variacao;
      grouped[key].assertividade += item.assertividade;
      grouped[key].count++;
    });

    // Calcular médias para assertividade
    Object.values(grouped).forEach((item: any) => {
      if (item.count > 0) {
        item.assertividade = item.assertividade / item.count;
      }
    });

    return Object.values(grouped);
  };

  // Handlers para drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dimensionId: string) => {
    setDraggedDimension(dimensionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropToRows = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedDimension && !pivotRows.includes(draggedDimension)) {
      setPivotRows([...pivotRows, draggedDimension]);
    }
    setDraggedDimension(null);
  };

  const handleDropToColumns = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedDimension && !pivotColumns.includes(draggedDimension)) {
      setPivotColumns([...pivotColumns, draggedDimension]);
    }
    setDraggedDimension(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeDimension = (dimension: string, from: 'rows' | 'columns') => {
    if (from === 'rows') {
      setPivotRows(pivotRows.filter(d => d !== dimension));
    } else {
      setPivotColumns(pivotColumns.filter(d => d !== dimension));
    }
  };

  const resetPivotTable = () => {
    setPivotRows([]);
    setPivotColumns([]);
  };

  // Funções para drag and drop
  const handleDragStartOld = (e: React.DragEvent<HTMLDivElement>, dimensionId: string) => {
    setDraggedItem(dimensionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverOld = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToRowsOld = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem && !pivotRows.includes(draggedItem)) {
      setPivotRows(prev => [...prev, draggedItem]);
    }
    setDraggedItem(null);
  };

  const handleDropToColumnsOld = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem && !pivotColumns.includes(draggedItem)) {
      setPivotColumns(prev => [...prev, draggedItem]);
    }
    setDraggedItem(null);
  };

  // Função para gerar dados da tabela dinâmica
  const generatePivotDataOld = () => {
    if (pivotRows.length === 0 && pivotColumns.length === 0) {
      return { headers: [], rows: [] };
    }

    let filteredData = pivotTableData;
    
    // Aplicar filtros
    if (pivotFilters.area !== "All") {
      filteredData = filteredData.filter(item => item.area === pivotFilters.area);
    }
    if (pivotFilters.projeto !== "All") {
      filteredData = filteredData.filter(item => item.projeto.includes(pivotFilters.projeto));
    }

    const headers = [];
    const rows = [];

    if (pivotRows.includes("area") && pivotColumns.includes("tipo")) {
      headers.push("Área", "Target", "AC", "SOP", "Variação AC-Target");
      
      const areas = [...new Set(filteredData.map(item => item.area))];
      
      areas.forEach(area => {
        const areaData = filteredData.filter(item => item.area === area);
        const totalTarget = areaData.reduce((sum, item) => sum + item.target, 0);
        const totalAC = areaData.reduce((sum, item) => sum + item.ac, 0);
        const totalSOP = areaData.reduce((sum, item) => sum + item.sop, 0);
        const variacao = totalAC - totalTarget;
        
        rows.push([
          area,
          formatCurrency(totalTarget),
          formatCurrency(totalAC),
          formatCurrency(totalSOP),
          formatCurrency(variacao)
        ]);
      });
    } else if (pivotRows.includes("projeto")) {
      headers.push("Projeto", "Área", "Target", "AC", "Status", "Responsável");
      
      const projetos = [...new Set(filteredData.map(item => item.projeto))];
      
      projetos.forEach(projeto => {
        const projetoData = filteredData.find(item => item.projeto === projeto);
        if (projetoData) {
          rows.push([
            projeto,
            projetoData.area,
            formatCurrency(projetoData.target),
            formatCurrency(projetoData.ac),
            projetoData.status,
            projetoData.responsavel
          ]);
        }
      });
    } else if (pivotRows.includes("mes")) {
      headers.push("Mês", "Target Total", "AC Total", "Variação", "Projetos Ativos");
      
      const meses = [...new Set(filteredData.map(item => item.mes))];
      
      meses.forEach(mes => {
        const mesData = filteredData.filter(item => item.mes === mes);
        const totalTarget = mesData.reduce((sum, item) => sum + item.target, 0);
        const totalAC = mesData.reduce((sum, item) => sum + item.ac, 0);
        const variacao = totalAC - totalTarget;
        const projetos = mesData.length;
        
        rows.push([
          mes,
          formatCurrency(totalTarget),
          formatCurrency(totalAC),
          formatCurrency(variacao),
          projetos.toString()
        ]);
      });
    } else if (pivotRows.includes("status")) {
      headers.push("Status", "Quantidade de Projetos", "Target Total", "AC Total");
      
      const statuses = [...new Set(filteredData.map(item => item.status))];
      
      statuses.forEach(status => {
        const statusData = filteredData.filter(item => item.status === status);
        const totalTarget = statusData.reduce((sum, item) => sum + item.target, 0);
        const totalAC = statusData.reduce((sum, item) => sum + item.ac, 0);
        const quantidade = statusData.length;
        
        rows.push([
          status,
          quantidade.toString(),
          formatCurrency(totalTarget),
          formatCurrency(totalAC)
        ]);
      });
    } else {
      // Dados padrão
      headers.push("Item", "Valor");
      rows.push(["Total Geral", formatCurrency(filteredData.reduce((sum, item) => sum + item.target, 0))]);
    }

    return { headers, rows };
  };

  // Dados para gráficos de pizza
  const assertivenessPieData = [
    { name: ">100%", value: 1, color: "#22c55e" },
    { name: "80-100%", value: 2, color: "#eab308" },
    { name: "<80%", value: 1, color: "#ef4444" }
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const getAssertivenessBg = (value: number) => {
    if (value >= 100) return "bg-green-100 text-green-800";
    if (value >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusBadgeOld = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-100 text-green-800 border-green-200">On Track</Badge>;
      case "attention":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Atenção</Badge>;
      case "critical":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Crítico</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "baseline": return FileText;
      case "delivery": return CheckCircle;
      case "alert": return AlertCircle;
      default: return Clock;
    }
  };

  const getTimelineColor = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-500";
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleClusterClick = (area: string) => {
    console.log("Cluster clicked:", area); // Debug log
    setSelectedCluster(area);
    setIsDrilldownOpen(true);
  };

  const exportPresentation = () => {
    console.log("Exportando apresentação executiva...");
  };

  const exportDrilldownPanel = () => {
    console.log("Exportando painel de drilldown...");
  };

  const downloadSlide = () => {
    console.log(`Baixando slide ${currentSlide + 1}...`);
  };

  const downloadPresentation = () => {
    console.log("Baixando apresentação completa...");
  };

  // Componente do Modo Apresentação
  const PresentationMode = () => {
    const slideContent = () => {
      switch (currentSlide) {
        case 0: // Slide de Capa
          return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 bg-gradient-to-br from-blue-50 to-white">
              <img 
                src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                alt="Electrolux Logo" 
                className="h-24 w-auto mb-8 object-contain"
              />
              <div className="space-y-6">
                <h1 className="text-7xl font-bold text-gray-900 leading-tight">
                  BA LA – IT BA LA
                </h1>
                <h2 className="text-5xl font-semibold text-blue-700 mb-8">
                  2024 Overview – New Baseline
                </h2>
                <div className="text-2xl text-gray-600 space-y-3">
                  <p className="font-medium">Apresentação Executiva de Resultados</p>
                  <p className="text-xl">Dezembro 2024</p>
                  <p className="text-lg text-gray-500">Preparado por: Admin User</p>
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 max-w-2xl mx-auto">
                  <p className="text-sm text-gray-600 italic">
                    Dados consolidados com base na nova baseline aprovada em 15/12/2024
                  </p>
                </div>
              </div>
            </div>
          );

        case 1: // KPIs Gerais
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">KPIs Principais</h1>
                <p className="text-3xl text-gray-600">Visão Consolidada 2024</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <KPICard
                  title="Target Total"
                  value={formatCurrency(totalRow.target)}
                  icon="🎯"
                  tooltip="Meta total estabelecida para 2024, incluindo todos os projetos e áreas"
                  type="default"
                />
                <KPICard
                  title="AC+SOP"
                  value={formatCurrency(totalRow.acSop)}
                  icon="✅"
                  tooltip="Valor atual consolidado: AC (Actual Cost) + SOP (Sales & Operations Planning)"
                  type={totalRow.acSop > totalRow.target ? "positive" : "negative"}
                />
                <KPICard
                  title="Variação Total"
                  value={formatCurrency(totalRow.var)}
                  icon="↕️"
                  tooltip="Diferença entre AC+SOP e Target. Valores positivos indicam superação da meta"
                  type={totalRow.var >= 0 ? "positive" : "negative"}
                />
                <KPICard
                  title="Performance"
                  value={`${((totalRow.acSop / totalRow.target) * 100).toFixed(1)}%`}
                  icon="⭐"
                  tooltip="Percentual de atingimento da meta: (AC+SOP / Target) × 100"
                  type={totalRow.acSop > totalRow.target ? "positive" : totalRow.acSop > totalRow.target * 0.95 ? "warning" : "negative"}
                />
              </div>
            </div>
          );

        case 2: // Tabela Comparativa Anual
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Comparativo Anual</h1>
                <p className="text-2xl text-gray-600">Target vs AC+SOP por Área (SEK kr)</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-lg">
                    <thead className="bg-blue-700 text-white sticky top-0">
                      <tr>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <th className="p-4 text-left font-semibold cursor-help">Área</th>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Divisões organizacionais da empresa</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <th className="p-4 text-right font-semibold cursor-help">Target</th>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Meta estabelecida para o ano em SEK (milhares)</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <th className="p-4 text-right font-semibold cursor-help">AC+SOP</th>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Valor atual: Actual Cost + Sales & Operations Planning</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <th className="p-4 text-center font-semibold cursor-help">Variação</th>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Diferença entre AC+SOP e Target</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                        <th className="p-4 text-right font-semibold">Go-get</th>
                        <th className="p-4 text-right font-semibold">Ajuste Manual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...comparativeData, totalRow].map((row, index) => (
                        <tr 
                          key={row.area} 
                          className={`
                            ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                            ${row.area === 'TOTAL' ? 'bg-blue-100 font-bold border-t-2 border-blue-300' : ''}
                            hover:bg-blue-50 transition-colors
                          `}
                        >
                          <td className="p-4 font-medium">{row.area}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(row.target)}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(row.acSop)}</td>
                          <td className="p-4">
                            <div className={`flex items-center justify-center space-x-2 px-3 py-1 rounded-full ${getVariationColor(row.var)}`}>
                              {getVariationIcon(row.var)}
                              <span className="font-semibold">{formatCurrency(row.var)}</span>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono">{formatCurrency(row.goGet)}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(row.ajusteManual)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );

        case 3: // Tabela YTD
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Performance YTD</h1>
                <p className="text-2xl text-gray-600">Year to Date - Comparação AC vs Target</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full text-lg">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        <th className="p-4 text-left font-semibold">Área</th>
                        <th className="p-4 text-right font-semibold">AC YTD</th>
                        <th className="p-4 text-right font-semibold">Target YTD</th>
                        <th className="p-4 text-center font-semibold">Variação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ytdData.map((row, index) => {
                        const maxDeviation = Math.max(...ytdData.map(r => Math.abs(r.var)));
                        const isMaxDeviation = Math.abs(row.var) === maxDeviation;
                        
                        return (
                          <tr 
                            key={row.area} 
                            className={`
                              ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                              ${isMaxDeviation ? 'ring-2 ring-orange-400 bg-orange-50' : ''}
                              hover:bg-green-50 transition-colors
                            `}
                          >
                            <td className="p-4 font-medium">
                              {row.area}
                              {isMaxDeviation && (
                                <Badge className="ml-2 bg-orange-100 text-orange-800">
                                  Maior Desvio
                                </Badge>
                              )}
                            </td>
                            <td className="p-4 text-right font-mono">{formatCurrency(row.acYtd)}</td>
                            <td className="p-4 text-right font-mono">{formatCurrency(row.targetYtd)}</td>
                            <td className="p-4">
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <div className={`flex items-center justify-center space-x-2 px-3 py-1 rounded-full cursor-help ${getVariationColor(row.var)}`}>
                                      {getVariationIcon(row.var)}
                                      <span className="font-semibold">{formatCurrency(row.var)}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Variação exata: {formatCurrency(row.var)}</p>
                                    <p>Percentual: {((row.var / row.targetYtd) * 100).toFixed(1)}%</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center">Performance por Área</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ytdData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [formatCurrency(value), name]}
                        labelFormatter={(label) => `Área: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="acYtd" fill="#10b981" name="AC YTD" />
                      <Bar dataKey="targetYtd" fill="#6b7280" name="Target YTD" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );

        case 4: // Assertividade Mensal
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Assertividade Mensal</h1>
                <p className="text-2xl text-gray-600">Performance vs Planejamento por Área</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full text-lg">
                    <thead className="bg-purple-700 text-white">
                      <tr>
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <th className="p-4 text-left font-semibold cursor-help">Área</th>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Divisões organizacionais avaliadas</p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                        <th className="p-4 text-right font-semibold">SOP Mês</th>
                        <th className="p-4 text-right font-semibold">AC Mês</th>
                        <th className="p-4 text-center font-semibold">Assertividade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assertivenessData.map((row, index) => {
                        const badge = getStatusBadge(row.assertividade);
                        const isSelected = selectedPieSlice === row.area;
                        
                        return (
                          <tr 
                            key={row.area} 
                            className={`
                              ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                              ${isSelected ? 'bg-purple-100 ring-2 ring-purple-400' : ''}
                              hover:bg-purple-50 transition-colors cursor-pointer
                            `}
                            onClick={() => setSelectedPieSlice(isSelected ? null : row.area)}
                          >
                            <td className="p-4 font-medium">{row.area}</td>
                            <td className="p-4 text-right font-mono">{formatCurrency(row.sopMes)}</td>
                            <td className="p-4 text-right font-mono">{formatCurrency(row.acMes)}</td>
                            <td className="p-4 text-center">
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className={`${badge.color} cursor-help`}>
                                      {badge.icon} {row.assertividade.toFixed(1)}%
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{row.assertividade >= 100 ? 'Acima do planejado' : 'Abaixo do planejado'}</p>
                                    <p>Variação: {row.var > 0 ? '+' : ''}{formatCurrency(row.var)}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="p-4 bg-blue-50 text-center">
                    <Button
                      variant="outline"
                      onClick={() => setIsDrilldownOpen(true)}
                      className="bg-blue-100 hover:bg-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes por Cluster
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold mb-4 text-center">Distribuição de Assertividade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assertivenessData}
                        dataKey="assertividade"
                        nameKey="area"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        onClick={(data) => setSelectedPieSlice(selectedPieSlice === data.area ? null : data.area)}
                      >
                        {assertivenessData.map((entry, index) => {
                          const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={selectedPieSlice === entry.area ? '#6366f1' : colors[index]} 
                              stroke={selectedPieSlice === entry.area ? '#4f46e5' : 'none'}
                              strokeWidth={selectedPieSlice === entry.area ? 3 : 0}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value.toFixed(1)}%`, 'Assertividade']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );

        case 5: // Gráfico Principal
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Evolução Anual</h1>
                <p className="text-2xl text-gray-600">Target vs AC+SOP - Progressão Mensal</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-red-100 text-red-800 px-3 py-1 text-sm">
                      📉 Corte de 25% aplicado
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm">
                      📍 Posição atual: Dezembro
                    </Badge>
                  </div>
                  <Button variant="outline" className="bg-gray-100">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Gráfico
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'target' ? `${value}%` : formatCurrency(value), 
                        name === 'target' ? 'Target (%)' : name
                      ]}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Target (-25%)"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="acSop" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      name="AC+SOP"
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                    {/* Marcação especial para dezembro */}
                    <Line 
                      type="monotone" 
                      dataKey="acSop" 
                      stroke="#10b981" 
                      strokeWidth={0}
                      dot={(props: any) => {
                        if (props.payload.month === 'Dez') {
                          return (
                            <circle 
                              cx={props.cx} 
                              cy={props.cy} 
                              r={8} 
                              fill="#10b981" 
                              stroke="#ffffff" 
                              strokeWidth={3}
                            />
                          );
                        }
                        return null;
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-sm text-green-800">
                    <strong>Where we are:</strong> Dezembro 2024 - Performance em {formatCurrency(chartData[11].acSop)} 
                    (Target ajustado: {chartData[11].target}%)
                  </p>
                </div>
              </div>
            </div>
          );

        case 6: // Gráfico Evolução Mensal
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Evolução Mensal Detalhada</h1>
                <p className="text-2xl text-gray-600">BU, AC+SOP, Realizados e Planejados</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por área" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">Todas as Áreas</SelectItem>
                        <SelectItem value="BRM">BRM</SelectItem>
                        <SelectItem value="Business Excellence">Business Excellence</SelectItem>
                        <SelectItem value="Group Solutions">Group Solutions</SelectItem>
                        <SelectItem value="DP&D">DP&D</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      variant={chartView === "monthly" ? "default" : "outline"}
                      onClick={() => setChartView("monthly")}
                    >
                      Mensal
                    </Button>
                    <Button 
                      variant={chartView === "cumulative" ? "default" : "outline"}
                      onClick={() => setChartView("cumulative")}
                    >
                      Acumulado
                    </Button>
                  </div>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [formatCurrency(value), name]}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="bu" 
                      fill="#8884d8" 
                      name="BU"
                      onClick={(data) => console.log(`Breakdown para ${data.month}`)}
                    />
                    <Bar dataKey="ac" fill="#82ca9d" name="AC" />
                    <Bar dataKey="realizados" fill="#ffc658" name="Realizados" />
                    <Bar dataKey="planejados" fill="#ff7c7c" name="Planejados" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 7: // Drilldown Área/Cluster
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Drilldown por Cluster</h1>
                <p className="text-2xl text-gray-600">Detalhamento de Projetos e Performance</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 bg-blue-50 border-b flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-blue-900">Cluster: Tecnologia e Inovação</h3>
                  <Button variant="outline" className="bg-blue-100">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Cluster
                  </Button>
                </div>
                <table className="w-full text-lg">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <th className="p-4 text-left font-semibold cursor-help">Projeto</th>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Nome do projeto dentro do cluster</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      <th className="p-4 text-right font-semibold">SOP</th>
                      <th className="p-4 text-right font-semibold">AC</th>
                      <th className="p-4 text-center font-semibold">Assertividade</th>
                      <th className="p-4 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterProjects.map((project, index) => {
                      const badge = getStatusBadge(project.assertividade);
                      return (
                        <tr 
                          key={project.id} 
                          className={`
                            ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                            hover:bg-blue-50 transition-colors
                          `}
                        >
                          <td className="p-4">
                            <button
                              className="text-blue-600 hover:text-blue-800 font-medium text-left"
                              onClick={() => setProjectDetailModal({ open: true, projectId: project.id })}
                            >
                              {project.name}
                            </button>
                          </td>
                          <td className="p-4 text-right font-mono">{formatCurrency(project.sop)}</td>
                          <td className="p-4 text-right font-mono">{formatCurrency(project.ac)}</td>
                          <td className="p-4 text-center">
                            <Badge className={badge.color}>
                              {badge.icon} {project.assertividade.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant={project.status === "on-track" ? "default" : "destructive"}>
                              {project.status === "on-track" ? "No Prazo" : "Atenção"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-6 bg-blue-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-600 font-medium">Total do Cluster</p>
                      <p className="text-xl font-bold text-blue-800">
                        {formatCurrency(clusterProjects.reduce((sum, p) => sum + p.ac, 0))}
                      </p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-600 font-medium">Projetos no Prazo</p>
                      <p className="text-xl font-bold text-green-800">
                        {clusterProjects.filter(p => p.status === "on-track").length}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg text-center">
                      <p className="text-sm text-yellow-600 font-medium">Assertividade Média</p>
                      <p className="text-xl font-bold text-yellow-800">
                        {(clusterProjects.reduce((sum, p) => sum + p.assertividade, 0) / clusterProjects.length).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

        case 8: // Histórico/Baseline
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Histórico de Baselines</h1>
                <p className="text-2xl text-gray-600">Evolução e Comparações</p>
              </div>
              <div className="relative">
                {/* Timeline horizontal */}
                <div className="flex justify-between items-center mb-8">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 -translate-y-1/2"></div>
                  {timelineData.map((baseline, index) => (
                    <div key={baseline.id} className="relative z-10 bg-white">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Card 
                              className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                                baseline.isActive ? 'border-green-500 bg-green-50' : 'border-gray-200'
                              }`}
                              onClick={() => setBaselineComparison({ 
                                open: true, 
                                baseline1: baseline.title, 
                                baseline2: timelineData[0].title 
                              })}
                            >
                              <div className="text-center space-y-2">
                                <div className={`w-4 h-4 rounded-full mx-auto ${
                                  baseline.isActive ? 'bg-green-500' : 'bg-blue-500'
                                }`}></div>
                                <h3 className="font-bold text-lg">{baseline.title}</h3>
                                <p className="text-sm text-gray-600">{baseline.date}</p>
                                <p className="text-xs text-gray-500">{baseline.user}</p>
                                {baseline.isActive && (
                                  <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                                )}
                              </div>
                            </Card>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="font-medium">{baseline.title}</p>
                            <p className="text-sm">{baseline.description}</p>
                            <p className="text-xs text-gray-500 mt-1">Clique para comparar</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 p-6">
                  <h3 className="text-2xl font-bold mb-4">Comparação entre Baselines</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium">Target Total</span>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(totalRow.target)}</div>
                        <div className="text-sm text-green-600">+200 SEK kr vs Q4</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Projetos Ativos</span>
                      <div className="text-right">
                        <div className="font-bold">24</div>
                        <div className="text-sm text-green-600">+3 novos projetos</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Assertividade Geral</span>
                      <div className="text-right">
                        <div className="font-bold">99.2%</div>
                        <div className="text-sm text-yellow-600">-1.8% vs Q4</div>
                      </div>
                    </div>
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setBaselineComparison({ 
                        open: true, 
                        baseline1: "Baseline atualizada", 
                        baseline2: "Baseline Q4" 
                      })}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Comparar Baselines
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar Histórico
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Ver Logs Detalhados
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          );

        case 9: // Cubo/Tabela Dinâmica
          return (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Análise Customizada</h1>
                <p className="text-2xl text-gray-600">Tabela Dinâmica - Configuração Livre</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Dimensões Disponíveis */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Dimensões
                  </h3>
                  <div className="space-y-2">
                    {pivotDimensions.map((dim) => (
                      <div
                        key={dim.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, dim.id)}
                        className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
                      >
                        <span className="text-sm font-medium">{dim.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h4 className="text-md font-bold mt-6 mb-3">Métricas</h4>
                  <div className="space-y-2">
                    {pivotMetrics.map((metric) => (
                      <div
                        key={metric.id}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <span className="text-sm font-medium">{metric.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Configuração da Tabela */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Linhas */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-bold mb-4">📊 Linhas</h3>
                      <div
                        className="min-h-24 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                        onDrop={handleDropToRows}
                        onDragOver={handleDragOver}
                      >
                        {pivotRows.length === 0 ? (
                          <p className="text-gray-500 text-center">Arraste dimensões aqui</p>
                        ) : (
                          <div className="space-y-2">
                            {pivotRows.map((row) => (
                              <div key={row} className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm font-medium">
                                  {pivotDimensions.find(d => d.id === row)?.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDimension(row, 'rows')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Colunas */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-lg font-bold mb-4">📈 Colunas</h3>
                      <div
                        className="min-h-24 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                        onDrop={handleDropToColumns}
                        onDragOver={handleDragOver}
                      >
                        {pivotColumns.length === 0 ? (
                          <p className="text-gray-500 text-center">Arraste dimensões aqui</p>
                        ) : (
                          <div className="space-y-2">
                            {pivotColumns.map((col) => (
                              <div key={col} className="flex items-center justify-between bg-white p-2 rounded border">
                                <span className="text-sm font-medium">
                                  {pivotDimensions.find(d => d.id === col)?.name}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDimension(col, 'columns')}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Filtros Aplicados */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">🔍 Filtros Aplicados</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-yellow-100">
                        Ano: {pivotFilters.ano}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-100">
                        Área: {pivotFilters.area}
                      </Badge>
                      <Badge variant="outline" className="bg-yellow-100">
                        Projeto: {pivotFilters.projeto}
                      </Badge>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={resetPivotTable}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                      </Button>
                    </div>
                  </div>

                  {/* Tabela Resultante */}
                  {(pivotRows.length > 0 || pivotColumns.length > 0) && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-4 bg-blue-50 border-b">
                        <h3 className="text-lg font-bold text-blue-900">Resultado da Análise</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-blue-700 text-white">
                            <tr>
                              <th className="p-3 text-left">Dimensão</th>
                              <th className="p-3 text-right">Target</th>
                              <th className="p-3 text-right">AC+SOP</th>
                              <th className="p-3 text-right">Variação</th>
                              <th className="p-3 text-center">Assertividade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generatePivotData().slice(0, 10).map((row: any, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="p-3 font-medium">
                                  <TooltipProvider>
                                    <UITooltip>
                                      <TooltipTrigger asChild>
                                        <span className="cursor-help">{row.rowKey}</span>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Agrupamento por: {pivotRows.join(', ')}</p>
                                        <p>Cálculo baseado em {row.count} registros</p>
                                      </TooltipContent>
                                    </UITooltip>
                                  </TooltipProvider>
                                </td>
                                <td className="p-3 text-right font-mono">{formatCurrency(row.target)}</td>
                                <td className="p-3 text-right font-mono">{formatCurrency(row.acSop)}</td>
                                <td className={`p-3 text-right font-mono ${getVariationColor(row.variacao)}`}>
                                  {formatCurrency(row.variacao)}
                                </td>
                                <td className="p-3 text-center">
                                  <Badge className={getStatusBadge(row.assertividade).color}>
                                    {row.assertividade.toFixed(1)}%
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );

        case 10: // Slide de Encerramento
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">Conclusões e Próximos Passos</h1>
                <p className="text-3xl text-gray-600">Resumo Executivo</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Próximos Passos */}
                <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <h3 className="text-3xl font-bold text-blue-900 mb-6 flex items-center">
                    🎯 Próximos Passos
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <p className="text-lg">Revisar projetos com assertividade < 95%</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <p className="text-lg">Implementar ações corretivas no Q1 2025</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <p className="text-lg">Atualizar baseline trimestral</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <p className="text-lg">Monitoramento semanal dos KPIs críticos</p>
                    </div>
                  </div>
                </Card>

                {/* Responsável e Contato */}
                <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <h3 className="text-3xl font-bold text-green-900 mb-6 flex items-center">
                    👤 Responsável
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold">Admin User</p>
                      <p className="text-gray-600">Director, Financial Planning</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email:</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-lg">admin.user@electrolux.com</p>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefone:</p>
                      <p className="text-lg">+46 8 123 4567</p>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <User className="w-4 h-4 mr-2" />
                      Contato Direto
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Comentários Finais */}
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-4">💬 Comentários Finais</h3>
                <Textarea
                  value={finalComments}
                  onChange={(e) => setFinalComments(e.target.value)}
                  placeholder="Adicione observações, insights ou comentários sobre a apresentação..."
                  className="min-h-32 text-lg"
                />
              </Card>

              {/* Ações de Exportação */}
              <Card className="p-8 bg-gray-50">
                <h3 className="text-2xl font-bold mb-6 text-center">📥 Exportar Apresentação</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Download className="w-6 h-6 mb-1" />
                    <span>PDF Completo</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-1" />
                    <span>PowerPoint</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <BarChart3 className="w-6 h-6 mb-1" />
                    <span>Dados Excel</span>
                  </Button>
                </div>
              </Card>

              {/* Rodapé com identidade visual */}
              <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl">
                <img 
                  src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                  alt="Electrolux Logo" 
                  className="h-12 w-auto mx-auto mb-4 brightness-0 invert"
                />
                <p className="text-lg font-semibold">Electrolux Group</p>
                <p className="text-sm opacity-80">Shape living for the better</p>
                <p className="text-xs opacity-60 mt-2">
                  Documento confidencial - {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-white z-50 overflow-hidden">
        {/* Barra de progresso */}
        <div className="absolute top-0 left-0 right-0 z-60">
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <div className="flex justify-center space-x-2 py-2 bg-white border-b">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Cabeçalho da apresentação */}
        <div className="absolute top-14 left-0 right-0 z-50 bg-white border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => setPresentationMode(false)}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5 mr-2" />
                Sair da Apresentação
              </Button>
              <div className="text-sm text-gray-600">
                Slide {currentSlide + 1} de {totalSlides}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowSlideNavigation(!showSlideNavigation)}
                className="hover:bg-gray-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                Miniaturas
              </Button>
              <Button variant="ghost" className="hover:bg-gray-100">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        {/* Navegação de miniaturas */}
        {showSlideNavigation && (
          <div className="absolute top-28 right-4 w-80 bg-white rounded-lg shadow-lg border p-4 z-40 max-h-96 overflow-y-auto">
            <h3 className="font-bold mb-3">Navegação Rápida</h3>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    goToSlide(index);
                    setShowSlideNavigation(false);
                  }}
                  className={`p-2 text-xs border rounded hover:bg-gray-50 text-left ${
                    index === currentSlide ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium">Slide {index + 1}</div>
                  <div className="text-gray-500">
                    {[
                      'Capa', 'KPIs', 'Comparativo', 'YTD', 'Assertividade',
                      'Evolução', 'Mensal', 'Drilldown', 'Baseline', 'Análise', 'Conclusão'
                    ][index]}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo do slide */}
        <div className="pt-32 pb-20 px-8 h-full overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {slideContent()}
          </div>
        </div>

        {/* Navegação inferior */}
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t px-8 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            <div className="text-sm text-gray-600">
              Use as setas do teclado ou clique nos botões para navegar
            </div>
            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="disabled:opacity-50"
            >
              Próximo
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (presentationMode) {
    return (
      <TooltipProvider>
        <PresentationMode />
        {/* Modais que podem aparecer durante a apresentação */}
        <Dialog open={projectDetailModal.open} onOpenChange={(open) => setProjectDetailModal({ ...projectDetailModal, open })}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Projeto</DialogTitle>
              <DialogDescription>
                Informações completas sobre o projeto selecionado
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">ID do Projeto:</p>
                  <p className="text-gray-600">{projectDetailModal.projectId}</p>
                </div>
                <div>
                  <p className="font-medium">Status:</p>
                  <Badge>No Prazo</Badge>
                </div>
              </div>
              <div>
                <p className="font-medium">Descrição:</p>
                <p className="text-gray-600">
                  Projeto de modernização da infraestrutura tecnológica com foco em eficiência 
                  e integração de sistemas. Inclui migração para cloud e implementação de 
                  ferramentas de analytics avançadas.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Budget:</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(2500)}</p>
                </div>
                <div>
                  <p className="font-medium">Gasto Atual:</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(2100)}</p>
                </div>
                <div>
                  <p className="font-medium">Conclusão:</p>
                  <p className="text-lg font-bold">75%</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={baselineComparison.open} onOpenChange={(open) => setBaselineComparison({ ...baselineComparison, open })}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Comparação de Baselines</DialogTitle>
              <DialogDescription>
                Análise comparativa entre {baselineComparison.baseline1} e {baselineComparison.baseline2}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-bold text-lg mb-3">{baselineComparison.baseline1}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Target Total:</span>
                      <span className="font-mono">{formatCurrency(67000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projetos:</span>
                      <span>24</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span>15/12/2024</span>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-bold text-lg mb-3">{baselineComparison.baseline2}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Target Total:</span>
                      <span className="font-mono">{formatCurrency(66800)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projetos:</span>
                      <span>21</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span>01/10/2024</span>
                    </div>
                  </div>
                </Card>
              </div>
              <Card className="p-4 bg-blue-50">
                <h3 className="font-bold mb-3">Principais Diferenças</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Variação no Target:</span>
                    <Badge className="bg-green-100 text-green-800">+{formatCurrency(200)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Novos Projetos:</span>
                    <Badge className="bg-blue-100 text-blue-800">+3 projetos</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alteração na Assertividade:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">-1.8%</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Header Fixo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 
              className="text-3xl font-bold text-gray-900 cursor-text hover:bg-blue-50 px-2 py-1 rounded" 
              contentEditable
              suppressContentEditableWarning={true}
            >
              BA LA – IT BA LA – 2024 Overview – New Baseline
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                Última atualização: 15/12/2024
              </Badge>
              <Badge variant="outline" className="text-sm">
                <User className="h-4 w-4 mr-1" />
                Admin User
              </Badge>
              <Button onClick={exportPresentation} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar Apresentação
              </Button>
              <Button onClick={() => setPresentationMode(true)} className="bg-purple-600 hover:bg-purple-700">
                <Presentation className="h-4 w-4 mr-2" />
                Modo Apresentação
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Área/Cluster" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todas as Áreas</SelectItem>
                <SelectItem value="BRM">BRM</SelectItem>
                <SelectItem value="Business Excellence">Business Excellence</SelectItem>
                <SelectItem value="Group Solutions">Group Solutions</SelectItem>
                <SelectItem value="DP&D">DP&D</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Trimestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Q1">Q1</SelectItem>
                <SelectItem value="Q2">Q2</SelectItem>
                <SelectItem value="Q3">Q3</SelectItem>
                <SelectItem value="Q4">Q4</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">Janeiro</SelectItem>
                <SelectItem value="February">Fevereiro</SelectItem>
                <SelectItem value="March">Março</SelectItem>
                <SelectItem value="December">Dezembro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Todos os Projetos</SelectItem>
                <SelectItem value="Strategic">Projetos Estratégicos</SelectItem>
                <SelectItem value="Operational">Projetos Operacionais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela Comparativa Anual */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Tabela Comparativa Anual (SEK kr)</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="optional" 
                  checked={showOptionalColumns}
                  onCheckedChange={(checked) => setShowOptionalColumns(checked === true)}
                />
                <label htmlFor="optional" className="text-sm">Mostrar colunas opcionais</label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Área</th>
                    <th className="text-right p-3 font-semibold">Target</th>
                    <th className="text-right p-3 font-semibold">AC+SOP</th>
                    <th className="text-right p-3 font-semibold">Var</th>
                    {showOptionalColumns && (
                      <>
                        <th className="text-right p-3 font-semibold text-gray-600">Go-get</th>
                        <th className="text-right p-3 font-semibold text-gray-600">Ajuste Manual</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {comparativeData.map((row, index) => (
                    <tr 
                      key={index} 
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleClusterClick(row.area)}
                    >
                      <td className="p-3 font-medium text-blue-600 hover:underline">{row.area}</td>
                      <td className="text-right p-3">{formatCurrency(row.target)}</td>
                      <td className="text-right p-3">{formatCurrency(row.acSop)}</td>
                      <td className={`text-right p-3 font-semibold ${
                        row.var >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className="flex items-center justify-end gap-2">
                          {getVariationIcon(row.var)}
                          {formatCurrency(row.var)}
                        </div>
                      </td>
                      {showOptionalColumns && (
                        <>
                          <td className="text-right p-3 text-gray-600">{formatCurrency(row.goGet)}</td>
                          <td className="text-right p-3 text-gray-600">{formatCurrency(row.ajusteManual)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-400 bg-blue-50 font-bold">
                    <td className="p-3 text-lg">{totalRow.area}</td>
                    <td className="text-right p-3 text-lg">{formatCurrency(totalRow.target)}</td>
                    <td className="text-right p-3 text-lg">{formatCurrency(totalRow.acSop)}</td>
                    <td className={`text-right p-3 text-lg ${
                      totalRow.var >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <div className="flex items-center justify-end gap-2">
                        {getVariationIcon(totalRow.var)}
                        {formatCurrency(totalRow.var)}
                      </div>
                    </td>
                    {showOptionalColumns && (
                      <>
                        <td className="text-right p-3 text-lg">{formatCurrency(totalRow.goGet)}</td>
                        <td className="text-right p-3 text-lg">{formatCurrency(totalRow.ajusteManual)}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tabela YTD */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Year-to-Date (YTD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Área</th>
                      <th className="text-right p-3 font-semibold">AC YTD</th>
                      <th className="text-right p-3 font-semibold">Target YTD</th>
                      <th className="text-right p-3 font-semibold">Var</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ytdData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{row.area}</td>
                        <td className="text-right p-3">{formatCurrency(row.acYtd)}</td>
                        <td className="text-right p-3">{formatCurrency(row.targetYtd)}</td>
                        <td className={`text-right p-3 font-semibold ${
                          row.var >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <div className="flex items-center justify-end gap-2">
                            {getVariationIcon(row.var)}
                            {formatCurrency(row.var)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Assertividade Mensal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Assertividade Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Área</th>
                      <th className="text-right p-3 font-semibold">SOP Mês</th>
                      <th className="text-right p-3 font-semibold">AC Mês</th>
                      <th className="text-right p-3 font-semibold">Var</th>
                      <th className="text-right p-3 font-semibold">% Assert.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assertivenessData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{row.area}</td>
                        <td className="text-right p-3">{formatCurrency(row.sopMes)}</td>
                        <td className="text-right p-3">{formatCurrency(row.acMes)}</td>
                        <td className={`text-right p-3 font-semibold ${
                          row.var >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(row.var)}
                        </td>
                        <td className="text-right p-3">
                          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getAssertivenessBg(row.assertividade)}`}>
                            {row.assertividade.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Target vs AC+SOP - Evolução Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), name]}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    name="Target (-25%)"
                    strokeDasharray="5 5"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="acSop" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="AC+SOP"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Execução Mensal vs Planejado</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={chartView === "monthly" ? "default" : "outline"}
                    onClick={() => setChartView("monthly")}
                  >
                    Mensal
                  </Button>
                  <Button 
                    size="sm" 
                    variant={chartView === "accumulated" ? "default" : "outline"}
                    onClick={() => setChartView("accumulated")}
                  >
                    Acumulado
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), name]}
                  />
                  <Legend />
                  <Bar dataKey="bu" fill="#8884d8" name="BU" />
                  <Bar dataKey="ac" fill="#82ca9d" name="AC+SOP" />
                  <Bar dataKey="realizados" fill="#ffc658" name="Realizados" />
                  <Bar dataKey="planejados" fill="#ff7c7c" name="Planejados" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Histórico/Baseline Melhorado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Histórico de Baselines</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Seleção de Baselines */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Baseline Principal:</label>
                <Select value={selectedBaseline} onValueChange={setSelectedBaseline}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecionar Baseline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Baseline Atual (Dez 2024)</SelectItem>
                    <SelectItem value="nov2024">Baseline Nov 2024</SelectItem>
                    <SelectItem value="oct2024">Baseline Out 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Comparar com:</label>
                <Select value={compareBaseline} onValueChange={(value) => {
                  setCompareBaseline(value);
                  setShowComparison(value !== "none");
                }}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecionar para comparar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    <SelectItem value="current">Baseline Atual (Dez 2024)</SelectItem>
                    <SelectItem value="nov2024">Baseline Nov 2024</SelectItem>
                    <SelectItem value="oct2024">Baseline Out 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timeline Horizontal de Baselines */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Timeline de Baselines</h4>
              <div className="flex items-center gap-4 overflow-x-auto pb-4">
                {Object.entries(baselineData).map(([key, baseline], index) => (
                  <div key={key} className="flex items-center gap-2 min-w-0">
                    <div 
                      className={`w-4 h-4 rounded-full cursor-pointer ${
                        selectedBaseline === key ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setSelectedBaseline(key)}
                    />
                    <div className="text-sm min-w-max">
                      <div className="font-medium">{baseline.name}</div>
                      <div className="text-gray-500">{baseline.date}</div>
                    </div>
                    {index < Object.entries(baselineData).length - 1 && (
                      <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tabela de Comparação */}
            {showComparison && compareBaseline && compareBaseline !== "none" && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Comparação entre Baselines</h4>
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Área</th>
                        <th className="text-center p-3 font-medium" colSpan={2}>
                          {baselineData[selectedBaseline as keyof typeof baselineData]?.name}
                        </th>
                        <th className="text-center p-3 font-medium" colSpan={2}>
                          {baselineData[compareBaseline as keyof typeof baselineData]?.name}
                        </th>
                        <th className="text-center p-3 font-medium">Variação</th>
                      </tr>
                      <tr className="bg-gray-50 border-t">
                        <th className="p-3"></th>
                        <th className="text-right p-3 text-xs">Target</th>
                        <th className="text-right p-3 text-xs">AC+SOP</th>
                        <th className="text-right p-3 text-xs">Target</th>
                        <th className="text-right p-3 text-xs">AC+SOP</th>
                        <th className="text-right p-3 text-xs">Target Δ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {baselineData[selectedBaseline as keyof typeof baselineData]?.data.map((row, index) => {
                        const compareRow = baselineData[compareBaseline as keyof typeof baselineData]?.data[index];
                        const targetDiff = row.target - (compareRow?.target || 0);
                        const hasChanged = targetDiff !== 0;
                        
                        return (
                          <tr key={index} className={`border-b ${hasChanged ? 'bg-yellow-50' : ''}`}>
                            <td className="p-3 font-medium">{row.area}</td>
                            <td className={`text-right p-3 ${hasChanged ? 'bg-blue-100 font-semibold' : ''}`}>
                              {formatCurrency(row.target)}
                            </td>
                            <td className="text-right p-3">{formatCurrency(row.acSop)}</td>
                            <td className="text-right p-3">{formatCurrency(compareRow?.target || 0)}</td>
                            <td className="text-right p-3">{formatCurrency(compareRow?.acSop || 0)}</td>
                            <td className={`text-right p-3 font-semibold ${
                              targetDiff > 0 ? 'text-green-600' : targetDiff < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              <div className="flex items-center justify-end gap-1">
                                {hasChanged && getVariationIcon(targetDiff)}
                                {formatCurrency(targetDiff)}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Comentário da Baseline Selecionada */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                Comentário - {baselineData[selectedBaseline as keyof typeof baselineData]?.name}
              </h4>
              <Textarea 
                className="mb-3 bg-white"
                value={baselineData[selectedBaseline as keyof typeof baselineData]?.comment || ""}
                readOnly
              />
              <div className="text-sm text-gray-600">
                <span>
                  Última atualização: {baselineData[selectedBaseline as keyof typeof baselineData]?.date} - {baselineData[selectedBaseline as keyof typeof baselineData]?.user}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cubo/Tabela Dinâmica Melhorado */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Análise Customizada (Tabela Dinâmica)</CardTitle>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar Tabela
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtros Rápidos */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Filtros Rápidos</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Ano</label>
                  <Select value={pivotFilters.ano} onValueChange={(value) => 
                    setPivotFilters(prev => ({ ...prev, ano: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Área</label>
                  <Select value={pivotFilters.area} onValueChange={(value) => 
                    setPivotFilters(prev => ({ ...prev, area: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todas as Áreas</SelectItem>
                      <SelectItem value="BRM">BRM</SelectItem>
                      <SelectItem value="Business Excellence">Business Excellence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Projeto</label>
                  <Select value={pivotFilters.projeto} onValueChange={(value) => 
                    setPivotFilters(prev => ({ ...prev, projeto: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Todos os Projetos</SelectItem>
                      <SelectItem value="ERP System">ERP System</SelectItem>
                      <SelectItem value="Automation">Automation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Configuração de Dimensões */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Configuração da Tabela Dinâmica</h4>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dimensões Disponíveis */}
                <div>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h5 className="text-sm font-medium mb-2 cursor-help">Dimensões Disponíveis</h5>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Arraste as dimensões para as áreas de linhas ou colunas</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  <div className="space-y-2">
                    {availableDimensions.map((dimension) => (
                      <TooltipProvider key={dimension.id}>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Badge 
                              variant="outline" 
                              className="w-full justify-start cursor-move hover:bg-blue-50 border-blue-200 p-2"
                              draggable
                              onDragStart={(e) => handleDragStartOld(e, dimension.id)}
                            >
                              {dimension.label}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{dimension.description}</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>

                {/* Área de Linhas */}
                <div>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h5 className="text-sm font-medium mb-2 cursor-help">Linhas</h5>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dimensões que aparecerão como linhas na tabela</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  <div 
                    className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[120px]"
                    onDragOver={handleDragOverOld}
                    onDrop={handleDropToRowsOld}
                  >
                    {pivotRows.length === 0 ? (
                      <p className="text-center text-blue-600 text-sm">
                        Solte dimensões aqui para linhas
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pivotRows.map((row, index) => {
                          const dimension = availableDimensions.find(d => d.id === row);
                          return (
                            <Badge key={index} variant="default" className="w-full justify-between">
                              {dimension?.label || row}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => 
                                setPivotRows(prev => prev.filter((_, i) => i !== index))
                              } />
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Área de Colunas */}
                <div>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h5 className="text-sm font-medium mb-2 cursor-help">Colunas</h5>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Dimensões que aparecerão como colunas na tabela</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  <div 
                    className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4 min-h-[120px]"
                    onDragOver={handleDragOverOld}
                    onDrop={handleDropToColumnsOld}
                  >
                    {pivotColumns.length === 0 ? (
                      <p className="text-center text-green-600 text-sm">
                        Solte dimensões aqui para colunas
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pivotColumns.map((col, index) => {
                          const dimension = availableDimensions.find(d => d.id === col);
                          return (
                            <Badge key={index} variant="default" className="w-full justify-between">
                              {dimension?.label || col}
                              <X className="h-3 w-3 cursor-pointer" onClick={() => 
                                setPivotColumns(prev => prev.filter((_, i) => i !== index))
                              } />
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview da Tabela Dinâmica */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">Preview da Tabela</h4>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {
                    setPivotRows(["area"]);
                    setPivotColumns(["tipo"]);
                  }}>
                    Área × Tipo
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setPivotRows(["projeto"]);
                    setPivotColumns([]);
                  }}>
                    Por Projeto
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setPivotRows(["mes"]);
                    setPivotColumns([]);
                  }}>
                    Por Mês
                  </Button>
                </div>
              </div>
              <div className="bg-white border rounded-lg overflow-hidden">
                {(() => {
                  const { headers, rows } = generatePivotDataOld();
                  
                  if (headers.length === 0 || rows.length === 0) {
                    return (
                      <div className="text-center p-8 text-gray-500">
                        <p className="text-lg mb-2">Configure sua tabela dinâmica</p>
                        <p className="text-sm">Arraste dimensões para as áreas de linhas e colunas, ou use os botões de exemplo acima</p>
                      </div>
                    );
                  }
                  
                  return (
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          {headers.map((header, index) => (
                            <th key={index} className="text-left p-3 font-medium border-r">
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">{header}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Dados agrupados por {header}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b hover:bg-gray-50">
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className={`p-3 border-r ${cellIndex === 0 ? 'font-medium' : ''}`}>
                                <span className={
                                  headers[cellIndex]?.includes("Variação") && 
                                  typeof cell === 'string' && 
                                  cell.startsWith("-")
                                    ? "text-red-600 font-semibold" 
                                    : headers[cellIndex]?.includes("Variação") && 
                                      typeof cell === 'string' && 
                                      !cell.startsWith("-") && 
                                      cell !== "SEK 0.00"
                                    ? "text-green-600 font-semibold"
                                    : ""
                                }>
                                  {cell}
                                </span>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drilldown Sheet */}
        <Sheet open={isDrilldownOpen} onOpenChange={setIsDrilldownOpen}>
          <SheetContent className="w-[520px] overflow-y-auto">
            {/* Header */}
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Detalhamento - {selectedCluster}</h2>
                    {getStatusBadgeOld("on-track")}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsDrilldownOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6 mt-6">
              {/* Tabela de Projetos */}
              <div>
                <TooltipProvider>
                  <div className="flex items-center gap-2 mb-3">
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h4 className="font-semibold cursor-help">Projetos do Cluster</h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lista detalhada dos projetos pertencentes a este cluster</p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </TooltipProvider>
                
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <TooltipProvider>
                          <th className="text-left p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">Projeto</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Nome e código do projeto</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-right p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">SOP</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Sales & Operations Planning - Valor planejado</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-right p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">AC</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Actual - Valor realizado atual</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-right p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">Target</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Meta estabelecida para o projeto</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-right p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">Var</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Variação entre AC e Target</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-right p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">Assert.</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Percentual de assertividade (AC/SOP * 100)</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                          <th className="text-center p-3 font-medium">
                            <UITooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">Status</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Status atual do projeto</p>
                              </TooltipContent>
                            </UITooltip>
                          </th>
                        </TooltipProvider>
                      </tr>
                    </thead>
                    <tbody>
                      {clusterProjects.map((project, index) => (
                        <tr key={project.id} className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="p-3">
                            <div>
                              <div className="font-medium text-gray-900">{project.name}</div>
                              <div className="text-xs text-gray-500">{project.id}</div>
                            </div>
                          </td>
                          <td className="text-right p-3 font-medium">{formatCurrency(project.sop)}</td>
                          <td className="text-right p-3 font-medium">{formatCurrency(project.ac)}</td>
                          <td className="text-right p-3 font-medium">{formatCurrency(project.target)}</td>
                          <td className={`text-right p-3 font-medium ${project.var >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <div className="flex items-center justify-end gap-1">
                              {getVariationIcon(project.var)}
                              {formatCurrency(project.var)}
                            </div>
                          </td>
                          <td className="text-right p-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getAssertivenessBg(project.assertividade)}`}>
                              {project.assertividade.toFixed(1)}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            {getStatusBadgeOld(project.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator />

              {/* Timeline de Alterações */}
              <div>
                <TooltipProvider>
                  <div className="flex items-center gap-2 mb-3">
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h4 className="font-semibold cursor-help">Timeline de Alterações</h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Histórico cronológico de mudanças e eventos importantes</p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </TooltipProvider>
                
                <div className="bg-white border rounded-lg p-4">
                  <div className="space-y-4">
                    {timelineData.map((item) => {
                      const IconComponent = getTimelineIcon(item.type);
                      return (
                        <div key={item.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <User className="h-3 w-3" />
                              <span>{item.user}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Justificativas e Comentários */}
              <div>
                <TooltipProvider>
                  <div className="flex items-center gap-2 mb-3">
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <h4 className="font-semibold cursor-help">Justificativas e Comentários</h4>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Área para documentar justificativas e observações sobre o desempenho</p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </TooltipProvider>
                
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Adicione justificativas para as variações ou comentários sobre o desempenho do cluster..."
                    className="min-h-[80px] text-sm"
                    defaultValue="Cluster apresentando performance superior ao esperado devido à otimização de processos implementada no Q3. Economia adicional de 150 SEK kr identificada no projeto ERP."
                  />
                  
                  {/* Área de Upload/Visualização de Documentos */}
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Arraste arquivos aqui ou clique para selecionar</p>
                      <p className="text-xs text-gray-500">PDF, Excel, PowerPoint até 10MB</p>
                    </div>
                    
                    {/* Documentos anexados (simulado) */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm flex-1">Ata_Reuniao_BRM_15Dec2024.pdf</span>
                        <Button size="sm" variant="ghost">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded border">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm flex-1">Analise_Performance_Q4.xlsx</span>
                        <Button size="sm" variant="ghost">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documento
                      </Button>
                      <Button size="sm">Salvar Comentário</Button>
                    </div>
                    <Button size="sm" variant="outline" onClick={exportDrilldownPanel}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Painel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
