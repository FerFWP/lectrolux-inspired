import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Star, 
  CheckCircle, 
  Zap,
  Calendar,
  Award,
  Heart,
  Sparkles
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface MotivationalFeedbackProps {
  updatesCompletedToday?: number;
  totalUpdatesThisWeek?: number;
  consecutiveDays?: number;
  completionRate?: number;
  className?: string;
}

export function MotivationalFeedback({
  updatesCompletedToday = 0,
  totalUpdatesThisWeek = 0,
  consecutiveDays = 0,
  completionRate = 0,
  className = ""
}: MotivationalFeedbackProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Initialize achievements
    const allAchievements: Achievement[] = [
      {
        id: "daily_hero",
        title: "Herói do Dia",
        description: "Atualizou 5+ campos hoje",
        icon: <Trophy className="h-5 w-5 text-yellow-600" />,
        earned: updatesCompletedToday >= 5,
        progress: updatesCompletedToday,
        maxProgress: 5
      },
      {
        id: "weekly_champion",
        title: "Campeão da Semana",
        description: "20+ atualizações esta semana",
        icon: <Award className="h-5 w-5 text-blue-600" />,
        earned: totalUpdatesThisWeek >= 20,
        progress: totalUpdatesThisWeek,
        maxProgress: 20
      },
      {
        id: "consistency_master",
        title: "Mestre da Consistência",
        description: "7 dias consecutivos atualizando",
        icon: <Target className="h-5 w-5 text-green-600" />,
        earned: consecutiveDays >= 7,
        progress: consecutiveDays,
        maxProgress: 7
      },
      {
        id: "perfectionist",
        title: "Perfeccionista",
        description: "100% de dados atualizados",
        icon: <Star className="h-5 w-5 text-purple-600" />,
        earned: completionRate >= 100,
        progress: completionRate,
        maxProgress: 100
      }
    ];

    setAchievements(allAchievements);
  }, [updatesCompletedToday, totalUpdatesThisWeek, consecutiveDays, completionRate]);

  useEffect(() => {
    // Update motivational message based on progress
    if (updatesCompletedToday === 0) {
      setCurrentMessage("Vamos começar o dia atualizando alguns dados! 🌟");
    } else if (updatesCompletedToday < 3) {
      setCurrentMessage(`Ótimo início! ${updatesCompletedToday} atualização${updatesCompletedToday > 1 ? 'ões' : ''} feita${updatesCompletedToday > 1 ? 's' : ''} hoje. Continue assim! 💪`);
    } else if (updatesCompletedToday < 5) {
      setCurrentMessage(`Excelente! ${updatesCompletedToday} campos atualizados hoje. Você está fazendo a diferença! 🚀`);
    } else {
      setCurrentMessage(`Incrível! ${updatesCompletedToday} atualizações hoje. Você é um herói dos dados! 🏆`);
      setShowCelebration(true);
    }
  }, [updatesCompletedToday]);

  const getProgressColor = (progress: number, max: number) => {
    const percentage = (progress / max) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const nextAchievements = achievements.filter(a => !a.earned);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main motivational message */}
      <Card className={`${showCelebration ? 'border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-green-200 bg-green-50'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${showCelebration ? 'bg-yellow-100' : 'bg-green-100'}`}>
              {showCelebration ? (
                <Sparkles className="h-6 w-6 text-yellow-600" />
              ) : (
                <Heart className="h-6 w-6 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${showCelebration ? 'text-yellow-800' : 'text-green-800'}`}>
                {currentMessage}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Cada atualização melhora a qualidade do nosso portfólio
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Seu Progresso
              </h3>
              <Badge className="bg-blue-100 text-blue-800">
                {completionRate}% completo
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{updatesCompletedToday}</div>
                <div className="text-muted-foreground">Hoje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalUpdatesThisWeek}</div>
                <div className="text-muted-foreground">Esta semana</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sequência atual</span>
                <span className="font-medium">{consecutiveDays} dias</span>
              </div>
              <Progress value={Math.min((consecutiveDays / 7) * 100, 100)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {earnedAchievements.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-600" />
              Conquistas Desbloqueadas
            </h3>
            <div className="space-y-2">
              {earnedAchievements.map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next achievements */}
      {nextAchievements.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-gray-600" />
              Próximas Conquistas
            </h3>
            <div className="space-y-3">
              {nextAchievements.slice(0, 2).map(achievement => (
                <div 
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-shrink-0 opacity-50">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                    {achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-1">
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="h-1"
                        />
                        <p className="text-xs text-muted-foreground">
                          {achievement.progress} / {achievement.maxProgress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick stats */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <Zap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">
              Impacto das suas atualizações
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Portfólio {completionRate}% atualizado • {totalUpdatesThisWeek} campos esta semana
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}