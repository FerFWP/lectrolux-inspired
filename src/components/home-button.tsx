import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HomeButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export const HomeButton = ({ 
  variant = "outline", 
  size = "sm", 
  className = "" 
}: HomeButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-2 ${className}`}
          asChild
        >
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Voltar ao Dashboard Principal</p>
      </TooltipContent>
    </Tooltip>
  );
};