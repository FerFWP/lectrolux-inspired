import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Award, 
  Trophy, 
  Star, 
  Medal, 
  Target, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Eye, 
  EyeOff,
  Settings,
  Bell,
  BellOff,
  Clock,
  FileText,
  MessageCircle,
  Activity
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const userBadges = [
  {
    id: 1,
    name: "Previsão Atualizada em Dia",
    icon: Calendar,
    description: "Mantenha suas previsões sempre em dia",
    earned: true,
    earnedDate: "2025-01-10",
    category: "Pontualidade"
  },
  {
    id: 2,
    name: "Zero Projetos Atrasados",
    icon: CheckCircle2,
    description: "Todos os projetos dentro do prazo",
    earned: true,
    earnedDate: "2025-01-05",
    category: "Gestão"
  },
  {
    id: 3,
    name: "Power User de Relatórios",
    icon: FileText,
    description: "Utilizou relatórios avançados 20+ vezes",
    earned: true,
    earnedDate: "2024-12-20",
    category: "Produtividade"
  },
  {
    id: 4,
    name: "Primeiro Lançamento",
    icon: Star,
    description: "Primeiro registro no sistema",
    earned: true,
    earnedDate: "2024-11-15",
    category: "Primeiros Passos"
  },
  {
    id: 5,
    name: "Revisor Dedicado",
    icon: Activity,
    description: "Revisou 50+ transações com precisão",
    earned: true,
    earnedDate: "2024-12-28",
    category: "Qualidade"
  },
  {
    id: 6,
    name: "Feedback Colaborador",
    icon: MessageCircle,
    description: "Contribuiu com 10+ melhorias",
    earned: false,
    earnedDate: null,
    category: "Colaboração"
  },
  {
    id: 7,
    name: "Mestre da Análise",
    icon: TrendingUp,
    description: "Criou 15+ relatórios personalizados",
    earned: false,
    earnedDate: null,
    category: "Análise"
  },
  {
    id: 8,
    name: "Mentor de Equipe",
    icon: Users,
    description: "Ajudou 5+ colegas com dúvidas",
    earned: false,
    earnedDate: null,
    category: "Liderança"
  }
];

const rankingData = {
  user: {
    name: "Você",
    engagement: 78,
    regularity: 85,
    adherence: 92
  },
  groupAverage: {
    engagement: 72,
    regularity: 68,
    adherence: 75
  }
};

const recentNotifications = [
  {
    id: 1,
    type: "badge",
    title: "Parabéns! Você conquistou o badge 'Revisor Dedicado'",
    description: "Continue mantendo a qualidade nas suas revisões",
    icon: Award,
    date: "2025-01-12",
    read: false
  },
  {
    id: 2,
    type: "achievement",
    title: "Meta de pontualidade alcançada!",
    description: "Você manteve todas as previsões em dia este mês",
    icon: Target,
    date: "2025-01-10",
    read: true
  }
];

export default function Gamificacao() {
  const [badgeVisibility, setBadgeVisibility] = useState<{[key: number]: boolean}>({});
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);

  const earnedBadges = userBadges.filter(badge => badge.earned);
  const availableBadges = userBadges.filter(badge => !badge.earned);

  const toggleBadgeVisibility = (badgeId: number) => {
    setBadgeVisibility(prev => ({
      ...prev,
      [badgeId]: !prev[badgeId]
    }));
  };

  const BadgeCard = ({ badge, showControls = false }: { badge: typeof userBadges[0], showControls?: boolean }) => (
    <Card className={`relative transition-all duration-200 ${badge.earned ? 'bg-card' : 'bg-muted/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${badge.earned ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <badge.icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-sm">{badge.name}</CardTitle>
              <Badge variant="secondary" className="text-xs mt-1">
                {badge.category}
              </Badge>
            </div>
          </div>
          {showControls && badge.earned && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBadgeVisibility(badge.id)}
                    className="h-8 w-8 p-0"
                  >
                    {badgeVisibility[badge.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{badgeVisibility[badge.id] ? 'Esconder do perfil' : 'Mostrar no perfil'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
        {badge.earned && badge.earnedDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Conquistado em {new Date(badge.earnedDate).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
        {!badge.earned && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="w-3 h-3" />
            <span>Em progresso</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ProgressChart = ({ label, value, average, color }: { label: string, value: number, average: number, color: string }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="space-y-1">
        <Progress value={value} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Média do grupo: {average}%</span>
          <span className={value > average ? 'text-green-600' : 'text-orange-600'}>
            {value > average ? '+' : ''}{value - average}%
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-primary" />
            Gamificação
          </h1>
          <p className="text-muted-foreground mt-1">
            Conquiste badges, acompanhe seu progresso e celebre suas conquistas
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <label htmlFor="notifications" className="text-sm font-medium">
              Notificações
            </label>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Notificações Recentes */}
      {showNotifications && notificationsEnabled && recentNotifications.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                Conquistas Recentes
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
                className="h-8 w-8 p-0"
              >
                <BellOff className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <notification.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges">Minhas Conquistas</TabsTrigger>
          <TabsTrigger value="progress">Meu Progresso</TabsTrigger>
          <TabsTrigger value="available">Badges Disponíveis</TabsTrigger>
        </TabsList>

        {/* Badges Conquistados */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} showControls={true} />
            ))}
          </div>
          
          {earnedBadges.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum badge conquistado ainda</h3>
                <p className="text-muted-foreground">
                  Continue usando o sistema para conquistar seus primeiros badges!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Progresso Pessoal */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Seu Desempenho
                </CardTitle>
                <CardDescription>
                  Compare seu progresso com a média do grupo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProgressChart
                  label="Engajamento"
                  value={rankingData.user.engagement}
                  average={rankingData.groupAverage.engagement}
                  color="blue"
                />
                <ProgressChart
                  label="Regularidade"
                  value={rankingData.user.regularity}
                  average={rankingData.groupAverage.regularity}
                  color="green"
                />
                <ProgressChart
                  label="Aderência a Prazos"
                  value={rankingData.user.adherence}
                  average={rankingData.groupAverage.adherence}
                  color="purple"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-5 h-5" />
                  Estatísticas Pessoais
                </CardTitle>
                <CardDescription>
                  Seus números no último trimestre
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{earnedBadges.length}</div>
                    <div className="text-sm text-muted-foreground">Badges Conquistados</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">89%</div>
                    <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-muted-foreground">Ações Completadas</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">15</div>
                    <div className="text-sm text-muted-foreground">Dias Consecutivos</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Badges Disponíveis */}
        <TabsContent value="available" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Próximas Conquistas
              </CardTitle>
              <CardDescription>
                Badges que você pode conquistar continuando suas atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}