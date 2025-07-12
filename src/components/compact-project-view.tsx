import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, Calendar, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  leader: string;
  status: "Em Andamento" | "Concluído" | "Em Atraso" | "Planejado" | "Crítico";
  area: string;
  budget: number;
  realized: number;
  committed: number;
  balance: number;
  currency: "BRL" | "USD" | "EUR" | "SEK";
  isCritical: boolean;
  progress: number;
  deadline: string;
}

interface CompactProjectViewProps {
  projects: Project[];
  selectedProjects: string[];
  onToggleSelection: (projectId: string) => void;
  formatCurrency: (amount: number, currency: string) => string;
  viewMode?: "executive" | "compact";
}

export function CompactProjectView({ 
  projects, 
  selectedProjects, 
  onToggleSelection, 
  formatCurrency,
  viewMode = "compact"
}: CompactProjectViewProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const navigate = useNavigate();

  const getHealthIndicator = (project: Project) => {
    if (project.isCritical || project.status === "Crítico") return "red";
    if (project.status === "Em Atraso" || project.progress < 50) return "yellow";
    return "green";
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 50) return "text-blue-600";
    if (progress >= 30) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedProjects.length === projects.length}
                onCheckedChange={(checked) => {
                  // Handle select all logic
                }}
              />
            </TableHead>
            {viewMode === "executive" && <TableHead className="w-4"></TableHead>}
            <TableHead>Projeto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Líder</TableHead>
            {viewMode === "executive" && <TableHead>Orçamento</TableHead>}
            {viewMode === "executive" && <TableHead>Saldo</TableHead>}
            <TableHead>Progresso</TableHead>
            <TableHead>Prazo</TableHead>
            <TableHead className="w-32">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <>
              <TableRow 
                key={project.id}
                className={`cursor-pointer transition-colors ${
                  viewMode === "compact" && expandedProject === project.id ? "bg-muted/50" : ""
                } ${project.isCritical ? "border-l-4 border-l-destructive" : ""} ${
                  viewMode === "executive" ? "hover:bg-muted/30" : ""
                }`}
                onMouseEnter={() => viewMode === "compact" && setExpandedProject(project.id)}
                onMouseLeave={() => viewMode === "compact" && setExpandedProject(null)}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => onToggleSelection(project.id)}
                  />
                </TableCell>
                {viewMode === "executive" && (
                  <TableCell>
                    <div className={`w-3 h-3 rounded-full ${
                      getHealthIndicator(project) === "red" ? "bg-red-500" :
                      getHealthIndicator(project) === "yellow" ? "bg-yellow-500" :
                      "bg-green-500"
                    }`} />
                  </TableCell>
                )}
                <TableCell>
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.id} • {project.area}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`
                    ${project.status === "Crítico" ? "border-red-200 bg-red-50 text-red-700" :
                      project.status === "Em Atraso" ? "border-orange-200 bg-orange-50 text-orange-700" :
                      project.status === "Em Andamento" ? "border-blue-200 bg-blue-50 text-blue-700" :
                      project.status === "Concluído" ? "border-green-200 bg-green-50 text-green-700" :
                      "border-gray-200 bg-gray-50 text-gray-700"
                    }
                  `}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{project.leader}</div>
                </TableCell>
                {viewMode === "executive" && (
                  <TableCell>
                    <div className="text-sm font-medium">
                      {formatCurrency(project.budget, project.currency)}
                    </div>
                  </TableCell>
                )}
                {viewMode === "executive" && (
                  <TableCell>
                    <div className={`text-sm font-medium flex items-center gap-1 ${
                      project.balance < 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {formatCurrency(project.balance, project.currency)}
                      {project.balance < 0 ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <TrendingUp className="h-3 w-3" />
                      )}
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={viewMode === "executive" ? "w-20" : "w-16"}>
                      <div className="bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            project.progress >= 80 ? "bg-green-500" :
                            project.progress >= 50 ? "bg-blue-500" :
                            project.progress >= 30 ? "bg-orange-500" :
                            "bg-red-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getProgressColor(project.progress)}`}>
                      {project.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{project.deadline}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0"
                          onClick={() => navigate(`/projetos/${project.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalhes</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar projeto</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
              
              {/* Expanded Details Row - Only in Compact Mode */}
              {viewMode === "compact" && expandedProject === project.id && (
                <TableRow className="bg-muted/20">
                  <TableCell colSpan={8} className="py-2">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Orçamento:</span>
                        <div className="font-medium">{formatCurrency(project.budget, project.currency)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Realizado:</span>
                        <div className="font-medium flex items-center gap-1">
                          {formatCurrency(project.realized, project.currency)}
                          {project.realized > project.budget ? (
                            <TrendingUp className="h-3 w-3 text-red-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Saldo:</span>
                        <div className={`font-medium ${project.balance < 0 ? "text-red-600" : "text-green-600"}`}>
                          {formatCurrency(project.balance, project.currency)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Comprometido:</span>
                        <div className="font-medium">{formatCurrency(project.committed, project.currency)}</div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}