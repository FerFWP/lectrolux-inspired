import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useNavigate } from "react-router-dom";
import electroluxLogo from "@/assets/electrolux-logo.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-background px-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLogoClick} 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity" 
                aria-label="Voltar ao Dashboard"
              >
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm border">
                  <img
                    src={electroluxLogo}
                    alt="Electrolux"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="font-semibold text-sm text-primary">Gestão Financeira</h2>
                  <p className="text-xs text-muted-foreground">Electrolux</p>
                </div>
              </button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}