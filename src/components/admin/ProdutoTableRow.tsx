import { memo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { Database } from "@/types/database";

type Produto = Database['public']['Tables']['produtos']['Row'];

interface ProdutoTableRowProps {
  produto: Produto;
  getCategoryDisplayName: (categoria: string) => string;
  onViewDetails: (produto: Produto) => void;
  onEditProduct: (produto: Produto) => void;
  onDeleteProduct: (produto: Produto) => void;
}

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

export const ProdutoTableRow = memo<ProdutoTableRowProps>(({ 
  produto, 
  onViewDetails, 
  onEditProduct, 
  onDeleteProduct 
}) => {
  return (
    <TableRow className="hover:bg-primary/5 border-b border-primary/10 transition-colors">
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
      <TableCell className="text-sm text-foreground">
        {produto.quantidade_disponivel}
        {produto.quantidade_disponivel <= 5 && (
          <Badge variant="destructive" className="ml-1 text-xs">Baixo</Badge>
        )}
      </TableCell>
      <TableCell className="text-sm text-foreground">
        R$ {produto.valor_venda.toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant={produto.ativo ? 'default' : 'secondary'}>
          {produto.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(produto)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditProduct(produto)}
            className="h-7 w-7 p-0 hover:bg-primary/10"
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteProduct(produto)}
            className="h-7 w-7 p-0 hover:bg-destructive/10 text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});