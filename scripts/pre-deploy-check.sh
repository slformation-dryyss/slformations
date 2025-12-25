#!/bin/bash
# Script de vérification pré-déploiement pour Clever Cloud

set -e

echo "🔍 Vérification pré-déploiement SL Formations"
echo "=============================================="
echo ""

# Vérifier Node.js
echo "✓ Vérification de Node.js..."
node --version

# Vérifier npm
echo "✓ Vérification de npm..."
npm --version

# Installer les dépendances
echo "✓ Installation des dépendances..."
npm install

# Générer le client Prisma
echo "✓ Génération du client Prisma..."
npx prisma generate

# Tester le build
echo "✓ Test du build Next.js..."
npm run build

echo ""
echo "✅ Vérification pré-déploiement terminée avec succès!"
echo ""
echo "Prochaines étapes:"
echo "1. Créer l'application sur Clever Cloud"
echo "2. Ajouter l'add-on PostgreSQL"
echo "3. Configurer les variables d'environnement"
echo "4. Ajouter le remote Git: git remote add clever <URL>"
echo "5. Déployer: git push clever main"
