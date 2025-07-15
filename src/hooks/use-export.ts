import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export type ExportFormat = 'excel' | 'pdf' | 'csv';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportData = async (data: any[], filename: string, format: ExportFormat = 'excel') => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      toast({
        title: "Iniciando exportação",
        description: `Preparando arquivo ${format.toUpperCase()}...`,
      });

      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Criar conteúdo baseado no formato
      let content = '';
      let mimeType = '';
      let fileExtension = '';

      switch (format) {
        case 'excel':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          fileExtension = '.xlsx';
          content = createExcelContent(data);
          break;
        case 'pdf':
          mimeType = 'application/pdf';
          fileExtension = '.pdf';
          content = createPDFContent(data);
          break;
        case 'csv':
          mimeType = 'text/csv';
          fileExtension = '.csv';
          content = createCSVContent(data);
          break;
      }

      // Criar e download do arquivo
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: `Arquivo ${format.toUpperCase()} baixado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const createExcelContent = (data: any[]) => {
    // Simulação de conteúdo Excel (em produção, usar biblioteca como xlsx)
    const headers = Object.keys(data[0] || {});
    let content = headers.join('\t') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => row[header] || '');
      content += values.join('\t') + '\n';
    });
    
    return content;
  };

  const createPDFContent = (data: any[]) => {
    // Simulação de conteúdo PDF (em produção, usar biblioteca como jsPDF)
    return `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n...`;
  };

  const createCSVContent = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      });
      csv += values.join(',') + '\n';
    });
    
    return csv;
  };

  return {
    exportData,
    isExporting
  };
};