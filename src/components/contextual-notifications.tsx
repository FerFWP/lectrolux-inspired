import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Eye,
  Edit3,
  Calendar,
  DollarSign
} from "lucide-react";

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'update_reminder';
  title: string;
  message: string;
  timestamp: Date;
  actionLabel?: string;
  onAction?: () => void;
  projectId?: string;
  field?: string;
  priority: 'low' | 'medium' | 'high';
  dismissable?: boolean;
}

interface ContextualNotificationsProps {
  position?: 'top-right' | 'bottom-right' | 'inline';
  maxVisible?: number;
  autoHide?: boolean;
  hideDelay?: number;
}

export function ContextualNotifications({ 
  position = 'top-right',
  maxVisible = 3,
  autoHide = false,
  hideDelay = 5000
}: ContextualNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load notifications - in real app, this would come from API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: 'update_reminder',
        title: "Previsões a atualizar",
        message: "3 projetos com progresso não atualizado há mais de 15 dias",
        timestamp: new Date(),
        actionLabel: "Atualizar agora",
        onAction: () => toast({
          title: "Redirecionando...",
          description: "Abrindo central de atualizações",
        }),
        priority: 'high',
        dismissable: true
      },
      {
        id: "2",
        type: 'warning',
        title: "Deseja revisar?",
        message: "Projeto Sistema CRM está 20% acima do orçamento planejado",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionLabel: "Revisar projeto",
        onAction: () => toast({
          title: "Abrindo projeto...",
          description: "Redirecionando para detalhes do projeto",
        }),
        priority: 'medium',
        dismissable: true
      },
      {
        id: "3",
        type: 'success',
        title: "Parabéns!",
        message: "Você atualizou 5 projetos hoje. Excelente trabalho!",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'low',
        dismissable: true
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setNotifications(prev => prev.slice(1));
      }, hideDelay);
      return () => clearTimeout(timer);
    }
  }, [notifications, autoHide, hideDelay]);

  const handleDismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'update_reminder': return <Clock className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'info': return 'border-l-blue-500';
      case 'warning': return 'border-l-orange-500';
      case 'success': return 'border-l-green-500';
      case 'update_reminder': return 'border-l-purple-500';
      default: return 'border-l-gray-500';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge className="bg-red-100 text-red-800">Alta</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Baixa</Badge>;
      default: return null;
    }
  };

  const visibleNotifications = notifications
    .filter(n => !dismissed.includes(n.id))
    .slice(0, maxVisible)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

  if (visibleNotifications.length === 0) return null;

  const containerClasses = {
    'top-right': 'fixed top-4 right-4 z-50 space-y-2 max-w-sm',
    'bottom-right': 'fixed bottom-4 right-4 z-50 space-y-2 max-w-sm',
    'inline': 'space-y-2 w-full'
  };

  return (
    <div className={containerClasses[position]}>
      {visibleNotifications.map(notification => (
        <Card 
          key={notification.id} 
          className={`border-l-4 ${getNotificationBorder(notification.type)} bg-card shadow-lg animate-slide-in-right`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(notification.priority)}
                    {notification.dismissable && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDismiss(notification.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {notification.timestamp.toLocaleString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {notification.actionLabel && notification.onAction && (
                    <Button
                      size="sm"
                      onClick={notification.onAction}
                      className="h-7 px-3 text-xs"
                    >
                      {notification.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {notifications.length > maxVisible && (
        <Card className="border-dashed bg-muted/50">
          <CardContent className="p-3 text-center">
            <p className="text-sm text-muted-foreground">
              +{notifications.length - maxVisible} mais notificações
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={() => setNotifications([])}
            >
              Ver todas
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Quick notification trigger component
export function QuickUpdateNotification({ 
  projectName, 
  fieldLabel, 
  onUpdateClick 
}: { 
  projectName: string; 
  fieldLabel: string; 
  onUpdateClick: () => void; 
}) {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <Clock className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>{projectName}</strong> • {fieldLabel} precisa ser atualizado
        </span>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onUpdateClick}
          className="ml-2"
        >
          <Edit3 className="h-3 w-3 mr-1" />
          Editar agora
        </Button>
      </AlertDescription>
    </Alert>
  );
}