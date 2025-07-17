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
import { Pencil, Check, X, Users, Search, Filter, AlertTriangle, Calendar, Plus, HelpCircle, DollarSign } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface CapexACRow {
  id: string;
  categoria: string;
  pais: string;
  ano: number;
  tipoPagamento: string;
  centroCusto: string;
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
  input: string;
}

interface CapexACTableProps {
  project: any;
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function CapexACTable({ project }: CapexACTableProps) {
  const [data, setData] = useState<CapexACRow[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Partial<CapexACRow>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Partial<CapexACRow>>({
    categoria: '',
    pais: '',
    ano: new Date().getFullYear(),
    tipoPagamento: '',
    centroCusto: '',
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
    input: 'manual/excel'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAno, setFilterAno] = useState<string>('all');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterPais, setFilterPais] = useState<string>('all');
  const [filterTipoPagamento, setFilterTipoPagamento] = useState<string>('all');
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

  const getCurrentCurrencyInfo = (exchangeRateKey: string = selectedCurrency) => {
    const currentRates = getCurrentExchangeRates();
    return currentRates[exchangeRateKey as keyof typeof currentRates] || { rate: 1.0, label: exchangeRateKey };
  };

  const convertCurrency = (amount: number, exchangeRateKey: string = selectedCurrency) => {
    const currencyInfo = getCurrentCurrencyInfo(exchangeRateKey);
    return amount * currencyInfo.rate;
  };

  useEffect(() => {
    // Dados mockados iniciais
    const initialData: CapexACRow[] = [
      {
        id: '1',
        categoria: 'Software',
        pais: 'Brasil',
        ano: 2025,
        tipoPagamento: 'Atual',
        centroCusto: 'TI-BR-01',
        sapId: 'BR2025001',
        jan: 25000,
        fev: 25000,
        mar: 25000,
        abr: 25000,
        mai: 25000,
        jun: 25000,
        jul: 25000,
        ago: 25000,
        set: 25000,
        out: 25000,
        nov: 25000,
        dez: 25000,
        total: 300000,
        nomeProjeto: project.name || 'Projeto Exemplo',
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
        input: 'integração'
      },
      {
        id: '2',
        categoria: 'Máquinas e equipamentos',
        pais: 'Brasil',
        ano: 2025,
        tipoPagamento: 'Avançado',
        centroCusto: 'PROD-BR-02',
        sapId: 'BR2025002',
        jan: 45000,
        fev: 45000,
        mar: 45000,
        abr: 45000,
        mai: 45000,
        jun: 45000,
        jul: 45000,
        ago: 45000,
        set: 45000,
        out: 45000,
        nov: 45000,
        dez: 45000,
        total: 540000,
        nomeProjeto: project.name || 'Projeto Exemplo',
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
        input: 'integração'
      },
      {
        id: '3',
        categoria: 'Hardware',
        pais: 'Brasil',
        ano: 2025,
        tipoPagamento: 'Comprometido',
        centroCusto: 'TI-BR-03',
        sapId: 'BR2025003',
        jan: 15000,
        fev: 15000,
        mar: 15000,
        abr: 15000,
        mai: 15000,
        jun: 15000,
        jul: 15000,
        ago: 15000,
        set: 15000,
        out: 15000,
        nov: 15000,
        dez: 15000,
        total: 180000,
        nomeProjeto: project.name || 'Projeto Exemplo',
        dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
        input: 'manual/excel'
      }
    ];
    
    setData(initialData);
  }, [project]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleStartEdit = (rowId: string) => {
    const row = data.find(r => r.id === rowId);
    if (!row) return;
    
    // Não permitir edição se o input for "integração"
    if (row.input === 'integração') {
      toast({
        title: "Não é possível editar",
        description: "Linhas com origem de dados 'integração' não podem ser editadas.",
        variant: "destructive",
      });
      return;
    }
    
    setEditingRowId(rowId);
    setEditingValues({ ...row });
    setHasChanges(false);
  };

  const handleFieldChange = (field: keyof CapexACRow, value: any) => {
    const newValues = { ...editingValues, [field]: value };
    setEditingValues(newValues);
    
    // Recalcular total se foi editado um mês
    if (months.includes(field as string)) {
      const total = months.reduce((sum, month) => {
        const monthValue = newValues[month as keyof CapexACRow] as number;
        return sum + (monthValue || 0);
      }, 0);
      newValues.total = total;
      setEditingValues(newValues);
    } else if (field === 'total') {
      // Se editou o total, distribuir proporcionalmente pelos meses
      const currentTotal = months.reduce((sum, month) => {
        return sum + (editingValues[month as keyof CapexACRow] as number || 0);
      }, 0);
      if (currentTotal > 0) {
        months.forEach(month => {
          const proportion = (editingValues[month as keyof CapexACRow] as number || 0) / currentTotal;
          (newValues as any)[month] = Math.round((value as number) * proportion);
        });
      }
      setEditingValues(newValues);
    }
    
    // Verificar se há mudanças
    const originalRow = data.find(r => r.id === editingRowId);
    if (originalRow) {
      const hasChanges = Object.keys(newValues).some(key => {
        const k = key as keyof CapexACRow;
        return newValues[k] !== originalRow[k];
      });
      setHasChanges(hasChanges);
    }
  };

  const handleSaveEdit = () => {
    if (!editingRowId || !editingValues) return;
    
    // Atualizar a linha editada
    const updatedData = data.map(row => 
      row.id === editingRowId ? { ...row, ...editingValues, dataAtualizacao: new Date().toLocaleDateString('pt-BR') } : row
    );

    setData(updatedData);
    setEditingRowId(null);
    setEditingValues({});
    setHasChanges(false);

    toast({
      title: "Alterações salvas",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setEditingValues({});
    setHasChanges(false);
  };

  const handleNewRowFieldChange = (field: keyof CapexACRow, value: any) => {
    const newValues = { ...newRowData, [field]: value };
    setNewRowData(newValues);
    
    // Recalcular total se foi editado um mês
    if (months.includes(field as string)) {
      const total = months.reduce((sum, month) => {
        const monthValue = newValues[month as keyof CapexACRow] as number;
        return sum + (monthValue || 0);
      }, 0);
      newValues.total = total;
      setNewRowData(newValues);
    }
  };

  const handleCreateNewRow = () => {
    // Validar campos obrigatórios
    if (!newRowData.categoria || !newRowData.pais || !newRowData.tipoPagamento) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios: Categoria, País e Tipo de Pagamento.",
        variant: "destructive",
      });
      return;
    }

    // Criar nova linha
    const newRow: CapexACRow = {
      id: Date.now().toString(),
      categoria: newRowData.categoria || '',
      pais: newRowData.pais || '',
      ano: newRowData.ano || new Date().getFullYear(),
      tipoPagamento: newRowData.tipoPagamento || '',
      centroCusto: newRowData.centroCusto || '',
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
      input: 'manual/excel'
    };

    // Adicionar nova linha aos dados
    const updatedData = [...data, newRow];
    
    setData(updatedData);
    
    // Resetar o formulário e fechar modal
    setNewRowData({
      categoria: '',
      pais: '',
      ano: new Date().getFullYear(),
      tipoPagamento: '',
      centroCusto: '',
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
      input: 'manual/excel'
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
      row.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.centroCusto.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAno = !filterAno || filterAno === 'all' || row.ano.toString() === filterAno;
    const matchesCategoria = !filterCategoria || filterCategoria === 'all' || row.categoria === filterCategoria;
    const matchesPais = !filterPais || filterPais === 'all' || row.pais === filterPais;
    const matchesTipoPagamento = !filterTipoPagamento || filterTipoPagamento === 'all' || row.tipoPagamento === filterTipoPagamento;

    return matchesSearch && matchesAno && matchesCategoria && matchesPais && matchesTipoPagamento;
  });

  const categories = [...new Set(data.map(row => row.categoria))];
  const countries = [...new Set(data.map(row => row.pais))];
  const years = [...new Set(data.map(row => row.ano))];
  const paymentTypes = [...new Set(data.map(row => row.tipoPagamento))];

  // Categorias para o select
  const categoriaOptions = [
    { group: "Expenses", items: ["Expenses"] },
    { group: "Intangíveis", items: ["Software", "Custo de Mão de Obra", "Outros intangíveis"] },
    { group: "Ativos", items: ["Ferramentas e Moldes", "Máquinas e equipamentos", "Veículos", "Mobília e Utensílios", "Hardware", "Construção", "Instalações industriais", "Terrenos"] }
  ];

  // Opções de tipo de pagamento
  const tipoPagamentoOptions = ["Atual", "Avançado", "Comprometido"];

  return (
    <div className="space-y-6">
      {/* Configurações de Visualização (mesmo estilo do Resumo) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5" />
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
                Taxa atual: {getCurrentCurrencyInfo().rate.toFixed(4)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Busca rápida</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SAP ID, Centro de Custo ou Projeto"
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
              <label className="text-sm font-medium mb-2 block">Tipo de Pagamento</label>
              <Select value={filterTipoPagamento} onValueChange={setFilterTipoPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {paymentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
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
                  setFilterTipoPagamento('all');
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
            <CardTitle>Capex AC - Realizado do Projeto</CardTitle>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-1" />
                  Nova Linha
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Nova Linha - Capex AC</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Categoria <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        value={newRowData.categoria} 
                        onValueChange={(value) => handleNewRowFieldChange('categoria', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoriaOptions.map((group) => (
                            <div key={group.group} className="space-y-1">
                              <div className="text-xs font-medium text-muted-foreground px-2 py-1">{group.group}</div>
                              {group.items.map((item) => (
                                <SelectItem key={item} value={item}>{item}</SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
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
                        Tipo de Pagamento <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        value={newRowData.tipoPagamento} 
                        onValueChange={(value) => handleNewRowFieldChange('tipoPagamento', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tipoPagamentoOptions.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Centro de Custo</label>
                      <Input
                        value={newRowData.centroCusto || ''}
                        onChange={(e) => handleNewRowFieldChange('centroCusto', e.target.value)}
                        placeholder="Ex: TI-BR-01"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">SAP ID Number</label>
                      <Input
                        value={newRowData.sapId || ''}
                        onChange={(e) => handleNewRowFieldChange('sapId', e.target.value)}
                        placeholder="Ex: BR2025001"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">Valores Mensais</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {months.map((month, index) => (
                        <div key={month}>
                          <label className="text-sm font-medium mb-2 block">
                            {monthNames[index]}
                          </label>
                          <Input
                            type="number"
                            value={(newRowData[month as keyof CapexACRow] as number) || 0}
                            onChange={(e) => handleNewRowFieldChange(month as keyof CapexACRow, parseFloat(e.target.value) || 0)}
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
                        {formatCurrency(newRowData.total || 0)}
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
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Editar</TableHead>
                  <TableHead className="w-[150px]">Categoria</TableHead>
                  <TableHead className="w-[100px]">País</TableHead>
                  <TableHead className="w-[80px]">Ano</TableHead>
                  <TableHead className="w-[120px]">Tipo de Pagamento</TableHead>
                  <TableHead className="w-[120px]">Centro de Custo</TableHead>
                  <TableHead className="w-[120px]">SAP ID Number</TableHead>
                  {months.map((month) => (
                    <TableHead key={month} className="w-[80px]">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">{month.charAt(0).toUpperCase() + month.slice(1)}</div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{monthNames[months.indexOf(month)]}</p>
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
                  const isEditable = row.input === 'manual/excel';
                  
                  return (
                    <TableRow
                      key={row.id}
                      className={`
                        ${isEditable ? 'hover:bg-blue-50' : 'hover:bg-gray-50'}
                        ${isBeingEdited ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                        ${!isEditable ? 'bg-gray-50' : ''}
                      `}
                    >
                      <TableCell>
                        {isEditable && !isBeingEdited && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleStartEdit(row.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                        {!isEditable && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="cursor-help">
                                <AlertTriangle className="h-4 w-4 text-orange-500" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Dados de integração não podem ser editados</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Select 
                            value={currentValues.categoria || ''} 
                            onValueChange={(value) => handleFieldChange('categoria', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoriaOptions.map((group) => (
                                <div key={group.group} className="space-y-1">
                                  <div className="text-xs font-medium text-muted-foreground px-2 py-1">{group.group}</div>
                                  {group.items.map((item) => (
                                    <SelectItem key={item} value={item}>{item}</SelectItem>
                                  ))}
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm">{row.categoria}</span>
                        )}
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
                      <TableCell>
                        {isBeingEdited ? (
                          <Select 
                            value={currentValues.tipoPagamento || ''} 
                            onValueChange={(value) => handleFieldChange('tipoPagamento', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tipoPagamentoOptions.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          row.tipoPagamento
                        )}
                      </TableCell>
                      <TableCell>
                        {isBeingEdited ? (
                          <Input
                            value={currentValues.centroCusto || ''}
                            onChange={(e) => handleFieldChange('centroCusto', e.target.value)}
                            className="w-full h-8"
                          />
                        ) : (
                          row.centroCusto
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
                      {months.map((month) => (
                        <TableCell key={month}>
                          {isBeingEdited ? (
                            <Input
                              type="number"
                              value={(currentValues[month as keyof CapexACRow] as number) || 0}
                              onChange={(e) => handleFieldChange(month as keyof CapexACRow, parseFloat(e.target.value) || 0)}
                              className="w-20 h-8"
                            />
                          ) : (
                            <span className="text-sm">
                              {formatCurrency(row[month as keyof CapexACRow] as number)}
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
                            {formatCurrency(row.total)}
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
                <p className="text-xs text-blue-600">Revise e confirme as alterações antes de salvar.</p>
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