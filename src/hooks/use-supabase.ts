import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './use-toast';

// Hook genérico para operações CRUD com Supabase
export function useSupabase<T, I, U>(
  tableName: string,
  options?: {
    select?: string;
    defaultFilter?: Record<string, unknown>;
    orderBy?: { column: string; ascending?: boolean };
    realtimeEnabled?: boolean;
  }
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Configurações padrão
  const {
    select = '*',
    defaultFilter = {},
    orderBy,
    realtimeEnabled = false,
  } = options || {};

  // Função para buscar dados
  const fetchData = useCallback(async (filter: Record<string, unknown> = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Combinar filtros padrão com filtros específicos
      const combinedFilter = { ...defaultFilter, ...filter };

      // Iniciar a query
      let query = supabase.from(tableName).select(select);

      // Aplicar filtros
      Object.entries(combinedFilter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Aplicar ordenação
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        });
      }

      // Executar a query
      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result as T[]);
    } catch (err) {
      console.error(`Erro ao buscar dados da tabela ${tableName}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      toast({
        title: 'Erro ao carregar dados',
        description: `Não foi possível carregar os dados de ${tableName}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [tableName, select, defaultFilter, orderBy, toast]);

  // Função para buscar um item por ID
  const getById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error: queryError } = await supabase
          .from(tableName)
          .select(select)
          .eq('id', id)
          .single();

        if (queryError) throw queryError;
        return result as T;
      } catch (err) {
        console.error(`Erro ao buscar item por ID na tabela ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: 'Erro ao carregar item',
          description: `Não foi possível carregar o item de ${tableName}`,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tableName, select, toast]
  );

  // Função para criar um novo item
  const create = useCallback(
    async (item: I) => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error: insertError } = await supabase
          .from(tableName)
          .insert(item)
          .select()
          .single();

        if (insertError) throw insertError;

        // Atualizar o estado local
        setData((prevData) => [...prevData, result as T]);

        toast({
          title: 'Item criado com sucesso',
          description: `O item foi adicionado à tabela ${tableName}`,
        });

        return result as T;
      } catch (err) {
        console.error(`Erro ao criar item na tabela ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: 'Erro ao criar item',
          description: `Não foi possível criar o item em ${tableName}`,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tableName, toast]
  );

  // Função para atualizar um item
  const update = useCallback(
    async (id: string, updates: U) => {
      setLoading(true);
      setError(null);

      try {
        const { data: result, error: updateError } = await supabase
          .from(tableName)
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Atualizar o estado local
        setData((prevData) =>
          prevData.map((item: T & { id: string }) => (item.id === id ? result : item)) as T[]
        );

        toast({
          title: 'Item atualizado com sucesso',
          description: `O item foi atualizado na tabela ${tableName}`,
        });

        return result as T;
      } catch (err) {
        console.error(`Erro ao atualizar item na tabela ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: 'Erro ao atualizar item',
          description: `Não foi possível atualizar o item em ${tableName}`,
          variant: 'destructive',
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [tableName, toast]
  );

  // Função para deletar um item
  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        // Atualizar o estado local
        setData((prevData) => prevData.filter((item: T & { id: string }) => item.id !== id) as T[]);

        toast({
          title: 'Item removido com sucesso',
          description: `O item foi removido da tabela ${tableName}`,
        });

        return true;
      } catch (err) {
        console.error(`Erro ao remover item da tabela ${tableName}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        toast({
          title: 'Erro ao remover item',
          description: `Não foi possível remover o item de ${tableName}`,
          variant: 'destructive',
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [tableName, toast]
  );

  // Configurar Realtime subscription
  useEffect(() => {
    if (!realtimeEnabled) return;

    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: tableName },
        (payload) => {
          
          // Atualizar o estado baseado no tipo de evento
          if (payload.eventType === 'INSERT') {
            setData((prevData) => [...prevData, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((prevData) =>
              prevData.map((item: T & { id: string }) => 
                item.id === payload.new.id ? payload.new : item
              ) as T[]
            );
          } else if (payload.eventType === 'DELETE') {
            setData((prevData) => 
              prevData.filter((item: T & { id: string }) => item.id !== payload.old.id) as T[]
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, realtimeEnabled]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    getById,
    create,
    update,
    remove,
    refresh: fetchData,
  };
}

// Hooks específicos para cada tabela

// Hook para produtos
export function useProdutos(options?: {
  onlyActive?: boolean;
  orderBy?: { column: string; ascending?: boolean };
  realtimeEnabled?: boolean;
}) {
  const defaultFilter = options?.onlyActive ? { ativo: true } : {};
  const orderByOption = options?.orderBy || { column: 'nome_produto', ascending: true };
  
  return useSupabase('produtos', {
    defaultFilter,
    orderBy: orderByOption,
    realtimeEnabled: options?.realtimeEnabled,
  });
}

// Hook para orçamentos
export function useOrcamentos(options?: {
  status?: 'pendente' | 'confirmado' | 'cancelado';
  orderBy?: { column: string; ascending?: boolean };
  realtimeEnabled?: boolean;
}) {
  const defaultFilter = options?.status ? { status: options.status } : {};
  const orderByOption = options?.orderBy || { column: 'created_at', ascending: false };
  
  return useSupabase('orcamentos', {
    defaultFilter,
    orderBy: orderByOption,
    realtimeEnabled: options?.realtimeEnabled,
  });
}

// Hook para eventos
export function useEventos(options?: {
  status?: 'pendente' | 'confirmado' | 'realizado' | 'cancelado';
  orderBy?: { column: string; ascending?: boolean };
  realtimeEnabled?: boolean;
}) {
  const defaultFilter = options?.status ? { status: options.status } : {};
  const orderByOption = options?.orderBy || { column: 'created_at', ascending: false };
  
  return useSupabase('eventos', {
    select: '*, orcamento_id(id, nome_contratante, evento_nome, evento_data)',
    defaultFilter,
    orderBy: orderByOption,
    realtimeEnabled: options?.realtimeEnabled,
  });
}

// Hook para solicitações de orçamento
export function useSolicitacoesOrcamento(options?: {
  processadas?: boolean;
  orderBy?: { column: string; ascending?: boolean };
  realtimeEnabled?: boolean;
}) {
  const defaultFilter = options?.processadas !== undefined ? { enviado_email: options.processadas } : {};
  const orderByOption = options?.orderBy || { column: 'created_at', ascending: false };
  
  return useSupabase('solicitacoes_orcamento', {
    defaultFilter,
    orderBy: orderByOption,
    realtimeEnabled: options?.realtimeEnabled,
  });
}