import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Clock, 
  Edit3, 
  TrendingUp, 
  CheckCircle,
  Zap
} from "lucide-react";
import { UpdatesCenter } from "./updates-center";

interface PendingUpdatesCardProps {
  className?: string;
}

export function PendingUpdatesCard({ className }: PendingUpdatesCardProps) {
  const [showUpdatesCenter, setShowUpdatesCenter] = useState(false);
  
  // Mock data - in real app, load from API
  const pendingCount = 4;
  const completedToday = 12;
  const totalUpdates = pendingCount + completedToday;
  const completionPercentage = Math.round((completedToday / totalUpdates) * 100);
  
  const urgentUpdates = [
    { project: "Sistema CRM", field: "Progresso", daysAgo: 15 },
    { project: "Portal Cliente", field: "Orçamento", daysAgo: 20 },
    { project: "App Mobile", field: "Status", daysAgo: 8 }
  ];

  return (
    <Card className={`border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Atualizações Pendentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedToday}</div>
            <div className="text-sm text-muted-foreground">Hoje</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso do mês</span>
            <span className="font-medium text-green-600">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Urgent Updates Preview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-orange-800 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Mais Urgentes
          </h4>
          <div className="space-y-2">
            {urgentUpdates.map((update, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-white/50 p-2 rounded border">
                <div>
                  <span className="font-medium">{update.project}</span>
                  <span className="text-muted-foreground"> • {update.field}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {update.daysAgo}d
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Dialog open={showUpdatesCenter} onOpenChange={setShowUpdatesCenter}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white">
                <Edit3 className="h-4 w-4 mr-2" />
                Atualizar Agora
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  Central de Atualizações
                </DialogTitle>
              </DialogHeader>
              <UpdatesCenter onClose={() => setShowUpdatesCenter(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Motivational Message */}
        <div className="text-center pt-2 border-t border-orange-200">
          <p className="text-sm text-orange-700">
            🎯 {pendingCount} campos aguardando sua atenção
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Mantenha o portfólio 100% atualizado!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}