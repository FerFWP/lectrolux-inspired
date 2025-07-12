import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Clock, CheckCircle } from "lucide-react";

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

interface ExecutiveDashboardProps {
  projects: Project[];
}

export function ExecutiveDashboard({ projects }: ExecutiveDashboardProps) {
  const totalProjects = projects.length;
  const criticalProjects = projects.filter(p => p.isCritical || p.status === "Crítico").length;
  const delayedProjects = projects.filter(p => p.status === "Em Atraso").length;
  const completedProjects = projects.filter(p => p.status === "Concluído").length;
  
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalRealized = projects.reduce((sum, p) => sum + p.realized, 0);
  const budgetUtilization = totalBudget > 0 ? (totalRealized / totalBudget) * 100 : 0;

  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* KPI Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Projetos Críticos</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{criticalProjects}</div>
          <p className="text-xs text-muted-foreground">
            {((criticalProjects / totalProjects) * 100).toFixed(1)}% do total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Atraso</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{delayedProjects}</div>
          <p className="text-xs text-muted-foreground">
            Precisam atenção imediata
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{completedProjects}</div>
          <p className="text-xs text-muted-foreground">
            {((completedProjects / totalProjects) * 100).toFixed(1)}% finalizados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Utilização Orçamento</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{budgetUtilization.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            Do orçamento total
          </p>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribuição por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(statusDistribution).map(([status, count]) => (
              <Badge key={status} variant="outline" className="gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  status === "Crítico" ? "bg-red-500" :
                  status === "Em Atraso" ? "bg-orange-500" :
                  status === "Em Andamento" ? "bg-blue-500" :
                  status === "Concluído" ? "bg-green-500" :
                  "bg-gray-500"
                }`} />
                {status}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}