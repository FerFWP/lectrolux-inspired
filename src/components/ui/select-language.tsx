import * as React from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
]

interface SelectLanguageProps {
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function SelectLanguage({ 
  value = "pt", 
  onValueChange,
  className 
}: SelectLanguageProps) {
  const selectedLanguage = languages.find(lang => lang.code === value) || languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "h-auto p-2 text-primary hover:text-primary-medium hover:underline font-normal text-sm",
            className
          )}
        >
          <Globe className="w-4 h-4 mr-2" />
          {selectedLanguage.flag} {selectedLanguage.name}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-background border border-border shadow-lg"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onValueChange?.(language.code)}
            className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent"
          >
            <span className="flex items-center">
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </span>
            {value === language.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}