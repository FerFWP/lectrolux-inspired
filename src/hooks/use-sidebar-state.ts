
import { useState } from 'react';

let globalCollapsed = false;
let globalSetCollapsed: ((value: boolean) => void) | null = null;

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(globalCollapsed);

  // Sync with global state
  if (globalSetCollapsed === null) {
    globalSetCollapsed = (value: boolean) => {
      globalCollapsed = value;
      setCollapsed(value);
    };
  }

  const toggleCollapsed = () => {
    const newValue = !globalCollapsed;
    globalCollapsed = newValue;
    setCollapsed(newValue);
    // Notify other components
    if (globalSetCollapsed) {
      globalSetCollapsed(newValue);
    }
  };

  return {
    collapsed,
    toggleCollapsed,
    setCollapsed: globalSetCollapsed || setCollapsed
  };
}
