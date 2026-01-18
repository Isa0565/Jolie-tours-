#!/bin/bash

echo "🚀 DÉPLOIEMENT JOLIE TOURS SUR VERCEL"
echo "======================================"
echo ""

# Vérifier si Git est initialisé
if [ ! -d ".git" ]; then
  echo "📦 Initialisation Git..."
  git init
  git branch -M main
fi

# Ajouter tous les fichiers
echo "📝 Ajout des fichiers..."
git add .

# Commit
echo "💾 Commit..."
git commit -m "Deploy Jolie Tours - Flight Search Application"

# Ajouter remote si nécessaire
if ! git remote | grep -q "origin"; then
  echo "🔗 Ajout du remote GitHub..."
  git remote add origin https://github.com/Isa0565/Jolie-tours-.git
fi

# Push vers GitHub
echo "⬆️  Push vers GitHub..."
git push -u origin main --force

echo ""
echo "✅ PUSH TERMINÉ!"
echo ""
echo "🌐 MAINTENANT:"
echo "1. Va sur https://vercel.com/new"
echo "2. Importe 'Isa0565/Jolie-tours-'"
echo "3. Clique 'Deploy'"
echo ""
echo "OU utilise Vercel CLI:"
echo "  npm install -g vercel"
echo "  vercel --prod"
echo ""
