import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectsList from "./pages/ProjectsList";
import ProjectDetail from "./pages/ProjectDetail";
import PortfolioDynamicReports from "./pages/PortfolioDynamicReports";
import UserAdministration from "./pages/UserAdministration";
import VmoLatamDashboard from "./pages/VmoLatamDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Without Sidebar */}
          <Route path="/" element={<Index />} />
          
          {/* Protected Routes - With Sidebar */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/projetos" element={<Layout><ProjectsList /></Layout>} />
          <Route path="/projetos/:id" element={<Layout><ProjectDetail /></Layout>} />
          <Route path="/relatorios-dinamicos" element={<Layout><PortfolioDynamicReports /></Layout>} />
          <Route path="/administracao" element={<Layout><UserAdministration /></Layout>} />
          
          {/* VMO LATAM Routes - With Sidebar */}
          <Route path="/vmo-latam/dashboard-consolidado" element={<Layout><VmoLatamDashboard /></Layout>} />
          <Route path="/vmo-latam/multi-moeda-cambio" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Multi-moeda & Câmbio</h1><p className="text-muted-foreground mt-2">Análise de variações cambiais e orçamentos em moedas diferentes</p></div></Layout>} />
          <Route path="/vmo-latam/simulacao-cenarios" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Simulação de Cenários</h1><p className="text-muted-foreground mt-2">Tela para simulação orçamentária ('what-if') com ajustes e impacto</p></div></Layout>} />
          <Route path="/vmo-latam/comparativo-valor" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Comparativo de Valor</h1><p className="text-muted-foreground mt-2">Painel comparativo de ROI, valor agregado e performance por região/área</p></div></Layout>} />
          <Route path="/vmo-latam/governanca-auditoria" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Governança & Auditoria</h1><p className="text-muted-foreground mt-2">Logs, registros de decisões, justificativas e exportação para compliance</p></div></Layout>} />
          <Route path="/vmo-latam/clusters-estrategicos" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Clusters Estratégicos</h1><p className="text-muted-foreground mt-2">Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)</p></div></Layout>} />
          
          {/* 404 Route - With Sidebar */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
