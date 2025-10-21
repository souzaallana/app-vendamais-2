#!/bin/bash

echo "🚀 Deploy VendaMais v3"
echo "====================="
echo ""

# Build do projeto
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Perguntar qual plataforma
echo "Escolha a plataforma de deploy:"
echo "1) Vercel (recomendado)"
echo "2) Netlify"
echo "3) Surge.sh (mais simples)"
echo ""
read -p "Opção [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "📤 Deploying to Vercel..."
        echo "Configure o projeto como: vendamais-v3"
        npx vercel --prod
        ;;
    2)
        echo ""
        echo "📤 Deploying to Netlify..."
        npx netlify deploy --prod --dir=dist --site-name=vendamais-v3
        ;;
    3)
        echo ""
        echo "📤 Deploying to Surge.sh..."
        npx surge dist vendamais-v3.surge.sh
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🔗 Próximos passos:"
echo "1. Acesse a URL gerada"
echo "2. Configure as variáveis de ambiente (se necessário)"
echo "3. Teste no celular"
echo ""
