import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useSapImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const importFromSAP = async (projectId: string, onSuccess?: () => void) => {
    if (isImporting) return;
    
    setIsImporting(true);
    
    try {
      toast({
        title: "Conectando ao SAP",
        description: "Estabelecendo conexão com o sistema SAP...",
      });

      // Simular conexão e importação
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular dados importados
      const importedData = [
        {
          id: `sap-${Date.now()}-1`,
          description: "Licenças Software SAP (Importado)",
          amount: 45000,
          category: "Software",
          transaction_type: "imported",
          transaction_date: new Date().toISOString().split('T')[0],
          supplier: "SAP Brasil",
          reference_number: "SAP-INV-2025-001"
        },
        {
          id: `sap-${Date.now()}-2`,
          description: "Consultoria Implementação (Importado)",
          amount: 28000,
          category: "Serviços",
          transaction_type: "imported",
          transaction_date: new Date().toISOString().split('T')[0],
          supplier: "SAP Consulting",
          reference_number: "SAP-INV-2025-002"
        },
        {
          id: `sap-${Date.now()}-3`,
          description: "Treinamento Usuários (Importado)",
          amount: 12000,
          category: "Treinamento",
          transaction_type: "imported",
          transaction_date: new Date().toISOString().split('T')[0],
          supplier: "SAP Education",
          reference_number: "SAP-INV-2025-003"
        }
      ];

      toast({
        title: "Importação concluída",
        description: `${importedData.length} transações importadas do SAP com sucesso!`,
      });

      // Chamar callback de sucesso
      if (onSuccess) {
        onSuccess();
      }

      return importedData;
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Não foi possível importar dados do SAP. Verifique a conexão.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importFromSAP,
    isImporting
  };
};