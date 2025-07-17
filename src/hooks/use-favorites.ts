import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_project_favorites')
        .select('project_id')
        .eq('user_id', session.user.id);

      if (error) throw error;

      setFavorites(data?.map(f => f.project_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (projectId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para favoritar projetos.",
          variant: "destructive"
        });
        return;
      }

      const isFavorited = favorites.includes(projectId);

      if (isFavorited) {
        const { error } = await supabase
          .from('user_project_favorites')
          .delete()
          .eq('user_id', session.user.id)
          .eq('project_id', projectId);

        if (error) throw error;

        setFavorites(prev => prev.filter(id => id !== projectId));
        toast({
          title: "Removido dos favoritos",
          description: "Projeto removido dos seus favoritos."
        });
      } else {
        const { error } = await supabase
          .from('user_project_favorites')
          .insert({
            user_id: session.user.id,
            project_id: projectId
          });

        if (error) throw error;

        setFavorites(prev => [...prev, projectId]);
        toast({
          title: "Adicionado aos favoritos",
          description: "Projeto adicionado aos seus favoritos."
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos.",
        variant: "destructive"
      });
    }
  };

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorited: (projectId: string) => favorites.includes(projectId)
  };
}