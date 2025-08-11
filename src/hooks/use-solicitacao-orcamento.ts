import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from './use-toast'
import { Database } from '@/types/database'

type SolicitacaoOrcamento = Database['public']['Tables']['solicitacoes_orcamento']['Insert']

export function useSolicitacaoOrcamento() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  /**
   * Envia uma nova solicitação de orçamento
   */
  const enviarSolicitacao = async (solicitacao: SolicitacaoOrcamento) => {
    setIsLoading(true)

    try {
      // Adicionar campos adicionais
      const solicitacaoCompleta = {
        ...solicitacao,
        enviado_email: false,
        created_at: new Date().toISOString(),
      }

      // Inserir no Supabase
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .insert(solicitacaoCompleta)
        .select('id')
        .single()

      if (error) throw error

      toast({
        title: 'Solicitação enviada com sucesso!',
        description: 'Entraremos em contato em breve.',
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useSolicitacaoOrcamento]', 'Erro ao enviar solicitação:', error)

      toast({
        title: 'Erro ao enviar solicitação',
        description: error instanceof Error ? error.message : 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Inscreve-se para receber atualizações em tempo real de novas solicitações
   * Útil para o painel administrativo
   */
  const inscreverAtualizacoes = (callback: (payload: unknown) => void) => {
    const subscription = supabase
      .channel('solicitacoes_orcamento_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'solicitacoes_orcamento',
        },
        callback
      )
      .subscribe()

    // Retorna função para cancelar a inscrição
    return () => {
      subscription.unsubscribe()
    }
  }

  /**
   * Busca solicitações de orçamento com filtros opcionais
   * Útil para o painel administrativo
   */
  const buscarSolicitacoes = async ({
    limit = 10,
    page = 1,
    filtros = {},
  }: {
    limit?: number
    page?: number
    filtros?: {
      tipo_solicitacao?: string
      enviado_email?: boolean
      data_inicio?: string
      data_fim?: string
    }
  } = {}) => {
    setIsLoading(true)

    try {
      let query = supabase
        .from('solicitacoes_orcamento')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filtros.tipo_solicitacao) {
        query = query.eq('tipo_solicitacao', filtros.tipo_solicitacao)
      }

      if (filtros.enviado_email !== undefined) {
        query = query.eq('enviado_email', filtros.enviado_email)
      }

      if (filtros.data_inicio) {
        query = query.gte('created_at', filtros.data_inicio)
      }

      if (filtros.data_fim) {
        query = query.lte('created_at', filtros.data_fim)
      }

      // Paginação
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return { data, count, error: null }
    } catch (error: unknown) {
      console.error('[useSolicitacaoOrcamento]', 'Erro ao buscar solicitações:', error)

      toast({
        title: 'Erro ao buscar solicitações',
        description: error instanceof Error ? error.message : 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, count: 0, error }
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Marca uma solicitação como tendo email enviado
   * Útil para o painel administrativo
   */
  const marcarEmailEnviado = async (id: number) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('solicitacoes_orcamento')
        .update({ enviado_email: true })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      toast({
        title: 'Solicitação atualizada',
        description: 'Email marcado como enviado.',
      })

      return { data, error: null }
    } catch (error: unknown) {
      console.error('[useSolicitacaoOrcamento]', 'Erro ao atualizar solicitação:', error)

      toast({
        title: 'Erro ao atualizar solicitação',
        description: error instanceof Error ? error.message : 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      })

      return { data: null, error }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    enviarSolicitacao,
    buscarSolicitacoes,
    marcarEmailEnviado,
    inscreverAtualizacoes,
  }
}