import { useState, useEffect, useCallback, useMemo } from "react";
import { useDebouncedSearch } from "@/hooks/use-debounced-search";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchema, type ProdutoFormData } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Produto = Database['public']['Tables']['produtos']['Row'];

// Função para mapear categorias para nomes de exibição
const getCategoryDisplayName = (categoria: string): string => {
  const categoryNames: Record<string, string> = {
    'tortas': 'Tortas',
    'granadas': 'Granadas',
    'metralhas': 'Metralhas',
    'acessorios': 'Acessórios/Fios',
    'kits': 'Kits',
    'rojoes': 'Rojões',
    'fumacas': 'Fumaças',
    'cascata': 'Cascata',
    'morteiros': 'Morteiros',
    'bombas': 'Bombas',
    'cha_revelacao': 'Chá Revelação',
    'lancador': 'Lançador',
    'papel_picado': 'Papel Picado'
  };
  
  return categoryNames[categoria] || categoria;
};

const AdminEstoque = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterEffect, setFilterEffect] = useState("all");
  const [priceSort, setPriceSort] = useState("none");
  const [durationSort, setDurationSort] = useState("none");
  const { toast } = useToast();

  const generateProductCode = async (categoria: string): Promise<string> => {
    try {
      // Mapear categoria para prefixo
      const categoryPrefixes: Record<string, string> = {
        'tortas': 'TOR',
        'granadas': 'GRD',
        'metralhas': 'MTL',
        'acessorios': 'ACC',
        'kits': 'KIT',
        'rojoes': 'ROJ',
        'fumacas': 'FUM',
        'cascata': 'CAS',
        'morteiros': 'MOR',
        'bombas': 'BOM',
        'cha_revelacao': 'CHR',
        'lancador': 'LAN',
        'papel_picado': 'PPD'
      };

      const prefix = categoryPrefixes[categoria] || 'PRD';
      
      // Buscar o último código da categoria
      const { data, error } = await supabase
        .from('produtos')
        .select('codigo')
        .like('codigo', `${prefix}%`)
        .order('codigo', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastCode = data[0].codigo;
        const numberPart = lastCode.replace(prefix, '');
        nextNumber = parseInt(numberPart) + 1;
      }

      return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Erro ao gerar código:', error);
      return `PRD${Date.now().toString().slice(-3)}`;
    }
  };

  const form = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      codigo: '',
      nome_produto: '',
      quantidade_disponivel: 0,
      tubos: '',
      categoria: '',
      fabricante: '',
      efeito: '',
      duracao_segundos: 0,
      valor_compra: 0,
      valor_venda: 0,
      ativo: true,
    }
  });

  const fetchProdutos = useCallback(async () => {
    try {
      // Tentar query mais específica primeiro
      const { data, error } = await supabase
        .from('produtos')
        .select(`
          id,
          codigo,
          nome_produto,
          quantidade_disponivel,
          tubos,
          categoria,
          fabricante,
          efeito,
          duracao_segundos,
          valor_compra,
          valor_venda,
          ativo,
          created_at,
          updated_at
        `)
        .eq('ativo', true)
        .order('nome_produto');


      if (error) {
        console.error('❌ Erro na query:', error);
        throw error;
      }
      
      setProdutos(data || []);
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar a lista de produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    // Testar conectividade primeiro
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('produtos')
          .select('count', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.error('❌ Erro de conectividade:', error);
        }
      } catch (err) {
        console.error('❌ Erro de conectividade:', err);
      }
    };

    testConnection();
    fetchProdutos();
  }, [fetchProdutos]);

  const handleSubmit = async (data: ProdutoFormData) => {
    try {
      if (editingProduct) {
        // Atualizar produto existente
        const { error } = await supabase
          .from('produtos')
          .update({
            ...data,
            tubos: data.tubos || null,
            fabricante: data.fabricante || null,
            efeito: data.efeito || null,
            duracao_segundos: data.duracao_segundos || null,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado!",
          description: "As informações do produto foram salvas com sucesso.",
        });
      } else {
        // Criar novo produto
        const { error } = await supabase
          .from('produtos')
          .insert({
            ...data,
            tubos: data.tubos || null,
            fabricante: data.fabricante || null,
            efeito: data.efeito || null,
            duracao_segundos: data.duracao_segundos || null,
          });

        if (error) throw error;

        toast({
          title: "Produto criado!",
          description: "O novo produto foi adicionado ao estoque.",
        });
      }

      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      fetchProdutos();
    } catch (error: unknown) {
      toast({
        title: "Erro ao salvar produto",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduct(produto);
    form.reset({
      codigo: produto.codigo,
      nome_produto: produto.nome_produto,
      quantidade_disponivel: produto.quantidade_disponivel,
      tubos: produto.tubos || '',
      categoria: produto.categoria,
      fabricante: produto.fabricante || '',
      efeito: produto.efeito || '',
      duracao_segundos: produto.duracao_segundos || 0,
      valor_compra: produto.valor_compra,
      valor_venda: produto.valor_venda,
      ativo: produto.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (produto: Produto) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${produto.nome_produto}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produto.id);

      if (error) throw error;

      toast({
        title: "Produto excluído!",
        description: "O produto foi removido do estoque.",
      });

      fetchProdutos();
    } catch (error: unknown) {
      toast({
        title: "Erro ao excluir produto",
        description: error instanceof Error ? error.message : "Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleNewProduct = async () => {
    setEditingProduct(null);
    form.reset();
    
    // Gerar código automático para novo produto
    const newCode = await generateProductCode('tortas'); // Default para tortas, será atualizado quando a categoria for selecionada
    form.setValue('codigo', newCode);
    
    setIsDialogOpen(true);
  };

  // Filtros base sem busca de texto (otimizado)
  const baseFilteredProdutos = useMemo(() => {
    return produtos.filter(produto => {
      // REGRA CONDICIONAL: Se filtros de ordenação estão ativos, produtos sem duração não aparecem
      const hasOrderingFilters = priceSort !== "none" || durationSort !== "none";
      if (hasOrderingFilters && (!produto.duracao_segundos || produto.duracao_segundos <= 0)) {
        return false;
      }
      
      const matchesCategory = filterCategory === "all" || produto.categoria === filterCategory;
      
      // Filtro de efeito por grupo principal
      let matchesEffect = true;
      if (filterEffect !== "all") {
        if (!produto.efeito) {
          matchesEffect = false;
        } else {
          const efeito = produto.efeito.toLowerCase();
          const filtro = filterEffect.toLowerCase();
          
          if (filtro === "leque w") {
            matchesEffect = efeito.includes("leque w");
          } else if (filtro === "leque z") {
            matchesEffect = efeito.includes("leque z");
          } else if (filtro === "leque") {
            matchesEffect = efeito.includes("leque");
          } else if (filtro === "reto") {
            matchesEffect = efeito.includes("reto");
          } else if (filtro === "fumaça") {
            matchesEffect = efeito.includes("fumaça");
          } else {
            matchesEffect = efeito.includes(filtro);
          }
        }
      }
      
      return matchesCategory && matchesEffect;
    });
  }, [produtos, filterCategory, filterEffect, priceSort, durationSort]);

  // Busca otimizada com debounce
  const { filteredItems: searchFilteredProdutos } = useDebouncedSearch(
    baseFilteredProdutos,
    searchTerm,
    ['nome_produto', 'codigo', 'categoria', 'fabricante']
  );

  // Sistema SIMPLES de custo-benefício que FUNCIONA
  const filteredProdutos = useMemo(() => {
    
    let result = [...searchFilteredProdutos];
    
    // ABORDAGEM SUPER SIMPLES: Calcular custo por segundo
    if (priceSort !== "none" && durationSort !== "none") {
      
      result = result.sort((a, b) => {
        // Calcular custo por segundo (menor = melhor custo-benefício)
        const custoSegundoA = a.valor_venda / a.duracao_segundos;
        const custoSegundoB = b.valor_venda / b.duracao_segundos;
        
        
        // Para "menor preço" + "maior duração" = menor custo por segundo primeiro
        if (priceSort === "asc" && durationSort === "desc") {
          return custoSegundoA - custoSegundoB; // Melhor custo-benefício primeiro
        }
        // Para "maior preço" + "menor duração" = maior custo por segundo primeiro  
        else if (priceSort === "desc" && durationSort === "asc") {
          return custoSegundoB - custoSegundoA; // Pior custo-benefício primeiro
        }
        // Outras combinações: ordenar por duração primeiro
        else {
          const durationCompare = durationSort === "asc" 
            ? a.duracao_segundos - b.duracao_segundos 
            : b.duracao_segundos - a.duracao_segundos;
          
          // Se durações iguais, usar preço
          if (durationCompare === 0) {
            return priceSort === "asc" 
              ? a.valor_venda - b.valor_venda 
              : b.valor_venda - a.valor_venda;
          }
          return durationCompare;
        }
      });
      
    } else if (durationSort !== "none") {
      result = result.sort((a, b) => {
        return durationSort === "asc" 
          ? a.duracao_segundos - b.duracao_segundos 
          : b.duracao_segundos - a.duracao_segundos;
      });
      
    } else if (priceSort !== "none") {
      result = result.sort((a, b) => {
        return priceSort === "asc" 
          ? a.valor_venda - b.valor_venda 
          : b.valor_venda - a.valor_venda;
      });
      
    }
    
    
    return result;
  }, [searchFilteredProdutos, priceSort, durationSort]);

  const totalProdutos = produtos.length;
  const produtosAtivos = produtos.filter(p => p.ativo).length;
  const produtosBaixoEstoque = produtos.filter(p => p.quantidade_disponivel <= 5).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
          <div className="text-center">
            <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-pulse mx-auto mb-2 sm:mb-3 md:mb-4" />
            <p className="text-xs sm:text-sm md:text-base">Carregando produtos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Gestão de Estoque</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Gerencie os produtos pirotécnicos</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewProduct} size="sm" className="text-xs py-1 h-8 sm:text-sm sm:h-9">
                <Plus className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border-border mx-4">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigo" className="text-foreground">Código *</Label>
                    <Input
                      id="codigo"
                      {...form.register('codigo')}
                      placeholder="Gerado automaticamente"
                      readOnly={!editingProduct}
                      className={!editingProduct ? "bg-muted cursor-not-allowed" : "bg-background border-border text-foreground"}
                    />
                    {!editingProduct && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Código gerado automaticamente baseado na categoria
                      </p>
                    )}
                    {form.formState.errors.codigo && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.codigo.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="categoria" className="text-foreground">Categoria *</Label>
                    <Controller
                      name="categoria"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={async (value) => {
                          field.onChange(value);
                          // Gerar novo código apenas para produtos novos (não edição)
                          if (!editingProduct) {
                            const newCode = await generateProductCode(value);
                            form.setValue('codigo', newCode);
                          }
                        }} value={field.value}>
                          <SelectTrigger className="bg-background border-border text-foreground">
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectItem value="tortas">Tortas</SelectItem>
                            <SelectItem value="granadas">Granadas</SelectItem>
                            <SelectItem value="metralhas">Metralhas</SelectItem>
                            <SelectItem value="acessorios">Acessórios/Fios</SelectItem>
                            <SelectItem value="kits">Kits</SelectItem>
                            <SelectItem value="rojoes">Rojões</SelectItem>
                            <SelectItem value="fumacas">Fumaças</SelectItem>
                            <SelectItem value="cascata">Cascata</SelectItem>
                            <SelectItem value="morteiros">Morteiros</SelectItem>
                            <SelectItem value="bombas">Bombas</SelectItem>
                            <SelectItem value="cha_revelacao">Chá Revelação</SelectItem>
                            <SelectItem value="lancador">Lançador</SelectItem>
                            <SelectItem value="papel_picado">Papel Picado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.categoria && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.categoria.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="nome_produto" className="text-foreground">Nome do Produto *</Label>
                  <Input
                    id="nome_produto"
                    {...form.register('nome_produto')}
                    placeholder="Nome do produto"
                    className="bg-background border-border text-foreground"
                  />
                  {form.formState.errors.nome_produto && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.nome_produto.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantidade_disponivel" className="text-foreground">Quantidade *</Label>
                    <Input
                      id="quantidade_disponivel"
                      type="number"
                      {...form.register('quantidade_disponivel', { valueAsNumber: true })}
                      placeholder="0"
                      className="bg-background border-border text-foreground"
                    />
                    {form.formState.errors.quantidade_disponivel && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantidade_disponivel.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="valor_compra" className="text-foreground">Valor Compra *</Label>
                    <Input
                      id="valor_compra"
                      type="number"
                      step="0.01"
                      {...form.register('valor_compra', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="bg-background border-border text-foreground"
                    />
                    {form.formState.errors.valor_compra && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.valor_compra.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="valor_venda" className="text-foreground">Valor Venda *</Label>
                    <Input
                      id="valor_venda"
                      type="number"
                      step="0.01"
                      {...form.register('valor_venda', { valueAsNumber: true })}
                      placeholder="0.00"
                      className="bg-background border-border text-foreground"
                    />
                    {form.formState.errors.valor_venda && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.valor_venda.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fabricante" className="text-foreground">Fabricante</Label>
                    <Input
                      id="fabricante"
                      {...form.register('fabricante')}
                      placeholder="Nome do fabricante"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tubos" className="text-foreground">Tubos</Label>
                    <Input
                      id="tubos"
                      {...form.register('tubos')}
                      placeholder="Ex: 25 tubos"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="efeito" className="text-foreground">Efeito</Label>
                    <Input
                      id="efeito"
                      {...form.register('efeito')}
                      placeholder="Ex: Chuva dourada, Salgueiro colorido"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duracao_segundos" className="text-foreground">Duração (segundos)</Label>
                    <Input
                      id="duracao_segundos"
                      type="number"
                      {...form.register('duracao_segundos', { valueAsNumber: true })}
                      placeholder="0"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    {...form.register('ativo')}
                    className="rounded"
                  />
                  <Label htmlFor="ativo" className="text-foreground">Produto ativo</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Atualizar' : 'Criar'} Produto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalProdutos}</div>
              <p className="text-xs text-muted-foreground">
                {produtosAtivos} ativos
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Baixo Estoque</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{produtosBaixoEstoque}</div>
              <p className="text-xs text-muted-foreground">
                ≤ 5 unidades
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">Valor do Estoque</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {produtos.reduce((acc, p) => acc + (p.valor_compra * p.quantidade_disponivel), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                valor de compra
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="Buscar por nome, código, categoria ou fabricante..."
                    className="pl-10 bg-background border-border text-foreground"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="tortas">Tortas</SelectItem>
                    <SelectItem value="granadas">Granadas</SelectItem>
                    <SelectItem value="metralhas">Metralhas</SelectItem>
                    <SelectItem value="acessorios">Acessórios/Fios</SelectItem>
                    <SelectItem value="kits">Kits</SelectItem>
                    <SelectItem value="rojoes">Rojões</SelectItem>
                    <SelectItem value="fumacas">Fumaças</SelectItem>
                    <SelectItem value="cascata">Cascata</SelectItem>
                    <SelectItem value="morteiros">Morteiros</SelectItem>
                    <SelectItem value="bombas">Bombas</SelectItem>
                    <SelectItem value="cha_revelacao">Chá Revelação</SelectItem>
                    <SelectItem value="lancador">Lançador</SelectItem>
                    <SelectItem value="papel_picado">Papel Picado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="effect">Efeito</Label>
                <Select value={filterEffect} onValueChange={setFilterEffect}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Todos os efeitos" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">Todos os efeitos</SelectItem>
                    <SelectItem value="Explosivo">Explosivo</SelectItem>
                    <SelectItem value="Fumaça">Fumaça</SelectItem>
                    <SelectItem value="Leque">Leque</SelectItem>
                    <SelectItem value="Leque W">Leque W</SelectItem>
                    <SelectItem value="Leque Z">Leque Z</SelectItem>
                    <SelectItem value="Reto">Reto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="price">Ordenar por Preço</Label>
                <Select value={priceSort} onValueChange={(value) => {
                  setPriceSort(value);
                }}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Sem ordenação" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="none">Sem ordenação</SelectItem>
                    <SelectItem value="asc">Menor preço</SelectItem>
                    <SelectItem value="desc">Maior preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="duration">Ordenar por Duração</Label>
                <Select value={durationSort} onValueChange={(value) => {
                  setDurationSort(value);
                }}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Sem ordenação" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="none">Sem ordenação</SelectItem>
                    <SelectItem value="asc">Menor duração</SelectItem>
                    <SelectItem value="desc">Maior duração</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-gradient-to-br from-card to-primary/5 border border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Produtos</CardTitle>
            <CardDescription className="text-muted-foreground">
              {filteredProdutos.length} produto(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-primary/5 border-b border-primary/20">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold !text-primary">Código</TableHead>
                    <TableHead className="font-semibold !text-primary">Fabricante</TableHead>
                    <TableHead className="font-semibold !text-primary">Produto</TableHead>
                    <TableHead className="font-semibold !text-primary">Categoria</TableHead>
                    <TableHead className="font-semibold !text-primary">Efeito</TableHead>
                    <TableHead className="font-semibold !text-primary">Duração</TableHead>
                    <TableHead className="font-semibold !text-primary">Estoque</TableHead>
                    <TableHead className="font-semibold !text-primary">Preço Venda</TableHead>
                    <TableHead className="font-semibold !text-primary">Status</TableHead>
                    <TableHead className="font-semibold !text-primary">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.map((produto) => (
                    <TableRow key={produto.id} className="hover:bg-primary/5 border-b border-primary/10 transition-colors">
                      <TableCell className="font-mono text-sm text-foreground">{produto.codigo}</TableCell>
                      <TableCell className="text-sm text-foreground">
                        {produto.fabricante || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{produto.nome_produto}</TableCell>
                      <TableCell className="text-sm text-foreground">{getCategoryDisplayName(produto.categoria)}</TableCell>
                      <TableCell className="text-sm text-foreground">
                        {produto.efeito || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {produto.duracao_segundos ? `${produto.duracao_segundos}s` : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${produto.quantidade_disponivel <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {produto.quantidade_disponivel}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold text-foreground">R$ {produto.valor_venda.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={produto.ativo ? 'default' : 'secondary'}>
                          {produto.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(produto);
                              setIsDetailsOpen(true);
                            }}
                            className="hover:bg-primary/10 hover:text-primary"
                            title="Ver detalhes"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(produto)}
                            className="hover:bg-primary/10 hover:text-primary"
                            title="Editar produto"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(produto)}
                            className="hover:bg-destructive/10 hover:text-destructive"
                            title="Excluir produto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3">
              {filteredProdutos.map((produto) => (
                <Card key={produto.id} className="border border-primary/10 hover:border-primary/20 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm">{produto.nome_produto}</h3>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{produto.codigo}</p>
                      </div>
                      <Badge variant={produto.ativo ? 'default' : 'secondary'} className="ml-2">
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block">Categoria:</span>
                        <p className="font-medium">{getCategoryDisplayName(produto.categoria)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Estoque:</span>
                        <p className={`font-semibold ${produto.quantidade_disponivel <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {produto.quantidade_disponivel} unid.
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Preço:</span>
                        <p className="font-semibold text-primary">R$ {produto.valor_venda.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Duração:</span>
                        <p className="font-medium">
                          {produto.duracao_segundos ? `${produto.duracao_segundos}s` : '—'}
                        </p>
                      </div>
                    </div>

                    {(produto.fabricante || produto.efeito) && (
                      <div className="grid grid-cols-1 gap-y-2 mb-3 text-xs">
                        {produto.fabricante && (
                          <div>
                            <span className="text-muted-foreground block">Fabricante:</span>
                            <p className="font-medium">{produto.fabricante}</p>
                          </div>
                        )}
                        {produto.efeito && (
                          <div>
                            <span className="text-muted-foreground block">Efeito:</span>
                            <p className="font-medium">{produto.efeito}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end space-x-2 pt-3 border-t border-primary/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(produto);
                          setIsDetailsOpen(true);
                        }}
                        className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                        title="Ver detalhes"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(produto)}
                        className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0"
                        title="Editar produto"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(produto)}
                        className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                        title="Excluir produto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
              
            {filteredProdutos.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                </p>
                {!searchTerm && (
                  <Button onClick={handleNewProduct} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Primeiro Produto
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de Detalhes do Produto */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl bg-background border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Detalhes do Produto</DialogTitle>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Código</Label>
                    <p className="text-sm mt-1 font-mono">{selectedProduct.codigo}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge variant={selectedProduct.ativo ? 'default' : 'secondary'}>
                        {selectedProduct.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-sm font-medium">Nome do Produto</Label>
                    <p className="text-sm mt-1">{selectedProduct.nome_produto}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Categoria</Label>
                    <p className="text-sm mt-1 capitalize">{selectedProduct.categoria}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Fabricante</Label>
                    <p className="text-sm mt-1">{selectedProduct.fabricante || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Quantidade em Estoque</Label>
                    <p className={`text-lg font-bold mt-1 ${selectedProduct.quantidade_disponivel <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {selectedProduct.quantidade_disponivel} unidades
                    </p>
                    {selectedProduct.quantidade_disponivel <= 5 && (
                      <p className="text-xs text-yellow-600 mt-1">⚠️ Estoque baixo</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Tubos</Label>
                    <p className="text-sm mt-1">{selectedProduct.tubos || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Efeito</Label>
                    <p className="text-sm mt-1">{selectedProduct.efeito || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Duração</Label>
                    <p className="text-sm mt-1">
                      {selectedProduct.duracao_segundos ? `${selectedProduct.duracao_segundos} segundos` : 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Valor de Compra</Label>
                    <p className="text-lg font-bold text-blue-600 mt-1">
                      R$ {selectedProduct.valor_compra.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Valor de Venda</Label>
                    <p className="text-lg font-bold text-green-600 mt-1">
                      R$ {selectedProduct.valor_venda.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Margem de Lucro</Label>
                    <p className="text-sm mt-1 font-medium">
                      {((selectedProduct.valor_venda - selectedProduct.valor_compra) / selectedProduct.valor_compra * 100).toFixed(1)}%
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Valor Total do Estoque</Label>
                    <p className="text-lg font-bold text-purple-600 mt-1">
                      R$ {(selectedProduct.valor_compra * selectedProduct.quantidade_disponivel).toFixed(2)}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      handleEdit(selectedProduct);
                    }}
                  >
                    Editar Produto
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailsOpen(false)}
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEstoque;