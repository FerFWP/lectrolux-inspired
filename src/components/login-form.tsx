import React, { useState } from "react"
import { Eye, EyeOff, User, Lock, AlertCircle, HelpCircle, Phone, Clock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SelectLanguage } from "@/components/ui/select-language"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"
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
  const isMobile = useIsMobile()

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

  if (isMobile) {
    // MOBILE VERSION - Optimized for touch and accessibility
    return (
      <div className={cn("min-h-screen bg-secondary flex flex-col items-center justify-center p-6", className)}>
        {/* Logo - Larger for mobile */}
        <div className="mb-8 animate-fade-in">
          <img 
            src={electroluxLogo} 
            alt="Electrolux" 
            className="h-20 w-auto"
          />
        </div>

        {/* Login Card - Mobile optimized */}
        <Card className="w-full max-w-sm bg-card shadow-xl border border-border animate-scale-in">
          <CardHeader className="space-y-3 pb-8">
            <h1 className="text-3xl font-bold text-center text-foreground">
              Entrar
            </h1>
            <p className="text-base text-muted-foreground text-center leading-relaxed">
              Sistema de Gestão Financeira Electrolux
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Message - Mobile optimized */}
              {error && (
                <div 
                  className="flex items-start gap-3 p-4 text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-xl"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Username Field - Larger for mobile */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-base font-semibold text-foreground">
                  Login *
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="E-mail corporativo ou usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-12 h-16 text-base border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 rounded-xl"
                    required
                    aria-describedby={error ? "error-message" : "username-help"}
                  />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed px-1" id="username-help">
                  💡 Use suas credenciais fornecidas pelo setor de TI
                </p>
              </div>

              {/* Password Field - Mobile optimized */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Label htmlFor="password" className="text-base font-semibold text-foreground">
                    Senha *
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-5 h-5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">🔒 Mínimo 8 caracteres, letras e números</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha de acesso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-14 h-16 text-base border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 rounded-xl"
                    required
                    aria-describedby={error ? "error-message" : undefined}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button - Large touch target */}
              <Button
                type="submit"
                className="w-full h-16 text-lg font-semibold rounded-xl hover-scale"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Forgot Password & Help - Mobile layout */}
            <div className="space-y-6">
              <div className="text-center">
                <button
                  type="button"
                  className="text-base text-primary hover:text-primary-medium hover:underline transition-colors font-semibold p-2"
                  onClick={() => {
                    console.log("Recuperar senha clicked")
                  }}
                >
                  🔑 Recuperar senha
                </button>
              </div>
              
              {/* Help Section - Simplified for mobile */}
              <div className="border-t border-border pt-6">
                <div className="text-center mb-4">
                  <button
                    type="button"
                    className="text-base text-primary hover:text-primary-medium hover:underline transition-colors font-semibold p-2 flex items-center gap-2 mx-auto"
                    onClick={() => {
                      console.log("Precisa de ajuda clicked")
                    }}
                  >
                    <Phone className="w-5 h-5" />
                    Precisa de ajuda?
                  </button>
                </div>
                
                <div className="space-y-3 text-sm text-muted-foreground text-center">
                  <p className="bg-muted/30 p-3 rounded-lg">
                    📞 <span className="text-foreground font-semibold">(11) 3000-8000</span>
                  </p>
                  <p>🕐 Segunda a Sexta, 8h às 18h</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Selector - Mobile simplified */}
        <div className="mt-8 w-full max-w-sm">
          <div className="flex justify-center">
            <SelectLanguage 
              value={language} 
              onValueChange={setLanguage}
            />
          </div>
        </div>
      </div>
    )
  }

  // DESKTOP VERSION - Enhanced visual comfort and clarity
  return (
    <div className={cn("min-h-screen bg-secondary flex items-center justify-center p-8", className)}>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Branding & Information */}
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 animate-fade-in">
          <div className="text-center space-y-6">
            <img 
              src={electroluxLogo} 
              alt="Electrolux" 
              className="h-24 w-auto mx-auto"
            />
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-foreground">
                Sistema de Gestão Financeira
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Plataforma integrada para gestão financeira corporativa com segurança e eficiência para toda América Latina.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="flex flex-col items-center justify-center">
          {/* Mobile logo for small screens */}
          <div className="lg:hidden mb-8 animate-fade-in">
            <img 
              src={electroluxLogo} 
              alt="Electrolux" 
              className="h-16 w-auto"
            />
          </div>

          <Card className="w-full max-w-md bg-card shadow-2xl border border-border animate-scale-in">
            <CardHeader className="space-y-3 pb-8">
              <h2 className="text-2xl font-bold text-center text-foreground">
                Acesso ao Sistema
              </h2>
              <p className="text-sm text-muted-foreground text-center">
                Faça login com suas credenciais corporativas
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div 
                    className="flex items-center gap-3 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg"
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
                    Login *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="E-mail corporativo ou nome de usuário"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
                      required
                      aria-describedby={error ? "error-message" : "username-help"}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground" id="username-help">
                    Use suas credenciais fornecidas pelo setor de TI
                  </p>
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
                      className="pl-10 pr-10 h-12 border-input bg-background focus:border-ring focus:ring-2 focus:ring-ring/20 transition-all"
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
                  className="w-full hover-scale"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar no Sistema"}
                </Button>
              </form>

              {/* Links & Help Section */}
              <div className="space-y-4">
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary hover:text-primary-medium hover:underline transition-colors font-medium"
                    onClick={() => {
                      console.log("Recuperar senha clicked")
                    }}
                  >
                    Recuperar senha
                  </button>
                </div>
                
                {/* Help Section */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-medium hover:underline transition-colors font-medium"
                      onClick={() => {
                        console.log("Precisa de ajuda clicked")
                      }}
                    >
                      Precisa de ajuda?
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs text-muted-foreground text-center">
                    <p>Suporte TI: <span className="text-foreground font-medium">(11) 3000-8000</span></p>
                    <p>Horário: Segunda a Sexta, 8h às 18h</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Selector - Desktop */}
          <div className="mt-8 w-full max-w-md">
            <div className="flex justify-center">
              <SelectLanguage 
                value={language} 
                onValueChange={setLanguage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}