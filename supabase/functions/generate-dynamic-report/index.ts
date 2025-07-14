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

    // Prepare comprehensive data context
    const projectsContext = projects ? projects.map(p => ({
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
    })) : [];

    const transactionsContext = transactions ? transactions.map(t => ({
      valor: t.amount,
      categoria: t.category,
      descricao: t.description,
      tipo: t.transaction_type,
      data: t.transaction_date,
      projeto_id: t.project_id,
      criado_em: t.created_at
    })) : [];

    const baselinesContext = baselines ? baselines.map(b => ({
      versao: b.version,
      orcamento: b.budget,
      descricao: b.description,
      projeto_id: b.project_id,
      criado_em: b.created_at
    })) : [];

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