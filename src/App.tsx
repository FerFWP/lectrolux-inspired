import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import PortfolioDynamicReports from "./pages/PortfolioDynamicReports";
import UserAdministration from "./pages/UserAdministration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="h-12 flex items-center border-b bg-background px-4">
                <SidebarTrigger className="mr-4" />
                <h1 className="font-semibold">Sistema de Gestão Financeira</h1>
              </header>
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/projetos" element={<ProjectsList />} />
                  <Route path="/projetos/:id" element={<ProjectDetail />} />
                  <Route path="/relatorios-dinamicos" element={<PortfolioDynamicReports />} />
                  <Route path="/administracao" element={<UserAdministration />} />
                  {/* VMO LATAM Routes - Placeholder pages */}
                  <Route path="/vmo-latam/dashboard-consolidado" element={<div className="p-6"><h1 className="text-2xl font-bold">Dashboard Consolidado VMO LATAM</h1><p className="text-muted-foreground mt-2">Visão regional dos KPIs financeiros e status dos projetos por país/BU</p></div>} />
                  <Route path="/vmo-latam/multi-moeda-cambio" element={<div className="p-6"><h1 className="text-2xl font-bold">Multi-moeda & Câmbio</h1><p className="text-muted-foreground mt-2">Análise de variações cambiais e orçamentos em moedas diferentes</p></div>} />
                  <Route path="/vmo-latam/simulacao-cenarios" element={<div className="p-6"><h1 className="text-2xl font-bold">Simulação de Cenários</h1><p className="text-muted-foreground mt-2">Tela para simulação orçamentária ('what-if') com ajustes e impacto</p></div>} />
                  <Route path="/vmo-latam/comparativo-valor" element={<div className="p-6"><h1 className="text-2xl font-bold">Comparativo de Valor</h1><p className="text-muted-foreground mt-2">Painel comparativo de ROI, valor agregado e performance por região/área</p></div>} />
                  <Route path="/vmo-latam/governanca-auditoria" element={<div className="p-6"><h1 className="text-2xl font-bold">Governança & Auditoria</h1><p className="text-muted-foreground mt-2">Logs, registros de decisões, justificativas e exportação para compliance</p></div>} />
                  <Route path="/vmo-latam/clusters-estrategicos" element={<div className="p-6"><h1 className="text-2xl font-bold">Clusters Estratégicos</h1><p className="text-muted-foreground mt-2">Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)</p></div>} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
