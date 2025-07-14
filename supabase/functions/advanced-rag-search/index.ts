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

    const { query, filters } = await req.json();

    if (!query) {
      throw new Error('Search query is required');
    }

    console.log('Processing RAG search:', query, filters);

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch data for search context
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: transactions } = await supabase.from('transactions').select('*');
    const { data: baselines } = await supabase.from('baselines').select('*');

    // Mock document database (in production, this would be a vector database)
    const mockDocuments = [
      {
        id: '1',
        title: 'Ata de Reunião - Projeto Portal do Cliente V2',
        type: 'ata',
        content: 'Reunião realizada em 15/11/2024 para discussão do cronograma do Portal do Cliente V2. Participantes: João Costa (líder), Ana Silva (TI), Carlos Santos (Marketing). Principais pontos: atraso de 2 semanas devido a problemas de integração com API externa. Orçamento atual: R$ 340.000 realizado de R$ 290.000 planejado, representando desvio de 17,2%. Ações: revisar escopo e replanejar entregas.',
        project: 'Portal do Cliente V2',
        area: 'TI',
        date: '2024-11-15',
        url: '/documents/ata-portal-v2-nov2024.pdf',
        tags: ['atraso', 'desvio orçamentário', 'integração', 'API']
      },
      {
        id: '2',
        title: 'Relatório de Baseline - Sistema ERP Corporativo',
        type: 'baseline',
        content: 'Baseline aprovada em março de 2023 para o Sistema ERP Corporativo. Orçamento total: R$ 850.000. Cronograma: 12 meses. Escopo: implementação completa do módulo financeiro, RH e vendas. Critérios de aceitação definidos. ROI esperado: 25% em 2 anos. Riscos identificados: resistência dos usuários e complexidade de migração de dados.',
        project: 'Sistema ERP Corporativo',
        area: 'TI',
        date: '2023-03-15',
        url: '/documents/baseline-erp-2023.pdf',
        tags: ['baseline', 'ROI', 'implementação', 'ERP']
      },
      {
        id: '3',
        title: 'Documento Técnico - Modernização Data Center',
        type: 'documento',
        content: 'Especificações técnicas para modernização do data center. Investimento CAPEX de R$ 1.200.000. Escopo: atualização de servidores, sistema de refrigeração e redundância elétrica. Economia esperada: 30% em custos operacionais. Cronograma: 8 meses. Aprovações necessárias: diretoria técnica e comitê de investimentos.',
        project: 'Modernização Data Center',
        area: 'TI',
        date: '2023-02-10',
        url: '/documents/spec-datacenter-2023.pdf',
        tags: ['CAPEX', 'infraestrutura', 'economia', 'modernização']
      },
      {
        id: '4',
        title: 'Histórico de Mudanças - Campanha Black Friday',
        type: 'historico',
        content: 'Histórico completo das alterações no projeto Campanha Black Friday. Versão 1.0: orçamento inicial R$ 180.000. Versão 1.1: aumento para R$ 200.000 devido a expansão do escopo digital. Versão 1.2: ajuste final para R$ 220.000 após inclusão de influenciadores. Status atual: 90% concluído com leve atraso de 5 dias.',
        project: 'Campanha Black Friday',
        area: 'Marketing',
        date: '2024-11-20',
        url: '/documents/historico-blackfriday-2024.pdf',
        tags: ['mudança de escopo', 'marketing digital', 'influenciadores']
      },
      {
        id: '5',
        title: 'Anexo Financeiro - Expansão Logística Sul',
        type: 'anexo',
        content: 'Planilha detalhada dos custos da Expansão Logística Sul. Total investido: R$ 615.000 de R$ 650.000 orçado. Economia de 5,4%. Principais itens: equipamentos R$ 400.000, obras civis R$ 180.000, licenças R$ 35.000. Projeto concluído dentro do prazo em novembro de 2024.',
        project: 'Expansão Logística Sul',
        area: 'Operações',
        date: '2024-11-30',
        url: '/documents/anexo-financeiro-logistica-sul.xlsx',
        tags: ['economia', 'CAPEX', 'equipamentos', 'obras']
      }
    ];

    // Use OpenAI to enhance search with semantic understanding
    const enhancedSearchPrompt = `
Você é um assistente de busca semântica especializado em documentos de projetos corporativos.

CONSULTA DO USUÁRIO: "${query}"

FILTROS APLICADOS:
- Tipo de documento: ${filters.documentType}
- Período: ${filters.dateRange}
- Área: ${filters.area}

DOCUMENTOS DISPONÍVEIS:
${JSON.stringify(mockDocuments, null, 2)}

INSTRUÇÕES:
1. Analise a consulta do usuário e identifique a intenção de busca
2. Encontre documentos relevantes com base no conteúdo semântico
3. Calcule uma pontuação de relevância de 0 a 1 para cada resultado
4. Aplique os filtros especificados
5. Retorne os resultados mais relevantes

FORMATO DE RESPOSTA (JSON):
{
  "results": [
    {
      "id": "id_do_documento",
      "title": "título do documento",
      "type": "tipo",
      "excerpt": "trecho mais relevante (máximo 200 caracteres)",
      "project": "nome do projeto",
      "area": "área",
      "date": "data",
      "url": "url",
      "tags": ["tag1", "tag2"],
      "relevance": 0.95
    }
  ],
  "total": número_total_de_resultados,
  "query_intent": "intenção_identificada_na_busca"
}

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
          { role: 'system', content: enhancedSearchPrompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
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

    let searchResults;
    try {
      searchResults = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      searchResults = {
        results: [],
        total: 0,
        query_intent: 'busca_geral'
      };
    }

    return new Response(JSON.stringify(searchResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in advanced-rag-search function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      total: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});