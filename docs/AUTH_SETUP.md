# Guide de Configuration Authentification (Auth0 + Prisma)

Pour que l'authentification fonctionne, vous devez configurer **Auth0** et les **variables d'environnement**.

## 1. Variables d'Environnement

Créez un fichier `.env` (local) ou configurez ces variables dans Clever Cloud.

```bash
# URL de l'application (en local)
AUTH0_SECRET='une_chaine_aleatoire_longue_32_caracteres'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://votre-tenant.eu.auth0.com'
AUTH0_CLIENT_ID='votre_client_id'
AUTH0_CLIENT_SECRET='votre_client_secret'

# Base de données (PostgreSQL)
DATABASE_URL='postgresql://user:pass@host:port/db?sslmode=prefer'

# Stripe (Optionnel pour le moment)
STRIPE_SECRET_KEY='sk_test_...'
```

> **Note**: Pour générer un secret Auth0 : `openssl rand -hex 32`

## 2. Configuration Auth0 (CRITIQUE)

Le code s'attend à recevoir les rôles via le token. **Si vous ne faites pas ça, tout le monde sera "STUDENT".**

1.  Allez dans votre Dashboard Auth0 > **Actions** > **Library**.
2.  Cliquez sur **Build Custom**.
3.  Nom : `Add Roles to Token`
4.  Trigger : **Login / Post Login**
5.  Code :

```javascript
exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://sl-formations.fr/roles';
  
  // Si l'utilisateur a des rôles définis dans Auth0 (RBAC), on les ajoute
  const roles = (event.authorization && event.authorization.roles) ? event.authorization.roles : [];
  
  // On ajoute le claim personnalisé au token d'identité et d'accès
  if (event.authorization) {
    api.idToken.setCustomClaim(namespace, roles);
    api.accessToken.setCustomClaim(namespace, roles);
  }
};
```

6.  **Deployer** l'action.
7.  Allez dans **Actions** > **Flows** > **Login**.
8.  Glissez-déposez votre action `Add Roles to Token` entre "Start" et "Complete".
9.  Cliquez sur **Apply**.

## 3. URLs de Callback (Dashboard Auth0)

Dans les settings de votre Application Auth0 :

- **Allowed Callback URLs**: 
  - `http://localhost:3000/api/auth/callback`
  - `https://votre-app-clever-cloud.cleverapps.io/api/auth/callback`
- **Allowed Logout URLs**:
  - `http://localhost:3000`
  - `https://votre-app-clever-cloud.cleverapps.io`
