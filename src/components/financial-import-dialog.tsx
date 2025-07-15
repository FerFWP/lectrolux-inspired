import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, Sparkles, Calendar, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FinancialImportDialogProps {
  projectId: string;
  open?: boolean;
  onClose?: () => void;
  onImportComplete: () => void;
}

interface ImportedTransaction {
  description: string;
  amount: number;
  category: string;
  date: string;
  confidence: number;
  aiSuggestions: {
    category: string;
    date: string;
    reason: string;
  };
}

export function FinancialImportDialog({ projectId, open = false, onClose, onImportComplete }: FinancialImportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<ImportedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportedFile(file);
    setLoading(true);

    try {
      // Simulate Excel/CSV parsing
      const mockData: ImportedTransaction[] = [
        {
          description: "Licença Microsoft Office 365",
          amount: 2500.00,
          category: "Software",
          date: "2025-01-15",
          confidence: 0.95,
          aiSuggestions: {
            category: "Licenças",
            date: "2025-01-15",
            reason: "Detectado padrão de licenciamento recorrente"
          }
        },
        {
          description: "Consultoria desenvolvimento sistema",
          amount: 45000.00,
          category: "Serviços",
          date: "2025-01-10",
          confidence: 0.88,
          aiSuggestions: {
            category: "Consultoria",
            date: "2025-01-10",
            reason: "Identificado serviço de consultoria técnica"
          }
        },
        {
          description: "Servidor Dell PowerEdge",
          amount: 12000.00,
          category: "Hardware",
          date: "2025-01-20",
          confidence: 0.92,
          aiSuggestions: {
            category: "Infraestrutura",
            date: "2025-01-20",
            reason: "Equipamento de infraestrutura identificado"
          }
        }
      ];

      setImportedData(mockData);
      
      // Trigger AI processing
      setProcessingAI(true);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI processing
      setProcessingAI(false);

      toast({
        title: "Arquivo importado com sucesso",
        description: `${mockData.length} transações detectadas e processadas pela IA`,
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível processar o arquivo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyAISuggestion = (index: number, field: 'category' | 'date') => {
    const newData = [...importedData];
    if (field === 'category') {
      newData[index].category = newData[index].aiSuggestions.category;
    } else {
      newData[index].date = newData[index].aiSuggestions.date;
    }
    setImportedData(newData);
  };

  const handleSaveImport = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const transactions = importedData.map(item => ({
        project_id: projectId,
        description: item.description,
        amount: item.amount,
        category: item.category,
        transaction_date: item.date,
        transaction_type: 'imported',
        user_id: user.id
      }));

      const { error } = await supabase
        .from('transactions')
        .insert(transactions);

      if (error) throw error;

      toast({
        title: "Importação concluída",
        description: `${transactions.length} transações importadas com sucesso`,
      });

      onImportComplete();
      setInternalOpen(false);
      setImportedFile(null);
      setImportedData([]);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Dialog open={open || internalOpen} onOpenChange={open !== undefined ? onClose : setInternalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Importar Planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importação Manual de Planilhas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload de Arquivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Selecionar Planilha</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Formatos suportados: Excel (.xlsx, .xls) e CSV
                  </p>
                </div>

                {importedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Arquivo: {importedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tamanho: {(importedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Processing Indicator */}
          {processingAI && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                  <div>
                    <p className="font-medium text-blue-900">IA processando dados...</p>
                    <p className="text-sm text-blue-700">
                      Analisando transações e gerando sugestões automáticas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Imported Data Preview */}
          {importedData.length > 0 && !processingAI && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Dados Importados ({importedData.length} transações)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {importedData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.description}</h4>
                          <p className="text-xl font-bold text-green-600">
                            R$ {item.amount.toLocaleString('pt-BR')}
                          </p>
                        </div>
                        <Badge className={getConfidenceColor(item.confidence)}>
                          {(item.confidence * 100).toFixed(0)}% confiança
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Categoria</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Select 
                              value={item.category} 
                              onValueChange={(value) => {
                                const newData = [...importedData];
                                newData[index].category = value;
                                setImportedData(newData);
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Software">Software</SelectItem>
                                <SelectItem value="Hardware">Hardware</SelectItem>
                                <SelectItem value="Serviços">Serviços</SelectItem>
                                <SelectItem value="Consultoria">Consultoria</SelectItem>
                                <SelectItem value="Licenças">Licenças</SelectItem>
                                <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                              </SelectContent>
                            </Select>
                            {item.category !== item.aiSuggestions.category && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplyAISuggestion(index, 'category')}
                                className="gap-1"
                              >
                                <Tag className="h-3 w-3" />
                                IA: {item.aiSuggestions.category}
                              </Button>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Data</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="date"
                              value={item.date}
                              onChange={(e) => {
                                const newData = [...importedData];
                                newData[index].date = e.target.value;
                                setImportedData(newData);
                              }}
                              className="flex-1"
                            />
                            {item.date !== item.aiSuggestions.date && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApplyAISuggestion(index, 'date')}
                                className="gap-1"
                              >
                                <Calendar className="h-3 w-3" />
                                IA: {new Date(item.aiSuggestions.date).toLocaleDateString('pt-BR')}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.aiSuggestions.reason && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                              Sugestão da IA:
                            </span>
                          </div>
                          <p className="text-sm text-blue-700 mt-1">{item.aiSuggestions.reason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onClose ? onClose() : setInternalOpen(false)}>
              Cancelar
            </Button>
            {importedData.length > 0 && (
              <Button 
                onClick={handleSaveImport}
                disabled={loading}
                className="gap-2"
              >
                {loading ? (
                  <>Salvando...</>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Importar {importedData.length} Transações
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}