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

// Dados simulados para relatórios dinâmicos
const mockData = {
  projects: [
    {
      codigo: "MOD-CWB-2024-001",
      nome: "Modernização Linha Produção Curitiba",
      descricao: "Modernização completa da linha de produção",
      lider: "Ana Silva",
      area: "Produção",
      status: "Em Andamento",
      orcamento: 2500000,
      realizado: 1875000,
      comprometido: 2200000,
      progresso: 75,
      prazo: "2024-12-31",
      inicio: "2024-01-15",
      critico: true,
      moeda: "BRL",
      pais: "Brasil",
      unidade: "Curitiba",
      desvio: 12.3,
      roi: 18.5,
      bu: 88.0,
      cpi: 0.85,
      categoria: "Capex"
    },
    {
      codigo: "ERP-ROS-2024-002",
      nome: "Implementação ERP Rosário",
      descricao: "Implementação sistema ERP integrado",
      lider: "Carlos Rodriguez",
      area: "TI",
      status: "Planejado",
      orcamento: 850000,
      realizado: 125000,
      comprometido: 680000,
      progresso: 15,
      prazo: "2025-06-30",
      inicio: "2024-08-01",
      critico: false,
      moeda: "USD",
      pais: "Argentina",
      unidade: "Rosário",
      desvio: -5.2,
      roi: 22.1,
      bu: 80.0,
      cpi: 1.05,
      categoria: "Opex"
    },
    {
      codigo: "EXP-MEX-2024-003",
      nome: "Expansão Capacidade México",
      descricao: "Expansão da capacidade produtiva",
      lider: "Maria González",
      area: "Engenharia",
      status: "Em Andamento",
      orcamento: 4200000,
      realizado: 3150000,
      comprometido: 3990000,
      progresso: 85,
      prazo: "2024-10-15",
      inicio: "2023-10-01",
      critico: true,
      moeda: "USD",
      pais: "México",
      unidade: "Guadalajara",
      desvio: 21.1,
      roi: 15.8,
      bu: 95.0,
      cpi: 0.79,
      categoria: "Capex"
    }
  ],
  transactions: [
    {
      valor: 875000,
      categoria: "Equipamentos",
      descricao: "Aquisição equipamentos industriais",
      tipo: "Capex",
      data: "2024-07-10",
      projeto_id: "MOD-CWB-2024-001",
      status: "Aprovado"
    },
    {
      valor: 245000,
      categoria: "Serviços",
      descricao: "Consultoria especializada",
      tipo: "Opex",
      data: "2024-07-05",
      projeto_id: "MOD-CWB-2024-001",
      status: "Pendente"
    },
    {
      valor: 320000,
      categoria: "Software",
      descricao: "Licenças software ERP",
      tipo: "Capex",
      data: "2024-07-12",
      projeto_id: "ERP-ROS-2024-002",
      status: "Aprovado"
    },
    {
      valor: 1200000,
      categoria: "Infraestrutura",
      descricao: "Construção civil",
      tipo: "Capex",
      data: "2024-07-08",
      projeto_id: "EXP-MEX-2024-003",
      status: "Em Execução"
    }
  ]
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

    const { prompt } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    console.log('Processing dynamic report request:', prompt);

    // Create Supabase client to fetch project data
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch comprehensive project data
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');

    const { data: baselines, error: baselinesError } = await supabase
      .from('baselines')
      .select('*');

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
      descricao: p.description,
      lider: p.leader,
      area: p.area,
      status: p.status,
      orcamento: p.budget,
      realizado: p.realized,
      comprometido: p.committed,
      progresso: p.progress,
      prazo: p.deadline,
      inicio: p.start_date,
      critico: p.is_critical,
      moeda: p.currency,
      criado_em: p.created_at,
      atualizado_em: p.updated_at
    })) : mockData.projects;

    const transactionsContext = transactions && transactions.length > 0 ? transactions.map(t => ({
      valor: t.amount,
      categoria: t.category,
      descricao: t.description,
      tipo: t.transaction_type,
      data: t.transaction_date,
      projeto_id: t.project_id,
      criado_em: t.created_at
    })) : mockData.transactions;

    const baselinesContext = baselines && baselines.length > 0 ? baselines.map(b => ({
      versao: b.version,
      orcamento: b.budget,
      descricao: b.description,
      projeto_id: b.project_id,
      criado_em: b.created_at
    })) : [
      {
        versao: "v2.1",
        orcamento: 2500000,
        descricao: "Revisão após aprovação adicional de recursos",
        projeto_id: "MOD-CWB-2024-001",
        criado_em: "2024-06-15"
      },
      {
        versao: "v1.0",
        orcamento: 850000,
        descricao: "Baseline inicial aprovada",
        projeto_id: "ERP-ROS-2024-002",
        criado_em: "2024-05-20"
      }
    ];

    const contextData = `
DADOS COMPLETOS DO PORTFÓLIO:

PROJETOS (${projectsContext.length} projetos):
${JSON.stringify(projectsContext, null, 2)}

TRANSAÇÕES (${transactionsContext.length} transações):
${JSON.stringify(transactionsContext, null, 2)}

BASELINES (${baselinesContext.length} baselines):
${JSON.stringify(baselinesContext, null, 2)}
    `;

    const systemPrompt = `Você é um analista especializado em gestão de projetos e portfólio para um sistema VMO (Value Management Office).

CONTEXTO DOS DADOS:
${contextData}

INSTRUÇÕES PARA GERAÇÃO DE RELATÓRIOS:

1. ANÁLISE DO PROMPT:
   - Identifique que tipo de relatório é solicitado (tabela, gráfico, resumo, análise)
   - Determine as métricas e dimensões relevantes
   - Identifique filtros implícitos (período, área, status, etc.)

2. PROCESSAMENTO DOS DADOS:
   - Use APENAS os dados fornecidos no contexto
   - Calcule métricas derivadas quando necessário (desvios, percentuais, médias)
   - Aplique filtros conforme solicitado no prompt

3. FORMATO DE RESPOSTA:
   Retorne um JSON no seguinte formato:

   Para TABELAS:
   {
     "type": "table",
     "title": "Título do Relatório",
     "data": {
       "headers": ["Coluna 1", "Coluna 2", ...],
       "rows": [["valor1", "valor2", ...], ...]
     },
     "insights": "Principais insights encontrados",
     "summary": "Resumo executivo dos dados"
   }

   Para RESUMOS/ANÁLISES:
   {
     "type": "summary",
     "title": "Título da Análise",
     "content": "<p>HTML formatado com a análise completa</p>",
     "metrics": [
       {
         "label": "Nome da Métrica",
         "value": "Valor",
         "icon": "trending-up|dollar-sign|clock|target"
       }
     ],
     "insights": "Principais insights"
   }

4. DIRETRIZES ESPECÍFICAS:
   - Use linguagem técnica mas acessível
   - Inclua cálculos de desvios, percentuais e variações
   - Identifique projetos críticos, em atraso ou com problemas
   - Forneça insights acionáveis
   - Formate valores monetários em R$ quando aplicável
   - Use datas no formato brasileiro (DD/MM/AAAA)
   - Calcule métricas como ROI, taxa de execução, variação orçamentária

5. MÉTRICAS COMUNS:
   - Desvio orçamentário: (realizado - orçado) / orçado * 100
   - Taxa de execução: realizado / orçado * 100
   - Projetos em atraso: status = "Em Atraso"
   - Projetos críticos: is_critical = true
   - Distribuição por área, categoria, líder

Responda APENAS com o JSON válido, sem texto adicional.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '';

    console.log('AI Response:', aiResponse);

    // Parse the JSON response from AI
    let reportData;
    try {
      reportData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback to a simple summary if parsing fails
      reportData = {
        type: 'summary',
        title: 'Análise Solicitada',
        content: `<p>${aiResponse}</p>`,
        insights: 'Relatório gerado com base na análise dos dados disponíveis.'
      };
    }

    console.log('Generated report data:', reportData);

    return new Response(JSON.stringify(reportData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-dynamic-report function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      type: 'error',
      title: 'Erro na Geração do Relatório',
      content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente em alguns instantes.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});