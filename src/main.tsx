import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CurrencyProvider } from './contexts/currency-context'

createRoot(document.getElementById("root")!).render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>
);
