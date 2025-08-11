import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { useProdutos } from '@/hooks/use-supabase'
import { formatCurrency } from '@/lib/utils'

type Produto = {
  id: string
  nome_produto: string
  descricao: string
  quantidade_disponivel: number
  valor_custo: number
  valor_venda: number
  ativo: boolean
  created_at: string
  updated_at: string
}

export function ProdutosTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState<Produto[]>([])
  
  // Utilizando o hook personalizado com realtime ativado
  const { 
    data: produtos, 
    loading, 
    error, 
    update, 
    remove 
  } = useProdutos({ 
    realtimeEnabled: true,
    onlyActive: false
  })

  // Filtrar produtos com base no termo de busca
  useEffect(() => {
    if (!produtos) return
    
    if (!searchTerm.trim()) {
      setFilteredData(produtos as Produto[])
      return
    }
    
    const filtered = produtos.filter((produto: Produto) => 
      produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    setFilteredData(filtered)
  }, [produtos, searchTerm])

  // Função para alternar o status ativo/inativo
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await update(id, { ativo: !currentStatus })
  }

  // Função para excluir produto (soft delete)
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await remove(id)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando produtos...</div>
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Erro ao carregar produtos: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>Novo Produto</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Valor de Custo</TableHead>
              <TableHead>Valor de Venda</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((produto) => (
                <TableRow key={produto.id}>
                  <TableCell className="font-medium">{produto.nome_produto}</TableCell>
                  <TableCell>
                    {produto.quantidade_disponivel < 5 ? (
                      <span className="text-red-500">{produto.quantidade_disponivel}</span>
                    ) : (
                      produto.quantidade_disponivel
                    )}
                  </TableCell>
                  <TableCell>{formatCurrency(produto.valor_custo)}</TableCell>
                  <TableCell>{formatCurrency(produto.valor_venda)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={produto.ativo ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleToggleStatus(produto.id, produto.ativo)}
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Editar</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => handleDelete(produto.id)}
                    >
                      <span className="sr-only">Excluir</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        <line x1="10" x2="10" y1="11" y2="17" />
                        <line x1="14" x2="14" y1="11" y2="17" />
                      </svg>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}