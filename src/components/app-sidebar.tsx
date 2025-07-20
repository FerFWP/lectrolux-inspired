import { useState } from "react";
import electroluxLogo from "@/assets/electrolux-logo.png";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  ChevronRight,
  BarChart3,
  Globe,
  Calculator,
  TrendingUp,
  Shield,
  Target,
  Brain,
  MessageCircle,
  FileBarChart,
  HelpCircle,
  Search,
  Lightbulb,
  Award,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  {
    title: "Projetos",
    url: "/projetos",
    icon: FolderOpen,
    description: "Gerenciamento de projetos"
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
    description: "Centro de relatórios financeiros"
  },
  {
    title: "Relatórios Dinâmicos",
    url: "/relatorios-dinamicos",
    icon: FileBarChart,
    description: "Relatórios personalizados"
  },
  {
    title: "Gamificação",
    url: "/gamificacao",
    icon: Award,
    description: "Badges, conquistas e engajamento"
  },
  {
    title: "Administração",
    url: "/administracao",
    icon: Users,
    description: "Configurações do sistema"
  },
];

const vmoLatamSubmenu = [
  {
    title: "Dashboard Consolidado",
    url: "/vmo-latam/dashboard-consolidado",
    icon: BarChart3,
    description: "Visão regional dos KPIs financeiros e status dos projetos por país/BU",
  },
  {
    title: "Multi-moeda & Câmbio",
    url: "/vmo-latam/multi-moeda-cambio",
    icon: Globe,
    description: "Análise de variações cambiais e orçamentos em moedas diferentes",
  },
  {
    title: "Simulação de Cenários",
    url: "/vmo-latam/simulacao-cenarios",
    icon: Calculator,
    description: "Tela para simulação orçamentária ('what-if') com ajustes e impacto",
  },
  {
    title: "Comparativo de Valor",
    url: "/vmo-latam/comparativo-valor",
    icon: TrendingUp,
    description: "Painel comparativo de ROI, valor agregado e performance por região/área",
  },
  {
    title: "Governança & Auditoria",
    url: "/vmo-latam/governanca-auditoria",
    icon: Shield,
    description: "Logs, registros de decisões, justificativas e exportação para compliance",
  },
  {
    title: "BU Analysis / Capex Monthly Meeting",
    url: "/vmo-latam/capex-meeting",
    icon: BarChart3,
    description: "Análise detalhada do CAPEX e performance mensal por BU",
  },
  {
    title: "Clusters Estratégicos",
    url: "/vmo-latam/clusters-estrategicos",
    icon: Target,
    description: "Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)",
  },
];

const inteligenciaSubmenu = [
  {
    title: "Assistente de Perguntas",
    url: "/inteligencia/assistente",
    icon: MessageCircle,
    description: "Chatbot para dúvidas sobre indicadores, conceitos, status ou procedimentos"
  },
  {
    title: "Geração de Relatórios Dinâmicos",
    url: "/inteligencia/relatorios-dinamicos",
    icon: FileBarChart,
    description: "Solicite análises personalizadas via prompt (ex: projetos com desvio >15%)"
  },
  {
    title: "Explicações de Indicadores",
    url: "/inteligencia/explicacoes",
    icon: HelpCircle,
    description: "Solicite explicação de métricas, cálculos ou gráficos específicos"
  },
  {
    title: "Pesquisa Avançada (RAG)",
    url: "/inteligencia/pesquisa-avancada",
    icon: Search,
    description: "Busca semântica em documentos, atas, anexos usando linguagem natural"
  },
  {
    title: "Sugestão de Ações",
    url: "/inteligencia/sugestoes",
    icon: Lightbulb,
    description: "Painel com recomendações e alertas automáticos baseados nos dados"
  },
];

