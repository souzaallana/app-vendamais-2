# 🚀 Deploy AGORA - 3 Comandos

## ⚡ Opção Rápida (Recomendada)

### 1. Execute o script automatizado:

```bash
cd /tmp/cc-agent/58951167/project
./deploy.sh
```

O script vai guiar você pelos passos!

---

## 📋 Opção Manual (Passo a Passo)

### Passo 1: Criar Repositório no GitHub

```bash
# Se você tem GitHub CLI configurado:
gh repo create vendamais-v3 --private --source=. --remote=origin --push
```

**OU via interface:**

1. Abra: https://github.com/new
2. Nome: `vendamais-v3`
3. Private
4. Clique em "Create repository"
5. Execute:
```bash
git remote add origin https://github.com/SEU_USUARIO/vendamais-v3.git
git push -u origin main
```

### Passo 2: Deploy no Vercel

**Opção A - Interface Web (Mais Fácil):**

1. Abra: https://vercel.com/new
2. Importe o repositório `vendamais-v3`
3. Adicione as 3 Environment Variables:

```
VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k

VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI
```

4. Clique em "Deploy"

**Opção B - CLI:**

```bash
cd /tmp/cc-agent/58951167/project

# Login no Vercel (abrirá navegador)
npx vercel login

# Deploy com env vars
npx vercel --prod \
  -e VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k \
  -e VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI
```

---

## ✅ Checklist

- [ ] Git tem todos os arquivos commitados
- [ ] Repositório criado no GitHub
- [ ] Código foi pushed (`git push`)
- [ ] Projeto importado no Vercel
- [ ] 3 variáveis de ambiente adicionadas
- [ ] Deploy executado
- [ ] URL funciona no navegador
- [ ] Testado no celular

---

## 🎯 Resultado Final

Após o deploy você terá:

- **GitHub:** `https://github.com/SEU_USUARIO/vendamais-v3`
- **Vercel:** `https://vendamais-v3.vercel.app` (ou personalizado)
- **Deploy automático:** Todo `git push` = novo deploy

---

## 🔄 Workflow Futuro

```bash
# Fazer mudanças no código...
git add .
git commit -m "feat: nova funcionalidade"
git push
# Vercel faz deploy automático! 🎉
```

---

## 🐛 Troubleshooting

### "Failed to create repository"
- Verifique se você está logado no GitHub
- Tente criar manualmente na interface

### "Vercel login required"
- Execute: `npx vercel login`
- Siga as instruções no navegador

### "Build failed"
- Verifique se as env vars foram adicionadas
- Teste local: `npm run build`

### "Runtime error"
- Abra DevTools (F12) no navegador
- Verifique console para erros
- Confirme que env vars estão corretas

---

## 📱 Teste Final

1. Abra a URL no navegador
2. Faça login/cadastro
3. Tire foto de um produto
4. Verifique se IA processa
5. Confirme salvamento no Supabase
6. Teste compartilhamento WhatsApp

---

**Tudo pronto!** 🚀 Execute `./deploy.sh` ou siga os passos manuais acima.
