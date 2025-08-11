import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface OrcamentoPDF {
  id: number;
  nome_contratante: string;
  telefone?: string;
  cpf?: string;
  evento_nome: string;
  evento_data: string;
  evento_local?: string;
  observacoes?: string;
  valor_total: number;
  status: string;
  created_at: string;
  orcamentos_produtos?: Array<{
    quantidade: number;
    valor_unitario: number;
    produtos?: {
      nome_produto: string;
      categoria: string;
      duracao_segundos?: number;
    };
  }>;
}

export const usePDFGenerator = () => {
  const { toast } = useToast();

  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }, []);

  const formatDate = useCallback((date: string): string => {
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  }, []);

  const generatePDF = useCallback(async (orcamento: OrcamentoPDF) => {
    try {
      toast({
        title: "Gerando PDF...",
        description: "Por favor, aguarde enquanto o PDF é gerado.",
      });

      // Criar documento PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Configurar fonte
      pdf.setFont('helvetica');
      
      // === CABEÇALHO ===
      let currentY = 20;
      
      // Logo da empresa (placeholder - será substituído futuramente)
      pdf.setFontSize(20);
      pdf.setTextColor(249, 115, 22); // Orange primary
      pdf.text('M5 MAX PRODUÇÕES', pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 8;
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Shows Pirotécnicos Profissionais', pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 5;
      pdf.text('40+ Anos de Experiência', pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 15;
      
      // Linha separadora
      pdf.setDrawColor(249, 115, 22);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 10;
      
      // === TÍTULO DO ORÇAMENTO ===
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`ORÇAMENTO #${orcamento.id.toString().padStart(4, '0')}`, 20, currentY);
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Gerado em: ${formatDate(new Date().toISOString())}`, pageWidth - 20, currentY, { align: 'right' });
      
      currentY += 15;
      
      // === DADOS DO CLIENTE ===
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('DADOS DO CLIENTE', 20, currentY);
      currentY += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Nome: ${orcamento.nome_contratante}`, 25, currentY);
      currentY += 5;
      
      if (orcamento.telefone) {
        pdf.text(`Telefone: ${orcamento.telefone}`, 25, currentY);
        currentY += 5;
      }
      
      if (orcamento.cpf) {
        pdf.text(`CPF: ${orcamento.cpf}`, 25, currentY);
        currentY += 5;
      }
      
      currentY += 5;
      
      // === DADOS DO EVENTO ===
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('DADOS DO EVENTO', 20, currentY);
      currentY += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Evento: ${orcamento.evento_nome}`, 25, currentY);
      currentY += 5;
      
      pdf.text(`Data: ${formatDate(orcamento.evento_data)}`, 25, currentY);
      currentY += 5;
      
      if (orcamento.evento_local) {
        pdf.text(`Local: ${orcamento.evento_local}`, 25, currentY);
        currentY += 5;
      }
      
      currentY += 10;
      
      // === PRODUTOS ===
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('PRODUTOS INCLUÍDOS', 20, currentY);
      currentY += 8;
      
      // Cabeçalho da tabela
      pdf.setFillColor(249, 115, 22);
      pdf.rect(20, currentY, pageWidth - 40, 7, 'F');
      
      pdf.setFontSize(9);
      pdf.setTextColor(255, 255, 255);
      pdf.text('PRODUTO', 25, currentY + 5);
      pdf.text('QTD', pageWidth - 100, currentY + 5);
      pdf.text('VALOR UNIT.', pageWidth - 70, currentY + 5);
      pdf.text('SUBTOTAL', pageWidth - 30, currentY + 5);
      
      currentY += 10;
      
      // Produtos
      let totalGeral = 0;
      const produtos = orcamento.orcamentos_produtos || [];
      
      pdf.setTextColor(0, 0, 0);
      
      produtos.forEach((item) => {
        if (currentY > pageHeight - 40) {
          pdf.addPage();
          currentY = 20;
        }
        
        const produto = item.produtos;
        const subtotal = item.quantidade * item.valor_unitario;
        totalGeral += subtotal;
        
        pdf.setFontSize(9);
        pdf.text(produto?.nome_produto || 'Produto não especificado', 25, currentY);
        pdf.text(item.quantidade.toString(), pageWidth - 100, currentY, { align: 'right' });
        pdf.text(formatCurrency(item.valor_unitario), pageWidth - 70, currentY, { align: 'right' });
        pdf.text(formatCurrency(subtotal), pageWidth - 30, currentY, { align: 'right' });
        
        currentY += 6;
      });
      
      // Linha separadora
      currentY += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, currentY, pageWidth - 20, currentY);
      currentY += 8;
      
      // Total
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text('VALOR TOTAL:', pageWidth - 80, currentY);
      pdf.setTextColor(249, 115, 22);
      pdf.text(formatCurrency(orcamento.valor_total), pageWidth - 30, currentY, { align: 'right' });
      
      currentY += 15;
      
      // === OBSERVAÇÕES ===
      if (orcamento.observacoes) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('OBSERVAÇÕES', 20, currentY);
        currentY += 8;
        
        pdf.setFontSize(10);
        const observacoesLines = pdf.splitTextToSize(orcamento.observacoes, pageWidth - 50);
        pdf.text(observacoesLines, 25, currentY);
        currentY += observacoesLines.length * 5;
      }
      
      // === RODAPÉ ===
      // Posicionar no final da página
      const rodapeY = pageHeight - 30;
      
      // Linha separadora
      pdf.setDrawColor(249, 115, 22);
      pdf.line(20, rodapeY - 10, pageWidth - 20, rodapeY - 10);
      
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text('M5 MAX Produções - Shows Pirotécnicos', pageWidth / 2, rodapeY, { align: 'center' });
      pdf.text('WhatsApp: (61) 99999-9999 | Email: contato@m5maxproducoes.com.br', pageWidth / 2, rodapeY + 5, { align: 'center' });
      pdf.text('Luziânia - GO | 40+ Anos de Experiência', pageWidth / 2, rodapeY + 10, { align: 'center' });
      
      // Salvar PDF
      const fileName = `Orcamento_${orcamento.id}_${orcamento.nome_contratante.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
      
      toast({
        title: "PDF gerado com sucesso!",
        description: `O arquivo ${fileName} foi baixado.`,
      });
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o arquivo PDF. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [formatCurrency, formatDate, toast]);

  return {
    generatePDF,
  };
};