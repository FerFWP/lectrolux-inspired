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
import DynamicReportsGenerator from "./pages/DynamicReportsGenerator";
import AdvancedSearch from "./pages/AdvancedSearch";
import ActionSuggestions from "./pages/ActionSuggestions";
import UserAdministration from "./pages/UserAdministration";
import VmoLatamDashboard from "./pages/VmoLatamDashboard";
import VmoLatamMultiMoeda from "./pages/VmoLatamMultiMoeda";
import VmoLatamSimulacao from "./pages/VmoLatamSimulacao";
import VmoLatamComparativo from "./pages/VmoLatamComparativo";
import VmoLatamGovernanca from "./pages/VmoLatamGovernanca";
import AssistenteDePerguntas from "./pages/AssistenteDePerguntas";
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
          <Route path="/vmo-latam/multi-moeda-cambio" element={<Layout><VmoLatamMultiMoeda /></Layout>} />
          <Route path="/vmo-latam/simulacao-cenarios" element={<Layout><VmoLatamSimulacao /></Layout>} />
          <Route path="/vmo-latam/comparativo-valor" element={<Layout><VmoLatamComparativo /></Layout>} />
          <Route path="/vmo-latam/governanca-auditoria" element={<Layout><VmoLatamGovernanca /></Layout>} />
          <Route path="/vmo-latam/clusters-estrategicos" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Clusters Estratégicos</h1><p className="text-muted-foreground mt-2">Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)</p></div></Layout>} />
          
          {/* Inteligência Routes - With Sidebar */}
          <Route path="/inteligencia/assistente" element={<Layout><AssistenteDePerguntas /></Layout>} />
          <Route path="/inteligencia/relatorios-dinamicos" element={<Layout><DynamicReportsGenerator /></Layout>} />
          <Route path="/relatorios-avancados" element={<Layout><PortfolioDynamicReports /></Layout>} />
          <Route path="/inteligencia/explicacoes" element={<Layout><div className="p-6"><h1 className="text-2xl font-bold">Explicações de Indicadores</h1><p className="text-muted-foreground mt-2">Solicite explicação de métricas, cálculos ou gráficos</p></div></Layout>} />
          <Route path="/inteligencia/pesquisa-avancada" element={<Layout><AdvancedSearch /></Layout>} />
          <Route path="/inteligencia/sugestoes" element={<Layout><ActionSuggestions /></Layout>} />
          
          {/* 404 Route - With Sidebar */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
