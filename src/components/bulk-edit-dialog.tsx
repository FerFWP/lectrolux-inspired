import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw,
  Zap,
  CheckCircle
} from "lucide-react";

interface BulkEditItem {
  id: string;
  name: string;
  code: string;
  currentValue: any;
  field: string;
  type: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
}

interface BulkEditDialogProps {
  items: BulkEditItem[];
  field: string;
  fieldLabel: string;
  onSave: (updates: { id: string; value: any }[]) => Promise<void>;
  trigger?: React.ReactNode;
}

export function BulkEditDialog({ 
  items, 
  field, 
  fieldLabel, 
  onSave, 
  trigger 
}: BulkEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkValue, setBulkValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkSave = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Nenhum item selecionado",
        description: "Selecione pelo menos um item para atualizar.",
        variant: "destructive",
      });
      return;
    }

    if (!bulkValue.trim()) {
      toast({
        title: "Valor obrigatório",
        description: "Digite um valor para aplicar aos itens selecionados.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      const updates = selectedItems.map(id => ({
        id,
        value: bulkValue
      }));

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onSave(updates);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast({
        title: "✅ Atualização em lote concluída!",
        description: `${selectedItems.length} item(s) atualizado(s) com sucesso!`,
        className: "bg-green-50 border-green-200",
      });

      setTimeout(() => {
        setOpen(false);
        setSelectedItems([]);
        setBulkValue("");
        setProgress(0);
      }, 1000);

    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Tente novamente ou contate o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleItem = items[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edição em Lote
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Edição em Lote - {fieldLabel}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Atualizando itens...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Value Input */}
          <div className="space-y-3">
            <Label htmlFor="bulkValue">Valor para aplicar a todos os itens selecionados</Label>
            
            {sampleItem?.type === 'select' && sampleItem?.options ? (
              <Select value={bulkValue} onValueChange={setBulkValue}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${fieldLabel.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {sampleItem.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="bulkValue"
                type={sampleItem?.type || 'text'}
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                placeholder={`Digite o novo ${fieldLabel.toLowerCase()}`}
                disabled={isLoading}
              />
            )}
          </div>

          {/* Items Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Selecionar itens ({selectedItems.length} de {items.length})</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoading}
              >
                {selectedItems.length === items.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
              </Button>
            </div>
            
            <div className="border rounded-md max-h-60 overflow-y-auto">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center space-x-3 p-3 border-b last:border-b-0 hover:bg-muted/50 ${
                    selectedItems.includes(item.id) ? 'bg-blue-50' : ''
                  }`}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleItemToggle(item.id)}
                    disabled={isLoading}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Atual:</p>
                        <Badge variant="outline" className="text-xs">
                          {item.currentValue}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {selectedItems.length > 0 && bulkValue && (
            <div className="bg-blue-50 p-4 rounded-lg border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Prévia da Atualização
              </h4>
              <p className="text-sm text-blue-700">
                {selectedItems.length} item(s) terão o campo "{fieldLabel}" atualizado para: 
                <span className="font-medium"> {bulkValue}</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleBulkSave}
              disabled={isLoading || selectedItems.length === 0}
              className="min-w-32"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Salvar ({selectedItems.length})
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}