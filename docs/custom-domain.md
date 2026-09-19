# Domaine personnalisé ONE-X Dev

Le site est actuellement publié à l’adresse `https://elkalebanquier-eng.github.io/devconnect/`. Cette adresse fonctionne, mais Google affichera naturellement GitHub dans le résultat tant qu’aucun domaine personnalisé n’est connecté.

## Quand un domaine sera acheté

1. Ajouter le domaine dans **GitHub → Settings → Pages → Custom domain**.
2. Créer les enregistrements DNS indiqués par GitHub chez le registrar du domaine.
3. Ajouter le domaine personnalisé dans **Firebase Authentication → Settings → Authorized domains**.
4. Remplacer l’URL du sitemap dans `client/public/sitemap.xml` par le nouveau domaine.
5. Ajouter l’URL canonique et les URLs Open Graph du nouveau domaine dans `client/index.html`.
6. Enregistrer le nouveau domaine dans Google Search Console et demander l’indexation.
7. Activer HTTPS dans GitHub Pages après propagation DNS.

Ne pas ajouter un fichier `CNAME` avant de connaître le domaine exact. Un `CNAME` incorrect peut rendre le déploiement inaccessible.
