import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Check, X, Users, Search, Filter, AlertTriangle, Calendar, Plus, HelpCircle } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface CapexBURow {
  id: string;
  categoria: string;
  pais: string;
  ano: number;
  sapId: string;
  jan: number;
  fev: number;
  mar: number;
  abr: number;
  mai: number;
  jun: number;
  jul: number;
  ago: number;
  set: number;
  out: number;
  nov: number;
  dez: number;
  total: number;
  nomeProjeto: string;
  dataAtualizacao: string;
  version: number;
  isActive: boolean;
  exchangeRate: string; // Taxa de câmbio selecionada
}

interface CapexBUTableProps {
  project: any;
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function CapexBUTable({ project }: CapexBUTableProps) {
  const [data, setData] = useState<CapexBURow[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<CapexBURow>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Partial<CapexBURow>>({
    categoria: '',
    pais: '',
    ano: new Date().getFullYear(),
    sapId: '',
    jan: 0,
    fev: 0,
    mar: 0,
    abr: 0,
    mai: 0,
    jun: 0,
    jul: 0,
    ago: 0,
    set: 0,
    out: 0,
    nov: 0,
    dez: 0,
    total: 0,
    nomeProjeto: project.name || '',
    exchangeRate: 'SEK_BU'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAno, setFilterAno] = useState<string>('all');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterPais, setFilterPais] = useState<string>('all');
  const [filterNomeProjeto, setFilterNomeProjeto] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BRL');
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  
  // Considerando todos os usuários como PMO por enquanto
  const isPMO = true;

  // Simulação de taxas de câmbio por ano
  const exchangeRatesByYear = {
    "2025": {
      "BRL": { rate: 1.0, label: "Moeda do cadastro (BRL)" },
      "SEK_APPROVAL": { rate: 0.48, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.52, label: "SEK BU (taxa anual)" },
      "SEK_AVG": { rate: 0.50, label: "SEK AVG (média mensal)" }
    },
    "2024": {
      "BRL": { rate: 1.0, label: "Moeda do cadastro (BRL)" },
      "SEK_APPROVAL": { rate: 0.45, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.49, label: "SEK BU (taxa anual)" },
      "SEK_AVG": { rate: 0.47, label: "SEK AVG (média mensal)" }
    },
    "2023": {
      "BRL": { rate: 1.0, label: "Moeda do cadastro (BRL)" },
      "SEK_APPROVAL": { rate: 0.42, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.46, label: "SEK BU (taxa anual)" },
      "SEK_AVG": { rate: 0.44, label: "SEK AVG (média mensal)" }
    }
  };

  const getCurrentExchangeRates = () => {
    return exchangeRatesByYear[selectedYear as keyof typeof exchangeRatesByYear] || exchangeRatesByYear["2025"];
  };

  const getCurrentCurrencyInfo = (exchangeRateKey: string) => {
    const currentRates = getCurrentExchangeRates();
    return currentRates[exchangeRateKey as keyof typeof currentRates] || { rate: 1.0, label: exchangeRateKey };
  };

  const convertCurrency = (amount: number, exchangeRateKey: string) => {
    const currencyInfo = getCurrentCurrencyInfo(exchangeRateKey);
    return amount * currencyInfo.rate;
  };

  useEffect(() => {
    // Dados mockados iniciais - apenas uma linha por projeto
    const initialData: CapexBURow[] = [
      {
        id: '1',
        categoria: 'Máquinas e equipamentos',
        pais: 'Brasil',
        ano: 2024,
        sapId: 'BR2024001',
        jan: 50000,
        fev: 45000,
        mar: 60000,
        abr: 55000,
        mai: 70000,
        jun: 65000,
        jul: 80000,
        ago: 75000,
        set: 90000,
        out: 85000,
        nov: 95000,
        dez: 100000,
        total: 870000,
        nomeProjeto: project.name || 'Projeto Exemplo',
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
        version: 1,
        isActive: true,
        exchangeRate: 'SEK_BU'
      }
    ];
    
    setData(initialData);
  }, [project]);

  const formatCurrency = (value: number, currency: string = 'BRL', exchangeRateKey?: string) => {
    let finalValue = value;
    
    // Aplicar conversão baseada na moeda de visualização selecionada
    if (exchangeRateKey && exchangeRateKey !== selectedCurrency) {
      // Se a linha tem uma taxa diferente da selecionada, primeiro converter para BRL base
      const lineRate = getCurrentCurrencyInfo(exchangeRateKey).rate;
      const baseValue = value / lineRate;
      
      // Depois converter para a moeda de visualização selecionada
      const displayRate = getCurrentCurrencyInfo(selectedCurrency).rate;
      finalValue = baseValue * displayRate;
    } else {
      // Se a linha já está na moeda de visualização, usar a taxa diretamente
      finalValue = convertCurrency(value, selectedCurrency);
    }
    
    // Determinar a moeda de exibição
    const displayCurrency = selectedCurrency.startsWith('SEK') ? 'SEK' : 'BRL';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: displayCurrency,
      minimumFractionDigits: 0,
    }).format(finalValue);
  };

