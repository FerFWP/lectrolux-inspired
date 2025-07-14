// Base de dados simulados para telas de inteligência
export const mockProjects = [
  {
    id: "1",
    name: "Modernização Linha Produção Curitiba",
    project_code: "MOD-CWB-2024-001",
    area: "Produção",
    leader: "Ana Silva",
    status: "Em Andamento",
    budget: 2500000,
    realized: 1875000,
    committed: 2200000,
    progress: 75,
    country: "Brasil",
    unit: "Curitiba",
    currency: "BRL",
    baseline_version: "v2.1",
    deadline: "2024-12-31",
    roi: 18.5,
    npv: 1200000,
    payback: 2.8,
    bu: 88.0,
    cpi: 0.85,
    spi: 0.92,
    deviation: 12.3,
    risk_level: "Alto",
    category: "Capex",
    is_critical: true
  },
  {
    id: "2",
    name: "Implementação ERP Rosário",
    project_code: "ERP-ROS-2024-002",
    area: "TI",
    leader: "Carlos Rodriguez",
    status: "Planejado",
    budget: 850000,
    realized: 125000,
    committed: 680000,
    progress: 15,
    country: "Argentina",
    unit: "Rosário",
    currency: "USD",
    baseline_version: "v1.0",
    deadline: "2025-06-30",
    roi: 22.1,
    npv: 450000,
    payback: 3.2,
    bu: 80.0,
    cpi: 1.05,
    spi: 0.88,
    deviation: -5.2,
    risk_level: "Médio",
    category: "Opex",
    is_critical: false
  },
  {
    id: "3",
    name: "Expansão Capacidade México",
    project_code: "EXP-MEX-2024-003",
    area: "Engenharia",
    leader: "Maria González",
    status: "Em Andamento",
    budget: 4200000,
    realized: 3150000,
    committed: 3990000,
    progress: 85,
    country: "México",
    unit: "Guadalajara",
    currency: "USD",
    baseline_version: "v3.0",
    deadline: "2024-10-15",
    roi: 15.8,
    npv: 2100000,
    payback: 4.1,
    bu: 95.0,
    cpi: 0.79,
    spi: 1.02,
    deviation: 21.1,
    risk_level: "Crítico",
    category: "Capex",
    is_critical: true
  },
  {
    id: "4",
    name: "Treinamento Segurança Chile",
    project_code: "TRE-CHI-2024-004",
    area: "RH",
    leader: "Pedro Morales",
    status: "Concluído",
    budget: 180000,
    realized: 165000,
    committed: 180000,
    progress: 100,
    country: "Chile",
    unit: "Santiago",
    currency: "USD",
    baseline_version: "v1.2",
    deadline: "2024-08-31",
    roi: 8.5,
    npv: 95000,
    payback: 1.8,
    bu: 91.7,
    cpi: 1.09,
    spi: 1.05,
    deviation: -8.3,
    risk_level: "Baixo",
    category: "Opex",
    is_critical: false
  },
  {
    id: "5",
    name: "Sustentabilidade Energia Verde",
    project_code: "SUS-LAT-2024-005",
    area: "ESG",
    leader: "Juliana Santos",
    status: "Em Andamento",
    budget: 1800000,
    realized: 720000,
    committed: 1440000,
    progress: 40,
    country: "Regional",
    unit: "Multi-país",
    currency: "USD",
    baseline_version: "v2.0",
    deadline: "2025-12-31",
    roi: 25.3,
    npv: 980000,
    payback: 2.1,
    bu: 80.0,
    cpi: 1.12,
    spi: 0.95,
    deviation: -4.5,
    risk_level: "Baixo",
    category: "Capex",
    is_critical: false
  }
];

export const mockTransactions = [
  {
    id: "t1",
    project_id: "1",
    description: "Aquisição equipamentos industriais",
    amount: 875000,
    category: "Equipamentos",
    transaction_date: "2024-07-10",
    status: "Aprovado",
    type: "Capex"
  },
  {
    id: "t2",
    project_id: "1",
    description: "Consultoria especializada",
    amount: 245000,
    category: "Serviços",
    transaction_date: "2024-07-05",
    status: "Pendente",
    type: "Opex"
  },
  {
    id: "t3",
    project_id: "2",
    description: "Licenças software ERP",
    amount: 320000,
    category: "Software",
    transaction_date: "2024-07-12",
    status: "Aprovado",
    type: "Capex"
  },
  {
    id: "t4",
    project_id: "3",
    description: "Construção civil",
    amount: 1200000,
    category: "Infraestrutura",
    transaction_date: "2024-07-08",
    status: "Em Execução",
    type: "Capex"
  },
  {
    id: "t5",
    project_id: "5",
    description: "Painéis solares",
    amount: 680000,
    category: "Energia",
    transaction_date: "2024-07-15",
    status: "Aprovado",
    type: "Capex"
  }
];

