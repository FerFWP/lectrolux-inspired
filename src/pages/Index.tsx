import { LoginForm } from "@/components/login-form"
import { toast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

const Index = () => {
  const navigate = useNavigate();

  const handleLogin = async (credentials: { username: string; password: string }) => {
    // Simulação de autenticação
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if ((credentials.username === "admin" && credentials.password === "123456") || 
            (credentials.username === "teste@electrolux.com" && credentials.password === "12345678")) {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Sistema de Gestão Financeira.",
          });
          // Redirecionar para o dashboard após login bem-sucedido
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
          resolve();
        } else {
          reject(new Error("Credenciais inválidas"))
        }
      }, 1500)
    })
  }

  return <LoginForm onSubmit={handleLogin} />
};

export default Index;
