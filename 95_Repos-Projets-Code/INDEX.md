# 95_Repos-Projets-Code

Repertoire de sources pour trouver des projets de code reutilisables : exemples complets, starters, composants, templates, outils, demos et patterns d'architecture.

## Recherche de repos

| Source | Type | Usage | Note |
| --- | --- | --- | --- |
| [GitHub Explore](https://docs.github.com/en/get-started/exploring-projects-on-github/discovering-projects-on-github) | Decouverte GitHub | Trouver projets, topics, organisations | Point de depart general. |
| [GitHub Topics](https://github.com/topics) | Index thematique | Repos par technologie ou domaine | Trier ensuite par activite recente. |
| [GitHub Search qualifiers](https://github.com/github/docs/blob/main/content/search-github/searching-on-github/searching-for-repositories.md) | Syntaxe recherche | `topic:`, `language:`, `stars:`, `pushed:`, `in:readme` | Indispensable pour filtrer proprement. |
| [Sourcegraph Code Search](https://sourcegraph.com/docs/docs/code_search) | Recherche code multi-repos | Trouver usages reels d'une API ou d'un pattern | Utile pour verifier du code en contexte. |
| [StackBlitz WebContainers](https://github.com/stackblitz/webcontainer-docs) | Runtime web | Demos Node dans navigateur, docs interactives | Pertinent pour prototypes partageables. |
| [awesome lists](https://github.com/sindresorhus/awesome) | Index communautaire | Reperer collections maintenues | Verifier chaque lien, beaucoup de bruit. |

## Sources par famille

| Famille | Sources utiles |
| --- | --- |
| UI React | shadcn/ui, Radix UI, Base UI, Motion, TanStack |
| Dashboards | Tremor, TanStack Table, Apache ECharts, Observable, D3 |
| Apps locales | Tauri, Electron, SwiftUI examples, Raycast extensions |
| Data tools | DuckDB, Datasette, Evidence.dev, Observable Framework |
| CLI tools | oclif, commander.js, Typer, Click, Cobra |
| Automations | n8n nodes, Activepieces, Trigger.dev, Temporal samples |

## Qualifier avant import

| Signal | Bon signe | Risque |
| --- | --- | --- |
| Licence | MIT, Apache-2.0, BSD claire | Licence absente, GPL/AGPL incompatible |
| Maintenance | Commits/release recents, issues traitees | Dernier commit ancien, issues critiques ouvertes |
| Taille | Peu de dependances, code lisible | Stack massive pour un petit besoin |
| Qualite | Tests, CI, docs, exemples | Demo seule, pas de test, code minifie |
| Integration | API claire, composants isoles | Couplage fort a un theme ou backend |

## Requetes utiles

| Besoin | Requete |
| --- | --- |
| Projet recent maintenu | `topic:dashboard language:typescript stars:>500 pushed:>2026-01-01` |
| Exemple API | `"useQuery" "TanStack" language:TypeScript pushed:>2026-01-01` |
| Starter local app | `topic:tauri language:typescript stars:>100 pushed:>2026-01-01` |
| Agent code | `topic:ai-agent topic:developer-tools stars:>1000 pushed:>2026-01-01` |
| Scraper Python | `topic:web-scraping language:python stars:>500 pushed:>2026-01-01` |
