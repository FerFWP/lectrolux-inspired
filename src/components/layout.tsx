import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
          <header className="h-12 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogoClick}
                className="flex items-center hover:opacity-80 transition-opacity"
                aria-label="Voltar ao Dashboard"
              >
                <img
                  src={electroluxLogo}
                  alt="Electrolux"
                  className="h-6 w-auto object-contain md:h-8"
                />
              </button>
              <SidebarTrigger className="ml-2" />
            </div>
            <h1 className="font-semibold text-sm md:text-base">Sistema de Gestão Financeira</h1>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}