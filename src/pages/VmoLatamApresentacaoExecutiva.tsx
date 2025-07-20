import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Download, Calendar, User, FileText, TrendingUp, TrendingDown, Minus, Upload, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function VmoLatamApresentacaoExecutiva() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedQuarter, setSelectedQuarter] = useState("Q4");
  const [selectedMonth, setSelectedMonth] = useState("December");
  const [selectedProject, setSelectedProject] = useState("All");
  const [showOptionalColumns, setShowOptionalColumns] = useState(false);
  const [chartView, setChartView] = useState("monthly");
  const [selectedBaseline, setSelectedBaseline] = useState("current");
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState("");

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
    { id: "P001", name: "Sistema ERP Integrado", sop: 2500, ac: 2650, target: 2400, var: 150, assertividade: 106.0 },
    { id: "P002", name: "Automação Fábrica 4.0", sop: 1800, ac: 1720, target: 1850, var: -130, assertividade: 95.6 },
    { id: "P003", name: "Modernização IT Infrastructure", sop: 3200, ac: 3100, target: 3150, var: -50, assertividade: 96.9 },
  ];

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

  const handleClusterClick = (area: string) => {
    setSelectedCluster(area);
    setIsDrilldownOpen(true);
  };

  const exportPresentation = () => {
    console.log("Exportando apresentação executiva...");
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

      {/* Baseline/Histórico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Histórico de Baselines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Select value={selectedBaseline} onValueChange={setSelectedBaseline}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Selecionar Baseline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Baseline Atual (Dez 2024)</SelectItem>
                <SelectItem value="nov2024">Baseline Nov 2024</SelectItem>
                <SelectItem value="oct2024">Baseline Out 2024</SelectItem>
                <SelectItem value="sep2024">Baseline Set 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Comparar Baselines
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Comentário da Baseline Atual:</h4>
            <Textarea 
              className="mb-3 bg-white"
              defaultValue="Ajustes realizados conforme revisão trimestral. Inclusão de 3 novos projetos estratégicos e reavaliação de timelines devido a mudanças de prioridade de negócio."
            />
            <div className="text-sm text-gray-600">
              <span>Última atualização: 15/12/2024 - Admin User</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela Dinâmica/Cubo */}
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
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Arraste e solte dimensões para customizar a análise:</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="cursor-move hover:bg-blue-50">Ano</Badge>
              <Badge variant="outline" className="cursor-move hover:bg-blue-50">Área</Badge>
              <Badge variant="outline" className="cursor-move hover:bg-blue-50">Projeto</Badge>
              <Badge variant="outline" className="cursor-move hover:bg-blue-50">Mês</Badge>
              <Badge variant="outline" className="cursor-move hover:bg-blue-50">Tipo de Valor</Badge>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg min-h-32 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <p className="text-center text-gray-500">
              Solte as dimensões aqui para criar sua análise customizada
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Drilldown Sheet */}
      <Sheet open={isDrilldownOpen} onOpenChange={setIsDrilldownOpen}>
        <SheetContent className="w-[600px] sm:w-[800px]">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              Detalhamento - {selectedCluster}
              <Button variant="ghost" size="sm" onClick={() => setIsDrilldownOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          
          <div className="space-y-6 mt-6">
            {/* Lista de Projetos */}
            <div>
              <h4 className="font-semibold mb-3">Projetos do Cluster</h4>
              <div className="space-y-3">
                {clusterProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-gray-500">{project.id}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">SOP:</span>
                        <div className="font-medium">{formatCurrency(project.sop)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">AC:</span>
                        <div className="font-medium">{formatCurrency(project.ac)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Var:</span>
                        <div className={`font-medium ${project.var >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(project.var)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Assertividade:</span>
                        <div className={`font-medium ${getAssertivenessBg(project.assertividade)} px-2 py-1 rounded text-center`}>
                          {project.assertividade.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Justificativas */}
            <div>
              <h4 className="font-semibold mb-3">Justificativas e Comentários</h4>
              <Textarea 
                placeholder="Adicione justificativas para as variações ou comentários sobre o desempenho do cluster..."
                className="mb-3"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documento
                </Button>
                <Button size="sm">Salvar Comentário</Button>
              </div>
            </div>

            <Separator />

            {/* Timeline de Alterações */}
            <div>
              <h4 className="font-semibold mb-3">Timeline de Alterações</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium">Baseline atualizada</div>
                    <div className="text-sm text-gray-500">15/12/2024 - Revisão mensal dos targets</div>
                    <div className="text-sm">Ajuste de +200 SEK kr no target devido a novo projeto aprovado</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium">Projeto entregue</div>
                    <div className="text-sm text-gray-500">01/12/2024 - Sistema ERP Integrado</div>
                    <div className="text-sm">Entrega antecipada resultou em economia de 150 SEK kr</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium">Alerta de desvio</div>
                    <div className="text-sm text-gray-500">25/11/2024 - Automação Fábrica 4.0</div>
                    <div className="text-sm">Identificado atraso de 2 semanas por questões de fornecedor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}