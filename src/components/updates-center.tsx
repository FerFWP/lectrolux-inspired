import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  DollarSign, 
  Target,
  Zap,
  TrendingUp,
  User,
  RefreshCw
} from "lucide-react";
import { InlineEdit } from "./inline-edit";

interface PendingUpdate {
  id: string;
  projectName: string;
  projectCode: string;
  field: string;
  fieldLabel: string;
  currentValue: string | number;
  lastUpdated: Date;
  priority: 'high' | 'medium' | 'low';
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  validation?: (value: string) => string | null;
  suggestions?: string[];
}

interface UpdatesCenterProps {
  projectId?: string;
  onClose?: () => void;
}

export function UpdatesCenter({ projectId, onClose }: UpdatesCenterProps) {
  const [pendingUpdates, setPendingUpdates] = useState<PendingUpdate[]>([]);
  const [completedToday, setCompletedToday] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingUpdates();
  }, [projectId]);

  const loadPendingUpdates = () => {
    // Mock data - in real app, load from API
    const mockUpdates: PendingUpdate[] = [
      {
        id: "1",
        projectName: "Sistema CRM",
        projectCode: "CRM-001",
        field: "progress",
        fieldLabel: "Progresso",
        currentValue: 45,
        lastUpdated: new Date(2025, 0, 1),
        priority: 'high',
        type: 'number',
        validation: (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0 || num > 100) {
            return "O progresso deve ser um número entre 0 e 100";
          }
          return null;
        }
      },
      {
        id: "2",
        projectName: "Portal do Cliente",
        projectCode: "PTC-002",
        field: "budget",
        fieldLabel: "Orçamento",
        currentValue: 500000,
        lastUpdated: new Date(2024, 11, 15),
        priority: 'high',
        type: 'number',
        validation: (value: string) => {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0) {
            return "O orçamento deve ser um número positivo";
          }
          return null;
        }
      },
      {
        id: "3",
        projectName: "App Mobile",
        projectCode: "APP-003",
        field: "status",
        fieldLabel: "Status",
        currentValue: "Em Andamento",
        lastUpdated: new Date(2024, 11, 20),
        priority: 'medium',
        type: 'select',
        options: [
          { value: "Planejado", label: "Planejado" },
          { value: "Em Andamento", label: "Em Andamento" },
          { value: "Crítico", label: "Crítico" },
          { value: "Concluído", label: "Concluído" }
        ]
      },
      {
        id: "4",
        projectName: "Dashboard Analytics",
        projectCode: "DAS-004",
        field: "description",
        fieldLabel: "Descrição",
        currentValue: "Dashboard para análise de dados",
        lastUpdated: new Date(2024, 10, 30),
        priority: 'low',
        type: 'textarea',
        suggestions: [
          "Dashboard para análise de dados de vendas",
          "Dashboard para análise de dados de marketing",
          "Dashboard para análise de dados operacionais"
        ]
      }
    ];

    setPendingUpdates(mockUpdates);
    setCompletedToday(12); // Mock completed updates today
  };

  const handleUpdateSave = async (updateId: string, value: string | number) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
      setCompletedToday(prev => prev + 1);
      
      toast({
        title: "✅ Campo atualizado!",
        description: "Obrigado por manter os dados atualizados!",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedUpdates.length === 0) return;
    
    setIsUpdating(true);
    try {
      // Simulate bulk update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPendingUpdates(prev => prev.filter(u => !selectedUpdates.includes(u.id)));
      setCompletedToday(prev => prev + selectedUpdates.length);
      setSelectedUpdates([]);
      
      toast({
        title: "✅ Atualização em lote concluída!",
        description: `${selectedUpdates.length} campos atualizados com sucesso!`,
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      toast({
        title: "Erro na atualização em lote",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDaysAgo = (date: Date) => {
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completionPercentage = Math.round((completedToday / (completedToday + pendingUpdates.length)) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{pendingUpdates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluídas Hoje</p>
                <p className="text-2xl font-bold">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progresso</p>
                <p className="text-2xl font-bold">{completionPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Progresso das Atualizações</h3>
            <span className="text-sm text-muted-foreground">
              {completedToday} de {completedToday + pendingUpdates.length} campos
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-sm text-green-600 mt-2">
            🎉 Portfólio {completionPercentage}% atualizado este mês!
          </p>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUpdates.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedUpdates.length} campo(s) selecionado(s)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUpdates([])}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleBulkUpdate}
                  disabled={isUpdating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Atualizar Selecionados
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Updates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Campos Pendentes para Atualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingUpdates.map((update, index) => (
              <div key={update.id}>
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedUpdates.includes(update.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUpdates(prev => [...prev, update.id]);
                      } else {
                        setSelectedUpdates(prev => prev.filter(id => id !== update.id));
                      }
                    }}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{update.projectName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {update.projectCode} • {update.fieldLabel}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(update.priority)}>
                          {update.priority === 'high' && 'Alta'}
                          {update.priority === 'medium' && 'Média'}
                          {update.priority === 'low' && 'Baixa'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getDaysAgo(update.lastUpdated)} dias atrás
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-card p-3 rounded border">
                      <p className="text-sm text-muted-foreground mb-2">
                        {update.fieldLabel}:
                      </p>
                      <InlineEdit
                        value={update.currentValue}
                        type={update.type}
                        options={update.options}
                        validation={update.validation}
                        onSave={(value) => handleUpdateSave(update.id, value)}
                        fieldName={update.fieldLabel}
                        autoSuggestions={update.suggestions}
                        placeholder={`Atualizar ${update.fieldLabel.toLowerCase()}`}
                      />
                    </div>
                  </div>
                </div>
                
                {index < pendingUpdates.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Footer */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">
              Continue assim! Cada atualização melhora a qualidade dos nossos dados.
            </p>
            <p className="text-sm text-green-600 mt-1">
              Você já atualizou {completedToday} campos hoje. Excelente trabalho! 🚀
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}