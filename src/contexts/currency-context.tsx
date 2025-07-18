import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface CurrencyContextType {
  selectedCurrency: string;
  selectedYear: string;
  setSelectedCurrency: (currency: string) => void;
  setSelectedYear: (year: string) => void;
  convertAmount: (amount: number, fromCurrency: string) => number;
  forceRefresh: () => void;
  refreshKey: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates data - same as in global-currency-config
const exchangeRatesByYear: Record<string, Record<string, { rate: number; label: string }>> = {
  "2024": {
    "USD": { rate: 1, label: "USD" },
    "BRL": { rate: 5.2, label: "BRL" },
    "EUR": { rate: 0.85, label: "EUR" },
    "GBP": { rate: 0.73, label: "GBP" },
    "JPY": { rate: 110, label: "JPY" },
    "CAD": { rate: 1.25, label: "CAD" },
    "AUD": { rate: 1.35, label: "AUD" },
    "CHF": { rate: 0.92, label: "CHF" },
    "CNY": { rate: 6.45, label: "CNY" },
    "INR": { rate: 74.5, label: "INR" }
  },
  "2023": {
    "USD": { rate: 1, label: "USD" },
    "BRL": { rate: 5.8, label: "BRL" },
    "EUR": { rate: 0.88, label: "EUR" },
    "GBP": { rate: 0.76, label: "GBP" },
    "JPY": { rate: 115, label: "JPY" },
    "CAD": { rate: 1.28, label: "CAD" },
    "AUD": { rate: 1.38, label: "AUD" },
    "CHF": { rate: 0.95, label: "CHF" },
    "CNY": { rate: 6.8, label: "CNY" },
    "INR": { rate: 78.2, label: "INR" }
  },
  "2022": {
    "USD": { rate: 1, label: "USD" },
    "BRL": { rate: 6.1, label: "BRL" },
    "EUR": { rate: 0.91, label: "EUR" },
    "GBP": { rate: 0.79, label: "GBP" },
    "JPY": { rate: 120, label: "JPY" },
    "CAD": { rate: 1.31, label: "CAD" },
    "AUD": { rate: 1.41, label: "AUD" },
    "CHF": { rate: 0.98, label: "CHF" },
    "CNY": { rate: 7.1, label: "CNY" },
    "INR": { rate: 81.8, label: "INR" }
  }
};

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const convertAmount = useCallback((amount: number, fromCurrency: string): number => {
    if (selectedCurrency === fromCurrency) return amount;
    
    const yearRates = exchangeRatesByYear[selectedYear];
    if (!yearRates) return amount;
    
    const fromRate = yearRates[fromCurrency]?.rate || 1;
    const toRate = yearRates[selectedCurrency]?.rate || 1;
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  }, [selectedCurrency, selectedYear]);

  const forceRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleCurrencyChange = useCallback((currency: string) => {
    setSelectedCurrency(currency);
    forceRefresh();
  }, [forceRefresh]);

  const handleYearChange = useCallback((year: string) => {
    setSelectedYear(year);
    forceRefresh();
  }, [forceRefresh]);

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        selectedYear,
        setSelectedCurrency: handleCurrencyChange,
        setSelectedYear: handleYearChange,
        convertAmount,
        forceRefresh,
        refreshKey,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}