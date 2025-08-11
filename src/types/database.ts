export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      eventos: {
        Row: {
          confirmado_em: string | null
          created_at: string | null
          id: string
          observacoes: string | null
          orcamento_id: string | null
          pdf_url: string | null
          realizado_em: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          confirmado_em?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          pdf_url?: string | null
          realizado_em?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          confirmado_em?: string | null
          created_at?: string | null
          id?: string
          observacoes?: string | null
          orcamento_id?: string | null
          pdf_url?: string | null
          realizado_em?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_estoque: {
        Row: {
          created_at: string | null
          id: string
          motivo: string | null
          produto_id: string | null
          quantidade_anterior: number
          quantidade_atual: number
          quantidade_movimentada: number
          tipo_movimentacao: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade_anterior: number
          quantidade_atual: number
          quantidade_movimentada: number
          tipo_movimentacao: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          motivo?: string | null
          produto_id?: string | null
          quantidade_anterior?: number
          quantidade_atual?: number
          quantidade_movimentada?: number
          tipo_movimentacao?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "historico_estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_estoque_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos: {
        Row: {
          cpf: string | null
          created_at: string | null
          created_by: string | null
          evento_data: string
          evento_local: string
          evento_nome: string
          id: string
          margem_lucro: number | null
          modo_pagamento: string
          nome_contratante: string
          pdf_url: string | null
          status: string | null
          telefone: string | null
          tipo: string
          updated_at: string | null
          valor_total: number | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          evento_data: string
          evento_local: string
          evento_nome: string
          id?: string
          margem_lucro?: number | null
          modo_pagamento: string
          nome_contratante: string
          pdf_url?: string | null
          status?: string | null
          telefone?: string | null
          tipo: string
          updated_at?: string | null
          valor_total?: number | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          created_by?: string | null
          evento_data?: string
          evento_local?: string
          evento_nome?: string
          id?: string
          margem_lucro?: number | null
          modo_pagamento?: string
          nome_contratante?: string
          pdf_url?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      orcamentos_produtos: {
        Row: {
          created_at: string | null
          id: string
          orcamento_id: string | null
          produto_id: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          orcamento_id?: string | null
          produto_id?: string | null
          quantidade: number
          valor_total: number
          valor_unitario: number
        }
        Update: {
          created_at?: string | null
          id?: string
          orcamento_id?: string | null
          produto_id?: string | null
          quantidade?: number
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "orcamentos_produtos_orcamento_id_fkey"
            columns: ["orcamento_id"]
            isOneToOne: false
            referencedRelation: "orcamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orcamentos_produtos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          categoria: string
          codigo: string
          created_at: string | null
          duracao_segundos: number | null
          efeito: string | null
          fabricante: string | null
          id: string
          nome_produto: string
          quantidade_disponivel: number | null
          tubos: string | null
          updated_at: string | null
          valor_compra: number
          valor_venda: number
        }
        Insert: {
          ativo?: boolean | null
          categoria: string
          codigo: string
          created_at?: string | null
          duracao_segundos?: number | null
          efeito?: string | null
          fabricante?: string | null
          id?: string
          nome_produto: string
          quantidade_disponivel?: number | null
          tubos?: string | null
          updated_at?: string | null
          valor_compra: number
          valor_venda: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string
          codigo?: string
          created_at?: string | null
          duracao_segundos?: number | null
          efeito?: string | null
          fabricante?: string | null
          id?: string
          nome_produto?: string
          quantidade_disponivel?: number | null
          tubos?: string | null
          updated_at?: string | null
          valor_compra?: number
          valor_venda?: number
        }
        Relationships: []
      }
      solicitacoes_orcamento: {
        Row: {
          created_at: string | null
          data_evento: string | null
          email: string | null
          enviado_email: boolean | null
          id: string
          kit_selecionado: string | null
          localizacao_evento: string | null
          nome_completo: string
          observacoes: string | null
          tipo_evento: string | null
          tipo_solicitacao: string
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          data_evento?: string | null
          email?: string | null
          enviado_email?: boolean | null
          id?: string
          kit_selecionado?: string | null
          localizacao_evento?: string | null
          nome_completo: string
          observacoes?: string | null
          tipo_evento?: string | null
          tipo_solicitacao: string
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          data_evento?: string | null
          email?: string | null
          enviado_email?: boolean | null
          id?: string
          kit_selecionado?: string | null
          localizacao_evento?: string | null
          nome_completo?: string
          observacoes?: string | null
          tipo_evento?: string | null
          tipo_solicitacao?: string
          whatsapp?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          role: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          role: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}