  const handleStartEdit = (rowId: string) => {
    const row = data.find(r => r.id === rowId);
    if (!row) return;
    
    setEditingRowId(rowId);
    setEditingValues({ ...row });
    setHasChanges(false);
  };

  const handleFieldChange = (field: keyof CapexBURow, value: any) => {
    const newValues = { ...editingValues, [field]: value };
    setEditingValues(newValues);
    
    // Recalcular total se foi editado um mês
    if (months.includes(field as string)) {
      const total = months.reduce((sum, month) => {
        const monthValue = newValues[month as keyof CapexBURow] as number;
        return sum + (monthValue || 0);
      }, 0);
      newValues.total = total;
      setEditingValues(newValues);
    } else if (field === 'total') {
      // Se editou o total, distribuir proporcionalmente pelos meses
      const currentTotal = months.reduce((sum, month) => {
        return sum + (editingValues[month as keyof CapexBURow] as number || 0);
      }, 0);
      if (currentTotal > 0) {
        months.forEach(month => {
          const proportion = (editingValues[month as keyof CapexBURow] as number || 0) / currentTotal;
          (newValues as any)[month] = Math.round((value as number) * proportion);
        });
      }
      setEditingValues(newValues);
    }
    
    // Verificar se há mudanças
    const originalRow = data.find(r => r.id === editingRowId);
    if (originalRow) {
      const hasChanges = Object.keys(newValues).some(key => {
        const k = key as keyof CapexBURow;
        return newValues[k] !== originalRow[k];
      });
      setHasChanges(hasChanges);
    }
  };

  const handleSaveEdit = () => {
    if (!editingRowId || !editingValues) return;
    
    const originalRow = data.find(row => row.id === editingRowId);
    if (!originalRow) return;

    // Criar nova linha com os dados atualizados
    const newRow: CapexBURow = {
      ...editingValues,
      id: Date.now().toString(),
      dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
      version: originalRow.version + 1,
      isActive: true
    } as CapexBURow;

    // Marcar a linha original como não ativa
    const updatedData = data.map(row => 
      row.id === editingRowId ? { ...row, isActive: false } : row
    );

    // Adicionar a nova linha
    updatedData.push(newRow);

    // Ordenar por SAP ID e versão (mais recente primeiro)
    const sortedData = updatedData.sort((a, b) => {
      if (a.sapId !== b.sapId) return a.sapId.localeCompare(b.sapId);
      return b.version - a.version;
    });

    setData(sortedData);
    setEditingRowId(null);
    setEditingValues({});
    setHasChanges(false);

    toast({
      title: "Alterações salvas",
      description: "Nova versão da linha foi criada com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingValues({});
    setHasChanges(false);
  };

  const handleNewRowFieldChange = (field: keyof CapexBURow, value: any) => {
    const newValues = { ...newRowData, [field]: value };
    setNewRowData(newValues);
    
    // Recalcular total se foi editado um mês
    if (months.includes(field as string)) {
      const total = months.reduce((sum, month) => {
        const monthValue = newValues[month as keyof CapexBURow] as number;
        return sum + (monthValue || 0);
      }, 0);
      newValues.total = total;
      setNewRowData(newValues);
    }
  };

  const handleCreateNewRow = () => {
    // Validar campos obrigatórios - SAP ID não é mais obrigatório
    if (!newRowData.categoria || !newRowData.pais) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios: Categoria e País.",
        variant: "destructive",
      });
      return;
    }

