import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Upload, Building2, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TransactionDialogProps {
  projectId: string;
  onTransactionAdded: () => void;
  trigger?: React.ReactNode;
}

export function TransactionDialog({ projectId, onTransactionAdded, trigger }: TransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    category: '',
    supplier: '',
    cost_center: '',
    transaction_type: 'manual',
    transaction_date: new Date(),
    notes: '',
    reference_number: '',
    capex_opex: '',
    asset_nature: '',
    attachments: [] as File[]
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('transactions')
        .insert({
          project_id: projectId,
          description: formData.description,
          amount: formData.amount,
          category: formData.category,
          transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
          transaction_type: formData.transaction_type,
          user_id: user.id
        });

      if (error) throw error;

      onTransactionAdded();
      setOpen(false);
      setFormData({ 
        description: '', 
        amount: 0, 
        category: '', 
        supplier: '',
        cost_center: '',
        transaction_type: 'manual',
        transaction_date: new Date(),
        notes: '',
        reference_number: '',
        capex_opex: '',
        asset_nature: '',
        attachments: []
      });
      toast({
        title: "Lançamento adicionado",
        description: "Nova transação criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar lançamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Lançamento</DialogTitle>
          <DialogDescription>
            Registre um novo lançamento financeiro para o projeto. Preencha todos os campos obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Informações Básicas</h4>
            
            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do lançamento"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Data da Transação *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !formData.transaction_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.transaction_date ? format(formData.transaction_date, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.transaction_date}
                      onSelect={(date) => setFormData({ ...formData, transaction_date: date || new Date() })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Classificação */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Classificação</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecionar categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software">Software</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Serviços">Serviços</SelectItem>
                    <SelectItem value="Consultoria">Consultoria</SelectItem>
                    <SelectItem value="Licenças">Licenças</SelectItem>
                    <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                    <SelectItem value="Treinamento">Treinamento</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="transaction_type">Tipo</Label>
                <Select 
                  value={formData.transaction_type} 
                  onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="imported">Importado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Classificação CAPEX/OPEX */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Classificação CAPEX/OPEX *</Label>
                <Select 
                  value={formData.capex_opex || ''} 
                  onValueChange={(value) => setFormData({ ...formData, capex_opex: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAPEX">
                      <div className="flex flex-col">
                        <span>CAPEX</span>
                        <span className="text-xs text-muted-foreground">Investimento de capital</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="OPEX">
                      <div className="flex flex-col">
                        <span>OPEX</span>
                        <span className="text-xs text-muted-foreground">Gasto operacional</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Natureza do Ativo</Label>
                <Select 
                  value={formData.asset_nature || ''} 
                  onValueChange={(value) => setFormData({ ...formData, asset_nature: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tangível">
                      <div className="flex flex-col">
                        <span>Tangível</span>
                        <span className="text-xs text-muted-foreground">Ativo físico</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Intangível">
                      <div className="flex flex-col">
                        <span>Intangível</span>
                        <span className="text-xs text-muted-foreground">Software, licenças</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Informações Adicionais</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supplier">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Fornecedor
                </Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  placeholder="Nome do fornecedor"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="cost_center">Centro de Custo</Label>
                <Select 
                  value={formData.cost_center} 
                  onValueChange={(value) => setFormData({ ...formData, cost_center: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecionar CC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TI-001">TI-001 - Infraestrutura</SelectItem>
                    <SelectItem value="TI-002">TI-002 - Desenvolvimento</SelectItem>
                    <SelectItem value="TI-003">TI-003 - Suporte</SelectItem>
                    <SelectItem value="ADM-001">ADM-001 - Administrativo</SelectItem>
                    <SelectItem value="FIN-001">FIN-001 - Financeiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reference_number">
                <FileText className="h-4 w-4 inline mr-1" />
                Número de Referência/NF
              </Label>
              <Input
                id="reference_number"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                placeholder="Ex: NF-12345, PO-67890"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informações adicionais, justificativas, etc."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Anexos com Drag & Drop */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Documentos e Comprovantes</h4>
            <div 
              className="border-2 border-dashed border-primary/25 rounded-lg p-6 text-center transition-colors hover:border-primary/50 cursor-pointer bg-primary/5"
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="text-sm font-medium text-primary mb-1">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG, XLSX até 10MB cada • Múltiplos arquivos aceitos
              </p>
              <input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    setFormData({ ...formData, attachments: [...formData.attachments, ...files] });
                  }
                }}
              />
            </div>
            
            {/* Lista de arquivos selecionados */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Arquivos Selecionados:</h5>
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <span>{file.name}</span>
                    <Button 
                      type="button"
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        const newAttachments = formData.attachments.filter((_, i) => i !== index);
                        setFormData({ ...formData, attachments: newAttachments });
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Validação visual */}
            <div className="text-xs text-muted-foreground">
              ✅ Comprovantes anexados aumentam a confiabilidade do lançamento
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Criar Lançamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}