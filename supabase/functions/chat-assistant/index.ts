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

    const systemPrompt = `Você é um assistente especializado em gestão de projetos e portfólio para um sistema VMO (Value Management Office) corporativo.

Contexto do sistema:
- Gerencia projetos CAPEX e OPEX
- Trabalha com indicadores financeiros como ROI, EVA, NPV, Payback, BU (Business Unit)
- Controla baselines, realizados, desvios e aprovações
- Integra com SAP para dados financeiros
- Atende unidades no Brasil (Curitiba, São Carlos, Manaus), Argentina (Rosário) e Chile (Santiago)
- Usa metodologias de PMO e governança corporativa

Diretrizes para suas respostas:
1. Seja prático e objetivo
2. Use linguagem técnica apropriada mas acessível
3. Inclua exemplos quando relevante
4. Sugira próximos passos quando aplicável
5. Mantenha foco no contexto de gestão de projetos e portfólio
6. Forneça orientações baseadas nas melhores práticas de VMO
7. Use dados simulados quando necessário para ilustrar exemplos

Responda sempre em português brasileiro e de forma profissional.`;

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