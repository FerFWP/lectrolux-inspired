
import { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronDown, ChevronLeft } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnhancedTooltip } from "@/components/ui/enhanced-tooltip";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { 
  LayoutDashboard, 
  FolderOpen, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Calculator, 
  ArrowLeftRight, 
  Shield, 
  PieChart, 
  Target, 
  FileText, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  Search as SearchIcon, 
  Lightbulb, 
  Settings, 
  Trophy
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  description: string;
  group: string;
  shortcut?: string;
}

const menuItems: MenuItem[] = [
  // VISÃO GERAL
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: LayoutDashboard, 
    description: "Visão geral dos projetos e KPIs principais da organização", 
    group: "visao-geral",
    shortcut: "Ctrl+D"
  },
  { 
    title: "Projetos", 
    url: "/projetos", 
    icon: FolderOpen, 
    description: "Gestão completa do portfólio de projetos estratégicos", 
    group: "visao-geral",
    shortcut: "Ctrl+P"
  },
  { 
    title: "Relatórios", 
    url: "/relatorios", 
    icon: BarChart3, 
    description: "Centro de relatórios financeiros e análises detalhadas", 
    group: "visao-geral",
    shortcut: "Ctrl+R"
  },

  // VMO LATAM
  { 
    title: "Dashboard Consolidado", 
    url: "/vmo-latam/dashboard-consolidado", 
    icon: TrendingUp, 
    description: "Visão estratégica consolidada para região LATAM", 
    group: "vmo-latam"
  },
  { 
    title: "Multi-moeda & Câmbio", 
    url: "/vmo-latam/multi-moeda-cambio", 
    icon: Globe, 
    description: "Análise e conversão de múltiplas moedas com taxas em tempo real", 
    group: "vmo-latam"
  },
  { 
    title: "Simulação de Cenários", 
    url: "/vmo-latam/simulacao-cenarios", 
    icon: Calculator, 
    description: "Simulações avançadas e projeções financeiras estratégicas", 
    group: "vmo-latam"
  },
  { 
    title: "Comparativo de Valor", 
    url: "/vmo-latam/comparativo-valor", 
    icon: ArrowLeftRight, 
    description: "Análise comparativa detalhada de investimentos e retorno", 
    group: "vmo-latam"
  },
  { 
    title: "Governança & Auditoria", 
    url: "/vmo-latam/governanca-auditoria", 
    icon: Shield, 
    description: "Controles de governança e trilhas de auditoria completas", 
    group: "vmo-latam"
  },
  { 
    title: "BU Analysis / Capex Monthly", 
    url: "/vmo-latam/capex-meeting", 
    icon: PieChart, 
    description: "Análise mensal detalhada de CAPEX por unidade de negócio", 
    group: "vmo-latam"
  },
  { 
    title: "Assertividade SOP", 
    url: "/vmo-latam/assertividade-sop", 
    icon: Target, 
    description: "Métricas de assertividade do processo S&OP", 
    group: "vmo-latam"
  },
  { 
    title: "Apresentação Executiva", 
    url: "/vmo-latam/apresentacao-executiva", 
    icon: FileText, 
    description: "Dashboards executivos para apresentações de diretoria", 
    group: "vmo-latam"
  },
  { 
    title: "Clusters Estratégicos", 
    url: "/vmo-latam/clusters-estrategicos", 
    icon: Users, 
    description: "Agrupamento inteligente de projetos por estratégias", 
    group: "vmo-latam"
  },

  // INTELIGÊNCIA
  { 
    title: "Assistente de Perguntas", 
    url: "/inteligencia/assistente", 
    icon: MessageCircle, 
    description: "IA conversacional para consultas sobre dados e insights", 
    group: "inteligencia"
  },
  { 
    title: "Explicações de Indicadores", 
    url: "/inteligencia/explicacoes", 
    icon: HelpCircle, 
    description: "Explicações detalhadas de KPIs e métricas de negócio", 
    group: "inteligencia"
  },
  { 
    title: "Pesquisa Avançada (RAG)", 
    url: "/inteligencia/pesquisa-avancada", 
    icon: SearchIcon, 
    description: "Busca inteligente com tecnologia RAG e processamento de linguagem natural", 
    group: "inteligencia"
  },
  { 
    title: "Sugestão de Ações", 
    url: "/inteligencia/sugestoes", 
    icon: Lightbulb, 
    description: "Recomendações baseadas em IA para otimização de processos", 
    group: "inteligencia"
  },

  // ADMINISTRAÇÃO
  { 
    title: "Administração", 
    url: "/administracao", 
    icon: Settings, 
    description: "Gestão completa de usuários, permissões e configurações do sistema", 
    group: "administracao"
  },
  { 
    title: "Gamificação", 
    url: "/gamificacao", 
    icon: Trophy, 
    description: "Sistema de pontuação, rankings e engajamento de usuários", 
    group: "administracao"
  },
];

