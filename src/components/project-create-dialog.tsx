import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectCreateDialogProps {
  onProjectCreated?: (project: any) => void;
  trigger?: React.ReactNode;
}

export function ProjectCreateDialog({ onProjectCreated, trigger }: ProjectCreateDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    project_code: '',
    name: '',
    description: '',
    leader: '',
    area: '',
    status: 'Planejado',
    budget: 0,
    currency: 'BRL',
    progress: 0,
    start_date: undefined as Date | undefined,
    deadline: undefined as Date | undefined,
    is_critical: false,
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      project_code: '',
      name: '',
      description: '',
      leader: '',
      area: '',
      status: 'Planejado',
      budget: 0,
      currency: 'BRL',
      progress: 0,
      start_date: undefined,
      deadline: undefined,
      is_critical: false,
    });
  };

  const validateForm = () => {
    if (!formData.project_code.trim()) {
      toast({
        title: "Código obrigatório",
        description: "Por favor, informe o código do projeto.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe o nome do projeto.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.leader.trim()) {
      toast({
        title: "Líder obrigatório",
        description: "Por favor, informe o líder do projeto.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.area) {
      toast({
        title: "Área obrigatória",
        description: "Por favor, selecione a área do projeto.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.budget <= 0) {
      toast({
        title: "Orçamento inválido",
        description: "O orçamento deve ser maior que zero.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (loading) return;

    setLoading(true);

    try {
      // Gerar código único se não fornecido
      const projectCode = formData.project_code || `PRJ-${Date.now()}`;

      const newProject = {
        project_code: projectCode,
        name: formData.name,
        description: formData.description || null,
        leader: formData.leader,
        area: formData.area,
        status: formData.status,
        budget: formData.budget,
        currency: formData.currency,
        progress: formData.progress,
        start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
        deadline: formData.deadline ? format(formData.deadline, "yyyy-MM-dd") : null,
        is_critical: formData.is_critical,
        realized: 0,
        committed: 0,
      };

      // Tentar inserir no banco
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            ...newProject,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;
        
        onProjectCreated?.(data);
      } else {
        // Fallback para modo demo
        const demoProject = {
          id: `demo-${Date.now()}`,
          ...newProject,
          user_id: 'demo-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        onProjectCreated?.(demoProject);
      }

      setOpen(false);
      resetForm();
      
      toast({
        title: "Projeto criado com sucesso!",
        description: `O projeto "${formData.name}" foi criado e está pronto para uso.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar projeto",
        description: error.message || "Não foi possível criar o projeto. Tente novamente.",
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
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project_code">Código do Projeto *</Label>
              <Input
                id="project_code"
                value={formData.project_code}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                placeholder="Ex: PRJ-2025-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Moeda *</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                  <SelectItem value="USD">Dólar (USD)</SelectItem>
                  <SelectItem value="SEK">Coroa Sueca (SEK)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Digite o nome do projeto"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva brevemente o projeto..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leader">Líder do Projeto *</Label>
              <Input
                id="leader"
                value={formData.leader}
                onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                placeholder="Nome do líder"
                required
              />
            </div>
            <div>
              <Label htmlFor="area">Área *</Label>
              <Select 
                value={formData.area} 
                onValueChange={(value) => setFormData({ ...formData, area: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Produção">Produção</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                  <SelectItem value="Internacional">Internacional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status Inicial</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Em Atraso">Em Atraso</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Orçamento *</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                min="0"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) => setFormData({ ...formData, start_date: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Prazo Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={(date) => setFormData({ ...formData, deadline: date })}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="critical"
              checked={formData.is_critical}
              onCheckedChange={(checked) => setFormData({ ...formData, is_critical: checked })}
            />
            <Label htmlFor="critical">Projeto Crítico</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar Projeto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}