import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  User,
  Calendar,
  MessageSquare,
  Bell
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ApprovalRequest {
  id: string;
  type: 'budget' | 'exchange' | 'deviation';
  title: string;
  description: string;
  amount: number;
  currency: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  approvers: {
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
    approvedAt?: Date;
  }[];
  justification: string;
  attachments?: string[];
  relatedProject: {
    id: string;
    name: string;
  };
}

interface ApprovalWorkflowProps {
  projectId: string;
  onApprovalChange?: (approval: ApprovalRequest) => void;
}

export function ApprovalWorkflow({ projectId, onApprovalChange }: ApprovalWorkflowProps) {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadApprovals();
  }, [projectId]);

  const loadApprovals = () => {
    // Mock data - in real app, load from API
    const mockApprovals: ApprovalRequest[] = [
      {
        id: "1",
        type: "budget",
        title: "Aumento de Orçamento - Sistema ERP",
        description: "Solicitação de aumento de orçamento devido a requisitos adicionais",
        amount: 150000,
        currency: "BRL",
        requestedBy: "João Silva",
        requestedAt: new Date(2025, 0, 10),
        status: "pending",
        priority: "high",
        approvers: [
          {
            name: "Maria Santos",
            role: "Gerente de Projetos",
            status: "approved",
            comment: "Aprovado conforme justificativa apresentada",
            approvedAt: new Date(2025, 0, 11)
          },
          {
            name: "Carlos Oliveira",
            role: "Diretor Financeiro",
            status: "pending"
          }
        ],
        justification: "Necessário incluir módulo de BI não previsto inicialmente",
        relatedProject: {
          id: "PRJ-001",
          name: "Sistema ERP Integrado"
        }
      },
      {
        id: "2",
        type: "exchange",
        title: "Aprovação de Taxa de Câmbio",
        description: "Aprovação de taxa de câmbio USD/BRL para compra de software",
        amount: 25000,
        currency: "USD",
        requestedBy: "Ana Costa",
        requestedAt: new Date(2025, 0, 12),
        status: "pending",
        priority: "medium",
        approvers: [
          {
            name: "Pedro Mendes",
            role: "Gerente Financeiro",
            status: "pending"
          }
        ],
        justification: "Taxa atual mais favorável que a prevista no orçamento",
        relatedProject: {
          id: "PRJ-003",
          name: "Expansão Internacional"
        }
      },
      {
        id: "3",
        type: "deviation",
        title: "Desvio de BU - Automação",
        description: "Desvio significativo identificado no projeto de automação",
        amount: 50000,
        currency: "BRL",
        requestedBy: "Sistema Automático",
        requestedAt: new Date(2025, 0, 13),
        status: "pending",
        priority: "high",
        approvers: [
          {
            name: "Lucas Ferreira",
            role: "Gerente de Operações",
            status: "pending"
          }
        ],
        justification: "Desvio detectado automaticamente - necessária análise urgente",
        relatedProject: {
          id: "PRJ-005",
          name: "Automação Linha Produção"
        }
      }
    ];

    setApprovals(mockApprovals);
  };

  const handleApprove = async (approvalId: string) => {
    setLoading(true);
    try {
      // Update approval status
      const updatedApprovals = approvals.map(approval => {
        if (approval.id === approvalId) {
          const updatedApprovers = approval.approvers.map(approver => {
            if (approver.status === 'pending') {
              return {
                ...approver,
                status: 'approved' as const,
                comment: comment || 'Aprovado',
                approvedAt: new Date()
              };
            }
            return approver;
          });

          const allApproved = updatedApprovers.every(a => a.status === 'approved');
          
          return {
            ...approval,
            approvers: updatedApprovers,
            status: allApproved ? 'approved' as const : approval.status
          };
        }
        return approval;
      });

      setApprovals(updatedApprovals);
      setComment("");
      setSelectedApproval(null);

      toast({
        title: "Aprovação concluída",
        description: "Solicitação aprovada com sucesso",
      });

      // Send notification
      await sendNotification(approvalId, 'approved');
    } catch (error) {
      toast({
        title: "Erro na aprovação",
        description: "Não foi possível processar a aprovação",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!comment.trim()) {
      toast({
        title: "Comentário obrigatório",
        description: "Por favor, forneça um motivo para a rejeição",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const updatedApprovals = approvals.map(approval => {
        if (approval.id === approvalId) {
          const updatedApprovers = approval.approvers.map(approver => {
            if (approver.status === 'pending') {
              return {
                ...approver,
                status: 'rejected' as const,
                comment: comment,
                approvedAt: new Date()
              };
            }
            return approver;
          });

          return {
            ...approval,
            approvers: updatedApprovers,
            status: 'rejected' as const
          };
        }
        return approval;
      });

      setApprovals(updatedApprovals);
      setComment("");
      setSelectedApproval(null);

      toast({
        title: "Solicitação rejeitada",
        description: "Rejeição processada com sucesso",
      });

      await sendNotification(approvalId, 'rejected');
    } catch (error) {
      toast({
        title: "Erro na rejeição",
        description: "Não foi possível processar a rejeição",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (approvalId: string, action: 'approved' | 'rejected') => {
    // Mock notification sending
    console.log(`Sending notification for approval ${approvalId} - ${action}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget': return <DollarSign className="h-4 w-4" />;
      case 'exchange': return <TrendingUp className="h-4 w-4" />;
      case 'deviation': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€" };
    return `${symbols[currency as keyof typeof symbols] || currency} ${amount.toLocaleString('pt-BR')}`;
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const completedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Workflow de Aprovações</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-2">
            <Bell className="h-3 w-3" />
            {pendingApprovals.length} Pendentes
          </Badge>
        </div>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Aprovações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingApprovals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma aprovação pendente
            </p>
          ) : (
            <div className="space-y-4">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(approval.type)}
                      <div>
                        <h4 className="font-medium">{approval.title}</h4>
                        <p className="text-sm text-muted-foreground">{approval.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(approval.priority)}>
                        {approval.priority === 'high' ? 'Alta' : approval.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                      <Badge variant="outline">
                        {formatCurrency(approval.amount, approval.currency)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p><strong>Projeto:</strong> {approval.relatedProject.name}</p>
                    <p><strong>Solicitado por:</strong> {approval.requestedBy}</p>
                    <p><strong>Data:</strong> {format(approval.requestedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                  </div>

                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm"><strong>Justificativa:</strong></p>
                    <p className="text-sm">{approval.justification}</p>
                  </div>

                  {/* Approvers */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Aprovadores:</p>
                    {approval.approvers.map((approver, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted rounded">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{approver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{approver.name}</p>
                          <p className="text-xs text-muted-foreground">{approver.role}</p>
                        </div>
                        <Badge className={getStatusColor(approver.status)}>
                          {approver.status === 'approved' ? 'Aprovado' : 
                           approver.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons for pending approvals */}
                  {approval.approvers.some(a => a.status === 'pending') && (
                    <div className="space-y-3">
                      <Separator />
                      <div>
                        <Label>Comentário</Label>
                        <Textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Adicione um comentário (obrigatório para rejeição)"
                          className="mt-2"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleApprove(approval.id)}
                          disabled={loading}
                          className="gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button 
                          variant="destructive"
                          onClick={() => handleReject(approval.id)}
                          disabled={loading}
                          className="gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Rejeitar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Approvals */}
      {completedApprovals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Aprovações Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedApprovals.slice(0, 5).map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(approval.type)}
                    <div>
                      <p className="font-medium">{approval.title}</p>
                      <p className="text-sm text-muted-foreground">{approval.relatedProject.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </Badge>
                    <Badge variant="outline">
                      {formatCurrency(approval.amount, approval.currency)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}