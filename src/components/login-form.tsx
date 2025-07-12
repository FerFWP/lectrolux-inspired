import React, { useState } from "react"
import { Eye, EyeOff, User, Lock, AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SelectLanguage } from "@/components/ui/select-language"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import electroluxLogo from "@/assets/electrolux-logo.png"

interface LoginFormProps {
  onSubmit?: (credentials: { username: string; password: string }) => Promise<void>
  className?: string
}

export function LoginForm({ onSubmit, className }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState("pt")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onSubmit?.({ username: username.trim(), password })
    } catch (err) {
      setError("Usuário ou senha inválidos. Tente novamente ou recupere sua senha.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn("min-h-screen bg-secondary flex flex-col items-center justify-center p-4", className)}>
      {/* Logo */}
      <div className="mb-12">
        <img 
          src={electroluxLogo} 
          alt="Electrolux" 
          className="h-16 w-auto"
        />
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-card shadow-lg border border-border">
        <CardHeader className="space-y-2 pb-6">
          <h1 className="text-2xl font-bold text-center text-foreground">
            Entrar
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Sistema de Gestão Financeira
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div 
                className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
                role="alert"
                aria-live="polite"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                Usuário *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu e-mail corporativo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20"
                  required
                  aria-describedby={error ? "error-message" : undefined}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha *
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Mínimo 8 caracteres, letras e números</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20"
                  required
                  aria-describedby={error ? "error-message" : undefined}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary-medium hover:underline transition-colors font-medium"
              onClick={() => {
                // Implementar lógica de esqueci minha senha
                console.log("Esqueci minha senha clicked")
              }}
            >
              Recuperar senha
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Language Selector */}
      <div className="mt-8">
        <SelectLanguage 
          value={language} 
          onValueChange={setLanguage}
        />
      </div>
    </div>
  )
}