import { useState, useEffect } from "react";
import { Search, ChevronRight, ChevronDown, Menu, ArrowRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  Trophy,
  Home
} from "lucide-react";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  description: string;
  group: string;
}

const menuItems: MenuItem[] = [
  // VISÃO GERAL
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, description: "Visão geral dos projetos e KPIs", group: "visao-geral" },
  { title: "Projetos", url: "/projetos", icon: FolderOpen, description: "Gestão de portfólio de projetos", group: "visao-geral" },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, description: "Centro de relatórios financeiros", group: "visao-geral" },

  // VMO LATAM
  { title: "Dashboard Consolidado", url: "/vmo-latam/dashboard-consolidado", icon: TrendingUp, description: "Visão consolidada LATAM", group: "vmo-latam" },
  { title: "Multi-moeda & Câmbio", url: "/vmo-latam/multi-moeda-cambio", icon: Globe, description: "Conversão e análise multi-moeda", group: "vmo-latam" },
  { title: "Simulação de Cenários", url: "/vmo-latam/simulacao-cenarios", icon: Calculator, description: "Simulação e projeções financeiras", group: "vmo-latam" },
  { title: "Comparativo de Valor", url: "/vmo-latam/comparativo-valor", icon: ArrowLeftRight, description: "Análise comparativa de investimentos", group: "vmo-latam" },
  { title: "Governança & Auditoria", url: "/vmo-latam/governanca-auditoria", icon: Shield, description: "Controles e auditoria", group: "vmo-latam" },
  { title: "BU Analysis / Capex Monthly", url: "/vmo-latam/capex-meeting", icon: PieChart, description: "Análise mensal de CAPEX por BU", group: "vmo-latam" },
  { title: "Assertividade SOP", url: "/vmo-latam/assertividade-sop", icon: Target, description: "Análise de assertividade SOP", group: "vmo-latam" },
  { title: "Apresentação Executiva", url: "/vmo-latam/apresentacao-executiva", icon: FileText, description: "Apresentação para diretoria", group: "vmo-latam" },
  { title: "Clusters Estratégicos", url: "/vmo-latam/clusters-estrategicos", icon: Users, description: "Agrupamento estratégico de projetos", group: "vmo-latam" },

  // INTELIGÊNCIA
  { title: "Assistente de Perguntas", url: "/inteligencia/assistente", icon: MessageCircle, description: "IA para perguntas sobre dados", group: "inteligencia" },
  { title: "Explicações de Indicadores", url: "/inteligencia/explicacoes", icon: HelpCircle, description: "Explicações detalhadas de KPIs", group: "inteligencia" },
  { title: "Pesquisa Avançada (RAG)", url: "/inteligencia/pesquisa-avancada", icon: SearchIcon, description: "Busca inteligente com IA", group: "inteligencia" },
  { title: "Sugestão de Ações", url: "/inteligencia/sugestoes", icon: Lightbulb, description: "Sugestões baseadas em IA", group: "inteligencia" },

  // ADMINISTRAÇÃO
  { title: "Administração", url: "/administracao", icon: Settings, description: "Gestão de usuários e sistema", group: "administracao" },
  { title: "Gamificação", url: "/gamificacao", icon: Trophy, description: "Sistema de pontuação e rankings", group: "administracao" },
];

const menuGroups = [
  { id: "visao-geral", title: "VISÃO GERAL", description: "Funcionalidades básicas do sistema" },
  { id: "vmo-latam", title: "VMO LATAM", description: "Visão regional e análises estratégicas LATAM" },
  { id: "inteligencia", title: "INTELIGÊNCIA", description: "Recursos de IA e analytics avançados" },
  { id: "administracao", title: "ADMINISTRAÇÃO", description: "Configurações e gestão do sistema" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["visao-geral", "vmo-latam", "inteligencia"]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);

  const currentPath = location.pathname;

  // Filter items based on search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
      // Expand all groups when searching
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

  // Collapsed sidebar (60px)
  if (collapsed) {
    return (
      <Sidebar className="w-15 bg-[#0A3454] border-r border-[#195280]">
        <SidebarContent className="px-3 py-4">
          {/* Logo compacto */}
          <div className="mb-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <img 
                      src="/src/assets/electrolux-logo.png" 
                      alt="Electrolux" 
                      className="h-6 w-6 object-contain brightness-0 invert"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Gestão Financeira</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Menu items compactos */}
          <div className="space-y-2">
            {menuGroups.map((group) => {
              const groupItems = filteredItems.filter(item => item.group === group.id);
              return (
                <div key={group.id}>
                  {groupItems.map((item) => (
                    <TooltipProvider key={item.url}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NavLink
                            to={item.url}
                            className={({ isActive }) =>
                              `flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-[#144875] border-l-4 border-[#00CFFF] text-white'
                                  : 'text-white/70 hover:bg-[#144875] hover:text-white'
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div>
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {group.id !== "administracao" && groupItems.length > 0 && (
                    <div className="my-3 h-px bg-[#195280]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Botão para expandir no rodapé */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </SidebarTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expandir menu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Expanded sidebar (220px)
  return (
    <Sidebar className="w-55 bg-[#0A3454] border-r border-[#195280]">
      <SidebarContent className="px-3 py-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5">
                <img 
                  src="/src/assets/electrolux-logo.png" 
                  alt="Electrolux" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-white font-semibold text-sm">Gestão Financeira</h2>
            </div>
            <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-10 bg-white/10 border-[#195280] text-white text-xs placeholder:text-white/50 focus:border-[#00CFFF] focus:ring-0"
            />
          </div>
        </div>

        {/* Menu Groups */}
        <div className="space-y-2">
          {menuGroups.map((group, groupIndex) => {
            const groupItems = filteredItems.filter(item => item.group === group.id);
            const isExpanded = expandedGroups.includes(group.id);
            const hasActiveItem = groupItems.some(item => isActive(item.url));
            
            if (groupItems.length === 0 && searchTerm) return null;

            return (
              <div key={group.id}>
                <SidebarGroup>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarGroupLabel 
                          className={`
                            text-[#6BA6D9] text-xs font-semibold uppercase tracking-wider cursor-pointer 
                            hover:text-white transition-colors flex items-center justify-between 
                            p-2 rounded hover:bg-white/5 mt-2
                          `}
                          onClick={() => toggleGroup(group.id)}
                        >
                          <div>{group.title}</div>
                          {groupItems.length > 0 && (
                            isExpanded ? 
                            <ChevronDown className="h-3 w-3" /> : 
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </SidebarGroupLabel>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{group.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {(isExpanded || searchTerm) && (
                    <SidebarGroupContent className="mt-1">
                      <SidebarMenu className="space-y-1">
                        {groupItems.map((item) => (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={item.url}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-200 w-full text-sm ${
                                    isActive
                                      ? 'bg-[#144875] border-l-4 border-[#00CFFF] text-white font-medium'
                                      : 'text-white/80 hover:bg-[#144875] hover:text-white hover:border-l-4 hover:border-[#00CFFF]'
                                  }`
                                }
                              >
                                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                                <span className="leading-tight">{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>

                {groupIndex < menuGroups.length - 1 && (
                  <div className="my-4 h-px bg-[#195280]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Search Results */}
        {searchTerm && filteredItems.length === 0 && (
          <div className="text-center py-8">
            <SearchIcon className="h-6 w-6 text-white/50 mx-auto mb-2" />
            <p className="text-white/70 text-xs">Nenhum resultado encontrado</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}