# Kaisse

PWA de caisse (POS) premium pour fastfoods, pensee pour tablette. MVP avec
panier temps reel, impression de ticket ESC/POS via Bluetooth, admin
produits/categories, et historique des ventes.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (tokens via `@theme` dans `src/styles/index.css`)
- Zustand pour le state (panier, session admin, UI)
- Web Bluetooth API + encodage ESC/POS maison pour l'impression 58mm
- PWA via `vite-plugin-pwa` (manifest + service worker, installable sur tablette)
- Donnees mockees en memoire (persistees en `localStorage`), isolees derriere
  une couche `services/` prete a etre branchee sur Supabase

## Multi-fastfood (multi-tenant)

Kaisse gere plusieurs fastfoods dans une seule appli :

- **`/select`** — ecran d'entree : on choisit son fastfood (carte avec logo/couleur), puis on entre son **code PIN** (4-6 chiffres). Ce PIN debloque a la fois la caisse et l'admin de ce fastfood pour la session — ce n'est pas un compte par caissier, mais un code par enseigne.
- **`/owner`** — espace proprietaire (mot de passe separe, par defaut `kaisse-owner-2026` dans `mockStorage.ts`) pour creer/modifier/supprimer des fastfoods : nom, PIN, couleur de marque, logo, adresse, telephone, message de ticket.
- Chaque fastfood a ses propres produits, categories et commandes (isolation par `restaurantId`), et sa propre couleur d'accent appliquee automatiquement dans toute l'interface et sur le ticket (`useBranding`).
- Deux fastfoods de demo sont pre-remplis : **Chez Kaisse** (PIN `1234`) et **Ndogou Express** (PIN `5678`).
- "Changer de fastfood" (visible dans l'admin) revient a l'ecran de selection.

## Demarrage

```bash
npm install
npm run dev       # serveur de dev, http://localhost:5173
npm run build     # build de prod dans dist/
npm run preview   # sert le build de prod localement
```

## Architecture des donnees / branchement Supabase futur

Toute la donnee transite par `src/services/` :

- `services/types.ts` — types partages (`Product`, `Category`, `Order`,
  `OrderItem`, `Settings`, `CartLine`) qui refletent deja le futur schema
  Supabase.
- `services/productService.ts`, `categoryService.ts`, `orderService.ts`,
  `settingsService.ts` — chacun exporte une **interface** (le contrat) et une
  implementation mock actuelle (`mockProductService`, etc.).
- `services/mock/` — la "base de donnees" en memoire (persistee en
  `localStorage` pour survivre a un rechargement de tablette) + les donnees
  de demarrage (`mockData.ts`).
- `services/index.ts` — **seul point d'injection** : c'est le seul fichier a
  modifier pour brancher Supabase. Creez `services/supabase/productService.ts`
  (etc.) qui implemente la meme interface, puis remplacez l'export ici.
  Aucun composant ni page n'importe jamais `services/mock/*` directement.

Aucun changement n'est necessaire ailleurs dans l'app pour ce branchement.

## Impression Bluetooth (ESC/POS, imprimante 58mm)

- `src/printing/bluetoothPrinter.ts` — connexion Web Bluetooth (GATT) et
  ecriture par chunks. Les UUID de service/caracteristique utilises
  (`000018f0-...` / `00002af1-...`) correspondent aux imprimantes
  thermiques BLE bon marche les plus courantes (clones Xprinter/GOOJPRT).
  Si votre imprimante utilise d'autres UUID, ajustez les constantes en
  haut du fichier.
- `src/printing/escposEncoder.ts` — petit builder de commandes ESC/POS
  (init, alignement, gras, double taille, saut de ligne, coupe papier).
- `src/printing/receiptFormatter.ts` — transforme une commande + les
  reglages en octets ESC/POS prets a imprimer.
- Fallback : si le Bluetooth n'est pas disponible/connecte, le ticket est
  simplement affiche a l'ecran via `ReceiptCard` — rien ne bloque la vente.
- Web Bluetooth necessite HTTPS (ou `localhost`) et n'est disponible que
  sur les navigateurs bases Chromium (Chrome/Edge Android). Non supporte
  sur Safari/iOS — c'est une limitation de la plateforme, pas de l'app.

## Fonctionnalites

1. **Caisse** (`/`) — grille produits par categorie, panier flottant temps
   reel (desktop : panneau lateral, mobile : barre + feuille modale),
   validation -> ticket ecran + impression Bluetooth.
2. **Admin** (`/admin/*`, protege par mot de passe) — CRUD produits, CRUD
   categories, reglages du fastfood et du ticket.
3. **Historique** (`/history`) — liste des commandes du jour, filtrable
   jour par jour, total du jour affiche.

## Roadmap suggeree (post-MVP)

- Brancher Supabase (auth reelle, tables `products`/`categories`/`orders`/
  `order_items`/`settings`, realtime si multi-caisse).
- Upload d'image produit (actuellement URL texte uniquement).
- Roles admin multiples avec vrai systeme d'authentification.
- Rapports/graphiques sur l'historique (actuellement liste simple, comme
  demande pour le MVP).
