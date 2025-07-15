import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  History, 
  User, 
  Calendar, 
  Edit3, 
  ArrowRight,
  Clock,
  CheckCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EditHistoryEntry {
  id: string;
  field: string;
  fieldLabel: string;
  oldValue: any;
  newValue: any;
  userId: string;
  userName: string;
  userAvatar?: string;
  timestamp: Date;
  type: 'create' | 'update' | 'delete';
}

interface EditHistoryProps {
  entries: EditHistoryEntry[];
  title?: string;
  trigger?: React.ReactNode;
}

export function EditHistory({ entries, title = "Histórico de Edições", trigger }: EditHistoryProps) {
  const [open, setOpen] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'update': return <Edit3 className="h-4 w-4 text-blue-600" />;
      case 'delete': return <ArrowRight className="h-4 w-4 text-red-600" />;
      default: return <Edit3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'create': return 'Criado';
      case 'update': return 'Atualizado';
      case 'delete': return 'Removido';
      default: return 'Modificado';
    }
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'Vazio';
    if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
    if (typeof value === 'number') return value.toLocaleString('pt-BR');
    return String(value);
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const date = entry.timestamp.toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, EditHistoryEntry[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-gray-600" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([date, dayEntries]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(date).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              
              <div className="space-y-3">
                {dayEntries.map(entry => (
                  <Card key={entry.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={entry.userAvatar} />
                          <AvatarFallback>
                            {entry.userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(entry.type)}
                            <span className="font-medium">{entry.userName}</span>
                            <Badge variant="outline" className="text-xs">
                              {getTypeLabel(entry.type)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(entry.timestamp, { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </span>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {entry.fieldLabel}
                            </p>
                            
                            {entry.type === 'create' ? (
                              <div className="text-sm">
                                <span className="text-green-600">Criado com valor: </span>
                                <span className="font-medium">{formatValue(entry.newValue)}</span>
                              </div>
                            ) : entry.type === 'update' ? (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="bg-red-50 text-red-600 px-2 py-1 rounded">
                                  {formatValue(entry.oldValue)}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                <span className="bg-green-50 text-green-600 px-2 py-1 rounded">
                                  {formatValue(entry.newValue)}
                                </span>
                              </div>
                            ) : (
                              <div className="text-sm">
                                <span className="text-red-600">Removido valor: </span>
                                <span className="font-medium line-through">{formatValue(entry.oldValue)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum histórico de edição encontrado.</p>
              <p className="text-sm mt-1">As edições aparecerão aqui conforme forem realizadas.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Example usage component
export function EditHistoryExample() {
  const mockHistory: EditHistoryEntry[] = [
    {
      id: "1",
      field: "progress",
      fieldLabel: "Progresso",
      oldValue: 40,
      newValue: 45,
      userId: "user1",
      userName: "João Silva",
      timestamp: new Date(2025, 0, 15, 14, 30),
      type: 'update'
    },
    {
      id: "2",
      field: "budget",
      fieldLabel: "Orçamento",
      oldValue: 450000,
      newValue: 500000,
      userId: "user2",
      userName: "Maria Santos",
      timestamp: new Date(2025, 0, 15, 9, 15),
      type: 'update'
    },
    {
      id: "3",
      field: "status",
      fieldLabel: "Status",
      oldValue: "Planejado",
      newValue: "Em Andamento",
      userId: "user1",
      userName: "João Silva",
      timestamp: new Date(2025, 0, 14, 16, 45),
      type: 'update'
    }
  ];

  return (
    <EditHistory
      entries={mockHistory}
      title="Histórico do Projeto"
    />
  );
}