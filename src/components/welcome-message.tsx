import { useAuth } from '@/contexts/auth-context';

export const WelcomeMessage = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getDisplayName = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-2">
        Olá, {getDisplayName(user.email || '')}!
      </h1>
      <p className="text-sm text-muted-foreground">
        Bem-vindo ao sistema de gestão financeira Electrolux.
      </p>
    </div>
  );
};