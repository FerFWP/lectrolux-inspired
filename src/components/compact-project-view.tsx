import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Circle } from "lucide-react";
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
  currency: "BRL" | "USD" | "SEK";
  isCritical: boolean;
  progress: number;
  deadline: string;
  budgetUnit: number;
}

interface CompactProjectViewProps {
  projects: Project[];
  formatCurrency: (amount: number, currency: string) => string;
}

export function CompactProjectView({ 
  projects, 
  formatCurrency
}: CompactProjectViewProps) {
  const navigate = useNavigate();

  const getFinancialStatusIcon = (project: Project) => {
    if (project.balance < 0 || project.isCritical || project.status === "Crítico") {
      return <Circle className="h-4 w-4 fill-red-500 text-red-500" />;
    }
    if (project.status === "Em Atraso" || (project.realized / project.budget) > 0.9) {
      return <Circle className="h-4 w-4 fill-yellow-500 text-yellow-500" />;
    }
    return <Circle className="h-4 w-4 fill-green-500 text-green-500" />;
  };

  const getFinancialStatusTooltip = (project: Project) => {
    if (project.balance < 0 || project.isCritical || project.status === "Crítico") {
      return "Status financeiro crítico";
    }
    if (project.status === "Em Atraso" || (project.realized / project.budget) > 0.9) {
      return "Status financeiro de atenção";
    }
    return "Status financeiro saudável";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getApprovalDate = (project: Project) => {
    // Mock data - in real app this would come from the project
    return "15/01/2025";
  };

  const getLastUpdate = (project: Project) => {
    // Mock data - in real app this would come from the project
    return "10/01/2025";
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Status</TableHead>
            <TableHead>Projeto</TableHead>
            <TableHead className="text-right">Orçamento Aprovado</TableHead>
            <TableHead className="text-right">Saldo Atual</TableHead>
            <TableHead className="text-center">Aprovação</TableHead>
            <TableHead className="text-center">Última Atualização</TableHead>
            <TableHead className="w-20 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow 
              key={project.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="text-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center">
                      {getFinancialStatusIcon(project)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getFinancialStatusTooltip(project)}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{project.name}</div>
                  <div className="text-sm text-muted-foreground">{project.id} • {project.area}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="font-medium">
                  {formatCurrency(project.budgetUnit, project.currency)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className={`font-medium ${
                  project.balance < 0 ? "text-red-600" : "text-green-600"
                }`}>
                  {formatCurrency(project.balance, project.currency)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm text-muted-foreground">
                  {getApprovalDate(project)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="text-sm text-muted-foreground">
                  {getLastUpdate(project)}
                </div>
              </TableCell>
              <TableCell className="text-center">
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
                  <TooltipContent>
                    <p>Visualizar detalhes do projeto</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}