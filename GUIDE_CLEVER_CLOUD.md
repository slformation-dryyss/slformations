# 🚀 Guide Visuel - Configuration Clever Cloud

## Étape 1: Accéder à Clever Cloud

1. Ouvrez votre navigateur
2. Allez sur: **https://console.clever-cloud.com**
3. Connectez-vous avec votre compte (ou créez-en un si nécessaire)

---

## Étape 2: Créer une Nouvelle Application

### Actions à faire:

1. **Cliquez sur le bouton "Create..."** en haut à droite
2. **Sélectionnez "an application"**
3. **Choisissez "Create a brand new app"**

### Configuration:

**Zone géographique:**
- Sélectionnez: **Paris (par-1)** ✅
- (Meilleure latence pour la France)

**Type d'application:**
- Sélectionnez: **Node.js** ✅

**Taille d'instance:**
- Pour tests: **Nano** (gratuit)
- Pour production: **S** ou **M** (recommandé)

**Nom de l'application:**
- Entrez: `slformations` (ou votre choix)

4. **Cliquez sur "Create"**

---

## Étape 3: Noter l'URL de l'Application

Après création, Clever Cloud vous donne une URL:

```
https://app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.cleverapps.io
```

**📝 IMPORTANT: Notez cette URL quelque part !**
Vous en aurez besoin pour:
- Auth0
- Stripe
- Les tests

---

## Étape 4: Ajouter PostgreSQL

### Dans votre application Clever Cloud:

1. **Cliquez sur l'onglet "Add-ons"** (dans le menu de gauche)
2. **Cliquez sur "Add an add-on"**
3. **Sélectionnez "PostgreSQL"**

### Configuration PostgreSQL:

**Plan:**
- Pour tests: **DEV** (gratuit)
- Pour production: **S** ou **M**

**Nom:**
- Entrez: `slformations-db`

4. **Cliquez sur "Create"**

### ✅ Vérification:

L'add-on PostgreSQL va créer automatiquement la variable:
- `POSTGRESQL_ADDON_URI`

**Ne touchez pas à cette variable !** Elle est gérée automatiquement.

---

## Étape 5: Configurer les Variables d'Environnement

### Dans votre application:

1. **Cliquez sur "Environment variables"** (menu de gauche)
2. **Cliquez sur "Add a variable"** pour chaque variable ci-dessous

### Variables à ajouter:

#### 🔐 Auth0

```
Nom: AUTH0_SECRET
Valeur: [Générer un secret - voir ci-dessous]

Nom: AUTH0_BASE_URL
Valeur: https://app-xxx.cleverapps.io
(Remplacez par VOTRE URL Clever Cloud notée à l'étape 3)

Nom: AUTH0_ISSUER_BASE_URL
Valeur: https://votre-tenant.eu.auth0.com
(Depuis votre Auth0 Dashboard > Applications > Settings)

Nom: AUTH0_CLIENT_ID
Valeur: [Depuis Auth0 Dashboard > Applications > Settings]

Nom: AUTH0_CLIENT_SECRET
Valeur: [Depuis Auth0 Dashboard > Applications > Settings]
```

**Pour générer AUTH0_SECRET:**
- Ouvrez PowerShell et exécutez:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```
- Ou utilisez: https://generate-secret.vercel.app/32

#### 💳 Stripe

```
Nom: STRIPE_SECRET_KEY
Valeur: sk_test_... (ou sk_live_... pour production)
(Depuis Stripe Dashboard > Developers > API keys)

