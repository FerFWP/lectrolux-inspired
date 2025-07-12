import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  leader: string;
  status: "Em Andamento" | "Concluído" | "Em Atraso" | "Planejado" | "Crítico";
  area: string;
  budget: number;
  realized: number;
  committed: number;
  balance: number;
  currency: "BRL" | "USD" | "EUR" | "SEK";
  isCritical: boolean;
  progress: number;
  deadline: string;
}

interface SearchSuggestion {
  type: 'project' | 'leader' | 'area' | 'status' | 'query';
  value: string;
  label: string;
  count?: number;
}

interface IntelligentSearchProps {
  projects: Project[];
  onSearch: (query: string, activeFilters: string[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function IntelligentSearch({ projects, onSearch, searchTerm, setSearchTerm }: IntelligentSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate smart suggestions based on input
  const generateSuggestions = (query: string): SearchSuggestion[] => {
    if (!query) {
      return [
        ...recentSearches.slice(0, 3).map(search => ({
          type: 'query' as const,
          value: search,
          label: search
        })),
        { type: 'query', value: 'projetos críticos', label: 'projetos críticos' },
        { type: 'query', value: 'em atraso', label: 'projetos em atraso' },
        { type: 'query', value: 'orçamento excedido', label: 'orçamento excedido' },
        { type: 'query', value: 'produção', label: 'área de produção' }
      ];
    }

    const suggestions: SearchSuggestion[] = [];
    const lowerQuery = query.toLowerCase();

    // Project name matches
    projects
      .filter(p => p.name.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(project => {
        suggestions.push({
          type: 'project',
          value: project.name,
          label: `${project.name} (${project.id})`
        });
      });

    // Leader matches
    const leaders = Array.from(new Set(projects.map(p => p.leader)))
      .filter(leader => leader.toLowerCase().includes(lowerQuery))
      .slice(0, 2);
    
    leaders.forEach(leader => {
      const count = projects.filter(p => p.leader === leader).length;
      suggestions.push({
        type: 'leader',
        value: `líder:${leader}`,
        label: `Líder: ${leader}`,
        count
      });
    });

    // Area matches
    const areas = Array.from(new Set(projects.map(p => p.area)))
      .filter(area => area.toLowerCase().includes(lowerQuery))
      .slice(0, 2);
    
    areas.forEach(area => {
      const count = projects.filter(p => p.area === area).length;
      suggestions.push({
        type: 'area',
        value: `área:${area}`,
        label: `Área: ${area}`,
        count
      });
    });

    // Status matches
    const statuses = ["Em Andamento", "Concluído", "Em Atraso", "Planejado", "Crítico"]
      .filter(status => status.toLowerCase().includes(lowerQuery))
      .slice(0, 2);
    
    statuses.forEach(status => {
      const count = projects.filter(p => p.status === status).length;
      suggestions.push({
        type: 'status',
        value: `status:${status}`,
        label: `Status: ${status}`,
        count
      });
    });

    // Smart queries based on natural language
    if (lowerQuery.includes('crítico') || lowerQuery.includes('urgente')) {
      suggestions.push({
        type: 'query',
        value: 'críticos',
        label: 'Projetos críticos e urgentes'
      });
    }

    if (lowerQuery.includes('atraso')) {
      suggestions.push({
        type: 'query',
        value: 'em atraso',
        label: 'Projetos em atraso'
      });
    }

    if (lowerQuery.includes('orçamento') || lowerQuery.includes('budget')) {
      suggestions.push({
        type: 'query',
        value: 'orçamento excedido',
        label: 'Projetos com orçamento excedido'
      });
    }

    return suggestions.slice(0, 8);
  };

  const suggestions = generateSuggestions(searchTerm);

  // Parse smart queries and apply semantic search
  const parseSmartQuery = (query: string): string[] => {
    const filters: string[] = [];
    let searchQuery = query;

    // Extract filters from query
    const filterMatches = query.match(/(líder|área|status|moeda):\s*([^,]+)/gi);
    if (filterMatches) {
      filterMatches.forEach(match => {
        const [filterType, filterValue] = match.split(':').map(s => s.trim());
        filters.push(`${filterType}:${filterValue}`);
        searchQuery = searchQuery.replace(match, '').trim();
      });
    }

    // Handle semantic queries
    if (query.includes('críticos') || query.includes('urgente')) {
      filters.push('status:Crítico');
    }
    if (query.includes('em atraso')) {
      filters.push('status:Em Atraso');
    }
    if (query.includes('orçamento excedido')) {
      filters.push('budget:exceeded');
    }
    if (query.includes('produção')) {
      filters.push('área:Produção');
    }

    return filters;
  };

  const handleSearch = (query: string) => {
    const parsedFilters = parseSmartQuery(query);
    setActiveFilters(parsedFilters);
    
    // Add to recent searches if it's a new search
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    
    onSearch(query, parsedFilters);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'project') {
      setSearchTerm(suggestion.value);
      handleSearch(suggestion.value);
    } else if (suggestion.type === 'query') {
      setSearchTerm(suggestion.value);
      handleSearch(suggestion.value);
    } else {
      // For leader, area, status filters
      const newFilter = suggestion.value;
      if (!activeFilters.includes(newFilter)) {
        const updatedFilters = [...activeFilters, newFilter];
        setActiveFilters(updatedFilters);
        setSearchTerm('');
        onSearch('', updatedFilters);
      }
    }
    setShowSuggestions(false);
  };

  const removeFilter = (filterToRemove: string) => {
    const updatedFilters = activeFilters.filter(f => f !== filterToRemove);
    setActiveFilters(updatedFilters);
    onSearch(searchTerm, updatedFilters);
  };

  const formatFilterLabel = (filter: string) => {
    const [type, value] = filter.split(':');
    return `${type}: ${value}`;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {activeFilters.map((filter, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              <Filter className="h-3 w-3" />
              {formatFilterLabel(filter)}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder="Digite: 'projetos críticos', 'líder:João Santos', 'área:Produção'..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(searchTerm);
            }
            if (e.key === 'Escape') {
              setShowSuggestions(false);
            }
          }}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveFilters([]);
              onSearch('', []);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card ref={suggestionsRef} className="absolute top-full mt-1 w-full z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {!searchTerm && recentSearches.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Buscas recentes
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left p-2 hover:bg-muted rounded-sm transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {suggestion.type === 'project' && <Search className="h-3 w-3 text-muted-foreground" />}
                    {suggestion.type === 'leader' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                    {suggestion.type === 'area' && <div className="w-3 h-3 rounded bg-green-500" />}
                    {suggestion.type === 'status' && <div className="w-3 h-3 rounded bg-orange-500" />}
                    {suggestion.type === 'query' && <Filter className="h-3 w-3 text-muted-foreground" />}
                    <span className="text-sm">{suggestion.label}</span>
                  </div>
                  {suggestion.count && (
                    <Badge variant="outline" className="text-xs">
                      {suggestion.count}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}