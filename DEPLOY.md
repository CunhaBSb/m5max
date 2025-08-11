# Deploy no Vercel - M5 Max Produções

## Pré-requisitos
- Conta no Vercel
- Projeto Supabase configurado
- Repositório Git

## Passos para Deploy

### 1. Configurar Variáveis de Ambiente no Vercel

No painel do Vercel, adicione as seguintes variáveis de ambiente:

```
VITE_SUPABASE_URL=https://psvmzrzezgkklfjshhua.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzdm16cnplemdra2xmanNoaHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTIzMTAsImV4cCI6MjA2OTM4ODMxMH0.s0ngJl3nesmkfte9s2a0wSx5ouMp1uqydcChxRmJ1JQ
VITE_APP_NAME=M5 Max Produções
VITE_APP_URL=https://seu-dominio.vercel.app
VITE_WHATSAPP_NUMBER=5561986059330
VITE_EMAIL_FROM=fogosm5.max@gmail.com
VITE_EMAIL_TO_PRIMARY=marcosdocunha@gmail.com
VITE_EMAIL_TO_SECONDARY=fogosm5.max@gmail.com
VITE_NODE_ENV=production
```

### 2. Configurações de Build

O projeto já está configurado com:
- ✅ `vercel.json` para roteamento SPA
- ✅ `vite.config.ts` otimizado para produção
- ✅ Manual chunks para melhor performance
- ✅ Cache headers para assets estáticos

### 3. Deploy Automático

1. Conecte o repositório no Vercel
2. Framework: **Vite**
3. Root Directory: `app`
4. Build Command: `npm run build`
5. Output Directory: `dist`

### 4. Configurações Avançadas

#### Vercel Functions (se necessário)
- O projeto usa Supabase como backend
- Todas as operações são client-side ou via Supabase

#### Performance
- Code splitting ativo (lazy loading)
- PDF generation otimizado com dynamic imports
- Debounced search implementado
- Bundle size otimizado com manual chunks

### 5. Pós-Deploy

1. Teste todas as funcionalidades admin
2. Verifique integração com Supabase
3. Teste responsividade em dispositivos móveis
4. Configure domínio customizado (se aplicável)

## Estrutura do Projeto

```
app/
├── vercel.json         # Configurações do Vercel
├── vite.config.ts      # Build otimizado
├── .env.example        # Template de variáveis
├── dist/               # Build de produção
└── src/                # Código fonte
```

## Comando de Build Local

```bash
npm run build
```

## Solução de Problemas

### Erro "vite: command not found"
Se encontrar este erro no Vercel:
1. Certifique-se que o Node.js 18+ está sendo usado
2. O build command usa `npx vite build` automaticamente
3. Verifique se o `package.json` está na raiz do projeto

### Erros de Ambiente
- Todas as variáveis `VITE_*` devem estar configuradas no Vercel
- URL do Supabase deve estar correta
- Chaves de API devem ser válidas

## Notas Importantes

- ⚠️ Nunca commite o arquivo `.env.local`
- ✅ Use as variáveis de ambiente do Vercel
- ✅ O projeto está otimizado para performance
- ✅ Todas as rotas SPA funcionam corretamente