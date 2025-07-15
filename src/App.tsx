import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
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
import ExplanationCenter from "./pages/ExplanationCenter";
import Gamificacao from "./pages/Gamificacao";
import UpdatesCenterPage from "./pages/UpdatesCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          {/* Public Routes - Without Sidebar */}
          <Route path="/" element={<Index />} />
          
          {/* Protected Routes - With Sidebar */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/projetos" element={<ProtectedRoute><Layout><ProjectsList /></Layout></ProtectedRoute>} />
          <Route path="/projetos/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
          <Route path="/relatorios-dinamicos" element={<ProtectedRoute><Layout><PortfolioDynamicReports /></Layout></ProtectedRoute>} />
          <Route path="/gamificacao" element={<ProtectedRoute><Layout><Gamificacao /></Layout></ProtectedRoute>} />
          <Route path="/administracao" element={<ProtectedRoute><Layout><UserAdministration /></Layout></ProtectedRoute>} />
          <Route path="/updates-center" element={<ProtectedRoute><Layout><UpdatesCenterPage /></Layout></ProtectedRoute>} />
          
          {/* VMO LATAM Routes - With Sidebar */}
          <Route path="/vmo-latam/dashboard-consolidado" element={<ProtectedRoute><Layout><VmoLatamDashboard /></Layout></ProtectedRoute>} />
          <Route path="/vmo-latam/multi-moeda-cambio" element={<ProtectedRoute><Layout><VmoLatamMultiMoeda /></Layout></ProtectedRoute>} />
          <Route path="/vmo-latam/simulacao-cenarios" element={<ProtectedRoute><Layout><VmoLatamSimulacao /></Layout></ProtectedRoute>} />
          <Route path="/vmo-latam/comparativo-valor" element={<ProtectedRoute><Layout><VmoLatamComparativo /></Layout></ProtectedRoute>} />
          <Route path="/vmo-latam/governanca-auditoria" element={<ProtectedRoute><Layout><VmoLatamGovernanca /></Layout></ProtectedRoute>} />
          <Route path="/vmo-latam/clusters-estrategicos" element={<ProtectedRoute><Layout><div className="p-6"><h1 className="text-2xl font-bold">Clusters Estratégicos</h1><p className="text-muted-foreground mt-2">Visualização e análise dos projetos por temas estratégicos (inovação, ESG, eficiência)</p></div></Layout></ProtectedRoute>} />
          
          {/* Inteligência Routes - With Sidebar */}
          <Route path="/inteligencia/assistente" element={<ProtectedRoute><Layout><AssistenteDePerguntas /></Layout></ProtectedRoute>} />
          <Route path="/inteligencia/relatorios-dinamicos" element={<ProtectedRoute><Layout><DynamicReportsGenerator /></Layout></ProtectedRoute>} />
          <Route path="/relatorios-avancados" element={<ProtectedRoute><Layout><PortfolioDynamicReports /></Layout></ProtectedRoute>} />
          <Route path="/inteligencia/explicacoes" element={<ProtectedRoute><Layout><ExplanationCenter /></Layout></ProtectedRoute>} />
          <Route path="/inteligencia/pesquisa-avancada" element={<ProtectedRoute><Layout><AdvancedSearch /></Layout></ProtectedRoute>} />
          <Route path="/inteligencia/sugestoes" element={<ProtectedRoute><Layout><ActionSuggestions /></Layout></ProtectedRoute>} />
          
          {/* 404 Route - With Sidebar */}
          <Route path="*" element={<ProtectedRoute><Layout><NotFound /></Layout></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
