import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Edit3 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
interface Project {
  id?: string;
  project_code: string;
  name: string;
  description?: string;
  leader: string;
  area: string;
  status: string;
  budget: number;
  currency: string;
  progress: number;
  start_date?: Date;
  deadline?: Date;
  is_critical: boolean;
}
interface ProjectEditDialogProps {
  project: Project;
  onProjectUpdate: (project: Project) => void;
}
export function ProjectEditDialog({
  project,
  onProjectUpdate
}: ProjectEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Project>(project);
  const {
    toast
  } = useToast();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If this is mock data, just update the local state
      if (project.id === "mock-uuid-001" || !project.id?.includes("-")) {
        console.log("Updating mock project data");
        onProjectUpdate(formData);
        setOpen(false);
        toast({
          title: "Projeto atualizado (modo demo)",
          description: "As alterações foram salvas localmente."
        });
        return;
      }

      // Otherwise try to update in database
      const {
        error
      } = await supabase.from('projects').update({
        name: formData.name,
        description: formData.description,
        leader: formData.leader,
        area: formData.area,
        status: formData.status,
        budget: formData.budget,
        currency: formData.currency,
        progress: formData.progress,
        start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
        deadline: formData.deadline ? format(formData.deadline, "yyyy-MM-dd") : null,
        is_critical: formData.is_critical
      }).eq('project_code', project.project_code);
      if (error) throw error;
      onProjectUpdate(formData);
      setOpen(false);
      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Projeto</DialogTitle>
          <DialogDescription>
            Modifique as informações do projeto abaixo. Todas as alterações serão salvas automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Projeto</Label>
              <Input id="name" value={formData.name} onChange={e => setFormData({
              ...formData,
              name: e.target.value
            })} required />
            </div>
            <div>
              <Label htmlFor="leader">Líder do Projeto</Label>
              <Input id="leader" value={formData.leader} onChange={e => setFormData({
              ...formData,
              leader: e.target.value
            })} required />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" value={formData.description || ''} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} rows={3} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="area">Área</Label>
              <Select value={formData.area} onValueChange={value => setFormData({
              ...formData,
              area: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TI">TI</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={value => setFormData({
              ...formData,
              status: value
            })}>
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
              <Label htmlFor="currency">Moeda</Label>
              <Select value={formData.currency} onValueChange={value => setFormData({
              ...formData,
              currency: value
            })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="SEK">SEK</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Orçamento</Label>
              <Input id="budget" type="number" step="0.01" value={formData.budget} onChange={e => setFormData({
              ...formData,
              budget: parseFloat(e.target.value) || 0
            })} required />
            </div>
            <div>
              <Label htmlFor="progress">Progresso (%)</Label>
              <Input id="progress" type="number" min="0" max="100" value={formData.progress} onChange={e => setFormData({
              ...formData,
              progress: parseInt(e.target.value) || 0
            })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.start_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.start_date} onSelect={date => setFormData({
                  ...formData,
                  start_date: date
                })} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Prazo Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !formData.deadline && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.deadline ? format(formData.deadline, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.deadline} onSelect={date => setFormData({
                  ...formData,
                  deadline: date
                })} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="critical" checked={formData.is_critical} onCheckedChange={checked => setFormData({
            ...formData,
            is_critical: checked
          })} />
            <Label htmlFor="critical">Projeto Crítico</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>;
}