    // Criar nova linha
    const newRow: CapexBURow = {
      id: Date.now().toString(),
      categoria: newRowData.categoria || '',
      pais: newRowData.pais || '',
      ano: newRowData.ano || new Date().getFullYear(),
      sapId: newRowData.sapId || '',
      jan: newRowData.jan || 0,
      fev: newRowData.fev || 0,
      mar: newRowData.mar || 0,
      abr: newRowData.abr || 0,
      mai: newRowData.mai || 0,
      jun: newRowData.jun || 0,
      jul: newRowData.jul || 0,
      ago: newRowData.ago || 0,
      set: newRowData.set || 0,
      out: newRowData.out || 0,
      nov: newRowData.nov || 0,
      dez: newRowData.dez || 0,
      total: newRowData.total || 0,
      nomeProjeto: newRowData.nomeProjeto || project.name || '',
      dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
      version: 1,
      isActive: true,
      exchangeRate: newRowData.exchangeRate || 'SEK_BU'
    };

    // Adicionar nova linha aos dados
    const updatedData = [...data, newRow];
    
    // Ordenar por SAP ID e versão
    const sortedData = updatedData.sort((a, b) => {
      if (a.sapId !== b.sapId) return a.sapId.localeCompare(b.sapId);
      return b.version - a.version;
    });

    setData(sortedData);
    
    // Resetar o formulário e fechar modal
    setNewRowData({
      categoria: '',
      pais: '',
      ano: new Date().getFullYear(),
      sapId: '',
      jan: 0,
      fev: 0,
      mar: 0,
      abr: 0,
      mai: 0,
      jun: 0,
      jul: 0,
      ago: 0,
      set: 0,
      out: 0,
      nov: 0,
      dez: 0,
      total: 0,
      nomeProjeto: project.name || '',
      exchangeRate: 'SEK_BU'
    });
    setIsCreateModalOpen(false);

