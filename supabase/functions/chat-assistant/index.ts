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

    const { question } = await req.json();

    if (!question) {
      throw new Error('Question is required');
    }

    console.log('Processing question:', question);

    // Create Supabase client to fetch project data
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

    // Prepare project context data
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
      critico: p.is_critical,
      moeda: p.currency
    })) : [];

    const transactionsContext = transactions ? transactions.map(t => ({
      valor: t.amount,
      categoria: t.category,
      descricao: t.description,
      tipo: t.transaction_type,
      data: t.transaction_date
    })) : [];

    const baselinesContext = baselines ? baselines.map(b => ({
      versao: b.version,
      orcamento: b.budget,
      descricao: b.description
    })) : [];

    const contextData = `
DADOS ATUAIS DO PORTFÓLIO:

PROJETOS (${projectsContext.length} projetos):
${JSON.stringify(projectsContext, null, 2)}

TRANSAÇÕES RECENTES (${transactionsContext.length} transações):
${JSON.stringify(transactionsContext, null, 2)}

BASELINES (${baselinesContext.length} baselines):
${JSON.stringify(baselinesContext, null, 2)}
    `;

    const systemPrompt = `Você é um assistente especializado em gestão de projetos e portfólio para um sistema VMO (Value Management Office) corporativo.

Contexto do sistema:
- Gerencia projetos CAPEX e OPEX
- Trabalha com indicadores financeiros como ROI, EVA, NPV, Payback, BU (Business Unit)
- Controla baselines, realizados, desvios e aprovações
- Integra com SAP para dados financeiros
- Atende unidades no Brasil (Curitiba, São Carlos, Manaus), Argentina (Rosário) e Chile (Santiago)
- Usa metodologias de PMO e governança corporativa

${contextData}

Diretrizes para suas respostas:
1. SEMPRE use os dados reais do portfólio quando disponíveis para responder perguntas específicas
2. Seja prático e objetivo
3. Use linguagem técnica apropriada mas acessível
4. Inclua exemplos com dados reais quando relevante
5. Sugira próximos passos quando aplicável
6. Mantenha foco no contexto de gestão de projetos e portfólio
7. Forneça orientações baseadas nas melhores práticas de VMO
8. Se precisar de informações externas (tendências de mercado, benchmarks, regulamentações), indique que pode buscar essas informações

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