import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
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
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  
  const [formData, setFormData] = useState({
    // Dados Gerais
    project_code: '',
    name: '',
    description: '',
    currency: 'BRL',
    budget: 0,
    area: '',
    directorate: '',
    plant: '',
    country: '',
    
    // Classificação e Identificação
    category: '',
    product_line: '',
    sap_id: '',
    stages: '',
    is_it_project: false,
    it_responsible: '',
    investment_type: 'CAPEX',
    input_type: 'Manual/Excel',
    status: 'Planejado',
    is_critical: false,
    
    // Justificativa e Resultados
    justification: '',
    results_benefits: '',
    start_date: undefined as Date | undefined,
    deadline: undefined as Date | undefined,
    
    // Dados iniciais das tabelas
    capex_ir: [{
      category: '',
      year: new Date().getFullYear(),
      country: '',
      sap_id: '',
      initial_value: 0,
      total: 0,
      project_name: '',
      update_date: new Date()
    }],
    capex_bu: [{
      category: '',
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    }],
    capex_ac: [{
      category: '',
      payment_type: '',
      cost_center: '',
      sap_id: '',
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    }],
    capex_sop: [{
      category: '',
      year_1: 0,
      year_2: 0,
      year_3: 0,
      total: 0
    }]
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      project_code: '',
      name: '',
      description: '',
      currency: 'BRL',
      budget: 0,
      area: '',
      directorate: '',
      plant: '',
      country: '',
      category: '',
      product_line: '',
      sap_id: '',
      stages: '',
      is_it_project: false,
      it_responsible: '',
      investment_type: 'CAPEX',
      input_type: 'Manual/Excel',
      status: 'Planejado',
      is_critical: false,
      justification: '',
      results_benefits: '',
      start_date: undefined,
      deadline: undefined,
      capex_ir: [{
        category: '',
        year: new Date().getFullYear(),
        country: '',
        sap_id: '',
        initial_value: 0,
        total: 0,
        project_name: '',
        update_date: new Date()
      }],
      capex_bu: [{
        category: '',
        jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
        jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
        total: 0
      }],
      capex_ac: [{
        category: '',
        payment_type: '',
        cost_center: '',
        sap_id: '',
        jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
        jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
        total: 0
      }],
      capex_sop: [{
        category: '',
        year_1: 0,
        year_2: 0,
        year_3: 0,
        total: 0
      }]
    });
    setCurrentStep(1);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: // Dados Gerais
        if (!formData.project_code.trim()) {
          toast({ title: "Código obrigatório", description: "Por favor, informe o código do projeto.", variant: "destructive" });
          return false;
        }
        if (!formData.name.trim()) {
          toast({ title: "Nome obrigatório", description: "Por favor, informe o nome do projeto.", variant: "destructive" });
          return false;
        }
        if (formData.budget <= 0) {
          toast({ title: "Orçamento inválido", description: "O orçamento deve ser maior que zero.", variant: "destructive" });
          return false;
        }
        if (!formData.area) {
          toast({ title: "Área obrigatória", description: "Por favor, selecione a área do projeto.", variant: "destructive" });
          return false;
        }
        break;
      case 2: // Classificação
        if (!formData.category) {
          toast({ title: "Categoria obrigatória", description: "Por favor, selecione a categoria do projeto.", variant: "destructive" });
          return false;
        }
        if (formData.sap_id && !/^BR\d{7}$/.test(formData.sap_id)) {
          toast({ title: "SAP ID inválido", description: "O SAP ID deve seguir o formato BRxxxxxxx.", variant: "destructive" });
          return false;
        }
        break;
      case 3: // Justificativa
        if (!formData.justification.trim()) {
          toast({ title: "Justificativa obrigatória", description: "Por favor, informe a justificativa do projeto.", variant: "destructive" });
          return false;
        }
        break;
      case 4: // Dados das tabelas
        // Validar se pelo menos uma linha foi preenchida adequadamente em cada tabela
        const hasValidCapexIR = formData.capex_ir.some(row => row.category && row.total > 0);
        const hasValidCapexBU = formData.capex_bu.some(row => row.category && row.total > 0);
        const hasValidCapexAC = formData.capex_ac.some(row => row.category && row.total > 0);
        const hasValidCapexSOP = formData.capex_sop.some(row => row.category && row.total > 0);
        
        if (!hasValidCapexIR) {
          toast({ title: "Capex IR obrigatório", description: "Preencha pelo menos uma linha válida no Capex IR.", variant: "destructive" });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todas as etapas antes de criar
    for (let step = 1; step <= 4; step++) {
      if (!validateStep(step)) return;
    }
    
    if (loading) return;
    setLoading(true);

    try {
      const projectCode = formData.project_code || `PRJ-${Date.now()}`;

      const newProject = {
        project_code: projectCode,
        name: formData.name,
        description: formData.description || null,
        leader: formData.justification, // Usando justificativa como leader temporariamente
        area: formData.area,
        status: formData.status,
        budget: formData.budget,
        currency: formData.currency,
        progress: 0,
        start_date: formData.start_date ? format(formData.start_date, "yyyy-MM-dd") : null,
        deadline: formData.deadline ? format(formData.deadline, "yyyy-MM-dd") : null,
        is_critical: formData.is_critical,
        realized: 0,
        committed: 0,
      };

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1(); // Dados Gerais
      case 2:
        return renderStep2(); // Classificação e Identificação
      case 3:
        return renderStep3(); // Justificativa e Resultados
      case 4:
        return renderStep4(); // Dados das Tabelas
      case 5:
        return renderStep5(); // Revisão Final
      default:
        return null;
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Gerais</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="project_code">Código do Projeto *</Label>
          <Input
            id="project_code"
            value={formData.project_code}
            onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
            placeholder="Ex: PRJ-2025-001"
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

      <div>
        <Label htmlFor="budget">Orçamento Inicial *</Label>
        <Input
          id="budget"
          type="number"
          step="0.01"
          min="0"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="directorate">Diretoria</Label>
          <Input
            id="directorate"
            value={formData.directorate}
            onChange={(e) => setFormData({ ...formData, directorate: e.target.value })}
            placeholder="Digite a diretoria"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plant">Planta</Label>
          <Input
            id="plant"
            value={formData.plant}
            onChange={(e) => setFormData({ ...formData, plant: e.target.value })}
            placeholder="Digite a planta"
          />
        </div>
        <div>
          <Label htmlFor="country">País</Label>
          <Select 
            value={formData.country} 
            onValueChange={(value) => setFormData({ ...formData, country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brasil">Brasil</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Chile">Chile</SelectItem>
              <SelectItem value="México">México</SelectItem>
              <SelectItem value="Suécia">Suécia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Classificação e Identificação</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoria do Projeto *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
              <SelectItem value="Produto">Produto</SelectItem>
              <SelectItem value="Processo">Processo</SelectItem>
              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="product_line">Linha de Produto</Label>
          <Input
            id="product_line"
            value={formData.product_line}
            onChange={(e) => setFormData({ ...formData, product_line: e.target.value })}
            placeholder="Digite a linha de produto"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sap_id">SAP ID Number</Label>
          <Input
            id="sap_id"
            value={formData.sap_id}
            onChange={(e) => setFormData({ ...formData, sap_id: e.target.value })}
            placeholder="BRxxxxxxx"
          />
        </div>
        <div>
          <Label htmlFor="stages">Estágios</Label>
          <Input
            id="stages"
            value={formData.stages}
            onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
            placeholder="Digite os estágios"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_it_project"
          checked={formData.is_it_project}
          onCheckedChange={(checked) => setFormData({ ...formData, is_it_project: checked })}
        />
        <Label htmlFor="is_it_project">Projeto IT</Label>
      </div>

      {formData.is_it_project && (
        <div>
          <Label htmlFor="it_responsible">Responsável IT</Label>
          <Input
            id="it_responsible"
            value={formData.it_responsible}
            onChange={(e) => setFormData({ ...formData, it_responsible: e.target.value })}
            placeholder="Nome do responsável IT"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="investment_type">Tipo de Investimento</Label>
          <Select 
            value={formData.investment_type} 
            onValueChange={(value) => setFormData({ ...formData, investment_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAPEX">CAPEX</SelectItem>
              <SelectItem value="OPEX">OPEX</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="input_type">Input</Label>
          <Select 
            value={formData.input_type} 
            onValueChange={(value) => setFormData({ ...formData, input_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Integração">Integração</SelectItem>
              <SelectItem value="Manual/Excel">Manual/Excel</SelectItem>
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
        <div className="flex items-center space-x-2">
          <Switch
            id="critical"
            checked={formData.is_critical}
            onCheckedChange={(checked) => setFormData({ ...formData, is_critical: checked })}
          />
          <Label htmlFor="critical">Projeto Crítico</Label>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Justificativa e Resultados</h3>
      
      <div>
        <Label htmlFor="justification">Justificativa *</Label>
        <Textarea
          id="justification"
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          placeholder="Descreva a justificativa do projeto..."
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="results_benefits">Resultados e Benefícios</Label>
        <Textarea
          id="results_benefits"
          value={formData.results_benefits}
          onChange={(e) => setFormData({ ...formData, results_benefits: e.target.value })}
          placeholder="Descreva os resultados esperados e benefícios..."
          rows={4}
        />
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
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Dados das Tabelas - Preenchimento Inicial</h3>
      
      <div className="space-y-4">
        <h4 className="font-medium">Capex IR *</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="capex_ir_category">Categoria</Label>
            <Input
              id="capex_ir_category"
              value={formData.capex_ir[0].category}
              onChange={(e) => {
                const newCapexIR = [...formData.capex_ir];
                newCapexIR[0].category = e.target.value;
                setFormData({ ...formData, capex_ir: newCapexIR });
              }}
              placeholder="Categoria"
            />
          </div>
          <div>
            <Label htmlFor="capex_ir_year">Ano</Label>
            <Input
              id="capex_ir_year"
              type="number"
              value={formData.capex_ir[0].year}
              onChange={(e) => {
                const newCapexIR = [...formData.capex_ir];
                newCapexIR[0].year = parseInt(e.target.value) || new Date().getFullYear();
                setFormData({ ...formData, capex_ir: newCapexIR });
              }}
            />
          </div>
          <div>
            <Label htmlFor="capex_ir_total">Total</Label>
            <Input
              id="capex_ir_total"
              type="number"
              step="0.01"
              value={formData.capex_ir[0].total}
              onChange={(e) => {
                const newCapexIR = [...formData.capex_ir];
                newCapexIR[0].total = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, capex_ir: newCapexIR });
              }}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Capex BU</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="capex_bu_category">Categoria</Label>
            <Input
              id="capex_bu_category"
              value={formData.capex_bu[0].category}
              onChange={(e) => {
                const newCapexBU = [...formData.capex_bu];
                newCapexBU[0].category = e.target.value;
                setFormData({ ...formData, capex_bu: newCapexBU });
              }}
              placeholder="Categoria"
            />
          </div>
          <div>
            <Label htmlFor="capex_bu_jan">Janeiro</Label>
            <Input
              id="capex_bu_jan"
              type="number"
              step="0.01"
              value={formData.capex_bu[0].jan}
              onChange={(e) => {
                const newCapexBU = [...formData.capex_bu];
                newCapexBU[0].jan = parseFloat(e.target.value) || 0;
                newCapexBU[0].total = Object.keys(newCapexBU[0])
                  .filter(key => ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].includes(key))
                  .reduce((sum, key) => sum + (newCapexBU[0][key as keyof typeof newCapexBU[0]] as number), 0);
                setFormData({ ...formData, capex_bu: newCapexBU });
              }}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Total: {formData.capex_bu[0].total.toFixed(2)}</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Capex AC</h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="capex_ac_category">Categoria</Label>
            <Input
              id="capex_ac_category"
              value={formData.capex_ac[0].category}
              onChange={(e) => {
                const newCapexAC = [...formData.capex_ac];
                newCapexAC[0].category = e.target.value;
                setFormData({ ...formData, capex_ac: newCapexAC });
              }}
              placeholder="Categoria"
            />
          </div>
          <div>
            <Label htmlFor="capex_ac_payment_type">Tipo de Pagamento</Label>
            <Input
              id="capex_ac_payment_type"
              value={formData.capex_ac[0].payment_type}
              onChange={(e) => {
                const newCapexAC = [...formData.capex_ac];
                newCapexAC[0].payment_type = e.target.value;
                setFormData({ ...formData, capex_ac: newCapexAC });
              }}
              placeholder="Tipo de Pagamento"
            />
          </div>
          <div>
            <Label>Total: {formData.capex_ac[0].total.toFixed(2)}</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Capex SOP</h4>
        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label htmlFor="capex_sop_category">Categoria</Label>
            <Input
              id="capex_sop_category"
              value={formData.capex_sop[0].category}
              onChange={(e) => {
                const newCapexSOP = [...formData.capex_sop];
                newCapexSOP[0].category = e.target.value;
                setFormData({ ...formData, capex_sop: newCapexSOP });
              }}
              placeholder="Categoria"
            />
          </div>
          <div>
            <Label htmlFor="capex_sop_year1">Ano 1</Label>
            <Input
              id="capex_sop_year1"
              type="number"
              step="0.01"
              value={formData.capex_sop[0].year_1}
              onChange={(e) => {
                const newCapexSOP = [...formData.capex_sop];
                newCapexSOP[0].year_1 = parseFloat(e.target.value) || 0;
                newCapexSOP[0].total = newCapexSOP[0].year_1 + newCapexSOP[0].year_2 + newCapexSOP[0].year_3;
                setFormData({ ...formData, capex_sop: newCapexSOP });
              }}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label htmlFor="capex_sop_year2">Ano 2</Label>
            <Input
              id="capex_sop_year2"
              type="number"
              step="0.01"
              value={formData.capex_sop[0].year_2}
              onChange={(e) => {
                const newCapexSOP = [...formData.capex_sop];
                newCapexSOP[0].year_2 = parseFloat(e.target.value) || 0;
                newCapexSOP[0].total = newCapexSOP[0].year_1 + newCapexSOP[0].year_2 + newCapexSOP[0].year_3;
                setFormData({ ...formData, capex_sop: newCapexSOP });
              }}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Total: {formData.capex_sop[0].total.toFixed(2)}</Label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Revisão Final</h3>
      
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Código:</strong> {formData.project_code}</div>
          <div><strong>Nome:</strong> {formData.name}</div>
          <div><strong>Categoria:</strong> {formData.category}</div>
          <div><strong>Área:</strong> {formData.area}</div>
          <div><strong>Orçamento:</strong> {formData.currency} {formData.budget.toLocaleString()}</div>
          <div><strong>Status:</strong> {formData.status}</div>
          <div><strong>Crítico:</strong> {formData.is_critical ? 'Sim' : 'Não'}</div>
          <div><strong>Projeto IT:</strong> {formData.is_it_project ? 'Sim' : 'Não'}</div>
        </div>
        
        {formData.justification && (
          <div>
            <strong>Justificativa:</strong>
            <p className="text-sm text-muted-foreground mt-1">{formData.justification}</p>
          </div>
        )}
        
        <div className="text-sm">
          <strong>Dados das Tabelas:</strong>
          <ul className="list-disc list-inside mt-1 text-muted-foreground">
            <li>Capex IR: {formData.capex_ir[0].category ? 'Configurado' : 'Não configurado'}</li>
            <li>Capex BU: {formData.capex_bu[0].category ? 'Configurado' : 'Não configurado'}</li>
            <li>Capex AC: {formData.capex_ac[0].category ? 'Configurado' : 'Não configurado'}</li>
            <li>Capex SOP: {formData.capex_sop[0].category ? 'Configurado' : 'Não configurado'}</li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Revise todas as informações antes de criar o projeto. Após a criação, você poderá editar os detalhes nas abas específicas.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(newOpen) => { setOpen(newOpen); if (!newOpen) resetForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Siga o assistente para criar um novo projeto completo no sistema.
          </DialogDescription>
        </DialogHeader>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Etapa {currentStep} de {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Dados Gerais</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Classificação</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Justificativa</span>
            <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Tabelas</span>
            <span className={currentStep >= 5 ? "text-primary font-medium" : ""}>Revisão</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Conteúdo da Etapa */}
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>

          {/* Navegação */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>

            <div className="flex space-x-2">
              {currentStep > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button 
                  type="button" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>Criando...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Criar Projeto
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}