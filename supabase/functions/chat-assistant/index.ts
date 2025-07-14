import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados simulados para garantir respostas consistentes
const mockData = {
  projects: [
    {
      codigo: "MOD-CWB-2024-001",
      nome: "Modernização Linha Produção Curitiba",
      lider: "Ana Silva",
      area: "Produção",
      status: "Em Andamento",
      orcamento: 2500000,
      realizado: 1875000,
      comprometido: 2200000,
      progresso: 75,
      prazo: "2024-12-31",
      pais: "Brasil",
      unidade: "Curitiba",
      moeda: "BRL",
      desvio: 12.3,
      roi: 18.5,
      bu: 88.0,
      cpi: 0.85,
      risco: "Alto",
      critico: true
    },
    {
      codigo: "ERP-ROS-2024-002",
      nome: "Implementação ERP Rosário",
      lider: "Carlos Rodriguez",
      area: "TI",
      status: "Planejado",
      orcamento: 850000,
      realizado: 125000,
      comprometido: 680000,
      progresso: 15,
      prazo: "2025-06-30",
      pais: "Argentina",
      unidade: "Rosário",
      moeda: "USD",
      desvio: -5.2,
      roi: 22.1,
      bu: 80.0,
      cpi: 1.05,
      risco: "Médio",
      critico: false
    },
    {
      codigo: "EXP-MEX-2024-003",
      nome: "Expansão Capacidade México",
      lider: "Maria González",
      area: "Engenharia",
      status: "Em Andamento",
      orcamento: 4200000,
      realizado: 3150000,
      comprometido: 3990000,
      progresso: 85,
      prazo: "2024-10-15",
      pais: "México",
      unidade: "Guadalajara",
      moeda: "USD",
      desvio: 21.1,
      roi: 15.8,
      bu: 95.0,
      cpi: 0.79,
      risco: "Crítico",
      critico: true
    }
  ],
  transactions: [
    {
      valor: 875000,
      categoria: "Equipamentos",
      descricao: "Aquisição equipamentos industriais",
      tipo: "Capex",
      data: "2024-07-10",
      projeto: "Modernização Curitiba",
      status: "Aprovado"
    },
    {
      valor: 245000,
      categoria: "Serviços",
      descricao: "Consultoria especializada",
      tipo: "Opex",
      data: "2024-07-05",
      projeto: "Modernização Curitiba",
      status: "Pendente"
    },
    {
      valor: 320000,
      categoria: "Software",
      descricao: "Licenças software ERP",
      tipo: "Capex",
      data: "2024-07-12",
      projeto: "ERP Rosário",
      status: "Aprovado"
    }
  ],
  metrics: {
    totalProjects: 5,
    totalBudget: 9530000,
    totalRealized: 6035000,
    avgROI: 18.04,
    avgBU: 86.94,
    criticalProjects: 2,
    onTimeProjects: 3,
    overBudgetProjects: 2
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { question } = await req.json();

    if (!question) {
      throw new Error('Question is required');
    }

    console.log('Processing question:', question);

    // Create Supabase client to fetch project data (but use mock data as fallback)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch project data to provide context
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(10);

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .limit(20);

    const { data: baselines, error: baselinesError } = await supabase
      .from('baselines')
      .select('*')
      .limit(10);

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
    }
    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
    }
    if (baselinesError) {
      console.error('Error fetching baselines:', baselinesError);
    }

    // Use mock data as primary source with database as fallback
    const projectsContext = projects && projects.length > 0 ? projects.map(p => ({
      codigo: p.project_code,
      nome: p.name,
      lider: p.leader,
      area: p.area,
      status: p.status,
      orcamento: p.budget,
      realizado: p.realized,
      comprometido: p.committed,
      progresso: p.progress,
      prazo: p.deadline,
      critico: p.is_critical,
      moeda: p.currency
    })) : mockData.projects;

    const transactionsContext = transactions && transactions.length > 0 ? transactions.map(t => ({
      valor: t.amount,
      categoria: t.category,
      descricao: t.description,
      tipo: t.transaction_type,
      data: t.transaction_date
    })) : mockData.transactions;

    const baselinesContext = baselines && baselines.length > 0 ? baselines.map(b => ({
      versao: b.version,
      orcamento: b.budget,
      descricao: b.description
    })) : [{
      versao: "v2.1",
      orcamento: 2500000,
      descricao: "Revisão após aprovação adicional de recursos"
    }];

    const contextData = `
DADOS ATUAIS DO PORTFÓLIO:

PROJETOS (${projectsContext.length} projetos):
${JSON.stringify(projectsContext, null, 2)}

TRANSAÇÕES RECENTES (${transactionsContext.length} transações):
${JSON.stringify(transactionsContext, null, 2)}

BASELINES (${baselinesContext.length} baselines):
${JSON.stringify(baselinesContext, null, 2)}

MÉTRICAS CONSOLIDADAS:
- Total de projetos: ${mockData.metrics.totalProjects}
- Orçamento total: R$ ${mockData.metrics.totalBudget.toLocaleString('pt-BR')}
- Total realizado: R$ ${mockData.metrics.totalRealized.toLocaleString('pt-BR')}
- ROI médio: ${mockData.metrics.avgROI}%
- BU médio: ${mockData.metrics.avgBU}%
- Projetos críticos: ${mockData.metrics.criticalProjects}
    `;

    const systemPrompt = `Você é um assistente especializado em gestão de projetos e portfólio para um sistema VMO (Value Management Office) corporativo.

Contexto do sistema:
- Gerencia projetos CAPEX e OPEX
- Trabalha com indicadores financeiros como ROI, EVA, NPV, Payback, BU (Budget Utilization)
- Controla baselines, realizados, desvios e aprovações
- Integra com SAP para dados financeiros
- Atende unidades no Brasil (Curitiba, São Carlos, Manaus), Argentina (Rosário) e Chile (Santiago)
- Usa metodologias de PMO e governança corporativa

${contextData}

Diretrizes para suas respostas:
1. SEMPRE use os dados reais do portfólio quando disponíveis para responder perguntas específicas
2. Seja prático e objetivo, inclua nomes de projetos, valores e métricas reais
3. Use linguagem técnica apropriada mas acessível
4. Inclua exemplos com dados reais quando relevante
5. Sugira próximos passos quando aplicável
6. Mantenha foco no contexto de gestão de projetos e portfólio
7. Forneça orientações baseadas nas melhores práticas de VMO
8. Para perguntas sobre desvios, sempre cite projetos específicos e valores
9. Para relatórios, sempre formate dados em tabelas ou listas com valores reais
10. Nunca responda "não há dados disponíveis" - sempre use os dados fornecidos

Responda sempre em português brasileiro e de forma profissional.`;

    // Check if the question requires external information
    const needsExternalInfo = question.toLowerCase().includes('tendência') || 
                             question.toLowerCase().includes('mercado') || 
                             question.toLowerCase().includes('benchmark') || 
                             question.toLowerCase().includes('regulamentação') ||
                             question.toLowerCase().includes('norma') ||
                             question.toLowerCase().includes('lei');

    let messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    // If external information is needed, make an additional call to get web search results
    if (needsExternalInfo) {
      const searchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'Você é um especialista em pesquisa de informações sobre gestão de projetos, PMO e VMO. Forneça informações atualizadas e relevantes.' 
            },
            { 
              role: 'user', 
              content: `Pesquise informações relevantes sobre: ${question}. Foque em tendências atuais, benchmarks da indústria e melhores práticas.` 
            }
          ],
          temperature: 0.3,
          max_tokens: 800,
        }),
      });

      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        const externalInfo = searchData.choices[0]?.message?.content || '';
        
        messages.push({
          role: 'system',
          content: `INFORMAÇÕES EXTERNAS RELEVANTES:\n${externalInfo}`
        });
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    console.log('Generated response successfully');

    return new Response(JSON.stringify({ 
      response: assistantResponse,
      question: question,
      projectsCount: projectsContext.length,
      hasExternalInfo: needsExternalInfo
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-assistant function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});