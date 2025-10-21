# 🚀 Deploy Rápido com URL Customizada (v3)

## ✨ Opção Mais Rápida: Surge.sh

### 1. Instale o Surge (uma vez só):
```bash
npm install -g surge
```

### 2. Faça o deploy:
```bash
cd /tmp/cc-agent/58951167/project
npm run build
surge dist vendamais-v3.surge.sh
```

**Pronto!** Seu app estará em: `https://vendamais-v3.surge.sh`

---

## 🎨 Opção Vercel (Melhor para produção)

### 1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

### 2. Faça login:
```bash
vercel login
```

### 3. Deploy com nome customizado:
```bash
cd /tmp/cc-agent/58951167/project
npm run build
vercel --prod --name vendamais-v3
```

Você terá URLs como:
- `https://vendamais-v3.vercel.app`
- `https://vendamais-v3-[hash].vercel.app`

### 4. Configure variáveis de ambiente:

No dashboard do Vercel, adicione:

```
VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k
VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI
```

---

## 🌐 Opção Netlify

### 1. Instale Netlify CLI:
```bash
npm install -g netlify-cli
```

### 2. Faça login:
```bash
netlify login
```

### 3. Deploy:
```bash
cd /tmp/cc-agent/58951167/project
npm run build
netlify deploy --prod --dir=dist --site-name=vendamais-v3
```

Você terá: `https://vendamais-v3.netlify.app`

---

## 📦 Deploy Manual (Qualquer Hosting)

Se você tem acesso a um servidor/hosting:

### 1. Build do projeto:
```bash
cd /tmp/cc-agent/58951167/project
npm run build
```

### 2. A pasta `dist/` contém todos os arquivos

### 3. Upload via FTP/SSH:
- Faça upload de toda a pasta `dist/` para seu servidor
- Configure o servidor para servir `index.html` como arquivo padrão
- Certifique-se que URLs são redirecionadas para `index.html` (SPA routing)

### 4. Exemplo de configuração Nginx:
```nginx
server {
    listen 80;
    server_name vendamais-v3.seudominio.com;
    root /var/www/vendamais/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔗 URLs Possíveis

Dependendo da plataforma escolhida:

- **Surge**: `vendamais-v3.surge.sh`
- **Vercel**: `vendamais-v3.vercel.app`
- **Netlify**: `vendamais-v3.netlify.app`
- **Customizada**: `v3.seudominio.com` (requer domínio próprio)

---

## ⚡ Deploy Mais Rápido (30 segundos)

```bash
# 1. Build
npm run build

# 2. Deploy com Surge (mais rápido)
npx surge dist vendamais-v3.surge.sh
```

**Primeira vez usando Surge?**
- Digite seu email
- Crie uma senha
- Confirme o nome do projeto
- Pronto!

---

## 🎯 Recomendação

**Para teste rápido:** Use Surge.sh
**Para produção:** Use Vercel (melhor performance + CDN global)

---

## 📱 Testando no Celular

Depois do deploy:

1. Abra a URL no navegador do celular
2. Teste o login
3. Teste o cadastro de produto com fotos
4. Verifique se a IA está funcionando

---

## 🐛 Se algo não funcionar

1. Verifique o console do navegador (F12)
2. Confirme que as variáveis de ambiente estão corretas
3. Teste a Edge Function do Supabase separadamente
4. Verifique se a API key do Gemini está configurada

---

## ✅ Checklist Final

- [ ] Build executado com sucesso (`npm run build`)
- [ ] Deploy realizado em uma plataforma
- [ ] URL acessível no navegador
- [ ] Variáveis de ambiente configuradas
- [ ] App abre no celular
- [ ] Login funciona
- [ ] Câmera/galeria funciona
- [ ] IA processa fotos
- [ ] Produtos são salvos

**Tudo funcionando?** Parabéns! 🎉 Seu app está no ar!
