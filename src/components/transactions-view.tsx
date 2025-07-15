import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Plus, 
  Upload, 
  Paperclip, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  FileText,
  AlertTriangle,
  TrendingUp,
  HelpCircle,
  Calendar,
  DollarSign,
  Building2,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { TransactionDialog } from "@/components/transaction-dialog";
import { useToast } from "@/hooks/use-toast";

interface TransactionsViewProps {
  project: any;
  transactions: any[];
  onTransactionAdded?: () => void;
  onImportSAP?: () => void;
  onAttachDocument?: (transactionId: string) => void;
}

export function TransactionsView({ 
  project, 
  transactions, 
  onTransactionAdded, 
  onImportSAP, 
  onAttachDocument 
}: TransactionsViewProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    type: "all",
    supplier: "all",
    minAmount: "",
    maxAmount: "",
    dateRange: null as any
  });
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string = "BRL") => {
    const symbols = { BRL: "R$", USD: "$", SEK: "kr" };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toLocaleString("pt-BR")}`;
  };

  // Enhanced mock transactions with more fields
  const enhancedTransactions = transactions.map(t => ({
    ...t,
    supplier: ["SAP AG", "Microsoft Corp", "Oracle Brasil", "Accenture", "IBM"][Math.floor(Math.random() * 5)],
    cost_center: ["TI-001", "TI-002", "ADM-001", "FIN-001"][Math.floor(Math.random() * 4)],
    attachment: Math.random() > 0.3,
    created_by: "João Silva",
    approved_by: Math.random() > 0.2 ? "Maria Santos" : null,
    is_suspicious: Math.random() > 0.85,
    integration_source: t.transaction_type === "imported" ? "SAP" : "Manual"
  }));

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return enhancedTransactions.filter(transaction => {
      const matchesSearch = !filters.search || 
        transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.supplier.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = filters.category === "all" || transaction.category === filters.category;
      const matchesType = filters.type === "all" || transaction.transaction_type === filters.type;
      const matchesSupplier = filters.supplier === "all" || transaction.supplier === filters.supplier;
      
      const matchesMinAmount = !filters.minAmount || transaction.amount >= parseFloat(filters.minAmount);
      const matchesMaxAmount = !filters.maxAmount || transaction.amount <= parseFloat(filters.maxAmount);
      
      return matchesSearch && matchesCategory && matchesType && matchesSupplier && matchesMinAmount && matchesMaxAmount;
    });
  }, [enhancedTransactions, filters]);

  // Get unique values for filter dropdowns
  const uniqueCategories = [...new Set(enhancedTransactions.map(t => t.category))];
  const uniqueSuppliers = [...new Set(enhancedTransactions.map(t => t.supplier))];

  // Calculate indicators
  const indicators = useMemo(() => {
    const amounts = filteredTransactions.map(t => t.amount);
    const maxTransaction = Math.max(...amounts);
    const avgTransaction = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const suspiciousCount = filteredTransactions.filter(t => t.is_suspicious).length;
    const highValueCount = filteredTransactions.filter(t => t.amount > avgTransaction * 2).length;

    return {
      maxTransaction,
      avgTransaction,
      suspiciousCount,
      highValueCount,
      totalAmount: amounts.reduce((a, b) => a + b, 0)
    };
  }, [filteredTransactions]);

  const exportTransactions = () => {
    const csvContent = filteredTransactions.map(t => 
      `${format(new Date(t.transaction_date), 'dd/MM/yyyy')},${t.description},${t.category},${t.supplier},${t.amount},${t.transaction_type}`
    ).join('\n');
    
    const blob = new Blob([`Data,Descrição,Categoria,Fornecedor,Valor,Tipo\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transacoes-${project.project_code}.csv`;
    a.click();
    
    toast({
      title: "Exportação Concluída",
      description: "Arquivo de transações baixado com sucesso.",
    });
  };

  const TransactionDetailDialog = ({ transaction }: { transaction: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Transação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Descrição</Label>
              <p className="text-sm">{transaction.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Valor</Label>
              <p className="text-lg font-bold">{formatCurrency(transaction.amount)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Data</Label>
              <p className="text-sm">{format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Categoria</Label>
              <Badge variant="outline">{transaction.category}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Fornecedor</Label>
              <p className="text-sm">{transaction.supplier}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Centro de Custo</Label>
              <p className="text-sm">{transaction.cost_center}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Tipo</Label>
              <Badge variant={transaction.transaction_type === 'manual' ? 'default' : 'secondary'}>
                {transaction.transaction_type === 'manual' ? 'Manual' : 'Automático'}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Origem</Label>
              <p className="text-sm">{transaction.integration_source}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-sm font-medium">Auditoria</Label>
            <div className="mt-2 space-y-2 text-sm">
              <p>📝 Criado por: {transaction.created_by}</p>
              <p>📅 Data de criação: {format(new Date(transaction.created_at || new Date()), 'dd/MM/yyyy HH:mm')}</p>
              {transaction.approved_by && (
                <p>✅ Aprovado por: {transaction.approved_by}</p>
              )}
              {transaction.attachment && (
                <p>📎 Possui comprovante anexado</p>
              )}
              {transaction.is_suspicious && (
                <p className="text-orange-600">⚠️ Transação marcada para revisão</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Paperclip className="h-4 w-4 mr-2" />
              Ver Anexos
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Log Completo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Transações Realizadas</h3>
          <div className="flex gap-2">
            <TransactionDialog 
              projectId={project.id || "mock-project-id"}
              onTransactionAdded={onTransactionAdded || (() => {})}
              trigger={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lançamento
                </Button>
              }
            />
            <Button size="sm" variant="outline" onClick={onImportSAP}>
              <Upload className="h-4 w-4 mr-2" />
              Importar SAP
            </Button>
            <Button size="sm" variant="outline" onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Realizado</p>
                  <p className="text-2xl font-bold">{formatCurrency(indicators.totalAmount)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maior Lançamento</p>
                  <p className="text-2xl font-bold">{formatCurrency(indicators.maxTransaction)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Acima do Planejado</p>
                  <p className="text-2xl font-bold">{indicators.highValueCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Para Revisão</p>
                  <p className="text-2xl font-bold">{indicators.suspiciousCount}</p>
                </div>
                <Eye className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Descrição ou fornecedor..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Categoria</Label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {uniqueCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="imported">Automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Fornecedor</Label>
                <Select value={filters.supplier} onValueChange={(value) => setFilters(prev => ({ ...prev, supplier: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os fornecedores</SelectItem>
                    {uniqueSuppliers.map(supplier => (
                      <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Valor Mínimo</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.minAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Valor Máximo</Label>
                <Input
                  type="number"
                  placeholder="999999"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Lançamentos ({filteredTransactions.length} de {enhancedTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Data
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Data do lançamento contábil</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Categoria
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Classificação do gasto (CAPEX/OPEX)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Tipo
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Manual (inserido pelo usuário) ou Automático (integração SAP)</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>C. Custo</TableHead>
                    <TableHead>Anexo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className={transaction.is_suspicious ? "bg-orange-50" : ""}>
                      <TableCell>
                        {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === 'manual' ? 'default' : 'secondary'}>
                          {transaction.transaction_type === 'manual' ? 'Manual' : 'Auto'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{transaction.supplier}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {transaction.cost_center}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {transaction.attachment ? (
                          <Paperclip className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {transaction.is_suspicious && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Revisar
                          </Badge>
                        )}
                        {!transaction.approved_by && !transaction.is_suspicious && (
                          <Badge variant="outline" className="text-xs">
                            Pendente
                          </Badge>
                        )}
                        {transaction.approved_by && !transaction.is_suspicious && (
                          <Badge variant="outline" className="text-xs border-green-500 text-green-600">
                            Aprovado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <TransactionDetailDialog transaction={transaction} />
                          <Button size="sm" variant="ghost" onClick={() => onAttachDocument?.(transaction.id)}>
                            <Paperclip className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}