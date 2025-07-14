import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  display_name: string | null;
}

export const WelcomeMessage = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (!user) return null;

  const getDisplayName = () => {
    if (userProfile?.display_name) {
      return userProfile.display_name;
    }
    return user.email?.split('@')[0] || 'Usuário';
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-2">
        Olá, {getDisplayName()}!
      </h1>
      <p className="text-sm text-muted-foreground">
        Bem-vindo ao sistema de gestão financeira Electrolux.
      </p>
    </div>
  );
};