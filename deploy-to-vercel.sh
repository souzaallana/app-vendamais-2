#!/bin/bash

echo "🚀 Iniciando deploy fix para Vercel..."

# Build do projeto
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Arquivos prontos na pasta dist/"
    echo ""
    echo "Próximos passos:"
    echo "1. Acesse https://vercel.com/new"
    echo "2. Faça upload da pasta dist/ OU"
    echo "3. Execute: npx vercel --prod"
    echo ""
    echo "Ou se você já tem o projeto no Vercel:"
    echo "npx vercel --prod"
else
    echo "❌ Build failed!"
    exit 1
fi