Nom: STRIPE_PUBLISHABLE_KEY
Valeur: pk_test_... (ou pk_live_... pour production)
(Depuis Stripe Dashboard > Developers > API keys)
```

**Note:** `STRIPE_WEBHOOK_SECRET` sera ajouté après le premier déploiement

#### 📧 Resend

```
Nom: RESEND_API_KEY
Valeur: re_...
(Depuis Resend Dashboard > API Keys)
```

#### ⚙️ Node.js

```
Nom: NODE_ENV
Valeur: production
```

### ⚠️ Variables à NE PAS ajouter:

- ❌ `DATABASE_URL` (géré automatiquement par Clever Cloud)
- ❌ `PORT` (géré automatiquement par Clever Cloud)
- ❌ `POSTGRESQL_ADDON_URI` (créé automatiquement par l'add-on)

---

## Étape 6: Mettre à Jour Auth0

### Dans Auth0 Dashboard:

1. Allez sur: **https://manage.auth0.com**
2. **Applications > [Votre Application] > Settings**

### Mettez à jour ces champs:

**Allowed Callback URLs:**
```
https://app-xxx.cleverapps.io/api/auth/callback
```
(Remplacez par votre URL Clever Cloud)

**Allowed Logout URLs:**
```
https://app-xxx.cleverapps.io
```

**Allowed Web Origins:**
```
https://app-xxx.cleverapps.io
```

3. **Cliquez sur "Save Changes"** en bas de la page

---

## Étape 7: Configurer Git

### Dans Clever Cloud:

1. **Cliquez sur "Information"** (menu de gauche)
2. **Trouvez la section "Deployment"**
3. **Copiez l'URL Git** (commence par `git+ssh://...`)

### Dans votre terminal PowerShell:

```powershell
# Naviguer vers le projet
cd C:\Users\andry\Bureau\slformations

# Ajouter le remote Clever Cloud
git remote add clever [COLLEZ L'URL GIT ICI]

# Vérifier
git remote -v
```

Vous devriez voir:
```
clever  git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_xxx.git (fetch)
clever  git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_xxx.git (push)
```

---

## Étape 8: Premier Déploiement

### Dans PowerShell:

```powershell
# Vérifier le statut
git status

# Ajouter tous les fichiers
git add .

# Commiter
git commit -m "Configure for Clever Cloud deployment"

# Déployer sur Clever Cloud
git push clever main
```

**Si votre branche s'appelle "master":**
```powershell
git push clever master
```

---

## Étape 9: Surveiller le Déploiement

### Dans Clever Cloud:

1. **Cliquez sur "Logs"** (menu de gauche)
2. **Surveillez le build en temps réel**

### Messages à rechercher:

✅ `Environment variables loaded from .env`
✅ `Prisma schema loaded from prisma/schema.prisma`
✅ `✓ Generating Prisma Client`
✅ `✓ Compiled successfully`
✅ `Application started`

**Temps estimé:** 3-5 minutes

### En cas d'erreur:

- Lisez attentivement le message d'erreur dans les logs
- Vérifiez que toutes les variables d'environnement sont correctes
- Vérifiez que l'add-on PostgreSQL est bien lié

---

## Étape 10: Tester l'Application

### Une fois le déploiement terminé:

1. **Ouvrez votre URL Clever Cloud** dans un navigateur
   ```
   https://app-xxx.cleverapps.io
   ```

2. **Vérifiez que la page d'accueil s'affiche**

3. **Testez la connexion:**
   - Cliquez sur "Se connecter"
   - Connectez-vous avec un compte test
   - Vérifiez la redirection vers le dashboard

4. **Vérifiez les logs** pour détecter d'éventuelles erreurs

---

## ✅ Checklist de Vérification

- [ ] Application créée sur Clever Cloud
- [ ] Add-on PostgreSQL ajouté
- [ ] Toutes les variables d'environnement configurées
- [ ] Auth0 mis à jour avec les nouvelles URLs
- [ ] Remote Git ajouté
- [ ] Code déployé avec succès
- [ ] Application accessible via l'URL
- [ ] Authentification fonctionne
- [ ] Pas d'erreurs dans les logs

---

## 🆘 Besoin d'Aide ?

Si vous rencontrez un problème:

1. **Vérifiez les logs Clever Cloud** en détail
2. **Vérifiez que toutes les variables sont correctes**
3. **Consultez le fichier `walkthrough.md`** pour plus de détails
4. **Contactez-moi** avec le message d'erreur exact

---

## Prochaines Étapes

Une fois le déploiement réussi:

1. **Configurer le webhook Stripe** (voir walkthrough.md - Étape 9)
2. **Configurer le domaine IONOS** (voir walkthrough.md - Étape 10)
3. **Tester toutes les fonctionnalités**
4. **Configurer le monitoring**
