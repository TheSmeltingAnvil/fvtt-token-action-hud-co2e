# Token Action HUD Chroniques Oubliées 2

Token Action HUD est un HUD repositionnable lorsque des tokens sont sélectionnés.

![Downloads](https://img.shields.io/github/downloads/LionelLalande/fvtt-token-action-hud-co2e/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

---

## Contribuer au projet

Merci de votre intérêt pour contribuer à **Token Action HUD CO2e** ! Ce guide vous explique comment configurer votre
environnement de développement, travailler sur le code et soumettre vos modifications.

---

### Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :

- [Node.js](https://nodejs.org/) (`>=24.13.1`) — requis par FoundryVTT v14
- [pnpm](https://pnpm.io/) (gestionnaire de paquets utilisé par ce projet)
- [Visual Studio Code](https://code.visualstudio.com/) (recommandé pour le workflow intégré décrit ci-dessous)
- [FoundryVTT](https://foundryvtt.com/) (version 14 minimum) avec le système
  [Chroniques Oubliées 2](https://foundryvtt.com/packages/co2) installé
- Le module [Token Action HUD Core](https://foundryvtt.com/packages/token-action-hud-core) (version 2.0.0 minimum)

---

### Workflow de développement avec VS Code

Ce projet est configuré pour offrir un workflow intégré dans **Visual Studio Code**.

#### Démarrage automatique du serveur Foundry

Lors de l'ouverture du dossier dans VS Code, la tâche **"Launch Foundry"** se lance automatiquement. Elle démarre
le serveur FoundryVTT en arrière-plan via `pnpm gulp launch`. Vous n'avez rien à faire : le serveur est prêt dès
que VS Code est ouvert.

> Le serveur écoute sur le port **30000** par défaut.

#### Lancer le débogage avec F5

Une fois le serveur Foundry démarré, appuyez sur **F5** (ou utilisez le menu _Exécuter > Démarrer le débogage_) pour
lancer la configuration **"Launch in MSEdge"**. Cela effectue automatiquement :

1. Le démarrage du serveur de développement Vite (`pnpm dev`) avec rechargement à chaud sur le port **30001**
2. L'ouverture de Microsoft Edge pointant vers `http://localhost:30001`

Le rechargement à chaud est actif : toute modification du code source est recompilée et reflétée dans le navigateur
sans redémarrage manuel.

> Si vous préférez vous connecter à une session Edge déjà ouverte, utilisez la configuration **"Attach to MSEdge"**
> disponible dans le panneau _Exécuter et déboguer_.

---

### Installation de l'environnement de développement

1. **Cloner le dépôt :**

```bash
git clone https://github.com/TheSmeltingAnvil/fvtt-token-action-hud-co2e.git
cd fvtt-token-action-hud-co2e
```

1. **Installer les dépendances :**

```bash
pnpm install
```

> Après l'installation, pnpm peut afficher un avertissement indiquant que des scripts de compilation natifs ont été
> ignorés. Exécutez alors la commande suivante pour les autoriser (nécessaire notamment pour `classic-level`) :
>
> ```bash
> pnpm approve-builds
> ```

1. **Configurer FoundryVTT :**

   Renseignez les chemins vers votre installation et vos données FoundryVTT dans le fichier de configuration
   correspondant à votre système d'exploitation (sélectionné automatiquement) :
   - **Windows :** `foundryconfig.windows.json`
   - **Linux / macOS :** `foundryconfig.linux.json`

   Exemple de contenu (`foundryconfig.windows.json`) :

   ```json
   {
     "dataPath": ["C:/Users/VotreNom/AppData/Local/FoundryVTT/Data"],
     "installPath": ["C:/Program Files/FoundryVTT"]
   }
   ```

1. **Créer le lien symbolique dans FoundryVTT :**

```bash
pnpm run create:link
```

> Pour supprimer le lien : `pnpm run delete:link`

---

### Développement

Lancez le serveur de développement avec rechargement à chaud :

```bash
pnpm dev
```

Le module sera compilé automatiquement à chaque modification. Rechargez FoundryVTT dans votre navigateur pour voir les
changements.

---

### Construire pour la production

Pour générer les fichiers de distribution optimisés dans le dossier `dist/` :

```bash
pnpm build
```

---

### Qualité du code

Ce projet utilise **ESLint** pour le linting et **Prettier** pour le formatage. Avant de soumettre une pull request,
assurez-vous que votre code respecte ces règles.

- **Vérifier le style du code :**

```bash
pnpm lint
```

- **Corriger automatiquement les problèmes de lint :**

```bash
pnpm lint:fix
```

- **Formater le code :**

```bash
pnpm format
```

- **Vérifier les types TypeScript :**

```bash
pnpm typecheck
```

---

### Structure du projet

```text
src/
├── co2e/               # Logique principale du module (système CO2e)
│   ├── builder.ts      # Construction des groupes et actions du HUD
│   ├── constants.ts    # Constantes spécifiques au système
│   ├── createActionHandler.ts    # Gestionnaire d'actions
│   ├── createDefaultRollHandler.ts # Gestionnaire de jets de dés par défaut
│   ├── createDefaults.ts         # Configuration par défaut du HUD
│   ├── createSystemManager.ts    # Gestionnaire du système CO2e
│   ├── createUtils.ts            # Utilitaires
│   └── helpers.ts      # Fonctions d'aide
├── hooks/              # Hooks FoundryVTT (initialisation du module)
├── constants.ts        # Constantes globales
├── index.ts            # Point d'entrée du module
└── styles.scss         # Styles CSS du HUD

langs/
└── fr.yml              # Traductions françaises

@types/
├── co2e/               # Types TypeScript pour le système CO2e
├── fvtt-token-action-hud-core/  # Types pour Token Action HUD Core
└── tah/                # Types supplémentaires pour le HUD
```

---

### Soumettre une contribution

1. **Forkez** le dépôt et créez une branche depuis `main` :

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

1. Effectuez vos modifications en respectant les conventions de code du projet.

1. Vérifiez que le code compile et passe les vérifications :

```bash
pnpm typecheck && pnpm lint && pnpm build
```

1. **Committez** vos changements avec un message clair et descriptif.

1. **Ouvrez une Pull Request** vers la branche `main` du dépôt original en décrivant :
   - Le problème résolu ou la fonctionnalité ajoutée
   - Les éventuels effets de bord ou points d'attention

---

### Signaler un problème

Si vous rencontrez un bug ou souhaitez proposer une amélioration,
[ouvrez une issue](https://github.com/TheSmeltingAnvil/fvtt-token-action-hud-co2e/issues) sur GitHub en fournissant
autant de détails que possible :

- Version de FoundryVTT
- Version du système Chroniques Oubliées 2
- Version du module Token Action HUD Core
- Description détaillée du problème et étapes pour le reproduire
