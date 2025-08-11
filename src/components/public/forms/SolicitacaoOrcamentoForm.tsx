import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

// Schema de validação
const solicitacaoSchema = z.object({
  tipo_solicitacao: z.enum(['casamento', 'aniversario', 'corporativo', 'outro'], {
    required_error: 'Selecione o tipo de evento',
  }),
  nome_completo: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo'),
  whatsapp: z.string()
    .regex(/^\d{9,11}$/, 'Telefone deve ter entre 9 a 11 dígitos')
    .transform(val => val.replace(/\D/g, '')),
  email: z.string()
    .email('Email inválido'),
  data_evento: z.string()
    .refine(val => !!val, 'Data do evento é obrigatória'),
  local_evento: z.string()
    .min(3, 'Local deve ter pelo menos 3 caracteres')
    .max(200, 'Local muito longo'),
  descricao: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(1000, 'Descrição muito longa'),
  como_conheceu: z.string().optional(),
})

type SolicitacaoFormValues = z.infer<typeof solicitacaoSchema>

export function SolicitacaoOrcamentoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  // Inicializar formulário com react-hook-form e zod
  const form = useForm<SolicitacaoFormValues>({
    resolver: zodResolver(solicitacaoSchema),
    defaultValues: {
      tipo_solicitacao: undefined,
      nome_completo: '',
      whatsapp: '',
      email: '',
      data_evento: '',
      local_evento: '',
      descricao: '',
      como_conheceu: '',
    },
  })

  // Função para enviar o formulário
  const onSubmit = async (data: SolicitacaoFormValues) => {
    setIsSubmitting(true)
    
    try {
      // Adaptar dados para a estrutura da tabela solicitacoes_orcamento
      const solicitacaoData = {
        tipo_solicitacao: 'contratar_equipe' as const,
        nome_completo: data.nome_completo.trim(),
        whatsapp: `55${data.whatsapp}`, // Adicionar código do Brasil
        email: data.email?.trim() || null,
        kit_selecionado: null,
        tipo_evento: data.tipo_solicitacao,
        localizacao_evento: data.local_evento.trim(),
        data_evento: data.data_evento,
        observacoes: `${data.descricao}${data.como_conheceu ? ` | Como conheceu: ${data.como_conheceu}` : ''}`,
        enviado_email: false
      }
      
      
      // Inserir no Supabase
      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .insert(solicitacaoData)
      
      if (error) throw error
      
      // Sucesso
      setIsSuccess(true)
      toast({
        title: '🎉 Solicitação Enviada com Sucesso!',
        description: '✅ Dados recebidos! Nossa equipe entrará em contato em até 24h via WhatsApp.',
        duration: 6000,
        className: "border-green-200 bg-green-50 text-green-800",
      })
      
      // Resetar formulário
      form.reset()
    } catch (error) {
      console.error('❌ Erro ao enviar solicitação:', error)
      toast({
        title: '❌ Erro ao Enviar Solicitação',
        description: 'Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente, ou entre em contato via WhatsApp.',
        variant: 'destructive',
        duration: 8000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para formatar o telefone enquanto digita
  const formatPhoneNumber = (value: string) => {
    // Remover caracteres não numéricos
    const numericValue = value.replace(/\D/g, '')
    
    // Formatar como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (numericValue.length <= 10) {
      return numericValue
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/^(\d{2})\)(\d{4})(\d)/, '($1) $2-$3')
    } else {
      return numericValue
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/^(\d{2})\)(\d{5})(\d)/, '($1) $2-$3')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Solicite um Orçamento</CardTitle>
        <CardDescription>
          Preencha o formulário abaixo para solicitar um orçamento personalizado para seu evento.
        </CardDescription>
      </CardHeader>
      
      {isSuccess ? (
        <CardContent className="space-y-6 text-center">
          {/* Ícone de sucesso */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <Send className="h-10 w-10 text-white" />
          </div>
          
          {/* Mensagem principal */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-green-600">🎉 Solicitação Enviada com Sucesso!</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 text-sm leading-relaxed font-medium">
                ✅ Recebemos sua solicitação de orçamento.<br />
                📱 Nossa equipe especializada entrará em contato 
                <strong className="text-green-800"> em até 24 horas via WhatsApp</strong> para apresentar uma proposta personalizada.
              </p>
            </div>
          </div>

          {/* Próximos passos */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
            <h4 className="font-bold text-primary mb-3">📋 Próximos passos:</h4>
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">1</div>
                <span className="text-sm text-foreground font-medium">Análise da sua solicitação (até 24h)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">2</div>
                <span className="text-sm text-foreground font-medium">Contato via WhatsApp para detalhes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">3</div>
                <span className="text-sm text-foreground font-medium">Envio do orçamento personalizado</span>
              </div>
            </div>
          </div>
          
          {/* Botões */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Button
              onClick={() => {
                const whatsappNumber = '5561982735575';
                const message = encodeURIComponent("Olá! Acabei de enviar uma solicitação de orçamento pelo site. Gostaria de dar continuidade ao atendimento.");
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
              }}
              variant="outline"
              className="w-full h-11 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 font-semibold transition-all duration-300 hover:scale-105"
            >
              📱 Continuar no WhatsApp
            </Button>
            
            <Button
              onClick={() => setIsSuccess(false)}
              className="w-full h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 font-semibold transition-all duration-300 hover:scale-105"
            >
              📝 Nova Solicitação
            </Button>
          </div>
        </CardContent>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="tipo_solicitacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de evento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="casamento">Casamento</SelectItem>
                        <SelectItem value="aniversario">Aniversário</SelectItem>
                        <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome_completo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu nome completo"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(XX) XXXXX-XXXX"
                          {...field}
                          value={formatPhoneNumber(field.value)}
                          onChange={(e) => {
                            // Passar apenas os números para o campo
                            const numericValue = e.target.value.replace(/\D/g, '')
                            field.onChange(numericValue)
                          }}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Usaremos este número para contato via WhatsApp
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data_evento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data do Evento</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="local_evento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local do Evento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Endereço ou nome do local"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Evento</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que você precisa para seu evento..."
                        className="min-h-[120px]"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Inclua detalhes como número de convidados, duração, necessidades específicas, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="como_conheceu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Como nos conheceu?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma opção" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="google">Pesquisa no Google</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="indicacao">Indicação de amigo</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enviando solicitação...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    🚀 Enviar Solicitação
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      )}
    </Card>
  )
}