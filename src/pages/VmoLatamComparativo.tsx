import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  Trophy,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data para demonstração
const performanceData = [
  { unit: "São Paulo", country: "Brasil", roi: 18.5, eva: 2.8, npv: 1250, payback: 2.1 },
  { unit: "Manaus", country: "Brasil", roi: 15.2, eva: 1.9, npv: 890, payback: 2.8 },
  { unit: "Santiago", country: "Chile", roi: 22.1, eva: 3.4, npv: 1580, payback: 1.8 },
  { unit: "Buenos Aires", country: "Argentina", roi: 12.8, eva: 1.2, npv: 650, payback: 3.2 },
  { unit: "Rosario", country: "Argentina", roi: 14.6, eva: 1.8, npv: 780, payback: 2.9 },
  { unit: "Curitiba", country: "Brasil", roi: 19.8, eva: 2.6, npv: 1120, payback: 2.3 }
];

const radarData = [
  { metric: "ROI", value: 18.5, fullMark: 25 },
  { metric: "EVA", value: 2.8, fullMark: 4 },
  { metric: "NPV", value: 8.5, fullMark: 10 },
  { metric: "Payback", value: 7.2, fullMark: 10 },
  { metric: "Risk Score", value: 6.8, fullMark: 10 }
];

const topValueProjects = [
  { name: "Automação Linha Produção", unit: "Santiago", country: "Chile", value: 2850, roi: 24.5, status: "Em Execução" },
  { name: "Modernização ERP", unit: "São Paulo", country: "Brasil", value: 2340, roi: 19.8, status: "Planejado" },
  { name: "Eficiência Energética", unit: "Curitiba", country: "Brasil", value: 1980, roi: 22.1, status: "Em Execução" },
  { name: "Logística Integrada", unit: "Manaus", country: "Brasil", value: 1750, roi: 16.4, status: "Concluído" },
  { name: "Digital Transformation", unit: "Buenos Aires", country: "Argentina", value: 1620, roi: 15.2, status: "Em Execução" }
];

const topRiskProjects = [
  { name: "Expansão Capacidade", unit: "Rosario", country: "Argentina", risk: "Alto", impact: 850, probability: 75 },
  { name: "Nova Linha Produtos", unit: "Buenos Aires", country: "Argentina", risk: "Alto", impact: 920, probability: 68 },
  { name: "Integração Sistemas", unit: "Manaus", country: "Brasil", risk: "Médio", impact: 580, probability: 45 },
  { name: "Compliance Ambiental", unit: "Santiago", country: "Chile", risk: "Médio", impact: 670, probability: 52 },
  { name: "Treinamento Equipes", unit: "São Paulo", country: "Brasil", risk: "Baixo", impact: 320, probability: 28 }
];

const chartConfig = {
  roi: { label: "ROI (%)", color: "hsl(var(--primary))" },
  eva: { label: "EVA (M$)", color: "hsl(var(--secondary))" },
  npv: { label: "NPV (K$)", color: "hsl(var(--accent))" },
  payback: { label: "Payback (anos)", color: "hsl(var(--muted))" }
};

export default function VmoLatamComparativo() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [chartType, setChartType] = useState("bar");
  const { toast } = useToast();

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Relatório comparativo será baixado em instantes.",
    });
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "Alto": return "destructive";
      case "Médio": return "secondary";
      case "Baixo": return "default";
      default: return "default";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Concluído": return "default";
      case "Em Execução": return "secondary";
      case "Planejado": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header com badges OKR */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Comparativo de Valor e Performance Regional</h1>
          <p className="text-muted-foreground mt-2">
            Dashboard comparativo de ROI, EVA, NPV e performance por unidade fabril
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="flex items-center gap-1">
            <Target className="w-3 h-3" />
            OKR: ROI +20%
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Meta EVA: $2.5M
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            Payback &lt; 3 anos
          </Badge>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Análise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="3years">Últimos 3 anos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Área</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Áreas</SelectItem>
                  <SelectItem value="manufacturing">Manufatura</SelectItem>
                  <SelectItem value="logistics">Logística</SelectItem>
                  <SelectItem value="it">Tecnologia</SelectItem>
                  <SelectItem value="sustainability">Sustentabilidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria Projeto</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="automation">Automação</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="efficiency">Eficiência</SelectItem>
                  <SelectItem value="expansion">Expansão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Gráfico</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Barras</SelectItem>
                  <SelectItem value="radar">Radar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Performance por Unidade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance por Unidade Fabril
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              {chartType === "bar" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="unit" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="roi" name="ROI (%)" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 'dataMax']} />
                    <Radar 
                      name="Performance" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Gráfico EVA por País */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              EVA por País (M$)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="eva" name="EVA (M$)" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabelas Top 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Projetos Maior Valor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top 5 - Maior Valor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Valor (K$)</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topValueProjects.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {project.unit}
                        <br />
                        <span className="text-muted-foreground text-xs">{project.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${project.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        {project.roi}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top 5 Projetos Maior Risco */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Top 5 - Maior Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projeto</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Impacto (K$)</TableHead>
                  <TableHead>Probabilidade</TableHead>
                  <TableHead>Nível</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRiskProjects.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {project.unit}
                        <br />
                        <span className="text-muted-foreground text-xs">{project.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-red-600">
                      ${project.impact.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-red-500" />
                        {project.probability}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(project.risk)}>
                        {project.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="text-sm text-muted-foreground">
              Dados atualizados em: 15/01/2025 14:30 BRT
              <br />
              Próxima atualização: 16/01/2025 08:00 BRT
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar Excel
              </Button>
              <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportar Power BI
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}