export const mockBaselines = [
  {
    id: "b1",
    project_id: "1",
    version: "v2.1",
    budget: 2500000,
    description: "Revisão após aprovação adicional de recursos",
    created_at: "2024-06-15"
  },
  {
    id: "b2",
    project_id: "2",
    version: "v1.0",
    budget: 850000,
    description: "Baseline inicial aprovada",
    created_at: "2024-05-20"
  },
  {
    id: "b3",
    project_id: "3",
    version: "v3.0",
    budget: 4200000,
    description: "Terceira revisão por mudanças de escopo",
    created_at: "2024-07-01"
  }
];

export const mockDocuments = [
  {
    id: "d1",
    title: "Ata Reunião Comitê Executivo - Julho 2024",
    type: "Ata",
    project_id: "1",
    content: "Discutido status do projeto Modernização Curitiba. Aprovado aumento de budget para R$ 2.5M. Identificado risco de atraso por fornecedor.",
    created_at: "2024-07-15",
    tags: ["comitê", "budget", "risco", "curitiba"]
  },
  {
    id: "d2",
    title: "Relatório Mensal Projetos TI - Junho 2024",
    type: "Relatório",
    project_id: "2",
    content: "Projeto ERP Rosário em fase de planejamento. Definida arquitetura técnica. Previsto início desenvolvimento em agosto.",
    created_at: "2024-06-30",
    tags: ["ti", "erp", "rosário", "planejamento"]
  },
  {
    id: "d3",
    title: "Análise de Risco Expansão México",
    type: "Análise",
    project_id: "3",
    content: "Identificados riscos cambiais e regulatórios. Recomendado hedge cambial para 70% do orçamento. Impacto potencial no prazo.",
    created_at: "2024-07-10",
    tags: ["risco", "méxico", "câmbio", "regulatório"]
  },
  {
    id: "d4",
    title: "Manual Indicadores Financeiros",
    type: "Manual",
    project_id: null,
    content: "CPI: Cost Performance Index = EV/AC. Valores <1 indicam sobre-orçamento. BU: Budget Utilization = Gasto/Orçamento * 100.",
    created_at: "2024-05-01",
    tags: ["indicadores", "cpi", "bu", "manual"]
  }
];

export const mockCurrencyRates = [
  {
    currency: "USD",
    rate: 5.45,
    date: "2024-07-15"
  },
  {
    currency: "ARS",
    rate: 0.0058,
    date: "2024-07-15"
  },
  {
    currency: "MXN",
    rate: 0.30,
    date: "2024-07-15"
  },
  {
    currency: "CLP",
    rate: 0.0061,
    date: "2024-07-15"
  }
];

export const mockActionSuggestions = [
  {
    id: "a1",
    title: "Revisar projetos com saldo <5% do budget",
    description: "Projeto Treinamento Segurança Chile tem apenas 3.3% de saldo restante",
    priority: "Médio",
    category: "Orçamento",
    projects: ["4"],
    action: "Verificar se há necessidade de aditivo orçamentário"
  },
  {
    id: "a2",
    title: "Verificar concentração de risco em TI Curitiba",
    description: "Alto volume de projetos TI concentrados na unidade Curitiba",
    priority: "Alto",
    category: "Risco",
    projects: ["1", "2"],
    action: "Considerar redistribuição de recursos ou reforço de equipe"
  },
  {
    id: "a3",
    title: "Reavaliar baseline de Rosário",
    description: "Projeto ERP Rosário sem revisão de baseline há 2 meses",
    priority: "Baixo",
    category: "Planejamento",
    projects: ["2"],
    action: "Agendar revisão de baseline com stakeholders"
  },
  {
    id: "a4",
    title: "Monitorar desvio crítico no México",
    description: "Expansão México com desvio de 21.1% acima do planejado",
    priority: "Crítico",
    category: "Performance",
    projects: ["3"],
    action: "Implementar plano de recuperação imediato"
  }
];

export const mockMetrics = {
  totalProjects: 5,
  totalBudget: 9530000,
  totalRealized: 6035000,
  avgROI: 18.04,
  avgBU: 86.94,
  criticalProjects: 2,
  onTimeProjects: 3,
  overBudgetProjects: 2
};

// Função para buscar dados simulados
export const getMockData = () => ({
  projects: mockProjects,
  transactions: mockTransactions,
  baselines: mockBaselines,
  documents: mockDocuments,
  currencyRates: mockCurrencyRates,
  actionSuggestions: mockActionSuggestions,
  metrics: mockMetrics
});

// Função para simular busca RAG
export const simulateRAGSearch = (query: string) => {
  const results = mockDocuments.filter(doc => 
    doc.content.toLowerCase().includes(query.toLowerCase()) ||
    doc.title.toLowerCase().includes(query.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  return results.map(doc => ({
    ...doc,
    relevance: Math.random() * 0.5 + 0.5, // 50-100% relevance
    highlight: doc.content.substring(0, 200) + "..."
  }));
};

// Função para filtrar projetos por critérios
export const filterProjects = (criteria: any) => {
  return mockProjects.filter(project => {
    if (criteria.deviation && project.deviation < criteria.deviation) return false;
    if (criteria.area && project.area !== criteria.area) return false;
    if (criteria.status && project.status !== criteria.status) return false;
    if (criteria.country && project.country !== criteria.country) return false;
    if (criteria.riskLevel && project.risk_level !== criteria.riskLevel) return false;
    return true;
  });
};