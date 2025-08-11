import { useMemo } from 'react';
import { useDebouncedSearch } from './use-debounced-search';
import type { Database } from "@/types/database";

type Produto = Database['public']['Tables']['produtos']['Row'];

interface ProductFilters {
  searchTerm: string;
  categoryFilter: string;
  effectFilter: string;
  priceSort: string;
  durationSort: string;
  activeOnly?: boolean;
}

export function useProductFilters(produtos: Produto[], filters: ProductFilters) {
  // Filtros base sem busca de texto
  const baseFilteredProducts = useMemo(() => {
    return produtos.filter(produto => {
      if (filters.activeOnly && !produto.ativo) return false;
      
      const categoryMatch = filters.categoryFilter === "all" || 
        produto.categoria.toLowerCase() === filters.categoryFilter;
      
      const effectMatch = filters.effectFilter === "all" || 
        (produto.efeito && produto.efeito.toLowerCase() === filters.effectFilter.toLowerCase());
      
      return categoryMatch && effectMatch;
    });
  }, [produtos, filters.categoryFilter, filters.effectFilter, filters.activeOnly]);

  // Busca otimizada com debounce
  const { filteredItems: searchFilteredProducts } = useDebouncedSearch(
    baseFilteredProducts,
    filters.searchTerm,
    ['nome_produto', 'codigo', 'fabricante']
  );

  // Ordenação otimizada
  const sortedFilteredProducts = useMemo(() => {
    const result = [...searchFilteredProducts];

    // Ordenação por preço
    if (filters.priceSort === "asc") {
      result.sort((a, b) => a.valor_venda - b.valor_venda);
    } else if (filters.priceSort === "desc") {
      result.sort((a, b) => b.valor_venda - a.valor_venda);
    }

    // Ordenação por duração
    if (filters.durationSort === "asc") {
      result.sort((a, b) => (a.duracao_segundos || 0) - (b.duracao_segundos || 0));
    } else if (filters.durationSort === "desc") {
      result.sort((a, b) => (b.duracao_segundos || 0) - (a.duracao_segundos || 0));
    }

    return result;
  }, [searchFilteredProducts, filters.priceSort, filters.durationSort]);

  return {
    filteredProducts: sortedFilteredProducts,
    totalCount: produtos.length,
    filteredCount: sortedFilteredProducts.length
  };
}