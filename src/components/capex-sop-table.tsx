import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Check, ChevronRight, ChevronDown } from "lucide-react";
import { useCurrency } from "@/contexts/currency-context";

interface Project {
  id: string;
  name: string;
  project_code: string;
  currency: string;
}

interface CapexSOPTableProps {
  project: Project;
}

interface CapexSOPItem {
  id: string;
  categoria: string;
  pais: string;
  ano: number;
  centroCusto: string;
  sapIdNumber: string;
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
  nomeProjeto: string;
  dataAtualizacao: string;
  aprovadoBU?: number;
  valorDisponivel?: number;
  realizadoAtual?: number;
  realizadoAvancado?: number;
  realizadoComprometido?: number;
}

const categoriaOptions = [
  { value: "Expenses", label: "Expenses" },
  { value: "Software", label: "Software" },
  { value: "Custo de Mão de Obra", label: "Custo de Mão de Obra" },
  { value: "Outros intangíveis", label: "Outros intangíveis" },
  { value: "Ferramentas e Moldes", label: "Ferramentas e Moldes" },
  { value: "Máquinas e equipamentos", label: "Máquinas e equipamentos" },
  { value: "Veículos", label: "Veículos" },
  { value: "Mobília e Utensílios", label: "Mobília e Utensílios" },
  { value: "Hardware", label: "Hardware" },
  { value: "Construção", label: "Construção" },
  { value: "Instalações industriais", label: "Instalações industriais" },
  { value: "Terrenos", label: "Terrenos" }
];

