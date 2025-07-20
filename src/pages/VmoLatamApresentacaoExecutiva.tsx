import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, User, FileText, TrendingUp, TrendingDown, Minus, Upload, X, Clock, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Presentation, Maximize2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      color: "blue"
    },
    { 
      id: 2, 
      type: "delivery", 
      title: "Projeto entregue", 
      date: "01/12/2024", 
      user: "Maria Silva", 
      description: "Sistema ERP Integrado - Entrega antecipada resultou em economia de 150 SEK kr",
      icon: CheckCircle,
      color: "green"
    },
    { 
      id: 3, 
      type: "alert", 
      title: "Alerta de desvio", 
      date: "25/11/2024", 
      user: "João Santos", 
      description: "Automação Fábrica 4.0 - Identificado atraso de 2 semanas por questões de fornecedor",
      icon: AlertCircle,
      color: "yellow"
    },
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

  // Dados simulados para tabela dinâmica
  const pivotData = [
    { ano: "2024", area: "BRM", projeto: "ERP System", mes: "Jan", tipo: "Target", valor: 1250 },
    { ano: "2024", area: "BRM", projeto: "ERP System", mes: "Jan", tipo: "AC", valor: 1350 },
    { ano: "2024", area: "BRM", projeto: "Automation", mes: "Jan", tipo: "Target", valor: 800 },
    { ano: "2024", area: "BRM", projeto: "Automation", mes: "Jan", tipo: "AC", valor: 750 },
    { ano: "2024", area: "Business Excellence", projeto: "Process Optimization", mes: "Jan", tipo: "Target", valor: 1000 },
    { ano: "2024", area: "Business Excellence", projeto: "Process Optimization", mes: "Jan", tipo: "AC", valor: 980 },
  ];

  const availableDimensions = [
    { id: "ano", label: "Ano", description: "Filtrar por ano fiscal" },
    { id: "area", label: "Área", description: "Área ou cluster organizacional" },
    { id: "projeto", label: "Projeto", description: "Projeto específico" },
    { id: "mes", label: "Mês", description: "Mês de referência" },
    { id: "tipo", label: "Tipo de Valor", description: "Target, AC, SOP, etc." }
  ];

  // Dados para gráficos de pizza
  const assertivenessPieData = [
    { name: ">100%", value: 1, color: "#22c55e" },
    { name: "80-100%", value: 2, color: "#eab308" },
    { name: "<80%", value: 1, color: "#ef4444" }
  ];

  const COLORS = ['#22c55e', '#eab308', '#ef4444'];

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString()} SEK kr`;
  };

  const getVariationIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getAssertivenessBg = (value: number) => {
    if (value >= 100) return "bg-green-100 text-green-800";
    if (value >= 80) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusBadge = (status: string) => {
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const downloadSlide = () => {
    console.log(`Baixando slide ${currentSlide + 1}...`);
  };

  const downloadPresentation = () => {
    console.log("Baixando apresentação completa...");
  };

  // Controles de teclado
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

  // Componente do Modo Apresentação
  const PresentationMode = () => {
    const slideContent = () => {
      switch (currentSlide) {
        case 0: // Slide de Capa
          return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <img 
                src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                alt="Electrolux Logo" 
                className="h-20 w-auto mb-8"
              />
              <h1 className="text-6xl font-bold text-gray-900 mb-4">
                BA LA – IT BA LA
              </h1>
              <h2 className="text-4xl font-semibold text-blue-700 mb-6">
                2024 Overview – New Baseline
              </h2>
              <div className="text-2xl text-gray-600 space-y-2">
                <p>Apresentação Executiva de Resultados</p>
                <p className="text-xl">Dezembro 2024</p>
                <p className="text-lg text-gray-500">Preparado por: Admin User</p>
              </div>
            </div>
          );

        case 1: // KPIs Gerais
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">KPIs Principais</h1>
                <p className="text-2xl text-gray-600">Visão Consolidada 2024</p>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-blue-600">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">Target Total</h3>
                    <p className="text-5xl font-bold text-blue-600">{formatCurrency(totalRow.target)}</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-green-600">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">AC+SOP</h3>
                    <p className="text-5xl font-bold text-green-600">{formatCurrency(totalRow.acSop)}</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-purple-600">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">Variação Total</h3>
                    <p className={`text-5xl font-bold ${totalRow.var >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalRow.var)}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-orange-600">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-2">Performance</h3>
                    <p className="text-5xl font-bold text-orange-600">
                      {((totalRow.acSop / totalRow.target) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );

        case 2: // Tabela Comparativa Anual
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Comparativo Anual</h1>
                <p className="text-2xl text-gray-600">Target vs AC+SOP por Área (SEK kr)</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-xl">
                  <thead className="bg-blue-700 text-white">
                    <tr>
                      <th className="text-left p-6 text-2xl font-bold">Área</th>
                      <th className="text-right p-6 text-2xl font-bold">Target</th>
                      <th className="text-right p-6 text-2xl font-bold">AC+SOP</th>
                      <th className="text-right p-6 text-2xl font-bold">Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparativeData.map((row, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
                        <td className="p-6 font-bold text-gray-900">{row.area}</td>
                        <td className="text-right p-6 font-semibold">{formatCurrency(row.target)}</td>
                        <td className="text-right p-6 font-semibold">{formatCurrency(row.acSop)}</td>
                        <td className={`text-right p-6 font-bold text-2xl ${
                          row.var >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(row.var)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-blue-100 border-t-4 border-blue-700">
                      <td className="p-6 font-bold text-2xl text-blue-900">{totalRow.area}</td>
                      <td className="text-right p-6 font-bold text-2xl">{formatCurrency(totalRow.target)}</td>
                      <td className="text-right p-6 font-bold text-2xl">{formatCurrency(totalRow.acSop)}</td>
                      <td className={`text-right p-6 font-bold text-3xl ${
                        totalRow.var >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(totalRow.var)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );

        case 3: // Tabela YTD
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Year-to-Date</h1>
                <p className="text-2xl text-gray-600">Performance Acumulada 2024</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full text-lg">
                    <thead className="bg-green-700 text-white">
                      <tr>
                        <th className="text-left p-4 text-xl font-bold">Área</th>
                        <th className="text-right p-4 text-xl font-bold">AC YTD</th>
                        <th className="text-right p-4 text-xl font-bold">Target YTD</th>
                        <th className="text-right p-4 text-xl font-bold">Var</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ytdData.map((row, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="p-4 font-semibold">{row.area}</td>
                          <td className="text-right p-4">{formatCurrency(row.acYtd)}</td>
                          <td className="text-right p-4">{formatCurrency(row.targetYtd)}</td>
                          <td className={`text-right p-4 font-bold ${
                            row.var >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatCurrency(row.var)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={ytdData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="acYtd" fill="#22c55e" name="AC YTD" />
                      <Bar dataKey="targetYtd" fill="#3b82f6" name="Target YTD" />
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
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Assertividade Mensal</h1>
                <p className="text-2xl text-gray-600">Performance vs Planejado (%)</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <table className="w-full text-lg">
                    <thead className="bg-purple-700 text-white">
                      <tr>
                        <th className="text-left p-4 text-xl font-bold">Área</th>
                        <th className="text-right p-4 text-xl font-bold">SOP</th>
                        <th className="text-right p-4 text-xl font-bold">AC</th>
                        <th className="text-right p-4 text-xl font-bold">Assert.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assertivenessData.map((row, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                          <td className="p-4 font-semibold">{row.area}</td>
                          <td className="text-right p-4">{formatCurrency(row.sopMes)}</td>
                          <td className="text-right p-4">{formatCurrency(row.acMes)}</td>
                          <td className="text-right p-4">
                            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getAssertivenessBg(row.assertividade)}`}>
                              {row.assertividade.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={assertivenessPieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {assertivenessPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
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
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Evolução Target vs AC+SOP</h1>
                <p className="text-2xl text-gray-600">Acompanhamento Anual 2024</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ResponsiveContainer width="100%" height={500}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 16 }} />
                    <YAxis tick={{ fontSize: 16 }} />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), name]}
                      labelStyle={{ fontSize: '16px' }}
                      contentStyle={{ fontSize: '16px' }}
                    />
                    <Legend iconSize={20} />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#ef4444" 
                      strokeWidth={4}
                      name="Target (-25%)"
                      strokeDasharray="8 8"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="acSop" 
                      stroke="#3b82f6" 
                      strokeWidth={4}
                      name="AC+SOP"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          );

        case 6: // Gráfico Evolução Mensal
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Execução Mensal</h1>
                <p className="text-2xl text-gray-600">BU vs AC+SOP vs Realizados vs Planejados</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 16 }} />
                    <YAxis tick={{ fontSize: 16 }} />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), name]}
                      labelStyle={{ fontSize: '16px' }}
                      contentStyle={{ fontSize: '16px' }}
                    />
                    <Legend iconSize={20} />
                    <Bar dataKey="bu" fill="#8884d8" name="BU" />
                    <Bar dataKey="ac" fill="#82ca9d" name="AC+SOP" />
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
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Detalhamento por Cluster</h1>
                <p className="text-2xl text-gray-600">Projetos e Performance - BRM</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-lg">
                  <thead className="bg-indigo-700 text-white">
                    <tr>
                      <th className="text-left p-4 text-xl font-bold">Projeto</th>
                      <th className="text-right p-4 text-xl font-bold">SOP</th>
                      <th className="text-right p-4 text-xl font-bold">AC</th>
                      <th className="text-right p-4 text-xl font-bold">Target</th>
                      <th className="text-right p-4 text-xl font-bold">Assert.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clusterProjects.map((project, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-4 font-semibold">{project.name}</td>
                        <td className="text-right p-4">{formatCurrency(project.sop)}</td>
                        <td className="text-right p-4">{formatCurrency(project.ac)}</td>
                        <td className="text-right p-4">{formatCurrency(project.target)}</td>
                        <td className="text-right p-4">
                          <span className={`px-3 py-2 rounded-full text-lg font-bold ${getAssertivenessBg(project.assertividade)}`}>
                            {project.assertividade.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-900 mb-3">Insights Principais</h3>
                <p className="text-xl text-blue-800">
                  Cluster BRM apresentando performance superior ao esperado devido à otimização de processos implementada no Q3. 
                  Economia adicional de 150 SEK kr identificada no projeto ERP.
                </p>
              </div>
            </div>
          );

        case 8: // Histórico/Baseline
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Histórico de Baselines</h1>
                <p className="text-2xl text-gray-600">Evolução e Comparação</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.entries(baselineData).map(([key, baseline]) => (
                  <div key={key} className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-blue-700 mb-4">{baseline.name}</h3>
                    <div className="space-y-3">
                      <p className="text-lg"><strong>Data:</strong> {baseline.date}</p>
                      <p className="text-lg"><strong>Responsável:</strong> {baseline.user}</p>
                      <div className="border-t pt-3">
                        <p className="text-sm text-gray-600">{baseline.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">Timeline de Evoluções</h3>
                <div className="flex items-center justify-between">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="flex-1 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 mx-4"></div>
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1 h-1 bg-gradient-to-r from-yellow-500 to-green-500 mx-4"></div>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600">
                  <span>Out 2024</span>
                  <span>Nov 2024</span>
                  <span>Dez 2024</span>
                </div>
              </div>
            </div>
          );

        case 9: // Cubo/Tabela Dinâmica
          return (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2">Análise Customizada</h1>
                <p className="text-2xl text-gray-600">Tabela Dinâmica - Área vs Tipo de Valor</p>
              </div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-xl">
                  <thead className="bg-gray-700 text-white">
                    <tr>
                      <th className="text-left p-6 text-2xl font-bold">Área</th>
                      <th className="text-center p-6 text-2xl font-bold">Target</th>
                      <th className="text-center p-6 text-2xl font-bold">AC</th>
                      <th className="text-center p-6 text-2xl font-bold">Variação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["BRM", "Business Excellence", "Group Solutions"].map((area, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-6 font-bold text-gray-900">{area}</td>
                        <td className="text-center p-6 font-semibold">{formatCurrency(15000 + index * 2000)}</td>
                        <td className="text-center p-6 font-semibold">{formatCurrency(15500 + index * 1800)}</td>
                        <td className="text-center p-6 font-bold text-green-600">
                          {formatCurrency(500 - index * 200)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-yellow-900 mb-3">Filtros Aplicados</h3>
                <div className="grid grid-cols-3 gap-4 text-lg">
                  <p><strong>Ano:</strong> 2024</p>
                  <p><strong>Período:</strong> Q4</p>
                  <p><strong>Moeda:</strong> SEK kr</p>
                </div>
              </div>
            </div>
          );

        case 10: // Slide de Encerramento
          return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
              <img 
                src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                alt="Electrolux Logo" 
                className="h-20 w-auto mb-8"
              />
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Principais Destaques
              </h1>
              <div className="space-y-6 text-2xl text-gray-700 max-w-4xl">
                <div className="bg-green-100 p-6 rounded-xl">
                  <p className="font-semibold text-green-800">✓ Performance 108% do target anual</p>
                </div>
                <div className="bg-blue-100 p-6 rounded-xl">
                  <p className="font-semibold text-blue-800">✓ Economia adicional de 1.4M SEK kr identificada</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-xl">
                  <p className="font-semibold text-purple-800">✓ 3 novos projetos estratégicos aprovados</p>
                </div>
              </div>
              <div className="mt-12 text-xl text-gray-600">
                <p className="font-semibold">Próximos Passos:</p>
                <p>Implementação Q1 2025 • Revisão mensal • Otimização contínua</p>
              </div>
              <div className="mt-8 text-lg text-gray-500">
                <p>Contato: admin@electrolux.com</p>
              </div>
            </div>
          );

        default:
          return <div>Slide não encontrado</div>;
      }
    };

    return slideContent();
  };

  return (
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

      {/* Modo Apresentação */}
      {presentationMode && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Controles de Navegação */}
          <div className="bg-black/90 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setPresentationMode(false)}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <X className="h-4 w-4 mr-2" />
                Sair
              </Button>
              <span className="text-lg font-medium">
                Slide {currentSlide + 1} de {totalSlides}
              </span>
            </div>
            
            {/* Navegação Central */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={prevSlide}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Miniaturas dos Slides */}
              <div className="flex gap-2 mx-4">
                {Array.from({ length: totalSlides }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={nextSlide}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Controles de Ação */}
            <div className="flex items-center gap-2">
              <Button 
                onClick={downloadSlide}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Slide
              </Button>
              <Button 
                onClick={downloadPresentation}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <FileText className="h-4 w-4 mr-2" />
                Baixar Tudo
              </Button>
            </div>
          </div>

          {/* Área do Slide */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-[1920px] h-[1080px] max-h-[90vh] bg-white rounded-lg shadow-2xl aspect-video overflow-auto">
              <div className="w-full h-full p-12">
                <PresentationMode />
              </div>
            </div>
          </div>

          {/* Controles de Teclado */}
          <div className="bg-black/90 p-2 text-center text-white/60 text-sm">
            Use as setas ← → ou clique nos pontos para navegar • ESC para sair
          </div>
        </div>
      )}

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
                <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 min-h-[120px]">
                  {pivotRows.length === 0 ? (
                    <p className="text-center text-blue-600 text-sm">
                      Solte dimensões aqui para linhas
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pivotRows.map((row, index) => (
                        <Badge key={index} variant="default" className="w-full justify-between">
                          {row}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => 
                            setPivotRows(prev => prev.filter((_, i) => i !== index))
                          } />
                        </Badge>
                      ))}
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
                <div className="bg-green-50 border-2 border-dashed border-green-300 rounded-lg p-4 min-h-[120px]">
                  {pivotColumns.length === 0 ? (
                    <p className="text-center text-green-600 text-sm">
                      Solte dimensões aqui para colunas
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pivotColumns.map((col, index) => (
                        <Badge key={index} variant="default" className="w-full justify-between">
                          {col}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => 
                            setPivotColumns(prev => prev.filter((_, i) => i !== index))
                          } />
                        </Badge>
                      ))}
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
              <Button size="sm" onClick={() => {
                setPivotRows(["area"]);
                setPivotColumns(["tipo"]);
              }}>
                Exemplo Rápido
              </Button>
            </div>
            <div className="bg-white border rounded-lg overflow-hidden">
              {pivotRows.length > 0 || pivotColumns.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <TooltipProvider>
                        <th className="text-left p-3 font-medium border-r">
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">Dimensão</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Linhas da tabela dinâmica</p>
                            </TooltipContent>
                          </UITooltip>
                        </th>
                        {pivotColumns.includes("tipo") ? (
                          <>
                            <th className="text-center p-3 font-medium">
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">Target</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Valores alvo estabelecidos</p>
                                </TooltipContent>
                              </UITooltip>
                            </th>
                            <th className="text-center p-3 font-medium">
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">AC</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Valores realizados (Actual)</p>
                                </TooltipContent>
                              </UITooltip>
                            </th>
                            <th className="text-center p-3 font-medium">
                              <UITooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">Variação</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Diferença entre AC e Target</p>
                                </TooltipContent>
                              </UITooltip>
                            </th>
                          </>
                        ) : (
                          <th className="text-center p-3 font-medium">Valores</th>
                        )}
                      </TooltipProvider>
                    </tr>
                  </thead>
                  <tbody>
                    {pivotRows.includes("area") ? (
                      ["BRM", "Business Excellence", "Group Solutions"].map((area, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-3 font-medium border-r">{area}</td>
                          {pivotColumns.includes("tipo") ? (
                            <>
                              <td className="text-center p-3">{formatCurrency(15000 + index * 2000)}</td>
                              <td className="text-center p-3">{formatCurrency(15500 + index * 1800)}</td>
                              <td className="text-center p-3 text-green-600 font-semibold">
                                {formatCurrency(500 - index * 200)}
                              </td>
                            </>
                          ) : (
                            <td className="text-center p-3">{formatCurrency(15000 + index * 2000)}</td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center p-8 text-gray-500">
                          Configure as dimensões acima para visualizar os dados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  Arraste dimensões para as áreas de linhas e colunas para criar sua tabela dinâmica
                </div>
              )}
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
                  {getStatusBadge("on-track")}
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
                          {getStatusBadge(project.status)}
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
                        <div className={`w-8 h-8 ${getTimelineColor(item.color)} rounded-full flex items-center justify-center flex-shrink-0`}>
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
  );
}