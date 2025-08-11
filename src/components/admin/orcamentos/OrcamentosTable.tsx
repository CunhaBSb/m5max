import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, FileText, Calendar, CheckCircle, XCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react'
import { useOrcamentos } from '@/hooks/use-orcamentos'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Filtros = {
  status?: string
  tipo?: string
  busca?: string
}

export function OrcamentosTable() {
  const [filtros, setFiltros] = useState<Filtros>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  
  const { 
    isLoading, 
    buscarOrcamentos, 
    atualizarStatusOrcamento,
    inscreverAtualizacoes 
  } = useOrcamentos()

  const [orcamentos, setOrcamentos] = useState<Array<{
    id: string;
    nome_contratante: string;
    telefone?: string;
    cpf?: string;
    status: string;
    valor_total: number;
    created_at: string;
    evento_nome?: string;
    evento_data?: string;
    evento_local?: string;
    modo_pagamento?: string;
    pdf_url?: string;
  }>>([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchData = useCallback(async () => {
    // Aplicar termo de busca aos filtros
    const filtrosComBusca = searchTerm 
      ? { ...filtros, busca: searchTerm }
      : filtros

    const { data, count } = await buscarOrcamentos({
      limit,
      page,
      filtros: filtrosComBusca
    })

    if (data) {
      setOrcamentos(data)
      setTotalCount(count || 0)
    }
  }, [buscarOrcamentos, limit, page, filtros, searchTerm])

  // Buscar orçamentos
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Inscrever para atualizações em tempo real
  useEffect(() => {
    const unsubscribe = inscreverAtualizacoes(() => {
      // Recarregar dados quando houver atualizações
      fetchData()
    })

    return () => {
      unsubscribe()
    }
  }, [inscreverAtualizacoes, fetchData])

  // Formatar valor monetário
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  // Formatar data
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), "dd/MM/yyyy", { locale: ptBR })
    } catch (e) {
      return dataString
    }
  }

  // Atualizar status do orçamento
  const handleAtualizarStatus = async (id: string, status: string) => {
    await atualizarStatusOrcamento(id, status)
  }

  // Abrir PDF
  const abrirPdf = (url: string) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  // Obter badge de status
  const getBadgeStatus = (status: string) => {
    switch (status) {
      case 'confirmado':
        return <Badge variant="default">Confirmado</Badge>
      case 'cancelado':
        return <Badge variant="destructive">Cancelado</Badge>
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Calcular total de páginas
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Orçamentos</CardTitle>
        <CardDescription>
          Gerencie os orçamentos criados no sistema.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, evento ou telefone..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-row gap-2">
            <Select
              value={filtros.status || ''}
              onValueChange={(value) => 
                setFiltros(prev => ({ ...prev, status: value || undefined }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filtros.tipo || ''}
              onValueChange={(value) => 
                setFiltros(prev => ({ ...prev, tipo: value || undefined }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="aniversario">Aniversário</SelectItem>
                <SelectItem value="corporativo">Corporativo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setFiltros({})
                setSearchTerm('')
                setPage(1)
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
        
        {/* Tabela */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orcamentos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum orçamento encontrado.
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentos.map((orcamento) => (
                  <TableRow key={orcamento.id}>
                    <TableCell className="font-medium">
                      {orcamento.nome_contratante}
                      <div className="text-sm text-muted-foreground">
                        {orcamento.telefone}
                      </div>
                      {orcamento.cpf && (
                        <div className="text-xs text-muted-foreground">
                          CPF: {orcamento.cpf}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{orcamento.evento_nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {formatarData(orcamento.evento_data)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {orcamento.evento_local}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatarValor(orcamento.valor_total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {orcamento.modo_pagamento}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBadgeStatus(orcamento.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {orcamento.pdf_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => abrirPdf(orcamento.pdf_url)}
                          >
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">Ver PDF</span>
                          </Button>
                        )}
                        
                        {orcamento.status === 'pendente' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleAtualizarStatus(orcamento.id, 'confirmado')}
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Confirmar</span>
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleAtualizarStatus(orcamento.id, 'cancelado')}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Cancelar</span>
                            </Button>
                          </>
                        )}
                        
                        {orcamento.status === 'confirmado' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleAtualizarStatus(orcamento.id, 'cancelado')}
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span className="sr-only">Cancelar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {orcamentos.length} de {totalCount} resultados
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}