
import { useState, useEffect } from 'react';

// Estado global simples
let globalCollapsed = false;
const listeners = new Set<(value: boolean) => void>();

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    // Carregar estado do localStorage apenas no cliente
    try {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved !== null) {
        const initial = JSON.parse(saved);
        globalCollapsed = initial;
        setCollapsed(initial);
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage');
    }

    // Adicionar listener
    listeners.add(setCollapsed);
    
    return () => {
      listeners.delete(setCollapsed);
    };
  }, []);

  const toggleCollapsed = () => {
    const newValue = !globalCollapsed;
    globalCollapsed = newValue;
    
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newValue));
    } catch (error) {
      console.warn('Failed to save sidebar state to localStorage');
    }
    
    // Notificar todos os listeners
    listeners.forEach(listener => listener(newValue));
  };

  const setCollapsedState = (value: boolean) => {
    globalCollapsed = value;
    
    try {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save sidebar state to localStorage');
    }
    
    listeners.forEach(listener => listener(value));
  };

  return {
    collapsed,
    toggleCollapsed,
    setCollapsed: setCollapsedState
  };
}
