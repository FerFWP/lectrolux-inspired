import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserProfileMenu } from "@/components/user-profile-menu";
import { useNavigate } from "react-router-dom";
import electroluxLogo from "@/assets/electrolux-logo.png";
interface LayoutProps {
  children: ReactNode;
}
function LayoutContent({
  children
}: {
  children: ReactNode;
}) {
  const {
    openMobile
  } = useSidebar();
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
  };
  return <div className="min-h-screen flex w-full relative">
      <AppSidebar />
      
      {/* Mobile overlay */}
      {openMobile && <div className="fixed inset-0 bg-black/50 z-[90] md:hidden transition-opacity duration-300" />}
      
      <div className="flex-1 flex flex-col min-w-0 relative z-[80]">
        <header className="h-12 flex items-center justify-between border-b bg-background px-4 relative z-[85]">
          <div className="flex items-center gap-3">
            <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 transition-opacity" aria-label="Voltar ao Dashboard">
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
    </div>;
}
export function Layout({
  children
}: LayoutProps) {
  return <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>;
}