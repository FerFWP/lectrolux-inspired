import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useNavigate } from "react-router-dom";
import electroluxLogo from "@/assets/electrolux-logo.png";

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { openMobile, open } = useSidebar();
  const navigate = useNavigate();
  
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full relative">
      <AppSidebar />
      
      {/* Desktop overlay when sidebar is open */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 z-[90] hidden md:block transition-opacity duration-300"
          onClick={() => {}} // Prevent click through
        />
      )}
      
      {/* Mobile overlay */}
      {openMobile && (
        <div className="fixed inset-0 bg-black/50 z-[90] md:hidden transition-opacity duration-300" />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 relative z-[80]">
        <header className="h-12 flex items-center border-b bg-background px-4 relative z-[85]">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
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
        <main className="flex-1 relative bg-background">
          <div className="h-full w-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}