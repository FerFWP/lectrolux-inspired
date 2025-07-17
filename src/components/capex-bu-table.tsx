import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pencil, Check, X, Users, Search, Filter, AlertTriangle, Calendar } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

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
}

interface CapexBUTableProps {
  project: any;
}

const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export function CapexBUTable({ project }: CapexBUTableProps) {
  const [data, setData] = useState<CapexBURow[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAno, setFilterAno] = useState<string>('all');
  const [filterCategoria, setFilterCategoria] = useState<string>('all');
  const [filterPais, setFilterPais] = useState<string>('all');
  const [filterNomeProjeto, setFilterNomeProjeto] = useState<string>('all');
  
  // Considerando todos os usuários como PMO por enquanto
  const isPMO = true;

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
        isActive: true
      }
    ];
    
    setData(initialData);
  }, [project]);

  const formatCurrency = (value: number, currency: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleCellEdit = (rowId: string, field: string, currentValue: any) => {
    setEditingCell({ rowId, field });
    setEditValue(currentValue.toString());
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;

    const { rowId, field } = editingCell;
    const newValue = parseFloat(editValue) || 0;
    
    // Encontrar a linha original
    const originalRow = data.find(row => row.id === rowId);
    if (!originalRow) return;

    // Criar nova linha com os dados atualizados
    const newRow: CapexBURow = {
      ...originalRow,
      id: Date.now().toString(),
      [field]: newValue,
      dataAtualizacao: new Date().toLocaleDateString('pt-BR'),
      version: originalRow.version + 1,
      isActive: true
    };

    // Recalcular total se foi editado um mês
    if (months.includes(field)) {
      newRow.total = months.reduce((sum, month) => sum + (newRow[month as keyof CapexBURow] as number), 0);
    } else if (field === 'total') {
      // Se editou o total, distribuir proporcionalmente pelos meses
      const currentTotal = months.reduce((sum, month) => sum + (originalRow[month as keyof CapexBURow] as number), 0);
      if (currentTotal > 0) {
        months.forEach(month => {
          const proportion = (originalRow[month as keyof CapexBURow] as number) / currentTotal;
          (newRow as any)[month] = Math.round(newValue * proportion);
        });
      }
    }

    // Marcar a linha original como não ativa
    const updatedData = data.map(row => 
      row.id === rowId ? { ...row, isActive: false } : row
    );

    // Adicionar a nova linha
    updatedData.push(newRow);

    // Ordenar por SAP ID e versão (mais recente primeiro)
    const sortedData = updatedData.sort((a, b) => {
      if (a.sapId !== b.sapId) return a.sapId.localeCompare(b.sapId);
      return b.version - a.version;
    });

    setData(sortedData);
    setEditingCell(null);
    setEditValue('');

    toast({
      title: "Valor atualizado",
      description: "Nova versão da linha foi criada com sucesso.",
    });
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
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
          <CardTitle>Capex BU - Detalhamento Financeiro</CardTitle>
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
                {filteredData.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`
                      ${row.isActive ? 'bg-green-50 border-l-4 border-l-green-500' : 'bg-gray-50 opacity-70'}
                      ${row.isActive ? 'hover:bg-green-100' : 'hover:bg-gray-100'}
                    `}
                  >
                    {isPMO && (
                      <TableCell>
                        {row.isActive && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleCellEdit(row.id, 'categoria', row.categoria)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{row.categoria}</span>
                        {row.isActive && (
                          <Badge variant="outline" className="text-xs text-muted-foreground border-muted-foreground/40">
                            Versão atual
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{row.pais}</TableCell>
                    <TableCell>{row.ano}</TableCell>
                    <TableCell className="font-mono">{row.sapId}</TableCell>
                    {months.map((month) => (
                      <TableCell key={month}>
                        {editingCell?.rowId === row.id && editingCell?.field === month ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-20 h-8"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className="text-sm">
                              {formatCurrency(row[month as keyof CapexBURow] as number, project.currency)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      {editingCell?.rowId === row.id && editingCell?.field === 'total' ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 h-8"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                          />
                          <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium">
                            {formatCurrency(row.total, project.currency)}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{row.nomeProjeto}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{row.dataAtualizacao}</span>
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
  );
}