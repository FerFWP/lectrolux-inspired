import { useState, useEffect } from "react";
import { Search, Star, StarIcon, ChevronRight, ChevronDown, User, X } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
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
  FileBarChart, 
  HelpCircle, 
  Search as SearchIcon, 
  Lightbulb, 
  Settings, 
  Trophy,
  Home,
  Menu
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
  { title: "Home", url: "/", icon: Home, description: "Página inicial do sistema", group: "visao-geral" },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, description: "Visão geral dos projetos e KPIs", group: "visao-geral" },
  { title: "Projetos", url: "/projetos", icon: FolderOpen, description: "Gestão de portfólio de projetos", group: "visao-geral" },
  { title: "Relatórios", url: "/relatorios", icon: BarChart3, description: "Centro de relatórios financeiros", group: "visao-geral" },

  // VMO LATAM
  { title: "Dashboard Consolidado", url: "/vmo-latam/dashboard", icon: TrendingUp, description: "Visão consolidada LATAM", group: "vmo-latam" },
  { title: "Multi-moeda & Câmbio", url: "/vmo-latam/multi-moeda", icon: Globe, description: "Conversão e análise multi-moeda", group: "vmo-latam" },
  { title: "Simulação de Cenários", url: "/vmo-latam/simulacao", icon: Calculator, description: "Simulação e projeções financeiras", group: "vmo-latam" },
  { title: "Comparativo de Valor", url: "/vmo-latam/comparativo", icon: ArrowLeftRight, description: "Análise comparativa de investimentos", group: "vmo-latam" },
  { title: "Governança & Auditoria", url: "/vmo-latam/governanca", icon: Shield, description: "Controles e auditoria", group: "vmo-latam" },
  { title: "BU Analysis / Capex Monthly", url: "/vmo-latam/capex-meeting", icon: PieChart, description: "Análise mensal de CAPEX por BU", group: "vmo-latam" },
  { title: "Assertividade SOP", url: "/vmo-latam/assertividade-sop", icon: Target, description: "Análise de assertividade SOP", group: "vmo-latam" },
  { title: "Apresentação Executiva", url: "/vmo-latam/apresentacao-executiva", icon: FileText, description: "Apresentação para diretoria", group: "vmo-latam" },
  { title: "Clusters Estratégicos", url: "/clusters-estrategicos", icon: Users, description: "Agrupamento estratégico de projetos", group: "vmo-latam" },

  // INTELIGÊNCIA
  { title: "Assistente de Perguntas", url: "/assistente-perguntas", icon: MessageCircle, description: "IA para perguntas sobre dados", group: "inteligencia" },
  { title: "Explicações de Indicadores", url: "/explanation-center", icon: HelpCircle, description: "Explicações detalhadas de KPIs", group: "inteligencia" },
  { title: "Pesquisa Avançada (RAG)", url: "/advanced-search", icon: SearchIcon, description: "Busca inteligente com IA", group: "inteligencia" },
  { title: "Sugestão de Ações", url: "/action-suggestions", icon: Lightbulb, description: "Sugestões baseadas em IA", group: "inteligencia" },

  // ADMINISTRAÇÃO
  { title: "Administração", url: "/user-administration", icon: Settings, description: "Gestão de usuários e sistema", group: "administracao" },
  { title: "Gamificação", url: "/gamificacao", icon: Trophy, description: "Sistema de pontuação e rankings", group: "administracao" },
];

