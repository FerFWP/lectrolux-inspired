import { useState } from "react";
import { format } from "date-fns";
import { DollarSign, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GlobalCurrencyConfigProps {
  projectCurrency: string;
  selectedCurrency: string;
  selectedYear: string;
  onCurrencyChange: (currency: string) => void;
  onYearChange: (year: string) => void;
}

export function GlobalCurrencyConfig({
  projectCurrency,
  selectedCurrency,
  selectedYear,
  onCurrencyChange,
  onYearChange
}: GlobalCurrencyConfigProps) {
  // Exchange rates data - same structure as in components
  const exchangeRatesByYear: Record<string, Record<string, { rate: number; label: string }>> = {
    "2025": {
      "BRL": { rate: 1.0, label: `Moeda do cadastro (${projectCurrency})` },
      "SEK_APPROVAL": { rate: 0.48, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.52, label: "SEK BU (taxa anual)" },
      "USD": { rate: 0.16, label: "USD" },
      "EUR": { rate: 0.15, label: "EUR" }
    },
    "2024": {
      "BRL": { rate: 1.0, label: `Moeda do cadastro (${projectCurrency})` },
      "SEK_APPROVAL": { rate: 0.45, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.49, label: "SEK BU (taxa anual)" },
      "USD": { rate: 0.18, label: "USD" },
      "EUR": { rate: 0.17, label: "EUR" }
    },
    "2023": {
      "BRL": { rate: 1.0, label: `Moeda do cadastro (${projectCurrency})` },
      "SEK_APPROVAL": { rate: 0.42, label: "SEK (taxa da aprovação)" },
      "SEK_BU": { rate: 0.46, label: "SEK BU (taxa anual)" },
      "USD": { rate: 0.19, label: "USD" },
      "EUR": { rate: 0.18, label: "EUR" }
    }
  };

  const getCurrentCurrencyInfo = () => {
    const yearRates = exchangeRatesByYear[selectedYear] || exchangeRatesByYear["2025"];
    return yearRates[selectedCurrency] || yearRates[projectCurrency] || { rate: 1.0, label: `Moeda do cadastro (${projectCurrency})` };
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Configurações de Visualização
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <label className="text-sm font-medium">Moeda:</label>
                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Escolha a moeda para visualização de todos os valores do projeto</p>
              </TooltipContent>
            </Tooltip>
            <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={projectCurrency}>
                  Moeda do cadastro ({projectCurrency})
                </SelectItem>
                <SelectItem value="SEK_APPROVAL">SEK (taxa da aprovação)</SelectItem>
                <SelectItem value="SEK_BU">SEK BU (taxa anual)</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <label className="text-sm font-medium">Ano:</label>
                  <HelpCircle className="h-3 w-3 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Selecione o ano de referência para as taxas de câmbio</p>
              </TooltipContent>
            </Tooltip>
            <Select value={selectedYear} onValueChange={onYearChange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              Taxa atual: {getCurrentCurrencyInfo().rate.toFixed(4)}
            </span>
            <span className="text-xs text-muted-foreground">
              | Atualizado em {format(new Date(), "dd/MM/yyyy HH:mm")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}