const menuGroups = [
  { 
    id: "visao-geral", 
    title: "VISÃO GERAL", 
    description: "Funcionalidades essenciais para visão panorâmica dos negócios",
    color: "text-blue-400"
  },
  { 
    id: "vmo-latam", 
    title: "VMO LATAM", 
    description: "Análises estratégicas regionais e gestão de valor para LATAM",
    color: "text-green-400"
  },
  { 
    id: "inteligencia", 
    title: "INTELIGÊNCIA", 
    description: "Recursos avançados de IA e analytics para insights profundos",
    color: "text-purple-400"
  },
  { 
    id: "administracao", 
    title: "ADMINISTRAÇÃO", 
    description: "Configurações avançadas e gestão operacional do sistema",
    color: "text-orange-400"
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["visao-geral", "vmo-latam", "inteligencia"]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const { collapsed, toggleCollapsed } = useSidebarState();

  const currentPath = location.pathname;

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      if (searchTerm.trim() && filtered.length > 0) {
        setExpandedGroups(menuGroups.map(g => g.id));
      }
    }
  }, [searchTerm]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (path: string) => currentPath === path;

  // Collapsed sidebar (60px width)
  if (collapsed) {
    return (
      <div className="fixed left-0 top-0 h-full w-[60px] bg-[#0A3454] border-r border-[#195280] z-[100] flex flex-col shadow-xl">
        {/* Botão de expansão no topo */}
        <div className="p-2 border-b border-[#195280]">
          <TooltipProvider>
            <EnhancedTooltip 
              content="Expandir Menu"
              description="Clique para ver todas as opções de navegação"
              shortcut="Ctrl+B"
            >
              <button
                onClick={toggleCollapsed}
                className="w-full h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00CFFF]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </EnhancedTooltip>
          </TooltipProvider>
        </div>

        {/* Logo compacto */}
        <div className="p-2 border-b border-[#195280]">
          <TooltipProvider>
            <EnhancedTooltip 
              content="Gestão Financeira Electrolux"
              description="Sistema integrado de gestão financeira e projetos estratégicos"
            >
              <div className="w-full h-12 flex items-center justify-center bg-white/10 rounded-lg">
                <img 
                  src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                  alt="Electrolux" 
                  className="h-8 w-8 object-contain"
                />
              </div>
            </EnhancedTooltip>
          </TooltipProvider>
        </div>

        {/* Ícones dos itens de menu com scroll */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 hover:scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
          {menuGroups.map((group, groupIndex) => {
            const groupItems = filteredItems.filter(item => item.group === group.id);
            return (
              <div key={group.id} className="space-y-1">
                {groupItems.map((item) => (
                  <TooltipProvider key={item.url}>
                    <EnhancedTooltip 
                      content={item.title}
                      description={item.description}
                      shortcut={item.shortcut}
                    >
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `relative flex items-center justify-center p-3 rounded-xl transition-all duration-300 mb-2 group ${
                            isActive
                              ? 'bg-[#144875] border border-[#00CFFF] text-white shadow-lg scale-105'
                              : 'text-white/70 hover:bg-[#144875] hover:text-white hover:border hover:border-[#00CFFF]/50 hover:shadow-md hover:scale-105'
                          }`
                        }
                      >
                        <item.icon className="h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                      </NavLink>
                    </EnhancedTooltip>
                  </TooltipProvider>
                ))}
                {groupIndex < menuGroups.length - 1 && groupItems.length > 0 && (
                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#195280] to-transparent mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Expanded sidebar (220px width)
  return (
    <div className="fixed left-0 top-0 h-full w-[220px] bg-[#0A3454] border-r border-[#195280] z-[100] flex flex-col shadow-xl">
      <div className="px-4 py-4 flex-1 flex flex-col min-h-0">
        {/* Header com botão de colapso */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
                <img 
                  src="/lovable-uploads/2d37f880-65b5-494e-8f7f-3ebd822105d6.png" 
                  alt="Electrolux" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm">Gestão Financeira</h2>
                <p className="text-white/60 text-xs">Sistema Integrado</p>
              </div>
            </div>
            <button
              onClick={toggleCollapsed}
              className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200 border border-[#195280] hover:border-[#00CFFF] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00CFFF]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Buscar funcionalidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 bg-white/10 border-[#195280] text-white text-sm placeholder:text-white/50 focus:border-[#00CFFF] focus:ring-0 rounded-lg"
            />
          </div>
        </div>

        {/* Menu Groups com scroll funcional */}
        <div className="flex-1 min-h-0">
          <div className="h-full overflow-y-auto space-y-3 hover:scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 pr-2">
            {menuGroups.map((group, groupIndex) => {
              const groupItems = filteredItems.filter(item => item.group === group.id);
              const isExpanded = expandedGroups.includes(group.id);
              
              if (groupItems.length === 0 && searchTerm) return null;

              return (
                <div key={group.id}>
                  <div>
                    <TooltipProvider>
                      <EnhancedTooltip 
                        content={group.title}
                        description={group.description}
                      >
                        <div 
                          className={`
                            ${group.color} text-xs font-bold uppercase tracking-wider cursor-pointer 
                            hover:text-white transition-all duration-200 flex items-center justify-between 
                            p-3 rounded-lg hover:bg-white/5 mt-2 group
                          `}
                          onClick={() => toggleGroup(group.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full bg-current opacity-60 group-hover:opacity-100`} />
                            <span>{group.title}</span>
                          </div>
                          {groupItems.length > 0 && (
                            <div className="transition-transform duration-200">
                              {isExpanded ? 
                                <ChevronDown className="h-3 w-3" /> : 
                                <ChevronRight className="h-3 w-3" />
                              }
                            </div>
                          )}
                        </div>
                      </EnhancedTooltip>
                    </TooltipProvider>

                    {(isExpanded || searchTerm) && (
                      <div className="mt-2 space-y-1">
                        {groupItems.map((item) => (
                          <div key={item.url}>
                            <NavLink
                              to={item.url}
                              className={({ isActive }) =>
                                `relative flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 w-full text-sm group ${
                                  isActive
                                    ? 'bg-[#144875] border-l-4 border-[#00CFFF] text-white font-medium shadow-lg'
                                    : 'text-white/80 hover:bg-[#144875] hover:text-white hover:border-l-4 hover:border-[#00CFFF] hover:shadow-md'
                                }`
                              }
                            >
                              <item.icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                              <span className="leading-tight flex-1">{item.title}</span>
                              {item.shortcut && (
                                <kbd className="hidden group-hover:inline-flex h-5 select-none items-center gap-1 rounded border bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white/60">
                                  {item.shortcut}
                                </kbd>
                              )}
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {groupIndex < menuGroups.length - 1 && (
                    <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#195280] to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && filteredItems.length === 0 && (
          <div className="text-center py-8 flex-shrink-0">
            <SearchIcon className="h-8 w-8 text-white/50 mx-auto mb-3" />
            <p className="text-white/70 text-sm font-medium">Nenhum resultado encontrado</p>
            <p className="text-white/50 text-xs mt-1">Tente outros termos de busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
