import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Download, 
  Search, 
  Clock, 
  User, 
  MapPin, 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Shuffle,
  Calendar,
  Filter,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data para demonstração
const auditLogs = [
  {
    id: 1,
    type: "Aprovação",
    action: "Aprovação de Baseline",
    project: "Automação Linha Produção",
    unit: "Santiago",
    country: "Chile",
    user: "Maria Silva",
    role: "Gerente VMO",
    date: new Date("2024-01-15T10:30:00"),
    reason: "Projeto alinhado com estratégia de automatização da região LATAM. ROI projetado de 24.5% justifica o investimento.",
    impact: "Baseline aprovada: $2.850K",
    status: "Aprovado"
  },
  {
    id: 2,
    type: "Remanejamento",
    action: "Transferência de Budget",
    project: "ERP Modernização",
    unit: "Curitiba PR1",
    country: "Brasil",
    user: "Carlos Rodriguez",
    role: "Diretor Regional",
    date: new Date("2024-01-12T14:15:00"),
    reason: "Realocação de recursos devido a atraso no projeto de Santiago. Priorização de projetos com maior impacto regional.",
    impact: "Budget transferido: $450K",
    status: "Executado"
  },
  {
    id: 3,
    type: "Baseline",
    action: "Criação de Nova Baseline",
    project: "Eficiência Energética",
    unit: "São Carlos",
    country: "Brasil",
    user: "Ana Paula Costa",
    role: "Coordenadora Financeira",
    date: new Date("2024-01-10T09:45:00"),
    reason: "Ajuste de baseline devido a mudanças no escopo do projeto e novas regulamentações ambientais.",
    impact: "Nova baseline: $1.980K",
    status: "Criado"
  },
  {
    id: 4,
    type: "Aprovação",
    action: "Aprovação Emergencial",
    project: "Logística Integrada",
    unit: "Manaus",
    country: "Brasil",
    user: "Roberto Santos",
    role: "VP Operations",
    date: new Date("2024-01-08T16:20:00"),
    reason: "Aprovação emergencial devido a oportunidade de integração com novo fornecedor logístico. Timeline crítico.",
    impact: "Orçamento aprovado: $1.750K",
    status: "Aprovado"
  },
  {
    id: 5,
    type: "Remanejamento",
    action: "Suspensão Temporária",
    project: "Digital Transformation",
    unit: "Rosário",
    country: "Argentina",
    user: "Diego Martinez",
    role: "Gerente Regional",
    date: new Date("2024-01-05T11:30:00"),
    reason: "Suspensão temporária devido a instabilidade econômica local e flutuação cambial ARS/USD.",
    impact: "Budget suspenso: $920K",
    status: "Suspenso"
  },
  {
    id: 6,
    type: "Baseline",
    action: "Revisão de Baseline",
    project: "Expansão Capacidade",
    unit: "Curitiba PR2",
    country: "Brasil",
    user: "Fernanda Lima",
    role: "Analista Senior",
    date: new Date("2024-01-03T13:45:00"),
    reason: "Revisão necessária devido a aumento nos custos de matéria-prima e equipamentos industriais.",
    impact: "Baseline revista: $2.100K (+15%)",
    status: "Revisado"
  },
  {
    id: 7,
    type: "Aprovação",
    action: "Aprovação Condicional",
    project: "Compliance Ambiental",
    unit: "Santiago",
    country: "Chile",
    user: "Luis Gonzalez",
    role: "Diretor Sustentabilidade",
    date: new Date("2023-12-28T15:10:00"),
    reason: "Aprovação condicional mediante apresentação de certificações ambientais e plano de mitigação de riscos.",
    impact: "Orçamento aprovado: $670K",
    status: "Condicional"
  },
  {
    id: 8,
    type: "Remanejamento",
    action: "Realocação de Recursos",
    project: "Treinamento Equipes",
    unit: "São Carlos",
    country: "Brasil",
    user: "Patricia Oliveira",
    role: "RH Regional",
    date: new Date("2023-12-22T10:25:00"),
    reason: "Realocação para foco em capacitação digital e automação, alinhado com transformação tecnológica da empresa.",
    impact: "Budget realocado: $320K",
    status: "Realocado"
  },
  {
    id: 9,
    type: "Baseline",
    action: "Baseline Inicial",
    project: "IoT Manufacturing",
    unit: "Manaus",
    country: "Brasil",
    user: "Marcos Ferreira",
    role: "Tech Lead",
    date: new Date("2023-12-20T08:30:00"),
    reason: "Criação de baseline inicial para projeto piloto de IoT na manufatura. Fase de prova de conceito aprovada.",
    impact: "Baseline criada: $890K",
    status: "Criado"
  },
  {
    id: 10,
    type: "Aprovação",
    action: "Aprovação Final",
    project: "Integração Sistemas",
    unit: "Rosário",
    country: "Argentina",
    user: "Sofia Mendez",
    role: "CTO Regional",
    date: new Date("2023-12-18T14:50:00"),
    reason: "Aprovação final após validação técnica e financeira. Projeto crítico para integração de sistemas regionais.",
    impact: "Projeto aprovado: $1.420K",
    status: "Aprovado"
  }
];

