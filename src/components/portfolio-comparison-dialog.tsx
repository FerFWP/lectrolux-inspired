import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, TrendingDown } from "lucide-react";

// Mock data for portfolio comparison
const portfolioData = {
  totalProjects: 24,
  avgBudgetUtilization: 98.2,
  avgProgress: 76.5,
  bestPerforming: {
    name: "Sistema CRM",
    budgetUtilization: 91.8,
    progress: 95
  },
  worstPerforming: {
    name: "Upgrade Infraestrutura",
    budgetUtilization: 115.3,
    progress: 62
  },
  categoryStats: [
    { category: "TI", projects: 8, avgBudgetUtilization: 102.1, avgProgress: 74.2 },
    { category: "Marketing", projects: 6, avgBudgetUtilization: 94.5, avgProgress: 81.3 },
    { category: "Operações", projects: 5, avgBudgetUtilization: 96.8, avgProgress: 78.9 },
    { category: "Financeiro", projects: 3, avgBudgetUtilization: 88.2, avgProgress: 83.1 },
    { category: "RH", projects: 2, avgBudgetUtilization: 91.5, avgProgress: 76.0 }
  ]
};

interface PortfolioComparisonDialogProps {
  currentProject: {
    name: string;
    area: string;
    budgetUtilization: number;
    progress: number;
  };
}

export function PortfolioComparisonDialog({ currentProject }: PortfolioComparisonDialogProps) {
  const [open, setOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return `R$ ${amount.toLocaleString("pt-BR")}`;
  };

  const getComparisonIcon = (current: number, avg: number) => {
    if (current > avg) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    }
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  };

  const getComparisonColor = (current: number, avg: number) => {
    if (current > avg && current > 100) return "text-red-600";
    if (current < avg) return "text-green-600";
    return "text-blue-600";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Comparar com Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Comparação com Portfolio</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo do Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral do Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{portfolioData.totalProjects}</div>
                  <div className="text-sm text-muted-foreground">Total de Projetos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{portfolioData.avgBudgetUtilization}%</div>
                  <div className="text-sm text-muted-foreground">Média Utilização Orçamento</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{portfolioData.avgProgress}%</div>
                  <div className="text-sm text-muted-foreground">Média Progresso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparação do Projeto Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Posição do Projeto Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">{currentProject.name}</div>
                      <div className="text-sm text-muted-foreground">Utilização: {currentProject.budgetUtilization}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getComparisonIcon(currentProject.budgetUtilization, portfolioData.avgBudgetUtilization)}
                      <span className={`font-bold ${getComparisonColor(currentProject.budgetUtilization, portfolioData.avgBudgetUtilization)}`}>
                        {currentProject.budgetUtilization > portfolioData.avgBudgetUtilization ? 'Acima' : 'Abaixo'} da média
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="font-medium">Progresso</div>
                      <div className="text-sm text-muted-foreground">{currentProject.progress}%</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getComparisonIcon(currentProject.progress, portfolioData.avgProgress)}
                      <span className={`font-bold ${currentProject.progress > portfolioData.avgProgress ? 'text-green-600' : 'text-red-600'}`}>
                        {currentProject.progress > portfolioData.avgProgress ? 'Acima' : 'Abaixo'} da média
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="font-medium text-green-800">Melhor Projeto</div>
                    <div className="text-sm text-green-600">{portfolioData.bestPerforming.name}</div>
                    <div className="text-xs text-green-600">
                      {portfolioData.bestPerforming.budgetUtilization}% orçamento | {portfolioData.bestPerforming.progress}% progresso
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <div className="font-medium text-red-800">Maior Desafio</div>
                    <div className="text-sm text-red-600">{portfolioData.worstPerforming.name}</div>
                    <div className="text-xs text-red-600">
                      {portfolioData.worstPerforming.budgetUtilization}% orçamento | {portfolioData.worstPerforming.progress}% progresso
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparação por Área */}
          <Card>
            <CardHeader>
              <CardTitle>Benchmark por Área</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioData.categoryStats.map((category) => (
                  <div 
                    key={category.category} 
                    className={`p-3 rounded-lg border ${
                      category.category === currentProject.area 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{category.category}</div>
                        {category.category === currentProject.area && (
                          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded">Sua Área</span>
                        )}
                        <span className="text-sm text-muted-foreground">({category.projects} projetos)</span>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-muted-foreground">Orçamento: </span>
                          <span className={category.avgBudgetUtilization > 100 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                            {category.avgBudgetUtilization}%
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Progresso: </span>
                          <span className="font-medium">{category.avgProgress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}