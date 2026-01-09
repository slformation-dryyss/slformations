# Script de vérification pré-déploiement pour Clever Cloud (Windows PowerShell)

Write-Host "🔍 Vérification pré-déploiement SL Formations" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "✓ Vérification de Node.js..." -ForegroundColor Green
node --version

# Vérifier npm
Write-Host "✓ Vérification de npm..." -ForegroundColor Green
npm --version

# Installer les dépendances
Write-Host "✓ Installation des dépendances..." -ForegroundColor Green
npm install

# Générer le client Prisma
Write-Host "✓ Génération du client Prisma..." -ForegroundColor Green
npx prisma generate

# Tester le build
Write-Host "✓ Test du build Next.js..." -ForegroundColor Green
npm run build

Write-Host ""
Write-Host "✅ Vérification pré-déploiement terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Créer l'application sur Clever Cloud"
Write-Host "2. Ajouter l'add-on PostgreSQL"
Write-Host "3. Configurer les variables d'environnement"
Write-Host "4. Ajouter le remote Git: git remote add clever <URL>"
Write-Host "5. Déployer: git push clever main"
