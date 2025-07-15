import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, User, Clock, Activity, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface LogsDialogProps {
  projectId: string;
  projectName: string;
}

export function LogsDialog({ projectId, projectName }: LogsDialogProps) {
  const [open, setOpen] = useState(false);

  // Mock logs data - in a real app, this would come from the backend
  const mockLogs = [
    {
      id: "log-1",
      timestamp: new Date("2025-01-15T10:30:00"),
      action: "Baseline criada",
      user: "Maria Silva",
      details: "Nova baseline v1.2 salva com orçamento de R$ 2.500.000",
      type: "baseline",
      status: "success"
    },
    {
      id: "log-2",
      timestamp: new Date("2025-01-14T14:15:00"),
      action: "Projeto editado",
      user: "João Santos",
      details: "Status alterado de 'Em Andamento' para 'Crítico'",
      type: "edit",
      status: "warning"
    },
    {
      id: "log-3",
      timestamp: new Date("2025-01-13T09:45:00"),
      action: "Lançamento adicionado",
      user: "Ana Costa",
      details: "Transação 'Aquisição Equipamentos' - R$ 850.000",
      type: "transaction",
      status: "success"
    },
    {
      id: "log-4",
      timestamp: new Date("2025-01-12T16:20:00"),
      action: "Importação SAP",
      user: "Sistema",
      details: "15 transações importadas automaticamente",
      type: "import",
      status: "success"
    },
    {
      id: "log-5",
      timestamp: new Date("2025-01-11T11:30:00"),
      action: "Progresso atualizado",
      user: "Pedro Oliveira",
      details: "Progresso alterado de 65% para 72%",
      type: "progress",
      status: "info"
    },
    {
      id: "log-6",
      timestamp: new Date("2025-01-10T08:15:00"),
      action: "Orçamento excedido",
      user: "Sistema",
      details: "Alerta: Realizado ultrapassou 90% do orçamento",
      type: "alert",
      status: "error"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Histórico de Alterações - {projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Projeto: {projectId}
            </p>
            <Badge variant="outline">{mockLogs.length} registros</Badge>
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Detalhes</TableHead>
                  <TableHead className="w-[150px]">Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusColor(log.status)}>
                          {log.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {log.details}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {format(log.timestamp, "dd/MM/yyyy HH:mm")}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}