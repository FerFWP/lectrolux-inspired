
import { ReactNode } from "react";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import electroluxLogo from "@/assets/electrolux-logo.png";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { collapsed } = useSidebarState();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full relative">
      <AppSidebar />
      
      {/* Conteúdo principal com margem ajustável dinamicamente */}
      <div className={`flex-1 flex flex-col min-w-0 relative z-[80] transition-all duration-300 ease-in-out ${
        collapsed ? 'ml-[60px]' : 'ml-[220px]'
      }`}>
        <header className="h-12 flex items-center justify-between border-b bg-background px-4 relative z-[85]">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogoClick} 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity" 
              aria-label="Voltar ao Dashboard"
            >
              <img src={electroluxLogo} alt="Electrolux" className="h-6 w-auto" />
            </button>
          </div>
          <UserProfileMenu />
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
