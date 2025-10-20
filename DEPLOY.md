# 🚀 Guia de Deploy - VendaMais IA

## Opção 1: Deploy no Vercel (Recomendado)

### Método A: Via Vercel CLI

1. **Instale o Vercel CLI:**
```bash
npm install -g vercel
```

2. **Faça login no Vercel:**
```bash
vercel login
```

3. **Execute o deploy:**
```bash
vercel
```

4. **Siga as instruções:**
   - Aceite as configurações padrão
   - O Vercel vai gerar uma URL para você
   - Acesse a URL no seu celular

### Método B: Via Dashboard do Vercel (Mais Fácil)

1. Acesse: https://vercel.com
2. Faça login ou crie uma conta
3. Clique em "Add New Project"
4. Se o projeto estiver no Git:
   - Conecte seu repositório
   - Vercel fará deploy automático
5. Se não estiver no Git:
   - Use o Vercel CLI (Método A)

### Configurar Variáveis de Ambiente no Vercel

Após o deploy, configure as variáveis:

1. Vá em "Settings" > "Environment Variables"
2. Adicione:
   - `VITE_SUPABASE_URL` = `https://jnqynypefthinysddrka.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k`
   - `VITE_GEMINI_API_KEY` = [Sua chave da API Gemini]

3. Faça redeploy

---

## Opção 2: Deploy no Netlify

### Método A: Netlify Drop (Super Fácil)

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta `dist` para o navegador
3. Pronto! URL gerada instantaneamente

### Método B: Netlify CLI

1. **Instale o Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Faça login:**
```bash
netlify login
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

### Configurar Variáveis de Ambiente no Netlify

1. No dashboard, vá em "Site settings" > "Environment variables"
2. Adicione as mesmas variáveis do Vercel
3. Faça redeploy

---

## Opção 3: Teste Local na Rede

Se quiser apenas testar rapidamente no celular sem fazer deploy:

1. **Descubra seu IP local:**
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

2. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev -- --host
```

3. **No celular:**
   - Conecte na mesma rede WiFi
   - Acesse: `http://SEU_IP:5173`

---

## 🔑 Obter Chave da API Gemini (Para AI Real)

1. Acesse: https://makersuite.google.com/app/apikey
2. Faça login com conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada
5. Adicione no `.env`: `VITE_GEMINI_API_KEY=sua_chave_aqui`
6. Faça rebuild e redeploy

**Nota:** Sem a chave do Gemini, o app funciona mas usa dados mock para os produtos.

---

## ✅ Checklist Pós-Deploy

- [ ] App abre no celular
- [ ] Login funciona
- [ ] Onboarding aparece na primeira vez
- [ ] Câmera abre ao tirar fotos
- [ ] Fotos são capturadas
- [ ] Tela de revisão funciona
- [ ] AI processa (ou mostra mock)
- [ ] Formulário salva produto
- [ ] Tela de sucesso exibe compartilhamento
- [ ] WhatsApp abre ao clicar
- [ ] Navegação entre telas funciona

---

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente do Supabase estão corretas
- Confirme que não há CORS bloqueado

### Câmera não abre
- Verifique permissões do navegador
- HTTPS é necessário para câmera funcionar (localhost e deploy funcionam)

### AI não funciona
- Confirme que `VITE_GEMINI_API_KEY` está configurada
- Verifique console do navegador para erros
- O fallback com dados mock funcionará automaticamente

---

## 📱 Testando no Celular

1. Abra a URL no navegador do celular (Chrome ou Safari)
2. Para "instalar" como PWA:
   - **iOS:** Safari > Compartilhar > Adicionar à Tela Inicial
   - **Android:** Chrome > Menu > Adicionar à tela inicial

3. Teste o fluxo completo de cadastro

---

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. Teste todas as funcionalidades no celular
2. Configure a chave do Gemini para AI real
3. Ajuste textos/cores conforme necessário
4. Implemente geração de imagens AI (requer API adicional)
5. Conecte com APIs reais dos marketplaces

---

**Dúvidas?** Consulte a documentação:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- Gemini: https://ai.google.dev/docs