export function CapexSOPTable({ project }: CapexSOPTableProps) {
  const { selectedCurrency, convertAmount } = useCurrency();
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showExtraColumns, setShowExtraColumns] = useState(false);

  // Mock data for demonstration
  const [sopData, setSopData] = useState<CapexSOPItem[]>([
    {
      id: "1",
      categoria: "Máquinas e equipamentos",
      pais: "Brasil",
      ano: 2024,
      centroCusto: "CC1001",
      sapIdNumber: "SAP001",
      jan: 50000,
      fev: 45000,
      mar: 60000,
      abr: 55000,
      mai: 40000,
      jun: 70000,
      jul: 65000,
      ago: 50000,
      set: 55000,
      out: 60000,
      nov: 45000,
      dez: 75000,
      nomeProjeto: project.name,
      dataAtualizacao: "2024-01-15",
      aprovadoBU: 675000,
      valorDisponivel: 625000,
      realizadoAtual: 320000,
      realizadoAvancado: 280000,
      realizadoComprometido: 75000
    },
    {
      id: "2",
      categoria: "Software",
      pais: "Brasil",
      ano: 2024,
      centroCusto: "CC1002",
      sapIdNumber: "SAP002",
      jan: 15000,
      fev: 15000,
      mar: 20000,
      abr: 18000,
      mai: 12000,
      jun: 25000,
      jul: 22000,
      ago: 15000,
      set: 18000,
      out: 20000,
      nov: 15000,
      dez: 25000,
      nomeProjeto: project.name,
      dataAtualizacao: "2024-01-20",
      aprovadoBU: 220000,
      valorDisponivel: 200000,
      realizadoAtual: 98000,
      realizadoAvancado: 85000,
      realizadoComprometido: 17000
    }
  ]);

  const formatCurrency = (amount: number) => {
    const symbols = { BRL: "R$", USD: "$", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$", CHF: "₣", CNY: "¥", INR: "₹" };
    const convertedAmount = convertAmount(amount, project.currency || 'BRL');
    return `${symbols[selectedCurrency as keyof typeof symbols] || selectedCurrency} ${convertedAmount.toLocaleString("pt-BR")}`;
  };

  const calculateTotal = (item: CapexSOPItem) => {
    return item.jan + item.fev + item.mar + item.abr + item.mai + item.jun +
           item.jul + item.ago + item.set + item.out + item.nov + item.dez;
  };

  const handleFieldEdit = (rowId: string, field: string, value: any) => {
    setSopData(prev => prev.map(item => 
      item.id === rowId ? { ...item, [field]: value } : item
    ));
    setEditingRow(null);
    setEditingField(null);
  };

  const months = [
    { key: 'jan', label: 'Jan' },
    { key: 'fev', label: 'Fev' },
    { key: 'mar', label: 'Mar' },
    { key: 'abr', label: 'Abr' },
    { key: 'mai', label: 'Mai' },
    { key: 'jun', label: 'Jun' },
    { key: 'jul', label: 'Jul' },
    { key: 'ago', label: 'Ago' },
    { key: 'set', label: 'Set' },
    { key: 'out', label: 'Out' },
    { key: 'nov', label: 'Nov' },
    { key: 'dez', label: 'Dez' }
  ];

  const renderEditableCell = (item: CapexSOPItem, field: string, value: any, type: 'text' | 'number' | 'select' = 'text') => {
    const isEditing = editingRow === item.id && editingField === field;
    
    if (isEditing) {
      if (type === 'select' && field === 'categoria') {
        return (
          <div className="flex items-center gap-1">
            <Select 
              value={value} 
              onValueChange={(newValue) => handleFieldEdit(item.id, field, newValue)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoriaOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      } else {
        return (
          <div className="flex items-center gap-1">
            <Input
              type={type}
              value={value}
              onChange={(e) => {
                const newValue = type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                handleFieldEdit(item.id, field, newValue);
              }}
              className="w-32"
              autoFocus
            />
          </div>
        );
      }
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">
          {type === 'number' && typeof value === 'number' ? formatCurrency(value) : value}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={() => {
            setEditingRow(item.id);
            setEditingField(field);
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  };

  const renderReadOnlyCell = (value: number) => (
    <span className="text-sm font-medium text-muted-foreground">
      {formatCurrency(value)}
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projeto Capex SOP</h3>
        <Button
          variant="outline"
          onClick={() => setShowExtraColumns(!showExtraColumns)}
          className="gap-2"
        >
          {showExtraColumns ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          Colunas Extras
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tabela Projeto Capex SOP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Categoria</TableHead>
                  <TableHead className="w-[100px]">País</TableHead>
                  <TableHead className="w-[80px]">Ano</TableHead>
                  <TableHead className="w-[120px]">Centro de Custo</TableHead>
                  <TableHead className="w-[140px]">SAP ID Number</TableHead>
                  {months.map(month => (
                    <TableHead key={month.key} className="w-[100px]">{month.label}</TableHead>
                  ))}
                  <TableHead className="w-[120px]">Total</TableHead>
                  <TableHead className="w-[200px]">Nome Projeto</TableHead>
                  <TableHead className="w-[140px]">Data Atualização</TableHead>
                  {showExtraColumns && (
                    <>
                      <TableHead className="w-[120px]">Aprovado BU</TableHead>
                      <TableHead className="w-[130px]">Valor Disponível</TableHead>
                      <TableHead className="w-[130px]">Realizado Atual</TableHead>
                      <TableHead className="w-[140px]">Realizado Avançado</TableHead>
                      <TableHead className="w-[160px]">Realizado Comprometido</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sopData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="w-[180px]">
                      {renderEditableCell(item, 'categoria', item.categoria, 'select')}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {renderEditableCell(item, 'pais', item.pais)}
                    </TableCell>
                    <TableCell className="w-[80px]">
                      {renderEditableCell(item, 'ano', item.ano, 'number')}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      {renderEditableCell(item, 'centroCusto', item.centroCusto)}
                    </TableCell>
                    <TableCell className="w-[140px]">
                      {renderEditableCell(item, 'sapIdNumber', item.sapIdNumber)}
                    </TableCell>
                    {months.map(month => (
                      <TableCell key={month.key} className="w-[100px]">
                        {renderEditableCell(item, month.key, item[month.key as keyof CapexSOPItem], 'number')}
                      </TableCell>
                    ))}
                    <TableCell className="w-[120px]">
                      <span className="text-sm font-semibold">
                        {formatCurrency(calculateTotal(item))}
                      </span>
                    </TableCell>
                    <TableCell className="w-[200px]">
                      {renderEditableCell(item, 'nomeProjeto', item.nomeProjeto)}
                    </TableCell>
                    <TableCell className="w-[140px]">
                      {renderEditableCell(item, 'dataAtualizacao', item.dataAtualizacao)}
                    </TableCell>
                    {showExtraColumns && (
                      <>
                        <TableCell className="w-[120px]">
                          {renderReadOnlyCell(item.aprovadoBU || 0)}
                        </TableCell>
                        <TableCell className="w-[130px]">
                          {renderReadOnlyCell(item.valorDisponivel || 0)}
                        </TableCell>
                        <TableCell className="w-[130px]">
                          {renderReadOnlyCell(item.realizadoAtual || 0)}
                        </TableCell>
                        <TableCell className="w-[140px]">
                          {renderReadOnlyCell(item.realizadoAvancado || 0)}
                        </TableCell>
                        <TableCell className="w-[160px]">
                          {renderReadOnlyCell(item.realizadoComprometido || 0)}
                        </TableCell>
                      </>
                    )}
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