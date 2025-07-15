import { useState } from "react";
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
  const [formData, setFormData] = useState({
    version: '',
    budget: 0,
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('baselines')
        .insert({
          project_id: projectId,
          version: formData.version,
          budget: formData.budget,
          description: formData.description,
          user_id: user.id
        });

      if (error) throw error;

      onBaselineAdded();
      setOpen(false);
      setFormData({ version: '', budget: 0, description: '' });
      toast({
        title: "Baseline salva",
        description: "Nova baseline criada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar baseline",
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
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Salvar Baseline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Nova Baseline</DialogTitle>
          <DialogDescription>
            Crie uma nova baseline para registrar o estado atual do projeto e permitir comparações futuras.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="version">Versão</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              placeholder="ex: v2.0"
              required
            />
          </div>

          <div>
            <Label htmlFor="budget">Orçamento</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as mudanças desta baseline..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Baseline"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}