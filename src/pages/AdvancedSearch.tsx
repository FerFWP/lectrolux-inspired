import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Search, HelpCircle, RefreshCw, FileText, Calendar, 
  Building, FolderOpen, ExternalLink, Lightbulb, AlertCircle,
  Filter, Clock, Target, BookOpen, ChevronRight
} from "lucide-react";
import { HomeButton } from "@/components/home-button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    documentType: "all",
    dateRange: "all",
    project: "all",
    area: "all"
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const documentTypes = [
    { value: "all", label: "Todos os tipos" },
    { value: "ata", label: "Atas de reunião" },
    { value: "documento", label: "Documentos" },
    { value: "anexo", label: "Anexos" },
    { value: "historico", label: "Históricos" },
    { value: "baseline", label: "Baselines" },
    { value: "relatorio", label: "Relatórios" }
  ];

  const dateRanges = [
    { value: "all", label: "Todas as datas" },
    { value: "last_week", label: "Última semana" },
    { value: "last_month", label: "Último mês" },
    { value: "last_3_months", label: "Últimos 3 meses" },
    { value: "last_6_months", label: "Últimos 6 meses" },
    { value: "last_year", label: "Último ano" }
  ];

  const areas = [
    { value: "all", label: "Todas as áreas" },
    { value: "ti", label: "TI" },
    { value: "rh", label: "Recursos Humanos" },
    { value: "operacoes", label: "Operações" },
    { value: "marketing", label: "Marketing" },
    { value: "financeiro", label: "Financeiro" },
    { value: "qualidade", label: "Qualidade" }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Digite sua busca",
        description: "Por favor, insira os termos para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke('advanced-rag-search', {
        body: { 
          query: searchQuery.trim(),
          filters: filters
        }
      });

      if (error) throw error;

      setSearchResults(data.results || []);
      
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Erro na pesquisa",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'ata': return <BookOpen className="w-4 h-4" />;
      case 'documento': return <FileText className="w-4 h-4" />;
      case 'anexo': return <FolderOpen className="w-4 h-4" />;
      case 'historico': return <Clock className="w-4 h-4" />;
      case 'baseline': return <Target className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pesquisa Avançada (RAG)</h1>
              <p className="text-muted-foreground">
                Busca semântica em documentos usando linguagem natural
              </p>
            </div>
            <HomeButton />
          </div>

          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Busca Inteligente
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Busque por palavras-chave, frases ou perguntas completas. 
                      A IA encontra informações mesmo com termos similares.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription>
                Pesquisa inteligente utiliza IA para encontrar informações mesmo com termos similares.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Busque documentos, atas, anexos ou históricos por texto livre"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Filtros:</span>
                
                <Select value={filters.documentType} onValueChange={(value) => setFilters(prev => ({...prev, documentType: value}))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({...prev, dateRange: value}))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filters.area} onValueChange={(value) => setFilters(prev => ({...prev, area: value}))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area.value} value={area.value}>
                        {area.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Resultados da Pesquisa</CardTitle>
              <CardDescription>
                {hasSearched && (
                  <span>
                    {searchResults.length > 0 
                      ? `${searchResults.length} resultado(s) encontrado(s) para "${searchQuery}"`
                      : `Nenhum resultado encontrado para "${searchQuery}"`
                    }
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-lg font-medium">Processando sua busca...</p>
                  <p className="text-muted-foreground text-center mt-2">
                    Nossa IA está analisando documentos e encontrando informações relevantes
                  </p>
                </div>
              ) : hasSearched && searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Tente variar os termos de busca ou ajustar os filtros para encontrar o que procura.
                  </p>
                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Dicas:</strong> Use sinônimos, termos mais gerais ou remova alguns filtros para ampliar a busca.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <Card key={index} className="border-l-4 border-l-primary/30">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(result.type)}
                            <h4 className="font-semibold text-lg">{result.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-3 flex items-center gap-4">
                          {result.project && (
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {result.project}
                            </span>
                          )}
                          {result.area && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {result.area}
                            </span>
                          )}
                          {result.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(result.date).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                          <span className="ml-auto font-medium text-primary">
                            {Math.round(result.relevance * 100)}% relevante
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed">
                          {highlightText(result.excerpt, searchQuery)}
                        </p>
                        
                        {result.tags && result.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {result.tags.map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : !hasSearched ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Pronto para pesquisar</h3>
                  <p className="text-muted-foreground">
                    Digite sua consulta no campo acima para começar a busca inteligente
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AdvancedSearch;