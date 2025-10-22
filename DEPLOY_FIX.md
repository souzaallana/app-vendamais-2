# Deploy Fix - Botão de Onboarding

## Problema
O botão "Entendi, vamos lá" na tela de onboarding não funciona quando publicado no Vercel.

## Solução Aplicada

### Mudanças Realizadas:

1. **src/modules/products/onboarding.js**
   - Alterado de event delegation para listeners diretos
   - Adicionados logs de debug detalhados
   - Aumentada robustez na captura de eventos

2. **src/main.js**
   - Aumentado timeout de 0ms para 100ms no setupOnboardingListeners
   - Garante que o DOM esteja completamente renderizado antes de adicionar listeners

## Como Fazer Deploy

### Opção 1: Deploy via Vercel CLI
```bash
cd /tmp/cc-agent/58951167/project
npm run build
vercel --prod
```

### Opção 2: Deploy via GitHub
1. Faça commit das mudanças
2. Push para o repositório
3. Vercel vai fazer o deploy automaticamente

### Opção 3: Deploy Manual
1. Faça o build localmente:
   ```bash
   npm run build
   ```
2. Faça upload da pasta `dist/` no Vercel
3. Configure as seguintes variáveis de ambiente:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

## Verificação

Após o deploy, abra o Console do navegador (F12) e você deve ver:

```
🎯 Setting up onboarding listeners
📍 Start button found: true
📍 Close button found: true
✓ Start button listener added
✓ Close button listener added
```

Ao clicar no botão:
```
✅ Start button clicked!
```

## Se ainda não funcionar

1. Verifique se as variáveis de ambiente estão configuradas
2. Force um hard refresh (Ctrl+Shift+R)
3. Limpe o cache do navegador
4. Verifique o Console para erros

## Arquivos Alterados
- src/modules/products/onboarding.js
- src/main.js
