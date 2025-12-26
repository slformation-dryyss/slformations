# 🔧 Configuration Variables d'Environnement - Clever Cloud

## 🌐 URL de votre Application
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io
```

---

## 📋 Variables à Ajouter dans Clever Cloud

Dans **Clever Cloud > Environment variables**, ajoutez ces variables une par une:

### 🔐 Auth0

#### AUTH0_SECRET
```
[GÉNÉRER UN SECRET - Voir commande ci-dessous]
```

**Pour générer (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

#### AUTH0_BASE_URL
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io
```

#### AUTH0_ISSUER_BASE_URL
```
[Votre tenant Auth0 - ex: https://dev-xxxxx.eu.auth0.com]
```
📍 Trouvez cette valeur dans: **Auth0 Dashboard > Applications > Settings > Domain**

#### AUTH0_CLIENT_ID
```
[Votre Client ID]
```
📍 Depuis: **Auth0 Dashboard > Applications > Settings > Client ID**

#### AUTH0_CLIENT_SECRET
```
[Votre Client Secret]
```
📍 Depuis: **Auth0 Dashboard > Applications > Settings > Client Secret**

---

### 🌍 Application URL (Essentiel !)

#### NEXT_PUBLIC_APP_URL
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io
```
⚠️ **Très important:** Utilisé pour les redirections de paiement et les liens dans les emails. Sans ça, ils pointeront vers localhost !

---

### 💳 Stripe

#### STRIPE_SECRET_KEY
```
sk_test_... (ou sk_live_... pour production)
```
📍 Depuis: **Stripe Dashboard > Developers > API keys > Secret key**

#### STRIPE_PUBLISHABLE_KEY
```
pk_test_... (ou pk_live_... pour production)
```
📍 Depuis: **Stripe Dashboard > Developers > API keys > Publishable key**

#### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
pk_test_... (ou pk_live_... pour production)
```
⚠️ **Important:** Mettre la même valeur que `STRIPE_PUBLISHABLE_KEY`. Elle est nécessaire pour le fonctionnement côté navigateur.

#### STRIPE_WEBHOOK_SECRET
```
whsec_...
```
⚠️ **À ajouter APRÈS le premier déploiement** (voir étape 5)

---

### 📧 Resend

#### RESEND_API_KEY
```
re_...
```
📍 Depuis: **Resend Dashboard > API Keys**

---

### ⚙️ Node.js

#### NODE_ENV
```
production
```

---

## ❌ Variables à NE PAS Ajouter

Ces variables sont gérées automatiquement par Clever Cloud:
- ❌ `DATABASE_URL`
- ❌ `POSTGRESQL_ADDON_URI`
- ❌ `PORT`

---

## 🔄 Configuration Auth0

Dans **Auth0 Dashboard > Applications > [Votre App] > Settings**, mettez à jour:

### Allowed Callback URLs
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io/api/auth/callback
```

### Allowed Logout URLs
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io
```

### Allowed Web Origins
```
https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io
```

Puis cliquez sur **"Save Changes"**

---

## 📝 Ordre des Étapes Config Mise à Jour

### 1️⃣ Ajouter PostgreSQL
- Dans Clever Cloud > Add-ons
- Ajouter PostgreSQL (plan S ou M)

### 2️⃣ Configurer les Variables
- Ajouter toutes les variables ci-dessus
- **N'oubliez pas `NEXT_PUBLIC_APP_URL` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` !**

### 3️⃣ Mettre à Jour Auth0
- Configurer les URLs dans Auth0 Dashboard

### 4️⃣ Ajouter le Remote Git
```powershell
git remote add clever git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_17ffc860-acff-4411-8b99-1a5684b8f08d.git
```

### 5️⃣ Déployer
```powershell
git push clever main
```

### 6️⃣ Configurer Stripe Webhook (après déploiement)
1. Aller sur **Stripe Dashboard > Webhooks**
2. Cliquer sur **"Add endpoint"**
3. URL: `https://app-17ffc860-acff-4411-8b99-1a5684b8f08d.cleverapps.io/api/webhooks/stripe`
4. Sélectionner les événements:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copier le **Signing secret** (commence par `whsec_`)
6. Ajouter dans Clever Cloud: `STRIPE_WEBHOOK_SECRET = whsec_...`
7. Redémarrer l'application

---

## ✅ Checklist

- [ ] Add-on PostgreSQL ajouté
- [ ] AUTH0_SECRET généré et ajouté
- [ ] AUTH0_BASE_URL ajouté
- [ ] AUTH0_ISSUER_BASE_URL ajouté
- [ ] AUTH0_CLIENT_ID ajouté
- [ ] AUTH0_CLIENT_SECRET ajouté
- [ ] NEXT_PUBLIC_APP_URL ajouté (Critique !)
- [ ] STRIPE_SECRET_KEY ajouté
- [ ] STRIPE_PUBLISHABLE_KEY ajouté
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ajouté (Critique !)
- [ ] RESEND_API_KEY ajouté
- [ ] NODE_ENV ajouté
- [ ] Auth0 URLs mises à jour
- [ ] Remote Git ajouté
- [ ] Code déployé
- [ ] Webhook Stripe configuré
- [ ] STRIPE_WEBHOOK_SECRET ajouté
- [ ] Application redémarrée
