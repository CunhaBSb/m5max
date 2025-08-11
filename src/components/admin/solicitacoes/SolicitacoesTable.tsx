import { useState, useEffect, useCallback } from 'react'
import { useSolicitacaoOrcamento } from '@/hooks/use-solicitacao-orcamento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, Mail, RefreshCw, Calendar, Phone } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Filtros = {
  tipo_solicitacao?: string
  enviado_email?: boolean
  data_inicio?: string
  data_fim?: string
}

export function SolicitacoesTable() {
  const [filtros, setFiltros] = useState<Filtros>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [atualizacoes, setAtualizacoes] = useState(0)

  const { 
    isLoading, 
    buscarSolicitacoes, 
    marcarEmailEnviado,
    inscreverAtualizacoes 
  } = useSolicitacaoOrcamento()

  const [solicitacoes, setSolicitacoes] = useState<Array<{
    id: number;
    nome_completo: string;
    email: string;
    whatsapp: string;
    local_evento: string;
    data_evento: string;
    tipo_solicitacao: string;
    enviado_email: boolean;
    created_at: string;
  }>>([])
  const [totalCount, setTotalCount] = useState(0)

  const fetchData = useCallback(async () => {
    const { data, count } = await buscarSolicitacoes({
      limit,
      page,
      filtros
    })

    if (data) {
      setSolicitacoes(data)
      setTotalCount(count || 0)
    }
  }, [buscarSolicitacoes, limit, page, filtros])

  // Buscar solicitações
  useEffect(() => {
    fetchData()
  }, [fetchData, atualizacoes])

  // Inscrever para atualizações em tempo real
  useEffect(() => {
    const unsubscribe = inscreverAtualizacoes(() => {
      // Incrementar contador para forçar atualização
      setAtualizacoes(prev => prev + 1)
    })

    return () => {
      unsubscribe()
    }
  }, [inscreverAtualizacoes])

  // Filtrar por termo de busca
  const solicitacoesFiltradas = searchTerm
    ? solicitacoes.filter(s => 
        s.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.whatsapp.includes(searchTerm) ||
        s.local_evento.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : solicitacoes

  // Formatar telefone
  const formatarTelefone = (telefone: string) => {
    if (!telefone) return ''
    
    const numeros = telefone.replace(/\D/g, '')
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
    } else if (numeros.length === 10) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`
    }
    return telefone
  }

  // Formatar data
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (e) {
      return dataString
    }
  }

  // Formatar data e hora
  const formatarDataHora = (dataString: string) => {
    try {
      return format(parseISO(dataString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch (e) {
      return dataString
    }
  }

  // Marcar email como enviado
  const handleMarcarEmailEnviado = async (id: number) => {
    await marcarEmailEnviado(id)
    // Atualizar lista
    setAtualizacoes(prev => prev + 1)
  }

  // Abrir WhatsApp
  const abrirWhatsApp = (telefone: string) => {
    const numero = telefone.replace(/\D/g, '')
    window.open(`https://wa.me/55${numero}`, '_blank')
  }

  // Enviar email
  const enviarEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  // Calcular total de páginas
  const totalPages = Math.ceil(totalCount / limit)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Solicitações de Orçamento</CardTitle>
        <CardDescription>
          Gerencie as solicitações de orçamento recebidas pelo site.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email, telefone ou local..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-row gap-2">
            <Select
              value={filtros.tipo_solicitacao || ''}
              onValueChange={(value) => 
                setFiltros(prev => ({ ...prev, tipo_solicitacao: value || undefined }))
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
            
            <Select
              value={filtros.enviado_email === undefined ? '' : filtros.enviado_email ? 'true' : 'false'}
              onValueChange={(value) => 
                setFiltros(prev => ({ 
                  ...prev, 
                  enviado_email: value === '' ? undefined : value === 'true'
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status do email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="true">Email enviado</SelectItem>
                <SelectItem value="false">Email pendente</SelectItem>
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
        ) : solicitacoesFiltradas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma solicitação encontrada.
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data do Evento</TableHead>
                  <TableHead>Recebido em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitacoesFiltradas.map((solicitacao) => (
                  <TableRow key={solicitacao.id}>
                    <TableCell>
                      <div className="font-medium">{solicitacao.nome_completo}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {solicitacao.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {formatarTelefone(solicitacao.whatsapp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {solicitacao.tipo_solicitacao}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatarData(solicitacao.data_evento)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {solicitacao.local_evento}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatarDataHora(solicitacao.created_at)}
                    </TableCell>
                    <TableCell>
                      {solicitacao.enviado_email ? (
                        <Badge className="bg-green-100 text-green-800">Email enviado</Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Email pendente</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => abrirWhatsApp(solicitacao.whatsapp)}
                        >
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => enviarEmail(solicitacao.email)}
                        >
                          Email
                        </Button>
                        {!solicitacao.enviado_email && (
                          <Button
                            size="sm"
                            onClick={() => handleMarcarEmailEnviado(solicitacao.id)}
                          >
                            Marcar enviado
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
              Mostrando {solicitacoesFiltradas.length} de {totalCount} resultados
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