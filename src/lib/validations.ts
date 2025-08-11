import { z } from 'zod';

// Schema para solicitação de orçamento - artigos pirotécnicos
export const solicitacaoArtigosSchema = z.object({
  nome_completo: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  whatsapp: z.string()
    .min(9, 'WhatsApp deve ter entre 9 a 11 dígitos')
    .max(11, 'WhatsApp deve ter entre 9 a 11 dígitos')
    .regex(/^\d{9,11}$/, 'Digite entre 9 a 11 números'),
  email: z.string().email('E-mail inválido').optional().or(z.literal("")),
  kit_selecionado: z.string().min(1, 'Selecione um kit'),
  localizacao_evento: z.string()
    .min(1, 'Informe a localização do evento')
    .max(200, 'Localização muito longa'),
  data_evento: z.string()
    .min(1, 'Informe a data do evento')
    .refine(date => {
      const eventDate = new Date(date);
      const today = new Date();
      return eventDate >= today;
    }, 'A data do evento deve ser futura'),
  observacoes: z.string()
    .max(500, 'Observações muito longas (máx. 500 caracteres)')
    .optional(),
});

// Schema para solicitação de orçamento - contratar equipe
export const solicitacaoEquipeSchema = z.object({
  nome_completo: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  whatsapp: z.string()
    .min(9, 'WhatsApp deve ter entre 9 a 11 dígitos')
    .max(11, 'WhatsApp deve ter entre 9 a 11 dígitos')
    .regex(/^\d{9,11}$/, 'Digite entre 9 a 11 números'),
  email: z.string().email('E-mail inválido').optional().or(z.literal("")),
  tipo_evento: z.string()
    .min(1, 'Informe o tipo de evento')
    .max(100, 'Tipo de evento muito longo'),
  localizacao_evento: z.string()
    .min(1, 'Informe a localização do evento')
    .max(200, 'Localização muito longa'),
  data_evento: z.string()
    .min(1, 'Informe a data do evento')
    .refine(date => {
      const eventDate = new Date(date);
      const today = new Date();
      return eventDate >= today;
    }, 'A data do evento deve ser futura'),
  observacoes: z.string()
    .max(500, 'Observações muito longas (máx. 500 caracteres)')
    .optional(),
  orcamento_estimado: z.string().optional(),
  duracao_evento: z.string()
    .regex(/^\d+$/, 'Deve conter apenas números')
    .optional(),
});

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Schema para produto
export const produtoSchema = z.object({
  codigo: z.string().min(1, 'Código é obrigatório'),
  nome_produto: z.string().min(1, 'Nome do produto é obrigatório'),
  quantidade_disponivel: z.number().min(0, 'Quantidade deve ser maior ou igual a 0'),
  tubos: z.string().optional(),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  fabricante: z.string().optional(),
  efeito: z.string().optional(),
  duracao_segundos: z.number().min(0, 'Duração deve ser maior ou igual a 0').optional(),
  valor_compra: z.number().min(0, 'Valor de compra deve ser maior que 0'),
  valor_venda: z.number().min(0, 'Valor de venda deve ser maior que 0'),
  ativo: z.boolean().default(true),
});

// Schema para orçamento
export const orcamentoSchema = z.object({
  tipo: z.enum(['show_pirotecnico', 'venda_artigos']),
  nome_contratante: z.string().min(1, 'Nome do contratante é obrigatório'),
  telefone: z.string().optional(),
  cpf: z.string().optional(),
  evento_nome: z.string().min(1, 'Nome do evento é obrigatório'),
  evento_data: z.string().min(1, 'Data do evento é obrigatória'),
  evento_local: z.string().min(1, 'Local do evento é obrigatório'),
  modo_pagamento: z.enum(['dinheiro', 'pix', 'cartao', 'transferencia']),
  valor_total: z.number().min(0, 'Valor total deve ser maior ou igual a 0'),
  margem_lucro: z.number().min(0, 'Margem de lucro deve ser maior ou igual a 0'),
  status: z.enum(['pendente', 'confirmado', 'cancelado']).default('pendente'),
});

// Schema para evento
export const eventoSchema = z.object({
  orcamento_id: z.string().uuid('ID do orçamento inválido'),
  status: z.enum(['pendente', 'confirmado', 'realizado', 'cancelado']).default('pendente'),
  observacoes: z.string().optional(),
});

// Schema para histórico de estoque
export const historicoEstoqueSchema = z.object({
  produto_id: z.string().uuid('ID do produto inválido'),
  tipo_movimentacao: z.enum(['entrada', 'saida', 'ajuste']),
  quantidade_anterior: z.number().min(0, 'Quantidade anterior deve ser maior ou igual a 0'),
  quantidade_movimentada: z.number().min(0, 'Quantidade movimentada deve ser maior ou igual a 0'),
  quantidade_atual: z.number().min(0, 'Quantidade atual deve ser maior ou igual a 0'),
  motivo: z.string().optional(),
});

// Schema para usuário
export const usuarioSchema = z.object({
  email: z.string().email('E-mail inválido'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'moderador']),
  ativo: z.boolean().default(true),
});

// Tipos TypeScript derivados dos schemas
export type SolicitacaoArtigosFormData = z.infer<typeof solicitacaoArtigosSchema>;
export type SolicitacaoEquipeFormData = z.infer<typeof solicitacaoEquipeSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProdutoFormData = z.infer<typeof produtoSchema>;
export type OrcamentoFormData = z.infer<typeof orcamentoSchema>;
export type EventoFormData = z.infer<typeof eventoSchema>;
export type HistoricoEstoqueFormData = z.infer<typeof historicoEstoqueSchema>;
export type UsuarioFormData = z.infer<typeof usuarioSchema>;