const MenuItemWithTooltip = ({ item, isActive, isCollapsed }: { 
  item: any; 
  isActive: boolean; 
  isCollapsed: boolean; 
}) => {
  const content = (
    <NavLink
      to={item.url}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium 
        transition-all duration-200 ease-in-out
        ${isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-2 border-sidebar-primary" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <item.icon className={`w-5 h-5 ${isActive ? "text-sidebar-primary" : ""} flex-shrink-0`} />
      {!isCollapsed && (
        <span className="flex-1 truncate">{item.title}</span>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p className="font-medium">{item.title}</p>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

const SubMenuItemWithTooltip = ({ item, isActive, isCollapsed }: { 
  item: any; 
  isActive: boolean; 
  isCollapsed: boolean; 
}) => {
  const content = (
    <NavLink
      to={item.url}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm
        transition-all duration-200 ease-in-out
        ${isCollapsed ? "ml-0" : "ml-6"}
        ${isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm border-l-2 border-sidebar-primary" 
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-sidebar-primary" : ""}`} />
      {!isCollapsed && (
        <span className="flex-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">
          {item.title}
        </span>
      )}
    </NavLink>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" className="ml-2 max-w-sm">
          <p className="font-medium">{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [vmoLatamOpen, setVmoLatamOpen] = useState(true); // Sempre aberto para debug
  // const [vmoLatamOpen, setVmoLatamOpen] = useState(
  //   currentPath.startsWith("/vmo-latam")
  // );
  const [inteligenciaOpen, setInteligenciaOpen] = useState(
    currentPath.startsWith("/inteligencia")
  );

  const isActive = (path: string) => currentPath === path;
  const isVmoLatamActive = currentPath.startsWith("/vmo-latam");
  const isInteligenciaActive = currentPath.startsWith("/inteligencia");

  return (
    <TooltipProvider>
      <Sidebar
        className="transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border"
        collapsible="icon"
        side="left"
        variant="sidebar"
      >
        <SidebarContent className="relative">
          {/* Header com Logo e Toggle */}
          <div className="flex items-center justify-between p-4 bg-sidebar-accent/30 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm">
                <img
                  src={electroluxLogo}
                  alt="Electrolux"
                  className="w-full h-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <h2 className="text-sidebar-accent-foreground font-semibold text-sm leading-tight">
                    Gestão Financeira
                  </h2>
                  <p className="text-sidebar-foreground/60 text-xs">
                    Electrolux
                  </p>
                </div>
              )}
            </div>
            <SidebarTrigger className={`
              p-1.5 rounded-md hover:bg-sidebar-accent/50 
              transition-colors duration-200
              ${isCollapsed ? "w-8 h-8 flex items-center justify-center" : ""}
            `} />
          </div>

          {/* Menu Principal */}
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className={`
              px-3 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wide
              ${isCollapsed ? "sr-only" : ""}
            `}>
              Menu Principal
            </SidebarGroupLabel>
            {!isCollapsed && (
              <p className="px-3 text-xs text-sidebar-foreground/40 mb-4">
                Acesse as funções básicas do sistema.
              </p>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <MenuItemWithTooltip 
                        item={item} 
                        isActive={isActive(item.url)} 
                        isCollapsed={isCollapsed}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="mx-4 bg-sidebar-border" />

          {/* VMO LATAM Section */}
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className={`
              px-3 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wide
              ${isCollapsed ? "sr-only" : ""}
            `}>
              VMO LATAM
            </SidebarGroupLabel>
            {!isCollapsed && (
              <p className="px-3 text-xs text-sidebar-foreground/40 mb-4">
                Visão regional e análises estratégicas LATAM.
              </p>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  open={isCollapsed || vmoLatamOpen}
                  onOpenChange={setVmoLatamOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="p-0">
                        <div className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full
                          transition-all duration-200 ease-in-out
                          ${isVmoLatamActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-2 border-sidebar-primary" 
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          }
                        `}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 w-full">
                                  <BarChart3 className={`w-5 h-5 ${isVmoLatamActive ? "text-sidebar-primary" : ""} flex-shrink-0`} />
                                  {!isCollapsed && (
                                    <>
                                      <span className="flex-1">VMO LATAM</span>
                                      <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </>
                                  )}
                                </div>
                              </TooltipTrigger>
                              {isCollapsed && (
                                <TooltipContent side="right" className="ml-2">
                                  <p className="font-medium">VMO LATAM</p>
                                  <p className="text-xs text-muted-foreground mt-1">Visão regional e análises estratégicas LATAM.</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="transition-all duration-200 ease-in-out">
                      <SidebarMenuSub className="mt-2 space-y-1">
                        {vmoLatamSubmenu.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="p-0">
                              <SubMenuItemWithTooltip 
                                item={subItem} 
                                isActive={isActive(subItem.url)} 
                                isCollapsed={isCollapsed}
                              />
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator className="mx-4 bg-sidebar-border" />

          {/* Inteligência Section */}
          <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className={`
              px-3 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wide
              ${isCollapsed ? "sr-only" : ""}
            `}>
              Inteligência
            </SidebarGroupLabel>
            {!isCollapsed && (
              <p className="px-3 text-xs text-sidebar-foreground/40 mb-4">
                Funcionalidades de IA e automação.
              </p>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <Collapsible
                  open={isCollapsed || inteligenciaOpen}
                  onOpenChange={setInteligenciaOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="p-0">
                        <div className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full
                          transition-all duration-200 ease-in-out
                          ${isInteligenciaActive 
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm border-l-2 border-sidebar-primary" 
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                          }
                        `}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-3 w-full">
                                  <Brain className={`w-5 h-5 ${isInteligenciaActive ? "text-sidebar-primary" : ""} flex-shrink-0`} />
                                  {!isCollapsed && (
                                    <>
                                      <span className="flex-1">Inteligência</span>
                                      <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </>
                                  )}
                                </div>
                              </TooltipTrigger>
                              {isCollapsed && (
                                <TooltipContent side="right" className="ml-2">
                                  <p className="font-medium">Inteligência</p>
                                  <p className="text-xs text-muted-foreground mt-1">Funcionalidades de IA e automação.</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="transition-all duration-200 ease-in-out">
                      <SidebarMenuSub className="mt-2 space-y-1">
                        {inteligenciaSubmenu.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild className="p-0">
                              <SubMenuItemWithTooltip 
                                item={subItem} 
                                isActive={isActive(subItem.url)} 
                                isCollapsed={isCollapsed}
                              />
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}