export default function VmoLatamGovernanca() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedUnit, setSelectedUnit] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const { toast } = useToast();

  // Filtrar logs baseado nos critérios selecionados
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || log.type === selectedType;
    const matchesCountry = selectedCountry === "all" || log.country === selectedCountry;
    const matchesUnit = selectedUnit === "all" || log.unit === selectedUnit;
    const matchesUser = selectedUser === "all" || log.user === selectedUser;

    return matchesSearch && matchesType && matchesCountry && matchesUnit && matchesUser;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Aprovação": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "Remanejamento": return <Shuffle className="w-4 h-4 text-orange-600" />;
      case "Baseline": return <FileText className="w-4 h-4 text-blue-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aprovado": return "default";
      case "Executado": return "secondary";
      case "Criado": return "outline";
      case "Suspenso": return "destructive";
      case "Condicional": return "secondary";
      case "Revisado": return "outline";
      case "Realocado": return "secondary";
      default: return "outline";
    }
  };

  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: "Logs de auditoria serão baixados em instantes.",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCountry("all");
    setSelectedUnit("all");
    setSelectedUser("all");
  };

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Governança, Logs e Auditoria</h1>
            <p className="text-muted-foreground mt-2">
              Registro completo de decisões, aprovações e alterações do VMO LATAM
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar Logs
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Busca Rápida */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Busca Rápida</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por projeto, usuário ou motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tipo de Ação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo Ação</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Aprovação">Aprovação</SelectItem>
                    <SelectItem value="Remanejamento">Remanejamento</SelectItem>
                    <SelectItem value="Baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* País */}
              <div className="space-y-2">
                <label className="text-sm font-medium">País</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Brasil">Brasil</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Unidade */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Unidade</label>
                <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Curitiba PR1">Curitiba PR1</SelectItem>
                    <SelectItem value="Curitiba PR2">Curitiba PR2</SelectItem>
                    <SelectItem value="São Carlos">São Carlos</SelectItem>
                    <SelectItem value="Manaus">Manaus</SelectItem>
                    <SelectItem value="Santiago">Santiago</SelectItem>
                    <SelectItem value="Rosário">Rosário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Responsável */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Responsável</label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Maria Silva">Maria Silva</SelectItem>
                    <SelectItem value="Carlos Rodriguez">Carlos Rodriguez</SelectItem>
                    <SelectItem value="Ana Paula Costa">Ana Paula Costa</SelectItem>
                    <SelectItem value="Roberto Santos">Roberto Santos</SelectItem>
                    <SelectItem value="Diego Martinez">Diego Martinez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {filteredLogs.length} registros encontrados
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline de Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Linha do Tempo de Decisões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredLogs.map((log, index) => (
                <div key={log.id} className="relative">
                  {/* Linha de conexão */}
                  {index < filteredLogs.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Ícone do tipo */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      {getTypeIcon(log.type)}
                    </div>

                    {/* Conteúdo */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        {/* Header do evento */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {log.type}
                            </Badge>
                            <span className="font-semibold text-sm">{log.action}</span>
                            <Badge variant={getStatusBadgeVariant(log.status)} className="text-xs">
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            {format(log.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </div>
                        </div>

                        {/* Detalhes do projeto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{log.project}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{log.unit}, {log.country}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{log.user}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {log.role}
                          </div>
                        </div>

                        {/* Motivo com tooltip */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Motivo da Decisão:</span>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p className="text-sm">{log.reason}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded border-l-4 border-primary/20">
                            {log.reason}
                          </p>
                        </div>

                        {/* Impacto */}
                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <span className="text-sm font-medium text-primary">
                            {log.impact}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ID: {log.id.toString().padStart(4, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum registro encontrado</h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou termos de busca para encontrar os logs desejados.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rodapé com informações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-sm text-muted-foreground">
              <div>
                <p>Sistema de auditoria ativo • Todos os eventos são registrados automaticamente</p>
                <p>Retenção: 7 anos • Backup diário • Conformidade SOX/LGPD</p>
              </div>
              <div className="text-right">
                <p>Última sincronização: {format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                <p>Total de registros: {auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}