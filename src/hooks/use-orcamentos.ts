import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'
import { Database } from '@/types/database'

type Orcamento = Database['public']['Tables']['orcamentos']['Row']
type OrcamentoInsert = Database['public']['Tables']['orcamentos']['Insert']
type OrcamentoUpdate = Database['public']['Tables']['orcamentos']['Update']

export function useOrcamentos() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  /**
   * Busca orçamentos com filtros opcionais
   */
  const buscarOrcamentos = async ({
    limit = 10,
    page = 1,
    filtros = {},
    ordenacao = { campo: 'created_at', ordem: 'desc' as const },
  }: {
    limit?: number
    page?: number
    filtros?: {
      status?: string
      tipo?: string
      data_inicio?: string
      data_fim?: string
      busca?: string
    }
    ordenacao?: {
      campo: keyof Orcamento
      ordem: 'asc' | 'desc'
    }
  } = {}) => {
    setIsLoading(true)

    try {
      let query = supabase
        .from('orcamentos')
        .select('*, usuarios!inner(*)', { count: 'exact' })

      // Aplicar filtros
      if (filtros.status) {
        query = query.eq('status', filtros.status)
      }

      if (filtros.tipo) {
        query = query.eq('tipo', filtros.tipo)
      }

      if (filtros.data_inicio) {
        query = query.gte('created_at', filtros.data_inicio)
      }

      if (filtros.data_fim) {
        query = query.lte('created_at', filtros.data_fim)
      }

      if (filtros.busca) {
        query = query.or(
          `nome_contratante.ilike.%${filtros.busca}%,evento_nome.ilike.%${filtros.busca}%,cpf.ilike.%${filtros.busca}%`
        )
      }

      // Ordenação
      query = query.order(ordenacao.campo, { ascending: ordenacao.ordem === 'asc' })

      // Paginação
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return { data, count, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao buscar orçamentos:', error)

      toast({
        title: 'Erro ao buscar orçamentos',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, count: 0, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Busca um orçamento pelo ID
   */
  const buscarOrcamentoPorId = async (id: number) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .select('*, usuarios!inner(*)')
        .eq('id', id)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao buscar orçamento:', error)

      toast({
        title: 'Erro ao buscar orçamento',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Cria um novo orçamento
   */
  const criarOrcamento = async (orcamento: OrcamentoInsert) => {
    setIsLoading(true)

    try {
      // Adicionar campos adicionais
      const orcamentoCompleto = {
        ...orcamento,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('orcamentos')
        .insert(orcamentoCompleto)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Orçamento criado com sucesso!',
        description: `Orçamento #${data.id} foi criado.`,
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao criar orçamento:', error)

      toast({
        title: 'Erro ao criar orçamento',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza um orçamento existente
   */
  const atualizarOrcamento = async (id: number, orcamento: OrcamentoUpdate) => {
    setIsLoading(true)

    try {
      // Adicionar campo updated_at
      const orcamentoAtualizado = {
        ...orcamento,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from('orcamentos')
        .update(orcamentoAtualizado)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Orçamento atualizado com sucesso!',
        description: `Orçamento #${data.id} foi atualizado.`,
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao atualizar orçamento:', error)

      toast({
        title: 'Erro ao atualizar orçamento',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza o status de um orçamento
   */
  const atualizarStatusOrcamento = async (id: number, status: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Mensagens específicas por status
      let mensagem = ''
      switch (status) {
        case 'aprovado':
          mensagem = 'Orçamento aprovado com sucesso!'
          break
        case 'recusado':
          mensagem = 'Orçamento marcado como recusado.'
          break
        case 'pendente':
          mensagem = 'Orçamento marcado como pendente.'
          break
        case 'cancelado':
          mensagem = 'Orçamento cancelado com sucesso.'
          break
        default:
          mensagem = 'Status do orçamento atualizado.'
      }

      toast({
        title: mensagem,
        description: `Orçamento #${data.id} foi atualizado.`,
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao atualizar status do orçamento:', error)

      toast({
        title: 'Erro ao atualizar status',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Atualiza a URL do PDF de um orçamento
   */
  const atualizarPdfUrl = async (id: number, pdf_url: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('orcamentos')
        .update({
          pdf_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'PDF atualizado com sucesso!',
        description: `O PDF do orçamento #${data.id} foi atualizado.`,
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useOrcamentos]', 'Erro ao atualizar PDF do orçamento:', error)

      toast({
        title: 'Erro ao atualizar PDF',
        description: error?.message || 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Inscreve-se para receber atualizações em tempo real de orçamentos
   */
  const inscreverAtualizacoes = (callback: (payload: unknown) => void) => {
    const subscription = supabase
      .channel('orcamentos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orcamentos',
        },
        callback
      )
      .subscribe()

    // Retorna função para cancelar a inscrição
    return () => {
      subscription.unsubscribe()
    }
  }

  return {
    isLoading,
    buscarOrcamentos,
    buscarOrcamentoPorId,
    criarOrcamento,
    atualizarOrcamento,
    atualizarStatusOrcamento,
    atualizarPdfUrl,
    inscreverAtualizacoes,
  }
}