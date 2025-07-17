import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, DollarSign, Target, Filter } from "lucide-react";

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
  currency: "BRL" | "USD" | "SEK";
  isCritical: boolean;
  progress: number;
  deadline: string;
}

interface SmartFiltersProps {
  projects: Project[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  favoritesCount?: number;
}

export function SmartFilters({ projects, activeFilter, onFilterChange, favoritesCount = 0 }: SmartFiltersProps) {
  const smartFilters = [
    {
      id: "all",
      label: "Todos os Projetos",
      icon: Target,
      count: projects.length,
      description: "Visualizar todos os projetos",
      color: "default"
    },
    {
      id: "favorites",
      label: "Favoritos",
      icon: Users,
      count: 0, // This will be updated from the parent component
      description: "Projetos favoritados por você",
      color: "blue"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filtros Inteligentes</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {smartFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              className={`h-auto p-3 flex-col items-start gap-2 ${
                isActive ? "" : "hover:bg-muted"
              }`}
              onClick={() => onFilterChange(filter.id)}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`h-4 w-4 ${
                  filter.color === "destructive" ? "text-red-500" :
                  filter.color === "orange" ? "text-orange-500" :
                  filter.color === "blue" ? "text-blue-500" :
                  "text-muted-foreground"
                }`} />
                <Badge 
                  variant={isActive ? "secondary" : "outline"} 
                  className="text-xs"
                >
                  {filter.id === "favorites" ? favoritesCount : filter.count}
                </Badge>
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{filter.label}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {filter.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}