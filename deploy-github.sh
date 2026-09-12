#!/bin/bash

# Script de deploy automático para GitHub
# Uso: ./deploy-github.sh

echo "🚀 Iniciando deploy para GitHub..."
echo ""

# Verificar se está em um repositório git
if [ ! -d .git ]; then
    echo "❌ Este diretório não é um repositório git."
    echo "Execute: git init"
    exit 1
fi

# Verificar se há mudanças
if git diff --quiet && git diff --cached --quiet; then
    echo "⚠️  Nenhuma mudança detectada."
    read -p "Deseja fazer push mesmo assim? (s/n): " confirm
    if [ "$confirm" != "s" ]; then
        echo "❌ Deploy cancelado."
        exit 0
    fi
fi

# Adicionar todas as mudanças
echo "📦 Adicionando arquivos..."
git add .

# Commit
echo "💾 Criando commit..."
read -p "Mensagem do commit (padrão: 'update: melhorias no projeto'): " message
message=${message:-"update: melhorias no projeto"}
git commit -m "$message"

# Verificar se existe remote
if ! git remote | grep -q "origin"; then
    echo ""
    echo "⚠️  Nenhum remote 'origin' configurado."
    echo "Configure com: git remote add origin https://github.com/SEU_USUARIO/saber-integral.git"
    exit 1
fi

# Push
echo ""
echo "📤 Enviando para o GitHub..."
git push

echo ""
echo "✅ Código enviado com sucesso!"
echo ""
echo "🔗 Próximos passos:"
echo "1. Acesse https://vercel.com e importe o repositório"
echo "2. Ou acesse https://netlify.com e importe o repositório"
echo ""
echo "🎉 Deploy concluído!"
