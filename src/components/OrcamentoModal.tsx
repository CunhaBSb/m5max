import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Globe, ArrowLeft, Check, Phone, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { solicitacaoArtigosSchema, solicitacaoEquipeSchema, type SolicitacaoArtigosFormData, type SolicitacaoEquipeFormData } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { useWhatsAppFormatter } from "@/hooks/useWhatsAppFormatter";
import { kits } from "@/data/homepage-data";
import { southAmericanCountries, defaultCountry } from "@/data/countries";

interface OrcamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStep = 'choice' | 'artigos' | 'equipe' | 'success';

export const OrcamentoModal = ({ isOpen, onClose }: OrcamentoModalProps) => {
  const [step, setStep] = useState<FormStep>('choice');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const { toast } = useToast();
  const { formatWhatsApp } = useWhatsAppFormatter();

  // Form hooks
  const artigosForm = useForm<SolicitacaoArtigosFormData>({
    resolver: zodResolver(solicitacaoArtigosSchema),
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      email: '',
      kit_selecionado: '',
      localizacao_evento: '',
      data_evento: '',
      observacoes: ''
    }
  });

  const equipeForm = useForm<SolicitacaoEquipeFormData>({
    resolver: zodResolver(solicitacaoEquipeSchema),
    defaultValues: {
      nome_completo: '',
      whatsapp: '',
      email: '',
      tipo_evento: '',
      localizacao_evento: '',
      data_evento: '',
      observacoes: '',
      orcamento_estimado: '',
      duracao_evento: ''
    }
  });

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      "Olá! Gostaria de solicitar um orçamento para meu evento. Prefiro negociar diretamente via WhatsApp."
    );
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5561982735575';
    
    toast({
      title: "📱 Redirecionando para WhatsApp",
      description: "Abrindo conversa direta com nossa equipe especializada!",
      duration: 3000,
      className: "border-green-200 bg-green-50 text-green-800",
    });
    
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    onClose();
  };

  const handleArtigosSubmit = async (data: SolicitacaoArtigosFormData) => {
    setIsLoading(true);
    
    try {
      // Formatação dos dados extras
      const observacoesCompletas = data.observacoes || null;

      // Validação de campos obrigatórios
      if (!data.nome_completo?.trim()) {
        throw new Error('Nome completo é obrigatório');
      }
      if (!data.whatsapp?.replace(/\D/g, '')) {
        throw new Error('WhatsApp é obrigatório');
      }
      if (!data.localizacao_evento?.trim()) {
        throw new Error('Localização do evento é obrigatória');
      }

      const insertData = {
        tipo_solicitacao: 'artigos_pirotecnicos' as const,
        nome_completo: data.nome_completo.trim(),
        whatsapp: `${selectedCountry.code}${data.whatsapp.replace(/\D/g, '')}`,
        email: data.email?.trim() || null,
        kit_selecionado: data.kit_selecionado,
        tipo_evento: null,
        localizacao_evento: data.localizacao_evento.trim(),
        data_evento: data.data_evento,
        observacoes: observacoesCompletas || null,
        enviado_email: false
      };


      const { error } = await supabase
        .from('solicitacoes_orcamento')
        .insert(insertData);

      if (error) {
        console.error('❌ Erro Supabase:', error);
        throw error;
      }


      // Analytics/tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'solicitation_sent', {
          event_category: 'engagement',
          event_label: 'artigos_pirotecnicos',
          value: 1
        });
      }

      // Toast de confirmação imediata
      toast({
        title: "🎉 Solicitação de Kit Enviada!",
        description: "✅ Dados recebidos com sucesso! Nossa equipe retornará em até 24h via WhatsApp com mais informações sobre o kit selecionado.",
        duration: 6000,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      
      // Mostrar tela de sucesso imediatamente
      setStep('success');
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast({
        title: "❌ Erro ao Enviar Solicitação de Kit",
        description: "Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente, ou entre em contato diretamente via WhatsApp.",
        variant: "destructive",
        duration: 8000,
      });
    }
    
    setIsLoading(false);
  };

  const handleEquipeSubmit = async (data: SolicitacaoEquipeFormData) => {
    setIsLoading(true);
    
    try {
      // Formatação dos dados extras
      const observacoesCompletas = [
        data.observacoes,
        data.orcamento_estimado ? `Orçamento mínimo: R$ ${data.orcamento_estimado}` : '',
        data.duracao_evento ? `Duração do evento: ${data.duracao_evento} horas` : ''
      ].filter(Boolean).join(' | ');

      // Validação de campos obrigatórios
      if (!data.nome_completo?.trim()) {
        throw new Error('Nome completo é obrigatório');
      }
      if (!data.whatsapp?.replace(/\D/g, '')) {
        throw new Error('WhatsApp é obrigatório');
      }
      if (!data.localizacao_evento?.trim()) {
        throw new Error('Localização do evento é obrigatória');
      }

      const insertData = {
        tipo_solicitacao: 'contratar_equipe' as const,
        nome_completo: data.nome_completo.trim(),
        whatsapp: `${selectedCountry.code}${data.whatsapp.replace(/\D/g, '')}`,
        email: data.email?.trim() || null,
        kit_selecionado: null,
        tipo_evento: data.tipo_evento.trim(),
        localizacao_evento: data.localizacao_evento.trim(),
        data_evento: data.data_evento,
        observacoes: observacoesCompletas || null,
        enviado_email: false
      };


      const { data: solicitacaoResult, error } = await supabase
        .from('solicitacoes_orcamento')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro Supabase equipe:', error);
        throw error;
      }


      // Criar orçamento automático com status pendente
      if (solicitacaoResult) {
        const orcamentoData = {
          tipo: 'show_pirotecnico' as const,
          nome_contratante: data.nome_completo.trim(),
          telefone: `${selectedCountry.code}${data.whatsapp.replace(/\D/g, '')}`,
          cpf: '',
          evento_nome: `${data.tipo_evento} - ${data.nome_completo}`,
          evento_data: data.data_evento,
          evento_local: data.localizacao_evento.trim(),
          modo_pagamento: 'dinheiro' as const,
          valor_total: 0,
          margem_lucro: 0,
          status: 'pendente' as const,
          solicitacao_id: solicitacaoResult.id
        };


        const { error: orcamentoError } = await supabase
          .from('orcamentos')
          .insert(orcamentoData);

        if (orcamentoError) {
          console.error('⚠️ Erro ao criar orçamento automático:', orcamentoError);
        }
      }

      // Analytics/tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'solicitation_sent', {
          event_category: 'engagement',
          event_label: 'contratar_equipe',
          value: 1
        });
      }

      // Toast de confirmação imediata
      toast({
        title: "🎆 Solicitação de Show Enviada!",
        description: "✅ Dados recebidos com sucesso! Nossa equipe retornará em até 24h via WhatsApp para agendar uma visita técnica e apresentar a proposta.",
        duration: 6000,
        className: "border-green-200 bg-green-50 text-green-800",
      });
      
      // Mostrar tela de sucesso imediatamente
      setStep('success');
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast({
        title: "❌ Erro ao Enviar Solicitação de Show",
        description: "Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente, ou entre em contato diretamente via WhatsApp.",
        variant: "destructive",
        duration: 8000,
      });
    }
    
    setIsLoading(false);
  };

  const resetModal = () => {
    setStep('choice');
    setSelectedCountry(defaultCountry);
    artigosForm.reset();
    equipeForm.reset();
  };

  const CountrySelector = () => (
    <Select 
      value={selectedCountry.countryCode} 
      onValueChange={(value) => {
        const country = southAmericanCountries.find(c => c.countryCode === value);
        if (country) setSelectedCountry(country);
      }}
    >
      <SelectTrigger className="w-20 border-r-0 rounded-r-none bg-muted/50 hover:bg-muted/70 transition-colors">
        <div className="flex items-center gap-1">
          <span className="text-base">{selectedCountry.flag}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-background border-border">
        {southAmericanCountries.map((country) => (
          <SelectItem 
            key={country.countryCode} 
            value={country.countryCode}
            className="text-foreground hover:bg-muted"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{country.flag}</span>
              <span className="text-xs text-muted-foreground">{country.code}</span>
              <span className="text-sm">{country.country}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const renderChoice = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold mb-2">Qual serviço você precisa?</h3>
        <p className="text-muted-foreground text-sm">Escolha a opção que melhor atende sua necessidade</p>
      </div>
      
      <div className="space-y-3">
        {/* Opção Contratar M5 - Destacada */}
        <div 
          onClick={() => setStep('equipe')}
          className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary via-primary to-primary/80 p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] group border border-primary/20"
        >
          {/* Brilho animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 group-hover:animate-shine"></div>
          
          <div className="relative z-10 flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl">🎆</div>
              </div>
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg font-bold">Quero contratar a M5</h4>
                <div className="inline-flex items-center bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  TOP
                </div>
              </div>
              <p className="text-sm opacity-95 mb-2">Equipe profissional completa para shows majestosos</p>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Recomendado para eventos majestosos</span>
              </div>
            </div>
          </div>
          
          {/* Exemplos de eventos */}
          <div className="relative z-10 mt-3 pt-3 border-t border-white/20">
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">Réveillon</span>
              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">Festa Junina</span>
              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">Shows</span>
              <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/20">Casamentos</span>
            </div>
          </div>
        </div>

        {/* Opção Kits */}
        <div 
          onClick={() => setStep('artigos')}
          className="relative overflow-hidden rounded-lg border border-border bg-card hover:bg-card/80 p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.01] group"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl">📦</div>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-base font-bold mb-1 text-foreground">Quero adquirir um Kit</h4>
              <p className="text-sm text-muted-foreground mb-2">Kits para uso próprio com detonador e manual</p>
              <div className="inline-flex items-center gap-1.5 bg-muted rounded-full px-2.5 py-0.5">
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
                <span className="text-xs font-medium text-muted-foreground">Para eventos pequeno porte</span>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="pt-3 border-t border-border">
          <Button
            onClick={handleWhatsAppRedirect}
            variant="outline"
            className="w-full p-3 h-auto rounded-lg border-2 border-green-200 bg-green-50/50 hover:bg-green-50 hover:border-green-300 transition-all duration-300 group hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700 text-sm">Prefere falar diretamente?</div>
                <div className="text-xs text-green-600 font-medium">Atendimento personalizado via WhatsApp</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderArtigos = () => {
    const selectedKit = artigosForm.watch('kit_selecionado');
    const kitData = kits.find(kit => kit.name === selectedKit);

    return (
      <form 
        onSubmit={artigosForm.handleSubmit(
          handleArtigosSubmit,
          (errors) => {
            toast({
              title: "❌ Erro de Validação",
              description: "Verifique os campos obrigatórios.",
              variant: "destructive",
            });
          }
        )} 
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStep('choice')}
            className="p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => setStep('equipe')}
            className="text-primary p-0 h-auto"
          >
            Prefiro contratar a M5 para show
          </Button>
        </div>

        {/* Header com Kit Selecionado */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-4">
          <div className="flex items-center gap-3">
            {/* Ícone central */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl">
                📦
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-primary mb-1">Adquirir Artigos Pirotécnicos</h3>
              <p className="text-muted-foreground text-sm">
                {kitData ? `${kitData.name} selecionado` : 'Preencha os dados para seu orçamento'}
              </p>
              {kitData && (
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{kitData.price}</span>
                  <span>•</span>
                  <span>{kitData.duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="kit_selecionado" className="text-foreground text-sm">Kit Desejado *</Label>
          <Controller
            name="kit_selecionado"
            control={artigosForm.control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Selecione um kit" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {kits.map((kit) => (
                    <SelectItem 
                      key={kit.id} 
                      value={kit.name} 
                      className="text-foreground hover:bg-muted"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{kit.name}</span>
                        <span className="text-primary font-medium ml-2">{kit.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {artigosForm.formState.errors.kit_selecionado && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.kit_selecionado.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="nome_completo" className="text-foreground text-sm">Nome Completo *</Label>
          <Input
            id="nome_completo"
            {...artigosForm.register('nome_completo')}
            placeholder="Seu nome completo"
            className="bg-background border-border text-foreground h-9"
          />
          {artigosForm.formState.errors.nome_completo && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.nome_completo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="whatsapp" className="text-foreground text-sm">WhatsApp para Contato *</Label>
          <div className="flex">
            <CountrySelector />
            <div className="relative flex-1">
              <Controller
                name="whatsapp"
                control={artigosForm.control}
                render={({ field }) => (
                  <Input
                    id="whatsapp"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    placeholder="11987654321"
                    className="bg-background border-border text-foreground rounded-l-none border-l-0 pr-8 h-9"
                    maxLength={15}
                  />
                )}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <MessageCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Digite apenas os números. Ex: 11987654321
          </p>
          {artigosForm.formState.errors.whatsapp && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.whatsapp.message}</p>
          )}
        </div>


        <div>
          <Label htmlFor="localizacao_evento" className="text-foreground text-sm">Localização do Evento *</Label>
          <Input
            id="localizacao_evento"
            {...artigosForm.register('localizacao_evento')}
            placeholder="Cidade e estado do evento"
            className="bg-background border-border text-foreground h-9"
          />
          {artigosForm.formState.errors.localizacao_evento && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.localizacao_evento.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="data_evento" className="text-foreground text-sm">Data do Evento *</Label>
          <Input
            id="data_evento"
            type="date"
            {...artigosForm.register('data_evento')}
            className="bg-background border-border text-foreground h-9"
          />
          {artigosForm.formState.errors.data_evento && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.data_evento.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-foreground text-sm">E-mail (opcional)</Label>
          <Input
            id="email"
            type="email"
            {...artigosForm.register('email')}
            placeholder="seu@email.com"
            className="bg-background border-border text-foreground h-9"
          />
          {artigosForm.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">{artigosForm.formState.errors.email.message}</p>
          )}
        </div>


        <div>
          <Label htmlFor="observacoes" className="text-foreground text-sm">Observações (opcional)</Label>
          <Textarea
            id="observacoes"
            {...artigosForm.register('observacoes')}
            placeholder="Detalhes adicionais sobre seu evento, preferências específicas, etc."
            rows={2}
            className="bg-background border-border text-foreground text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Máximo 500 caracteres</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 flex-shrink-0"></div>
            <div className="text-xs text-muted-foreground">
              <strong className="text-primary">Próximos passos:</strong> Após enviar, nossa equipe analisará sua solicitação e entrará em contato via WhatsApp em até 24h com um orçamento personalizado.
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando solicitação...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              📦 Solicitar Kit
            </div>
          )}
        </Button>
      </div>
    </form>
    );
  };

  const renderEquipe = () => (
    <form onSubmit={equipeForm.handleSubmit(handleEquipeSubmit)} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep('choice')}
          className="p-0 h-auto text-xs"
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Voltar
        </Button>
        <Button
          type="button"
          variant="link" 
          size="sm"
          onClick={() => setStep('artigos')}
          className="text-primary p-0 h-auto text-xs"
        >
          Prefiro adquirir artigos
        </Button>
      </div>

      <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20 p-3">
        <h3 className="text-base font-bold mb-1 text-primary">🎆 Contratar M5 para Show Pirotécnico</h3>
        <p className="text-muted-foreground text-xs">Preencha os dados para seu orçamento profissional</p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="nome_completo" className="text-foreground text-sm">Nome Completo *</Label>
          <Input
            id="nome_completo"
            {...equipeForm.register('nome_completo')}
            placeholder="Seu nome completo"
            className="bg-background border-border text-foreground h-9"
          />
          {equipeForm.formState.errors.nome_completo && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.nome_completo.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="whatsapp" className="text-foreground text-sm">WhatsApp para Contato *</Label>
          <div className="flex">
            <CountrySelector />
            <div className="relative flex-1">
              <Controller
                name="whatsapp"
                control={equipeForm.control}
                render={({ field }) => (
                  <Input
                    id="whatsapp"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                    placeholder="11987654321"
                    className="bg-background border-border text-foreground rounded-l-none border-l-0 pr-8 h-9"
                    maxLength={15}
                  />
                )}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <MessageCircle className="h-3 w-3 text-green-500" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Digite apenas os números. Ex: 11987654321
          </p>
          {equipeForm.formState.errors.whatsapp && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.whatsapp.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="tipo_evento" className="text-foreground text-sm">Tipo de Evento *</Label>
          <Input
            id="tipo_evento"
            {...equipeForm.register('tipo_evento')}
            placeholder="Ex: Casamento, Festa Junina, Evento Corporativo"
            className="bg-background border-border text-foreground h-9"
          />
          {equipeForm.formState.errors.tipo_evento && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.tipo_evento.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="localizacao_evento" className="text-foreground text-sm">Localização do Evento *</Label>
          <Input
            id="localizacao_evento"
            {...equipeForm.register('localizacao_evento')}
            placeholder="Cidade e estado do evento"
            className="bg-background border-border text-foreground h-9"
          />
          {equipeForm.formState.errors.localizacao_evento && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.localizacao_evento.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="data_evento" className="text-foreground text-sm">Data do Evento *</Label>
          <Input
            id="data_evento"
            type="date"
            {...equipeForm.register('data_evento')}
            className="bg-background border-border text-foreground h-9"
          />
          {equipeForm.formState.errors.data_evento && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.data_evento.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-foreground text-sm">E-mail (opcional)</Label>
          <Input
            id="email"
            type="email"
            {...equipeForm.register('email')}
            placeholder="seu@email.com"
            className="bg-background border-border text-foreground h-9"
          />
          {equipeForm.formState.errors.email && (
            <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="duracao_evento" className="text-foreground text-sm">Duração (h)</Label>
            <Input
              id="duracao_evento"
              {...equipeForm.register('duracao_evento')}
              placeholder="Ex: 4"
              className="bg-background border-border text-foreground h-9"
            />
            {equipeForm.formState.errors.duracao_evento && (
              <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.duracao_evento.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="orcamento_estimado" className="text-foreground text-sm">Orçamento Min. (R$)</Label>
            <Input
              id="orcamento_estimado"
              {...equipeForm.register('orcamento_estimado')}
              placeholder="Ex: 3000"
              className="bg-background border-border text-foreground h-9"
            />
            {equipeForm.formState.errors.orcamento_estimado && (
              <p className="text-sm text-destructive mt-1">{equipeForm.formState.errors.orcamento_estimado.message}</p>
            )}
          </div>
        </div>


        <div className="space-y-1">
          <Label htmlFor="observacoes" className="text-foreground text-sm">Observações (opcional)</Label>
          <Textarea
            id="observacoes"
            {...equipeForm.register('observacoes')}
            placeholder="Tipo de show desejado, expectativas especiais, estrutura do local, acesso para equipamentos, etc."
            rows={2}
            className="bg-background border-border text-foreground text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">Máximo 500 caracteres</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 flex-shrink-0"></div>
            <div className="text-xs text-muted-foreground">
              <strong className="text-primary">Próximos passos:</strong> Nossa equipe entrará em contato para agendar uma visita técnica e apresentar uma proposta personalizada para seu evento.
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Enviando solicitação...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              🎆 Solicitar Orçamento para Show
            </div>
          )}
        </Button>
      </div>
    </form>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      {/* Ícone de sucesso animado */}
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-pulse">
        <Check className="h-10 w-10 text-white" />
      </div>
      
      {/* Título principal */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-green-600">🎉 Solicitação Enviada com Sucesso!</h3>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm leading-relaxed font-medium">
            ✅ Recebemos sua solicitação de orçamento.<br />
            📱 Nossa equipe especializada entrará em contato 
            <strong className="text-green-800"> em até 24 horas via WhatsApp</strong> para dar continuidade ao seu pedido.
          </p>
        </div>
      </div>

      {/* Próximos passos */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-lg border border-primary/20">
        <div className="text-left space-y-3">
          <h4 className="font-bold text-primary mb-3 text-center">📋 Próximos passos:</h4>
          <div className="space-y-2.5">
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
      </div>

      {/* Dica */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2 text-amber-800">
          <div className="text-lg">💡</div>
          <div className="text-sm font-medium">
            <strong>Dica:</strong> Mantenha seu WhatsApp disponível para um atendimento mais rápido!
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Button 
          onClick={() => {
            const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '5561982735575';
            const message = encodeURIComponent("Olá! Acabei de enviar uma solicitação de orçamento pelo site. Gostaria de dar continuidade ao atendimento.");
            
            toast({
              title: "📱 Abrindo WhatsApp",
              description: "Redirecionando para conversa direta com nossa equipe!",
              duration: 3000,
              className: "border-green-200 bg-green-50 text-green-800",
            });
            
            window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
          }}
          variant="outline"
          className="w-full h-11 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 font-semibold transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Continuar no WhatsApp
        </Button>
        
        <Button 
          onClick={handleClose} 
          className="w-full h-11 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 font-semibold transition-all duration-300 hover:scale-105"
        >
          ✅ Fechar
        </Button>
      </div>
    </div>
  );

  const getTitle = () => {
    switch (step) {
      case 'choice':
        return 'Solicitar Orçamento';
      case 'artigos':
        return 'Adquirir Artigos Pirotécnicos';
      case 'equipe':
        return 'Contratar M5 para Show Pirotécnico';
      case 'success':
        return 'Solicitação Enviada!';
      default:
        return 'Orçamento';
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'choice':
        return renderChoice();
      case 'artigos':
        return renderArtigos();
      case 'equipe':
        return renderEquipe();
      case 'success':
        return renderSuccess();
      default:
        return renderChoice();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto bg-background text-foreground border-border">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-foreground text-base sm:text-lg">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="px-0">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};