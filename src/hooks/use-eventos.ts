import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

type Evento = {
  id: string
  nome: string
  tipo: string
  data: string
  data_fim: string
  local: string
  cliente_nome: string
  cliente_email: string
  cliente_telefone: string
  status: 'pendente' | 'confirmado' | 'realizado' | 'cancelado'
  observacoes?: string
  contrato_url?: string
  orcamento_id?: string
  created_at: string
  updated_at: string
}

type FiltrosEventos = {
  status?: string
  tipo?: string
  data_inicio?: string
  data_fim?: string
  cliente_nome?: string
  search?: string
}

type BuscarEventosParams = {
  filtros?: FiltrosEventos
  ordenacao?: {
    campo: string
    direcao: 'asc' | 'desc'
  }
  paginacao?: {
    pagina: number
    limite: number
  }
}

export function useEventos() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  /**
   * Busca eventos com filtros, ordenação e paginação opcionais
   */
  const buscarEventos = useCallback(async (params?: BuscarEventosParams) => {
    setIsLoading(true)
    
    try {
      let query = supabase
        .from('eventos')
        .select(`
          *,
          orcamentos (
            evento_nome,
            evento_data,
            evento_local,
            nome_contratante,
            telefone,
            tipo
          )
        `)
      
      // Aplicar filtros
      if (params?.filtros) {
        const { status, tipo, data_inicio, data_fim, cliente_nome, search } = params.filtros
        
        if (status) {
          query = query.eq('status', status)
        }
        
        if (tipo) {
          query = query.eq('orcamentos.tipo', tipo)
        }
        
        if (data_inicio) {
          query = query.gte('orcamentos.evento_data', data_inicio)
        }
        
        if (data_fim) {
          query = query.lte('orcamentos.evento_data', data_fim)
        }
        
        if (cliente_nome) {
          query = query.ilike('orcamentos.nome_contratante', `%${cliente_nome}%`)
        }
        
        if (search) {
          query = query.or(
            `orcamentos.evento_nome.ilike.%${search}%,orcamentos.nome_contratante.ilike.%${search}%,orcamentos.evento_local.ilike.%${search}%`
          )
        }
      }
      
      // Aplicar ordenação
      if (params?.ordenacao) {
        const { campo, direcao } = params.ordenacao
        query = query.order(campo, { ascending: direcao === 'asc' })
      } else {
        // Ordenação padrão por data
        query = query.order('orcamentos.evento_data', { ascending: true })
      }
      
      // Aplicar paginação
      if (params?.paginacao) {
        const { pagina, limite } = params.paginacao
        const from = (pagina - 1) * limite
        const to = from + limite - 1
        query = query.range(from, to)
      }
      
      const { data, error, count } = await query
      
      if (error) throw error
      
      return { data, count }
    } catch (error: unknown) {
      console.error('[useEventos] buscarEventos error:', error)
      toast({
        title: 'Erro ao buscar eventos',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao buscar os eventos. Tente novamente.',
        variant: 'destructive'
      })
      return { data: [], count: 0 }
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  /**
   * Busca um evento específico pelo ID
   */
  const buscarEventoPorId = async (id: string) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .select(`
          *,
          orcamentos (
            evento_nome,
            evento_data,
            evento_local,
            nome_contratante,
            telefone,
            tipo
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      return { data }
    } catch (error: unknown) {
      console.error('[useEventos] buscarEventoPorId error:', error)
      toast({
        title: 'Erro ao buscar evento',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao buscar o evento. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cria um novo evento
   */
  const criarEvento = async (evento: Omit<Evento, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .insert([evento])
        .select()
      
      if (error) throw error
      
      toast({
        title: 'Evento criado',
        description: 'O evento foi criado com sucesso!'
      })
      
      return { data: data[0] }
    } catch (error: unknown) {
      console.error('[useEventos] criarEvento error:', error)
      toast({
        title: 'Erro ao criar evento',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao criar o evento. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza um evento existente
   */
  const atualizarEvento = async (id: string, evento: Partial<Evento>) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .update(evento)
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      toast({
        title: 'Evento atualizado',
        description: 'O evento foi atualizado com sucesso!'
      })
      
      return { data: data[0] }
    } catch (error: unknown) {
      console.error('[useEventos] atualizarEvento error:', error)
      toast({
        title: 'Erro ao atualizar evento',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o evento. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza o status de um evento
   */
  const atualizarStatusEvento = async (id: string, status: string) => {
    setIsLoading(true)
    
    try {
      const atualizacoes: { status: string; confirmado_em?: string; realizado_em?: string; cancelado_em?: string } = { status }
      
      // Adicionar timestamps para confirmação ou realização
      if (status === 'confirmado') {
        atualizacoes.confirmado_em = new Date().toISOString()
      } else if (status === 'realizado') {
        atualizacoes.realizado_em = new Date().toISOString()
      } else if (status === 'cancelado') {
        atualizacoes.cancelado_em = new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('eventos')
        .update(atualizacoes)
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      const statusTexto = 
        status === 'confirmado' ? 'confirmado' : 
        status === 'realizado' ? 'marcado como realizado' : 
        status === 'cancelado' ? 'cancelado' : 'atualizado'
      
      toast({
        title: `Evento ${statusTexto}`,
        description: `O evento foi ${statusTexto} com sucesso!`
      })
      
      return { data: data[0] }
    } catch (error: unknown) {
      console.error('[useEventos] atualizarStatusEvento error:', error)
      toast({
        title: 'Erro ao atualizar status',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o status do evento. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza a URL do contrato de um evento
   */
  const atualizarContratoUrl = async (id: string, contratoUrl: string) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .update({ contrato_url: contratoUrl })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      toast({
        title: 'Contrato atualizado',
        description: 'O contrato foi atualizado com sucesso!'
      })
      
      return { data: data[0] }
    } catch (error: unknown) {
      console.error('[useEventos] atualizarContratoUrl error:', error)
      toast({
        title: 'Erro ao atualizar contrato',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao atualizar o contrato. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Remove um evento (soft delete)
   */
  const removerEvento = async (id: string) => {
    setIsLoading(true)
    
    try {
      const { error } = await supabase
        .from('eventos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({
        title: 'Evento removido',
        description: 'O evento foi removido com sucesso!'
      })
      
      return { success: true }
    } catch (error: unknown) {
      console.error('[useEventos] removerEvento error:', error)
      toast({
        title: 'Erro ao remover evento',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao remover o evento. Tente novamente.',
        variant: 'destructive'
      })
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Adiciona observações a um evento
   */
  const adicionarObservacoes = async (id: string, observacoes: string) => {
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('eventos')
        .update({ observacoes })
        .eq('id', id)
        .select()
      
      if (error) throw error
      
      toast({
        title: 'Observações salvas',
        description: 'As observações foram salvas com sucesso!'
      })
      
      return { data: data[0] }
    } catch (error: unknown) {
      console.error('[useEventos] adicionarObservacoes error:', error)
      toast({
        title: 'Erro ao salvar observações',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao salvar as observações. Tente novamente.',
        variant: 'destructive'
      })
      return { data: null }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Inscreve para atualizações em tempo real na tabela de eventos
   */
  const inscreverAtualizacoes = (callback: () => void) => {
    const subscription = supabase
      .channel('eventos-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'eventos' }, 
        () => {
          callback()
        }
      )
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }

  return {
    isLoading,
    buscarEventos,
    buscarEventoPorId,
    criarEvento,
    atualizarEvento,
    atualizarStatusEvento,
    atualizarContratoUrl,
    adicionarObservacoes,
    removerEvento,
    inscreverAtualizacoes
  }
}