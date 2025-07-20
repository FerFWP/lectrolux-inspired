import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProjectUploadDialogProps {
  onProjectImported?: (project: any) => void;
}

interface UploadedProject {
  name: string;
  leader: string;
  area: string;
  budget: number;
  currency: string;
  deadline: string;
  category: string;
  type: string;
  description?: string;
  isValid: boolean;
  errors: string[];
}

export const ProjectUploadDialog = ({ onProjectImported }: ProjectUploadDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedProject, setParsedProject] = useState<UploadedProject | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls).",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    // Simular processamento do arquivo Excel
    setTimeout(() => {
      const mockParsedProject: UploadedProject = {
        name: "Projeto Importado da Planilha",
        leader: "João Silva",
        area: "Produção",
        budget: 1500000,
        currency: "BRL",
        deadline: "31/12/2025",
        category: "CAPEX",
        type: "Tangível",
        description: "Projeto importado automaticamente via planilha Excel",
        isValid: true,
        errors: []
      };

      // Validação básica
      const errors: string[] = [];
      if (!mockParsedProject.name) errors.push("Nome do projeto é obrigatório");
      if (!mockParsedProject.leader) errors.push("Líder do projeto é obrigatório");
      if (!mockParsedProject.budget || mockParsedProject.budget <= 0) errors.push("Orçamento deve ser maior que zero");

      mockParsedProject.isValid = errors.length === 0;
      mockParsedProject.errors = errors;

      setParsedProject(mockParsedProject);
      setIsProcessing(false);
      setStep('preview');
    }, 2000);
  };

  const handleConfirmImport = () => {
    if (!parsedProject || !parsedProject.isValid) return;

    const newProject = {
      id: `PRJ-${String(Date.now()).slice(-3)}`,
      name: parsedProject.name,
      leader: parsedProject.leader,
      status: "Planejado" as const,
      area: parsedProject.area,
      budget: parsedProject.budget,
      realized: 0,
      committed: 0,
      balance: parsedProject.budget,
      currency: parsedProject.currency as "BRL" | "USD" | "SEK",
      isCritical: false,
      progress: 0,
      deadline: parsedProject.deadline,
      category: parsedProject.category as "CAPEX" | "OPEX" | "P&D",
      type: parsedProject.type as "Tangível" | "Intangível",
      budgetUnit: parsedProject.budget
    };

    onProjectImported?.(newProject);
    setStep('success');

    toast({
      title: "Projeto importado com sucesso!",
      description: `O projeto "${parsedProject.name}" foi adicionado à lista.`,
    });

    // Reset após 2 segundos
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    setUploadedFile(null);
    setParsedProject(null);
    setStep('upload');
    setIsProcessing(false);
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload de Projeto</h3>
        <p className="text-muted-foreground mb-6">
          Faça upload de uma planilha Excel contendo os dados do projeto para importação automática.
        </p>
      </div>

      <Card className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors">
        <CardContent className="pt-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Clique para selecionar ou arraste o arquivo</p>
              <p className="text-xs text-muted-foreground">Arquivos Excel (.xlsx, .xls) - Máximo 10MB</p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
          </div>
        </CardContent>
      </Card>

      {isProcessing && (
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Processando arquivo...</p>
        </div>
      )}

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Formato esperado da planilha:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Coluna A: Nome do Projeto</li>
          <li>• Coluna B: Líder do Projeto</li>
          <li>• Coluna C: Área</li>
          <li>• Coluna D: Orçamento</li>
          <li>• Coluna E: Moeda (BRL, USD, SEK)</li>
          <li>• Coluna F: Prazo (DD/MM/AAAA)</li>
          <li>• Coluna G: Categoria (CAPEX, OPEX, P&D)</li>
          <li>• Coluna H: Tipo (Tangível, Intangível)</li>
        </ul>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Prévia do Projeto</h3>
        <p className="text-muted-foreground">
          Confira os dados importados antes de confirmar a criação do projeto.
        </p>
      </div>

      {parsedProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {parsedProject.name}
              {parsedProject.isValid ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Válido
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Erros encontrados
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Líder</TableCell>
                  <TableCell>{parsedProject.leader}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Área</TableCell>
                  <TableCell>{parsedProject.area}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Orçamento</TableCell>
                  <TableCell>
                    {parsedProject.currency === "BRL" ? "R$" : 
                     parsedProject.currency === "USD" ? "$" : "kr"} {parsedProject.budget.toLocaleString("pt-BR")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Prazo</TableCell>
                  <TableCell>{parsedProject.deadline}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Categoria</TableCell>
                  <TableCell>{parsedProject.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Tipo</TableCell>
                  <TableCell>{parsedProject.type}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {!parsedProject.isValid && parsedProject.errors.length > 0 && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <h4 className="font-medium text-destructive mb-2">Erros encontrados:</h4>
                <ul className="text-sm text-destructive space-y-1">
                  {parsedProject.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={() => setStep('upload')}>
          Voltar
        </Button>
        <Button 
          onClick={handleConfirmImport} 
          disabled={!parsedProject?.isValid}
        >
          Confirmar Importação
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Projeto Importado com Sucesso!</h3>
        <p className="text-muted-foreground">
          O projeto foi adicionado à lista e está pronto para uso.
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Upload Projeto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>
            {step === 'upload' && 'Upload de Projeto'}
            {step === 'preview' && 'Prévia do Projeto'}
            {step === 'success' && 'Importação Concluída'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {step === 'upload' && renderUploadStep()}
        {step === 'preview' && renderPreviewStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};