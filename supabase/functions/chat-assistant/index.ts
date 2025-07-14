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

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user context from request headers
    const authHeader = req.headers.get('authorization');
    let userId = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data } = await supabase.auth.getUser(token);
        userId = data.user?.id;
        console.log('User ID from token:', userId);
      } catch (error) {
        console.error('Error getting user from token:', error);
      }
    }

    // Get relevant data based on the question
    let contextData = '';
    
    try {
      // Get projects data
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId || '')
        .limit(50);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
      } else {
        console.log('Found projects:', projects?.length || 0);
      }

      // Get transactions data
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId || '')
        .limit(100);

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
      } else {
        console.log('Found transactions:', transactions?.length || 0);
      }

      // Get baselines data
      const { data: baselines, error: baselinesError } = await supabase
        .from('baselines')
        .select('*')
        .eq('user_id', userId || '')
        .limit(50);

      if (baselinesError) {
        console.error('Error fetching baselines:', baselinesError);
      } else {
        console.log('Found baselines:', baselines?.length || 0);
      }

      // Build context data
      if (projects && projects.length > 0) {
        contextData += `\n\nDADOS DOS PROJETOS ATUAIS:\n${JSON.stringify(projects, null, 2)}`;
      }
      
      if (transactions && transactions.length > 0) {
        contextData += `\n\nTRANSAÇÕES RECENTES:\n${JSON.stringify(transactions, null, 2)}`;
      }
      
      if (baselines && baselines.length > 0) {
        contextData += `\n\nBASELINES DOS PROJETOS:\n${JSON.stringify(baselines, null, 2)}`;
      }

      if (contextData) {
        contextData = `\n\nCONTEXTO DOS DADOS DISPONÍVEIS:${contextData}`;
      }
      
    } catch (dataError) {
      console.error('Error fetching context data:', dataError);
      contextData = '\n\nNota: Não foi possível acessar os dados do usuário no momento.';
    }

    const systemPrompt = `Você é um assistente especializado em gestão de projetos e portfólio para um sistema VMO (Value Management Office) corporativo.

Contexto do sistema:
- Gerencia projetos CAPEX e OPEX
- Trabalha com indicadores financeiros como ROI, EVA, NPV, Payback, BU (Business Unit)
- Controla baselines, realizados, desvios e aprovações
- Integra com SAP para dados financeiros
- Atende unidades no Brasil (Curitiba, São Carlos, Manaus), Argentina (Rosário) e Chile (Santiago)
- Usa metodologias de PMO e governança corporativa

DADOS DISPONÍVEIS:
- Projetos: id, name, project_code, area, leader, status, budget, realized, committed, progress, currency, start_date, deadline, is_critical
- Transações: amount, category, description, transaction_date, transaction_type, project_id
- Baselines: version, budget, description, project_id

Diretrizes para suas respostas:
1. SEMPRE use os dados reais fornecidos no contexto quando disponíveis
2. Seja específico com números, datas e valores dos dados reais
3. Identifique projetos pelo nome e código quando mencioná-los
4. Calcule métricas e indicadores usando os dados fornecidos
5. Seja prático e objetivo
6. Use linguagem técnica apropriada mas acessível
7. Inclua exemplos baseados nos dados reais quando relevante
8. Sugira próximos passos quando aplicável
9. Se não houver dados suficientes, seja claro sobre as limitações
10. Mantenha foco no contexto de gestão de projetos e portfólio

Quando analisar dados:
- Calcule desvios: (Realizado - Orçado) / Orçado * 100
- Identifique projetos críticos por status ou flag is_critical
- Agrupe por área, líder ou unidade quando relevante
- Compare realizados vs. budget vs. committed
- Analise tendências temporais quando datas estão disponíveis

Responda sempre em português brasileiro e de forma profissional.${contextData}`;

    const userMessage = question;

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
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
      question: question
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