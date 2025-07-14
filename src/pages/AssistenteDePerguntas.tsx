import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Send, RotateCcw, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AssistenteDePerguntas = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const frequentQuestions = [
    "Quais projetos do meu portfólio estão com desvio acima de 10% este mês?",
    "O que significa BU e como ele é calculado no sistema?",
    "Como faço para atualizar o baseline de um projeto?",
    "Quais lançamentos estão pendentes de aprovação?",
    "Me mostre os projetos classificados como críticos neste trimestre.",
    "Como exportar um relatório de realizados em Excel?",
    "Explique a diferença entre Capex e Opex nos lançamentos.",
    "Como funciona a atualização automática dos realizados via SAP?",
    "Qual é a diferença entre ROI e EVA nos indicadores financeiros?",
    "Como configurar alertas automáticos para desvios de prazo?",
    "Quais são os critérios para classificar um projeto como crítico?",
    "Como interpretar o gráfico de Curva S de um projeto?"
  ];

  const handleQuestionClick = (q: string) => {
    setQuestion(q);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta vazia",
        description: "Por favor, digite uma pergunta antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { question: question.trim() }
      });

      if (error) {
        throw error;
      }

      setResponse(data.response || 'Desculpe, não foi possível gerar uma resposta neste momento.');
    } catch (error) {
      console.error('Erro ao consultar assistente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar sua pergunta neste momento.",
        variant: "destructive"
      });
      setResponse('Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion('');
    setResponse('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Assistente de Perguntas</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Receba respostas automatizadas para dúvidas operacionais, financeiras e estratégicas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pergunta e Resposta */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campo de Pergunta */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Sua Pergunta
                </CardTitle>
                <CardDescription>
                  Digite sua dúvida sobre projetos, indicadores, processos...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua dúvida sobre projetos, indicadores, processos…"
                    className="min-h-[60px] py-3"
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Perguntas complexas ou técnicas podem demorar mais para responder.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span>Pressione Enter para enviar ou use o botão</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading || !question.trim()}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Pergunta
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleClear}
                    disabled={isLoading}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Área de Resposta */}
            {(response || isLoading) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Resposta do Assistente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center space-y-2">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground">Processando sua pergunta...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                          {response}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Perguntas Frequentes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
                <CardDescription>
                  Clique em uma pergunta para preencher automaticamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {frequentQuestions.map((q, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left h-auto p-3 text-wrap justify-start"
                    onClick={() => handleQuestionClick(q)}
                    disabled={isLoading}
                  >
                    <span className="text-sm leading-relaxed">{q}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Dicas de Uso */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dicas de Uso</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="space-y-1">
                  <p className="font-medium">• Seja específico</p>
                  <p className="text-muted-foreground pl-2">Inclua períodos, projetos ou métricas específicas</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">• Use linguagem natural</p>
                  <p className="text-muted-foreground pl-2">Pergunte como falaria com um colega</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">• Contextualize</p>
                  <p className="text-muted-foreground pl-2">Mencione sua área ou responsabilidade</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistenteDePerguntas;