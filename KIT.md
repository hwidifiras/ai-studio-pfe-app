# SmartSocial PME - Kit de Composants React + Tailwind

Ce document définit les standards et la structure du kit de composants pour l'application SmartSocial PME.

## 1. Arborescence du Projet

```text
src/
├── components/
│   ├── kit/                # Primitives et Patterns du Design System
│   │   ├── Patterns.tsx    # PageHeader, EmptyState, LoadingOverlay
│   │   └── Examples.tsx    # Exemples d'utilisation détaillés
│   ├── ui/                 # Composants atomiques (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── features/           # Composants métiers par domaine
│   │   ├── dashboard/      # StatsCards, ActivityFeed
│   │   ├── publications/   # PostComposer, PostPreview, CalendarGrid
│   │   ├── inbox/          # ThreadList, MessagePane, ReplyZone
│   │   ├── analytics/      # PerformanceCharts, EngagementTable
│   │   └── ia/             # AiAssistant, AiPolicyEditor, KnowledgeBase
├── lib/                    # Utilitaires et configuration
│   └── utils.ts            # Helper cn() pour Tailwind
├── types.ts                # Types et Interfaces partagés
└── App.tsx                 # Point d'entrée et Layout principal
```

## 2. Conventions de Nommage

- **Composants** : `PascalCase` (ex: `PostComposer.tsx`).
- **Fichiers non-composants** : `kebab-case` (ex: `api-service.ts`).
- **Interfaces de Props** : Suffixe `Props` (ex: `interface PostComposerProps`).
- **Types Partagés** : Définis dans `src/types.ts` pour une réutilisation maximale.
- **Variants Tailwind** : Utilisation de `cva` (Class Variance Authority) pour les composants atomiques.

## 3. Interfaces TypeScript des Composants Principaux

### PageHeader
```typescript
interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}
```

### PostComposer
```typescript
interface PostComposerProps {
  role: UserRole;
  initialData?: Partial<Post>;
  onSave: (post: Post) => Promise<void>;
  onPublish: (post: Post) => Promise<void>;
}
```

### InboxThreadList
```typescript
interface InboxThreadListProps {
  threads: Thread[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading?: boolean;
  filters: {
    channel?: ChannelType;
    status?: InboxStatus;
  };
}
```

### CalendarGrid
```typescript
interface CalendarGridProps {
  posts: Post[];
  currentDate: Date;
  onDateClick: (date: Date) => void;
  onPostClick: (post: Post) => void;
}
```

## 4. Exemples d'Utilisation Détaillés

### A. Composeur (Formulaire + Toolbar + Preview)
```tsx
<PostComposer 
  role="agent"
  onSave={async (post) => console.log("Sauvegardé", post)}
  onPublish={async (post) => console.log("Publié", post)}
/>
// État: Gère localement le texte, les médias et la sélection FB/LI.
```

### B. Inbox (Filtres + Liste + Conversation)
```tsx
<div className="flex gap-4">
  <InboxThreadList 
    threads={mockThreads}
    onSelect={(id) => setSelectedThread(id)}
    filters={{ channel: 'facebook' }}
  />
  <MessagePane threadId={selectedThread} />
</div>
// État: Synchronisé via onSelect pour charger les messages du thread.
```

### C. Calendrier (Grille + Navigation)
```tsx
<CalendarGrid 
  posts={scheduledPosts}
  currentDate={new Date()}
  onPostClick={(post) => openEditDrawer(post)}
/>
// État: Affiche les posts selon leur date de planification.
```

## 5. Mapping Composant → API MVP

| Composant | Méthode | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `PostComposer` | POST | `/orgs/:orgId/posts` | Création de post FB/LI |
| `InboxThreadList` | GET | `/orgs/:orgId/inbox/threads` | Liste des conversations |
| `AiAssistant` | POST | `/orgs/:orgId/ai/generate` | Génération de contenu |
| `AiPolicyEditor` | PATCH | `/orgs/:orgId/ai/policies` | Config seuils/horaires |
| `AnalyticsSummary` | GET | `/orgs/:orgId/analytics/summary` | Stats Dashboard |

## 6. Checklist de Conformité & Non-Régression

### Conformité Binaire
- [PASS] **Labels FR** : Aucun texte anglais résiduel (ex: "Submit" -> "Envoyer").
- [PASS] **Scope Canaux** : Uniquement FB/LI. Instagram est en "Coming Soon".
- [PASS] **RBAC** : Les agents ne voient pas les boutons de config système.
- [PASS] **Accessibilité** : Focus visible et navigation clavier sur les boutons.
- [PASS] **États UI** : Présence systématique de `Loading` et `Empty`.

### Règles de Non-Régression
- Ne pas modifier la signature de `cn()` dans `utils.ts`.
- Ne pas introduire de dépendances circulaires entre `features/`.
- Toute modification de `src/types.ts` doit être rétrocompatible.
- Les composants `ui/primitives` ne doivent jamais contenir de logique métier.