const menuGroups = [
  { id: "visao-geral", title: "VISÃO GERAL", subtitle: "" },
  { id: "vmo-latam", title: "VMO LATAM", subtitle: "Visão regional e análises estratégicas LATAM" },
  { id: "inteligencia", title: "INTELIGÊNCIA", subtitle: "Recursos de IA e analytics avançados" },
  { id: "administracao", title: "ADMINISTRAÇÃO", subtitle: "Configurações e gestão do sistema" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["visao-geral", "vmo-latam", "inteligencia"]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);

  const currentPath = location.pathname;
  const userName = "Admin User"; // This would come from auth context

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("sidebar-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  const toggleFavorite = (url: string) => {
    setFavorites(prev => {
      if (prev.includes(url)) {
        return prev.filter(fav => fav !== url);
      } else if (prev.length < 3) {
        return [...prev, url];
      }
      return prev;
    });
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(g => g !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (path: string) => currentPath === path;
  const isFavorite = (url: string) => favorites.includes(url);

  const favoriteItems = menuItems.filter(item => favorites.includes(item.url));

  // Collapsed sidebar (68px)
  if (collapsed) {
    return (
      <Sidebar className="w-16 bg-gradient-to-b from-[#0A3454] to-[#195280] border-r border-[#195280]">
        <SidebarContent className="p-2">
          {/* Logo compacto */}
          <div className="mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <img 
                      src="/src/assets/electrolux-logo.png" 
                      alt="Electrolux" 
                      className="h-8 w-8 object-contain brightness-0 invert"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Gestão Financeira</p>
                  <p className="text-xs text-gray-500">Electrolux LATAM</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Toggle button */}
          <div className="mb-4 flex justify-center">
            <SidebarTrigger className="text-[#B0C4D6] hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors" />
          </div>

          {/* Favoritos compactos */}
          {favoriteItems.length > 0 && (
            <div className="space-y-2 mb-4">
              {favoriteItems.slice(0, 3).map((item) => (
                <TooltipProvider key={item.url}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center justify-center p-3 rounded-lg transition-all duration-200 ${
                            isActive
                              ? 'bg-[#00CFFF]/20 border-l-4 border-[#00CFFF] text-white shadow-lg'
                              : 'text-[#B0C4D6] hover:bg-white/10 hover:text-white'
                          }`
                        }
                      >
                        <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="font-medium">⭐ {item.title}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}

          <Separator className="mb-4 bg-[#195280]" />

          {/* Menu items compactos */}
          <div className="space-y-1">
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
                                  ? 'bg-[#00CFFF]/20 border-l-4 border-[#00CFFF] text-white shadow-lg'
                                  : 'text-[#B0C4D6] hover:bg-white/10 hover:text-white'
                              }`
                            }
                          >
                            <item.icon className="h-5 w-5" />
                          </NavLink>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {group.id !== "administracao" && groupItems.length > 0 && (
                    <div className="my-2 h-px bg-[#195280]" />
                  )}
                </div>
              );
            })}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Expanded sidebar (260px)
  return (
    <Sidebar className="w-64 bg-gradient-to-b from-[#0A3454] to-[#195280] border-r border-[#195280]">
      <SidebarContent className="p-4">
        {/* Header completo */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm">
                <img 
                  src="/src/assets/electrolux-logo.png" 
                  alt="Electrolux" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-white font-bold text-base leading-tight">Gestão Financeira</h2>
                <p className="text-[#B0C4D6] text-sm">Electrolux LATAM</p>
              </div>
            </div>
            <SidebarTrigger className="text-[#B0C4D6] hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
          </div>

          {/* Welcome Message */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4 border border-white/20">
            <p className="text-white text-sm flex items-center">
              <User className="w-4 h-4 mr-2 text-[#00CFFF]" />
              Olá, <span className="font-medium ml-1">{userName}!</span>
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0C4D6]" />
            <Input
              placeholder="Buscar funções ou relatórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 backdrop-blur-sm border-[#195280] text-white placeholder:text-[#B0C4D6] focus:border-[#00CFFF] focus:ring-1 focus:ring-[#00CFFF]/50"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-[#B0C4D6] hover:text-white"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Favorites */}
          {favoriteItems.length > 0 && (
            <div className="mb-4">
              <h3 className="text-[#B0C4D6] text-xs font-semibold mb-3 flex items-center tracking-wider">
                <Star className="w-3 h-3 mr-2 text-[#FFD700]" />
                FAVORITOS
              </h3>
              <div className="flex space-x-2">
                {favoriteItems.slice(0, 3).map((item, index) => (
                  <TooltipProvider key={item.url}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.url}
                          className="group relative p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-[#00CFFF]/50 flex-1"
                        >
                          <div className="flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-[#00CFFF] group-hover:scale-110 transition-transform" />
                          </div>
                          <Star className="absolute -top-1 -right-1 h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">⭐ {item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu Groups */}
        <div className="space-y-1">
          {menuGroups.map((group, groupIndex) => {
            const groupItems = filteredItems.filter(item => item.group === group.id);
            const isExpanded = expandedGroups.includes(group.id);
            const hasActiveItem = groupItems.some(item => isActive(item.url));
            
            if (groupItems.length === 0 && searchTerm) return null;

            return (
              <div key={group.id}>
                <SidebarGroup>
                  <SidebarGroupLabel 
                    className={`
                      text-[#B0C4D6] text-xs font-bold tracking-wider cursor-pointer 
                      hover:text-white transition-colors flex items-center justify-between 
                      p-3 rounded-lg hover:bg-white/5
                      ${hasActiveItem ? 'text-white bg-white/10' : ''}
                    `}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        {group.title}
                        {hasActiveItem && (
                          <div className="w-2 h-2 bg-[#00CFFF] rounded-full ml-2" />
                        )}
                      </div>
                      {group.subtitle && (
                        <div className="text-xs font-normal text-[#B0C4D6]/80 mt-1 leading-tight">
                          {group.subtitle}
                        </div>
                      )}
                    </div>
                    {groupItems.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                          {groupItems.length}
                        </span>
                        {isExpanded ? 
                          <ChevronDown className="h-3 w-3" /> : 
                          <ChevronRight className="h-3 w-3" />
                        }
                      </div>
                    )}
                  </SidebarGroupLabel>

                  {(isExpanded || searchTerm) && (
                    <SidebarGroupContent className="mt-2">
                      <SidebarMenu className="space-y-1">
                        {groupItems.map((item) => (
                          <SidebarMenuItem key={item.url}>
                            <SidebarMenuButton asChild>
                              <NavLink
                                to={item.url}
                                className={({ isActive }) =>
                                  `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 w-full ${
                                    isActive
                                      ? 'bg-[#00CFFF]/20 border-l-4 border-[#00CFFF] text-white shadow-lg backdrop-blur-sm'
                                      : 'text-[#B0C4D6] hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-white/30'
                                  }`
                                }
                              >
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                <span className="text-sm font-medium leading-tight">{item.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  )}
                </SidebarGroup>

                {groupIndex < menuGroups.length - 1 && (
                  <Separator className="my-3 bg-[#195280]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Search Results */}
        {searchTerm && filteredItems.length === 0 && (
          <div className="text-center py-8">
            <SearchIcon className="h-8 w-8 text-[#B0C4D6] mx-auto mb-2" />
            <p className="text-[#B0C4D6] text-sm">Nenhum resultado encontrado</p>
            <p className="text-[#B0C4D6]/60 text-xs">Tente termos diferentes</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}