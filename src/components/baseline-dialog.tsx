import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BaselineDialogProps {
  projectId: string;
  onBaselineAdded: () => void;
}

export function BaselineDialog({ projectId, onBaselineAdded }: BaselineDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentBaseline, setCurrentBaseline] = useState<number>(0);
  const [formData, setFormData] = useState({
    version: '',
    newBudget: '',
    justification: ''
  });
  const { toast } = useToast();

  // Load the last baseline value when dialog opens
  useEffect(() => {
    if (open) {
      loadLastBaseline();
    }
  }, [open, projectId]);

  const loadLastBaseline = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('baselines')
        .select('budget')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading baseline:', error);
        return;
      }

      setCurrentBaseline(data?.budget || 0);
    } catch (error) {
      console.error('Error loading baseline:', error);
    }
  };

  const isFormValid = () => {
    return formData.version.trim() !== '' && 
           formData.newBudget.trim() !== '' && 
           !isNaN(parseFloat(formData.newBudget)) &&
           formData.justification.trim() !== '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('baselines')
        .insert({
          project_id: projectId,
          version: formData.version,
          budget: parseFloat(formData.newBudget),
          description: formData.justification,
          user_id: user.id
        });

      if (error) throw error;

      onBaselineAdded();
      setOpen(false);
      setFormData({ version: '', newBudget: '', justification: '' });
      toast({
        title: "Baseline criada",
        description: "Nova baseline criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar baseline",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setFormData({ version: '', newBudget: '', justification: '' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          + Nova Baseline
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Baseline</DialogTitle>
          <DialogDescription>
            Crie uma nova baseline para registrar alterações no orçamento do projeto.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="version">Versão</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="ex: v2.0"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="currentBaseline">Valor atual da baseline</Label>
              <Input
                id="currentBaseline"
                type="text"
                value={currentBaseline.toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
                readOnly
                className="mt-1 bg-muted text-muted-foreground"
              />
            </div>

            <div>
              <Label htmlFor="newBudget">Novo valor da baseline *</Label>
              <Input
                id="newBudget"
                type="number"
                step="0.01"
                value={formData.newBudget}
                onChange={(e) => setFormData({ ...formData, newBudget: e.target.value })}
                placeholder="0.00"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="justification">Justificativa para mudança *</Label>
              <Textarea
                id="justification"
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Explique o motivo desta alteração de baseline..."
                rows={4}
                required
                className="mt-1 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isFormValid()}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? "Salvando..." : "Confirmar Baseline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}