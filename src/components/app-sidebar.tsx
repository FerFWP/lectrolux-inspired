import { useState } from "react";
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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  Building2,
} from "lucide-react";

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projetos",
    url: "/projetos",
    icon: FolderOpen,
  },
  {
    title: "Relatórios Dinâmicos",
    url: "/relatorios-dinamicos",
    icon: FileText,
  },
  {
    title: "Administração",
    url: "/administracao",
    icon: Users,
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
    title: "Clusters Estratégicos",
    url: "/vmo-latam/clusters-estrategicos",
    icon: Target,
    description: "Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [vmoLatamOpen, setVmoLatamOpen] = useState(
    currentPath.startsWith("/vmo-latam")
  );

  const isActive = (path: string) => currentPath === path;
  const isVmoLatamActive = currentPath.startsWith("/vmo-latam");

  const getNavClassName = (isActive: boolean) =>
    isActive
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const getSubNavClassName = (isActive: boolean) =>
    isActive
      ? "bg-primary/10 text-primary font-medium pl-8"
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground pl-8";

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        {/* Logo/Brand */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-sm">Gestão Financeira</h2>
                <p className="text-xs text-muted-foreground">Electrolux</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(isActive(item.url))}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* VMO LATAM Section */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            VMO LATAM
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={vmoLatamOpen}
                onOpenChange={setVmoLatamOpen}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`${
                        isVmoLatamActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
                      } ${isCollapsed ? "justify-center" : ""}`}
                    >
                      <BarChart3 className="w-4 h-4" />
                      {!isCollapsed && (
                        <>
                          <span>VMO LATAM</span>
                          <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </>
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {!isCollapsed && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {vmoLatamSubmenu.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <NavLink
                                to={subItem.url}
                                className={getSubNavClassName(isActive(subItem.url))}
                                title={subItem.description}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <span className="text-sm">{subItem.title}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}