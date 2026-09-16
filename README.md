# DevConnect

Marketplace africaine de freelances et de services numériques. Cette première version est un frontend React/Vite mobile-first, avec données de démonstration clairement signalées et des frontières d'intégration prêtes pour Firebase, ImageKit, Cloudinary et un prestataire de paiement local.

## Ce qui est déjà inclus

- Accueil premium et responsive avec catégories, projets récents, talents disponibles, fonctionnement, sécurité et avis.
- Pages de démonstration pour explorer les talents, explorer les projets, publier un projet, tableau de bord client, connexion, messagerie et administration.
- Architecture prête à accueillir authentification, profils, projets, propositions, messages, notifications, évaluations, modération et paiements par étapes.
- Aucun mot de passe, clé privée ou faux identifiant n'est stocké dans le dépôt.
- Données d'interface fictives marquées « Démo ».
- Workflow GitHub Actions pour GitHub Pages, avec base `/devconnect/` sur le dépôt et configuration compatible avec un futur domaine personnalisé.

## Développement local

```bash
cp .env.example .env.local
npm install
npm run dev
```

Toutes les variables sont facultatives pour visualiser la démo. Le site indique les zones qui resteront inactives tant que les services ne seront pas configurés.

## Variables à ajouter demain

### Firebase Web App

À ajouter dans `.env.local` pour le développement local et dans les secrets/variables du futur environnement applicatif :

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Ces valeurs sont les paramètres de l'application Web Firebase. Elles ne remplacent pas les règles de sécurité Firebase. Les règles Firestore/Storage devront limiter les lectures et écritures par utilisateur, rôle et propriétaire de ressource.

### ImageKit

- `VITE_IMAGEKIT_PUBLIC_KEY`
- `VITE_IMAGEKIT_URL_ENDPOINT`
- `VITE_IMAGEKIT_AUTH_ENDPOINT`

L'endpoint d'authentification doit être servi par un backend ou une fonction serverless qui garde la clé privée ImageKit. Ne mettez jamais `IMAGEKIT_PRIVATE_KEY` dans une variable `VITE_*` ni dans GitHub Pages.

### Cloudinary

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

Utilisez uniquement un upload preset unsigned limité et dédié aux médias publics si vous uploadez directement depuis le navigateur. Pour les fichiers de projet sensibles, passez par un backend signé et gardez `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET` dans un secret manager.

### Variables serveur futures

À ne jamais ajouter à GitHub Pages : `FIREBASE_SERVICE_ACCOUNT_JSON`, `IMAGEKIT_PRIVATE_KEY`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, secrets de paiement et clés de messagerie. La version `web-static` ne fournit volontairement pas de backend sécurisé ; il faudra migrer les opérations sensibles vers un backend/serverless avant la production.

## Paiements et sécurité

Les paiements réels ne sont pas activés et aucune promesse de paiement sécurisé n'est faite dans cette démo. Avant lancement, ajouter un prestataire local avec vérification serveur des webhooks, journal d'actions, signalement, blocage, litiges, limites anti-abus et paiement par étapes. L'administration devra dépendre d'un rôle Firebase vérifié ou d'une allowlist côté serveur, pas d'une URL cachée.

## GitHub Pages et domaine personnalisé

Le workflow `.github/workflows/deploy-pages.yml` déploie automatiquement la branche `main` vers GitHub Pages. Pour un domaine personnalisé, configurez le domaine dans **Settings → Pages**, puis ajoutez les enregistrements DNS indiqués par GitHub. Le code ne contient aucun domaine réel ni certificat. Si le domaine est utilisé, ajustez également `VITE_APP_BASE_URL` dans l'environnement de build et vérifiez la base Vite si le site n'est plus servi sous `/devconnect/`.
