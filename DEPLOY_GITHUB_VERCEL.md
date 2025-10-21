# 🚀 Deploy no Vercel via GitHub

## Passo a Passo Completo

### 1️⃣ Preparar o Projeto para Git

Primeiro, vamos garantir que o `.gitignore` está correto:

```bash
# Já está configurado em .gitignore:
# - node_modules/
# - .env
```

### 2️⃣ Inicializar Git (se ainda não estiver)

```bash
cd /tmp/cc-agent/58951167/project

# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "feat: VendaMais v3 com IA Gemini integrada"
```

### 3️⃣ Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `vendamais-v3` (ou o nome que preferir)
3. **Deixe PRIVADO** (para proteger as configs)
4. **NÃO** marque "Initialize with README"
5. Clique em "Create repository"

### 4️⃣ Conectar e Fazer Push

GitHub vai te mostrar comandos. Use estes:

```bash
# Adicionar o remote (substitua SEU_USUARIO pelo seu username)
git remote add origin https://github.com/SEU_USUARIO/vendamais-v3.git

# Renomear branch para main (padrão do GitHub)
git branch -M main

# Fazer push
git push -u origin main
```

**Ou se preferir SSH:**

```bash
git remote add origin git@github.com:SEU_USUARIO/vendamais-v3.git
git branch -M main
git push -u origin main
```

### 5️⃣ Configurar no Vercel

1. Acesse: https://vercel.com/new
2. Faça login (pode usar conta GitHub)
3. Clique em "Import Project"
4. Selecione o repositório `vendamais-v3`
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### 6️⃣ Adicionar Variáveis de Ambiente no Vercel

**IMPORTANTE:** Adicione estas variáveis:

```
VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k

VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI
```

**Como adicionar:**
1. No Vercel, vá em "Settings" do projeto
2. Clique em "Environment Variables"
3. Adicione cada variável (Name + Value)
4. Selecione "Production, Preview, Development"
5. Clique em "Save"

### 7️⃣ Deploy!

Clique em "Deploy" e aguarde (~2 minutos).

Você terá URLs como:
- **Production:** `https://vendamais-v3.vercel.app`
- **Preview:** Links únicos para cada commit

---

## 🔄 Atualizações Futuras

Depois que estiver configurado, qualquer alteração é simples:

```bash
# Fazer mudanças no código...

# Adicionar mudanças
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push

# Vercel faz deploy AUTOMÁTICO! 🎉
```

---

## 🎯 Configuração de Domínio Customizado (Opcional)

Se você tem um domínio (ex: `seusite.com`):

1. No Vercel, vá em "Settings" > "Domains"
2. Adicione: `v3.seusite.com` ou `vendamais.seusite.com`
3. Configure DNS conforme instruções do Vercel
4. Aguarde propagação (~10 min a 48h)

---

## 📱 Testando

Depois do deploy:

1. Acesse a URL do Vercel no navegador
2. Teste no celular (Chrome/Safari)
3. Verifique console (F12) para erros
4. Teste fluxo completo:
   - Login
   - Onboarding
   - Captura de fotos
   - Processamento com IA
   - Salvar produto

---

## ✅ Checklist Pós-Deploy

- [ ] Repositório criado no GitHub
- [ ] Código commitado e pushed
- [ ] Projeto importado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] URL acessível no navegador
- [ ] App funciona no celular
- [ ] IA processa fotos corretamente
- [ ] Produtos salvos no Supabase

---

## 🐛 Troubleshooting

### Erro: "Build failed"
- Verifique se `package.json` está no repositório
- Confirme que `vite.config.js` está presente
- Cheque logs do build no Vercel

### Erro: "Failed to fetch"
- Verifique se as variáveis de ambiente foram adicionadas
- Confirme que não há typos nos nomes das variáveis
- Faça redeploy após adicionar variáveis

### Câmera não funciona
- Certifique-se que a URL é HTTPS (Vercel já faz isso)
- Dê permissão de câmera no navegador
- Use Chrome/Safari no celular

### IA não funciona
- Verifique se `VITE_GEMINI_API_KEY` está configurada
- Teste a API key no console: `console.log(import.meta.env.VITE_GEMINI_API_KEY)`
- Cheque logs da Edge Function no Supabase

---

## 📊 Monitoramento

**No Vercel:**
- Analytics: veja visitas, performance
- Logs: erros e warnings em tempo real
- Deployments: histórico completo

**No Supabase:**
- Table Editor: veja produtos cadastrados
- SQL Editor: rode queries personalizadas
- Logs: veja chamadas da Edge Function
- Auth: monitore usuários

---

## 🎉 Resultado Final

Você terá:

✅ Código versionado no GitHub (privado e seguro)
✅ Deploy automático no Vercel (cada push = novo deploy)
✅ URL profissional (`vendamais-v3.vercel.app`)
✅ HTTPS automático (SSL grátis)
✅ CDN global (super rápido em qualquer lugar)
✅ Rollback fácil (voltar versões anteriores)
✅ Preview automático (testar antes de publicar)

---

## 🚀 Comandos Rápidos

```bash
# Setup inicial (uma vez)
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/SEU_USUARIO/vendamais-v3.git
git push -u origin main

# Atualizações (sempre que mudar algo)
git add .
git commit -m "feat: descrição da mudança"
git push
```

---

**Dúvidas?**
- GitHub: https://docs.github.com
- Vercel: https://vercel.com/docs
- Git: https://git-scm.com/doc

**Pronto para começar?** Siga o passo 2! 🎯
