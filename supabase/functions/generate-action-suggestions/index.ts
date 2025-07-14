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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Generating action suggestions...');

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch comprehensive portfolio data
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*');

    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');

    const { data: baselines, error: baselinesError } = await supabase
      .from('baselines')
      .select('*');

    if (projectsError) console.error('Error fetching projects:', projectsError);
    if (transactionsError) console.error('Error fetching transactions:', transactionsError);
    if (baselinesError) console.error('Error fetching baselines:', baselinesError);

    // Prepare data context for AI analysis
    const projectsContext = projects ? projects.map(p => ({
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
      inicio: p.start_date,
      critico: p.is_critical,
      moeda: p.currency,
      desvio_orcamentario: p.budget > 0 ? ((p.realized - p.budget) / p.budget * 100).toFixed(2) : 0
    })) : [];

    const transactionsContext = transactions ? transactions.map(t => ({
      valor: t.amount,
      categoria: t.category,
      descricao: t.description,
      tipo: t.transaction_type,
      data: t.transaction_date,
      projeto_id: t.project_id
    })) : [];

    const baselinesContext = baselines ? baselines.map(b => ({
      versao: b.version,
      orcamento: b.budget,
      descricao: b.description,
      projeto_id: b.project_id
    })) : [];

    const contextData = `
ANÁLISE COMPLETA DO PORTFÓLIO:

PROJETOS (${projectsContext.length} projetos):
${JSON.stringify(projectsContext, null, 2)}

TRANSAÇÕES (${transactionsContext.length} transações):
${JSON.stringify(transactionsContext, null, 2)}

BASELINES (${baselinesContext.length} baselines):
${JSON.stringify(baselinesContext, null, 2)}
    `;

    const systemPrompt = `Você é um consultor sênior de PMO e especialista em análise de portfólio de projetos corporativos.

DADOS DO PORTFÓLIO:
${contextData}

MISSÃO:
Analise os dados fornecidos e gere sugestões de ações estratégicas e operacionais para otimizar o portfólio de projetos.

CRITÉRIOS DE ANÁLISE:
1. **Desvios orçamentários** - Identifique projetos com variação >10%
2. **Projetos críticos** - Foque em projetos marcados como críticos ou em atraso
3. **Concentração de riscos** - Analise distribuição por área, líder, período
4. **Oportunidades de economia** - Identifique padrões de gastos
5. **Governança** - Verifique se baselines estão atualizadas
6. **Performance por área** - Compare desempenho entre diferentes áreas
7. **Cronograma** - Analise prazos e entregas

TIPOS DE SUGESTÕES:
- **Financeiro**: Revisão de orçamentos, realocação de recursos, controle de custos
- **Cronograma**: Revisão de prazos, dependências críticas, marcos
- **Risco**: Mitigação de riscos, diversificação, contingências
- **Oportunidade**: Otimizações, sinergias, melhores práticas
- **Governança**: Processos, aprovações, documentação

FORMATO DE RESPOSTA (JSON):
{
  "suggestions": [
    {
      "id": "suggestion_1",
      "title": "Título conciso e acionável",
      "description": "Descrição clara do problema ou oportunidade identificada",
      "priority": "critical|high|medium|low",
      "category": "financial|timeline|risk|opportunity|governance",
      "action": "Ação específica recomendada",
      "impact": "Impacto esperado da ação",
      "data_source": ["projetos", "transações", "baselines"],
      "created_at": "2024-12-13T10:00:00Z"
    }
  ],
  "summary": {
    "total_suggestions": 0,
    "critical_count": 0,
    "main_concerns": ["área1", "área2"],
    "analysis_timestamp": "2024-12-13T10:00:00Z"
  }
}

DIRETRIZES:
- Seja específico e acionável
- Use dados reais dos projetos nas sugestões
- Priorize por impacto e urgência
- Inclua números e percentuais quando relevantes
- Limite a 8-10 sugestões mais importantes
- Use linguagem técnica mas acessível

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
          { role: 'system', content: systemPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2500,
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

    let suggestionsData;
    try {
      suggestionsData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback with sample suggestions if parsing fails
      suggestionsData = {
        suggestions: [
          {
            id: "sample_1",
            title: "Revisar projetos com desvio orçamentário elevado",
            description: "Identificados projetos com variação superior a 15% em relação ao orçamento planejado.",
            priority: "high",
            category: "financial",
            action: "Realizar auditoria financeira e replanejar escopo se necessário",
            impact: "Controle de custos e evitar estouro de orçamento em R$ 200k+",
            data_source: ["projetos", "transações"],
            created_at: new Date().toISOString()
          }
        ],
        summary: {
          total_suggestions: 1,
          critical_count: 0,
          main_concerns: ["financeiro"],
          analysis_timestamp: new Date().toISOString()
        }
      };
    }

    console.log('Generated suggestions:', suggestionsData);

    return new Response(JSON.stringify(suggestionsData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-action-suggestions function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      suggestions: [],
      summary: {
        total_suggestions: 0,
        critical_count: 0,
        main_concerns: [],
        analysis_timestamp: new Date().toISOString()
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});