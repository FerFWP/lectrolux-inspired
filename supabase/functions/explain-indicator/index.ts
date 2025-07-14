import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { query } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating explanation for query:', query);

    const systemPrompt = `Você é um especialista em gestão financeira de projetos e indicadores de performance. Sua função é explicar métricas, fórmulas e conceitos do sistema de gestão financeira de forma clara e didática.

Contexto do Sistema:
- Sistema de gestão de portfólio de projetos corporativo
- Métricas principais: CPI, NPV, ROI, EVA, Payback, BU (Budget Utilization), Capex/Opex
- Foco em projetos corporativos e análise de performance
- Unidades no Brasil (Curitiba), Argentina (Rosário), México (Guadalajara)

EXEMPLOS REAIS DO SISTEMA:
- Projeto "Modernização Linha Produção Curitiba": Orçamento R$ 2.5M, Realizado R$ 1.875M, CPI 0.85, BU 88%
- Projeto "ERP Rosário": Orçamento USD 850K, Realizado USD 125K, CPI 1.05, BU 80%
- Projeto "Expansão México": Orçamento USD 4.2M, Realizado USD 3.15M, CPI 0.79, BU 95%

Diretrizes para suas respostas:
1. Use linguagem clara e profissional
2. Inclua a fórmula matemática quando aplicável
3. SEMPRE dê exemplos práticos usando dados reais dos projetos acima
4. Explique a interpretação dos resultados com casos reais
5. Mencione limitações ou considerações importantes
6. Mantenha o foco no contexto de gestão de projetos
7. Use valores monetários em formato brasileiro (R$ 1.000.000,00)

Formato esperado:
- Definição do conceito
- Fórmula (se aplicável)
- Exemplo prático com dados reais do sistema
- Interpretação dos resultados
- Considerações importantes`;

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
          { role: 'user', content: query }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    console.log('Explanation generated successfully');

    return new Response(
      JSON.stringify({ explanation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in explain-indicator function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while generating the explanation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});