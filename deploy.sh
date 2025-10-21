#!/bin/bash

echo "🚀 VendaMais v3 - Deploy Automático"
echo "===================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Passo 1: Verificando Git...${NC}"
if [ ! -d ".git" ]; then
    echo "Inicializando Git..."
    git init
    git add .
    git commit -m "feat: VendaMais v3 - App completo com IA Gemini"
    git branch -M main
fi

echo -e "${GREEN}✓ Git configurado${NC}"
echo ""

echo -e "${BLUE}📤 Passo 2: GitHub${NC}"
echo "Você tem duas opções:"
echo ""
echo "A) Criar repositório manualmente:"
echo "   1. Abra: https://github.com/new"
echo "   2. Nome: vendamais-v3"
echo "   3. Visibilidade: Private"
echo "   4. NÃO marque 'Initialize this repository'"
echo "   5. Após criar, execute:"
echo "      git remote add origin https://github.com/SEU_USUARIO/vendamais-v3.git"
echo "      git push -u origin main"
echo ""
echo "B) Usar GitHub CLI (se tiver configurado):"
echo "   gh repo create vendamais-v3 --private --source=. --remote=origin --push"
echo ""

read -p "Você já criou o repositório e fez push? (s/n): " github_done

if [ "$github_done" != "s" ]; then
    echo -e "${RED}Por favor, complete o passo do GitHub primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Código no GitHub${NC}"
echo ""

echo -e "${BLUE}🚀 Passo 3: Deploy no Vercel${NC}"
echo ""
echo "Você tem duas opções:"
echo ""
echo "A) Deploy via Interface Web (Recomendado):"
echo "   1. Abra: https://vercel.com/new"
echo "   2. Importe o repositório 'vendamais-v3'"
echo "   3. Configure as Environment Variables:"
echo "      VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co"
echo "      VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k"
echo "      VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI"
echo "   4. Clique em 'Deploy'"
echo ""
echo "B) Deploy via CLI:"
echo "   npx vercel --prod"
echo "   (Você precisará fazer login e configurar as env vars)"
echo ""

read -p "Deseja fazer deploy via CLI agora? (s/n): " deploy_cli

if [ "$deploy_cli" = "s" ]; then
    echo ""
    echo "Fazendo deploy..."
    echo ""

    # Criar arquivo .vercel com as env vars
    echo "Configurando variáveis de ambiente..."

    npx vercel --prod \
        -e VITE_SUPABASE_URL=https://jnqynypefthinysddrka.supabase.co \
        -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucXlueXBlZnRoaW55c2RkcmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5ODExOTUsImV4cCI6MjA3NjU1NzE5NX0.WEJk5IiWyJqaaiNh0-jsEL0a5R1ry3hQ1N0U4eBm45k \
        -e VITE_GEMINI_API_KEY=AIzaSyAEIio71m9vjU6BuQaseFFBirkNwmYKQoI

    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
        echo ""
        echo "🎉 Seu app está no ar!"
        echo ""
    else
        echo -e "${RED}❌ Erro no deploy. Use a interface web: https://vercel.com/new${NC}"
    fi
else
    echo ""
    echo "Ok! Use a interface web para fazer o deploy:"
    echo "👉 https://vercel.com/new"
fi

echo ""
echo -e "${GREEN}===================================="
echo "✅ Deploy Preparado!"
echo "====================================${NC}"
echo ""
echo "📱 Próximos passos:"
echo "1. Acesse a URL do Vercel"
echo "2. Teste o app no navegador"
echo "3. Teste no celular"
echo "4. Verifique se a IA está funcionando"
echo ""
echo "📊 Monitoramento:"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo ""
echo "🔄 Atualizações futuras:"
echo "   git add ."
echo "   git commit -m \"sua mensagem\""
echo "   git push"
echo "   (Deploy automático no Vercel!)"
echo ""
