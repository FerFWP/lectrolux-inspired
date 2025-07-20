
import { useState, useEffect } from 'react';

let globalCollapsed = false;
let globalSetCollapsed: ((value: boolean) => void) | null = null;
const listeners: Set<(value: boolean) => void> = new Set();

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(() => {
    // Carregar estado persistido do localStorage
    const saved = localStorage.getItem('sidebar-collapsed');
    const initial = saved ? JSON.parse(saved) : false;
    globalCollapsed = initial;
    return initial;
  });

  useEffect(() => {
    // Adicionar listener para mudanças
    listeners.add(setCollapsed);
    return () => {
      listeners.delete(setCollapsed);
    };
  }, []);

  const toggleCollapsed = () => {
    const newValue = !globalCollapsed;
    globalCollapsed = newValue;
    
    // Persistir no localStorage
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
    
    // Notificar todos os listeners
    listeners.forEach(listener => listener(newValue));
  };

  const setCollapsedState = (value: boolean) => {
    globalCollapsed = value;
    localStorage.setItem('sidebar-collapsed', JSON.stringify(value));
    listeners.forEach(listener => listener(value));
  };

  return {
    collapsed,
    toggleCollapsed,
    setCollapsed: setCollapsedState
  };
}