    toast({
      title: "Nova linha criada",
      description: "A nova linha foi adicionada com sucesso à tabela.",
    });
  };

  const filteredData = data.filter(row => {
    const matchesSearch = 
      row.sapId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAno = !filterAno || filterAno === 'all' || row.ano.toString() === filterAno;
    const matchesCategoria = !filterCategoria || filterCategoria === 'all' || row.categoria === filterCategoria;
    const matchesPais = !filterPais || filterPais === 'all' || row.pais === filterPais;
    const matchesNomeProjeto = !filterNomeProjeto || filterNomeProjeto === 'all' || row.nomeProjeto === filterNomeProjeto;

    return matchesSearch && matchesAno && matchesCategoria && matchesPais && matchesNomeProjeto;
  });

  const categories = [...new Set(data.map(row => row.categoria))];
  const countries = [...new Set(data.map(row => row.pais))];
  const years = [...new Set(data.map(row => row.ano))];
  const projectNames = [...new Set(data.map(row => row.nomeProjeto))];

  return (
    <div className="space-y-6">
      {/* Selo PMO */}
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Edição restrita a PMO:</strong> Apenas usuários com perfil PMO podem editar esta tabela.
          {isPMO && " Você tem permissão para editar."}
        </AlertDescription>
      </Alert>

      {/* Configurações de Visualização */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5" />
            Configurações de Visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Moeda:</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">
                    Moeda do cadastro (BRL)
                  </SelectItem>
                  <SelectItem value="SEK_APPROVAL">SEK (taxa da aprovação)</SelectItem>
                  <SelectItem value="SEK_BU">SEK BU (taxa anual)</SelectItem>
                  <SelectItem value="SEK_AVG">SEK AVG (média mensal)</SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Selecione a moeda para visualizar os valores convertidos conforme o câmbio</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Ano:</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Selecione o ano de referência para as taxas de câmbio</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                Taxa atual: {getCurrentCurrencyInfo(selectedCurrency).rate.toFixed(4)}
              </span>
              <span className="text-xs text-muted-foreground">
                | Atualizado em {format(new Date(), "dd/MM/yyyy HH:mm")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Busca rápida</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SAP ID ou Nome do Projeto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <Select value={filterAno} onValueChange={setFilterAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os anos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">País</label>
              <Select value={filterPais} onValueChange={setFilterPais}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os países" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os países</SelectItem>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Projeto</label>
              <Select value={filterNomeProjeto} onValueChange={setFilterNomeProjeto}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os projetos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os projetos</SelectItem>
                  {projectNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterAno('all');
                  setFilterCategoria('all');
                  setFilterPais('all');
                  setFilterNomeProjeto('all');
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Capex BU - Detalhamento Financeiro</CardTitle>
            {isPMO && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4 mr-1" />
                    Nova Linha
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Linha - Capex BU</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Categoria <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={newRowData.categoria || ''}
                          onChange={(e) => handleNewRowFieldChange('categoria', e.target.value)}
                          placeholder="Ex: Máquinas e equipamentos"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          País <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={newRowData.pais || ''}
                          onChange={(e) => handleNewRowFieldChange('pais', e.target.value)}
                          placeholder="Ex: Brasil"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ano</label>
                        <Input
                          type="number"
                          value={newRowData.ano || ''}
                          onChange={(e) => handleNewRowFieldChange('ano', parseInt(e.target.value) || new Date().getFullYear())}
                          placeholder={new Date().getFullYear().toString()}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          SAP ID Number
                        </label>
                        <Input
                          value={newRowData.sapId || ''}
                          onChange={(e) => handleNewRowFieldChange('sapId', e.target.value)}
                          placeholder="Ex: BR2024001"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nome do Projeto</label>
                        <Input
                          value={newRowData.nomeProjeto || ''}
                          onChange={(e) => handleNewRowFieldChange('nomeProjeto', e.target.value)}
                          placeholder={project.name || 'Nome do projeto'}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Taxa de Câmbio</label>
                        <Select value={newRowData.exchangeRate || 'SEK_BU'} onValueChange={(value) => handleNewRowFieldChange('exchangeRate', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a taxa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BRL">Moeda do cadastro (BRL)</SelectItem>
                            <SelectItem value="SEK_APPROVAL">SEK (taxa da aprovação)</SelectItem>
                            <SelectItem value="SEK_BU">SEK BU (taxa anual)</SelectItem>
                            <SelectItem value="SEK_AVG">SEK AVG (média mensal)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Valores Mensais (BU)</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {months.map((month, index) => (
                          <div key={month}>
                            <label className="text-sm font-medium mb-2 block">
                              {monthNames[index]}
                            </label>
                            <Input
                              type="number"
                              value={(newRowData[month as keyof CapexBURow] as number) || 0}
                              onChange={(e) => handleNewRowFieldChange(month as keyof CapexBURow, parseFloat(e.target.value) || 0)}
                              placeholder="0"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <label className="text-sm font-medium">Total Anual:</label>
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(newRowData.total || 0, project.currency)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleCreateNewRow}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Salvar Nova Linha
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isPMO && <TableHead className="w-[50px]">Editar</TableHead>}
                  <TableHead className="w-[150px]">Categoria</TableHead>
                  <TableHead className="w-[100px]">País</TableHead>
                  <TableHead className="w-[80px]">Ano</TableHead>
                  <TableHead className="w-[120px]">SAP ID Number</TableHead>
                  <TableHead className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <span>Taxa de Câmbio</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Taxa de câmbio utilizada para conversão dos valores</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>
                  {months.map((month, index) => (
                    <TableHead key={month} className="w-[100px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">{month.charAt(0).toUpperCase() + month.slice(1)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>BU alocado para {monthNames[index]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  ))}
                  <TableHead className="w-[120px]">Total</TableHead>
                  <TableHead className="w-[200px]">Nome Projeto</TableHead>
                  <TableHead className="w-[120px]">Data Atualização</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => {
                  const isBeingEdited = editingRowId === row.id;
                  const currentValues = isBeingEdited ? editingValues : row;
                  
                  return (
                    <TableRow
                      key={row.id}
                      className={`
                        ${row.isActive ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-gray-50 opacity-70'}
                        ${row.isActive ? 'hover:bg-green-100' : 'hover:bg-gray-100'}
                        ${isBeingEdited ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      `}
                    >
                      {isPMO && (
                        <TableCell>
                          {row.isActive && !isBeingEdited && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleStartEdit(row.id)}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isBeingEdited ? (
                            <Input
                              value={currentValues.categoria || ''}
                              onChange={(e) => handleFieldChange('categoria', e.target.value)}
                              className="w-full h-8"
                            />
                          ) : (
                            <span className="text-sm">{row.categoria}</span>
                          )}
                          {row.isActive && (
                            <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/40">
                              Versão atual
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Input
                            value={currentValues.pais || ''}
                            onChange={(e) => handleFieldChange('pais', e.target.value)}
                            className="w-full h-8"
                          />
                        ) : (
                          row.pais
                        )}
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Input
                            type="number"
                            value={currentValues.ano || ''}
                            onChange={(e) => handleFieldChange('ano', parseInt(e.target.value) || 0)}
                            className="w-full h-8"
                          />
                        ) : (
                          row.ano
                        )}
                      </TableCell>
                      <TableCell className="font-mono">
                        {isBeingEdited ? (
                          <Input
                            value={currentValues.sapId || ''}
                            onChange={(e) => handleFieldChange('sapId', e.target.value)}
                            className="w-full h-8"
                          />
                        ) : (
                          row.sapId
                        )}
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Select value={currentValues.exchangeRate || 'SEK_BU'} onValueChange={(value) => handleFieldChange('exchangeRate', value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BRL">Moeda do cadastro (BRL)</SelectItem>
                              <SelectItem value="SEK_APPROVAL">SEK (taxa da aprovação)</SelectItem>
                              <SelectItem value="SEK_BU">SEK BU (taxa anual)</SelectItem>
                              <SelectItem value="SEK_AVG">SEK AVG (média mensal)</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {row.exchangeRate === 'BRL' && 'BRL'}
                                {row.exchangeRate === 'SEK_APPROVAL' && 'SEK Aprovação'}
                                {row.exchangeRate === 'SEK_BU' && 'SEK BU'}
                                {row.exchangeRate === 'SEK_AVG' && 'SEK AVG'}
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Taxa: {getCurrentCurrencyInfo(row.exchangeRate).rate.toFixed(4)}</p>
                                  <p>{getCurrentCurrencyInfo(row.exchangeRate).label}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                             <div className="text-xs text-muted-foreground">
                               {row.exchangeRate === 'BRL' && 'Moeda do cadastro'}
                               {row.exchangeRate === 'SEK_APPROVAL' && 'Taxa da aprovação'}
                               {row.exchangeRate === 'SEK_BU' && 'Taxa anual BU'}
                               {row.exchangeRate === 'SEK_AVG' && 'Média mensal'}
                             </div>
                          </div>
                        )}
                      </TableCell>
                      {months.map((month) => (
                        <TableCell key={month}>
                          {isBeingEdited ? (
                            <Input
                              type="number"
                              value={(currentValues[month as keyof CapexBURow] as number) || 0}
                              onChange={(e) => handleFieldChange(month as keyof CapexBURow, parseFloat(e.target.value) || 0)}
                              className="w-20 h-8"
                            />
                          ) : (
                            <span className="text-sm">
                              {formatCurrency(row[month as keyof CapexBURow] as number, selectedCurrency, row.exchangeRate)}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        {isBeingEdited ? (
                          <Input
                            type="number"
                            value={currentValues.total || 0}
                            onChange={(e) => handleFieldChange('total', parseFloat(e.target.value) || 0)}
                            className="w-24 h-8"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {formatCurrency(row.total, selectedCurrency, row.exchangeRate)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Input
                            value={currentValues.nomeProjeto || ''}
                            onChange={(e) => handleFieldChange('nomeProjeto', e.target.value)}
                            className="w-full h-8"
                          />
                        ) : (
                          row.nomeProjeto
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{row.dataAtualizacao}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Botão de salvar alterações */}
          {editingRowId && hasChanges && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Alterações detectadas</p>
                <p className="text-xs text-blue-600">As alterações serão salvas como uma nova versão, mantendo o histórico.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Salvar alterações
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}