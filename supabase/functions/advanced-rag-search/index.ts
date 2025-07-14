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

    // Base de documentos simulados mais robusta
    const mockDocuments = [
      {
        id: '1',
        title: 'Ata Reunião Comitê - Modernização Curitiba',
        type: 'ata',
        content: 'Reunião realizada em 15/07/2024 para discussão do projeto Modernização Linha Produção Curitiba. Participantes: Ana Silva (líder), João Costa (Produção), Carlos Santos (Qualidade). Principais pontos: projeto com 75% de progresso, desvio orçamentário de 12.3% identificado. Orçamento atual: R$ 2.500.000 com R$ 1.875.000 realizado. CPI atual: 0.85 indica sobre-custo. Ações: implementar controle rigoroso de gastos e revisar fornecedores.',
        project: 'Modernização Linha Produção Curitiba',
        area: 'Produção',
        date: '2024-07-15',
        url: '/documents/ata-modernizacao-curitiba-jul2024.pdf',
        tags: ['desvio orçamentário', 'CPI', 'controle gastos', 'fornecedores']
      },
      {
        id: '2',
        title: 'Baseline ERP Rosário - Versão 1.0',
        type: 'baseline',
        content: 'Baseline aprovada em maio de 2024 para o projeto Implementação ERP Rosário. Orçamento total: USD 850.000. Cronograma: 18 meses. Escopo: implementação completa do módulo financeiro, RH e vendas. Líder: Carlos Rodriguez. ROI esperado: 22.1% em 2 anos. Status atual: fase de planejamento com 15% de progresso. Riscos: resistência dos usuários e complexidade de integração com sistemas legados.',
        project: 'Implementação ERP Rosário',
        area: 'TI',
        date: '2024-05-20',
        url: '/documents/baseline-erp-rosario-v1.pdf',
        tags: ['baseline', 'ROI', 'integração', 'ERP', 'planejamento']
      },
      {
        id: '3',
        title: 'Análise de Risco - Expansão México',
        type: 'analise',
        content: 'Análise de riscos do projeto Expansão Capacidade México. Orçamento: USD 4.200.000 com USD 3.150.000 já realizado (progresso 85%). Desvio crítico de 21.1% identificado. CPI: 0.79 indica severo sobre-custo. Riscos principais: variação cambial, atraso de fornecedores, custos de construção civil acima do planejado. Líder: Maria González. Prazo: 15/10/2024. Ações urgentes: renegociar contratos e implementar plano de contingência.',
        project: 'Expansão Capacidade México',
        area: 'Engenharia',
        date: '2024-07-10',
        url: '/documents/analise-risco-expansao-mexico.pdf',
        tags: ['risco crítico', 'sobre-custo', 'variação cambial', 'contingência']
      },
      {
        id: '4',
        title: 'Manual de Indicadores VMO',
        type: 'manual',
        content: 'Manual completo dos indicadores utilizados no sistema VMO. CPI (Cost Performance Index): CPI = EV/AC. Valores <1 indicam sobre-orçamento. Exemplo: Projeto México com CPI 0.79 significa 21% de sobre-custo. BU (Budget Utilization): BU = Realizado/Orçamento * 100. Exemplo: Projeto Curitiba com BU 88% = R$ 1.875.000 / R$ 2.500.000. ROI: Return on Investment calculado como (Benefício - Custo) / Custo * 100.',
        project: null,
        area: 'PMO',
        date: '2024-05-01',
        url: '/documents/manual-indicadores-vmo.pdf',
        tags: ['CPI', 'BU', 'ROI', 'indicadores', 'manual']
      },
      {
        id: '5',
        title: 'Relatório Transações Julho 2024',
        type: 'relatorio',
        content: 'Relatório detalhado das transações de julho 2024. Principais lançamentos: Modernização Curitiba - Equipamentos industriais R$ 875.000 (aprovado), Consultoria R$ 245.000 (pendente). ERP Rosário - Licenças software USD 320.000 (aprovado). Expansão México - Construção civil USD 1.200.000 (em execução). Total de transações: R$ 2.640.000 equivalente. Categoria predominante: Capex (78%). Status: 65% aprovado, 20% em execução, 15% pendente.',
        project: 'Múltiplos',
        area: 'Financeiro',
        date: '2024-07-31',
        url: '/documents/relatorio-transacoes-jul2024.xlsx',
        tags: ['transações', 'Capex', 'aprovações', 'lançamentos']
      },
      {
        id: '6',
        title: 'Histórico Sustentabilidade Energia Verde',
        type: 'historico',
        content: 'Histórico completo do projeto Sustentabilidade Energia Verde. Versão 1.0: orçamento inicial USD 1.800.000. Líder: Juliana Santos. Escopo: implementação de painéis solares em múltiplas unidades. Progresso atual: 40% com USD 720.000 realizado. BU: 80%. ROI esperado: 25.3% com payback de 2.1 anos. Status: em andamento com prazo para dezembro 2025. Categoria: Capex ESG.',
        project: 'Sustentabilidade Energia Verde',
        area: 'ESG',
        date: '2024-07-20',
        url: '/documents/historico-sustentabilidade-verde.pdf',
        tags: ['sustentabilidade', 'ESG', 'energia verde', 'payback']
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