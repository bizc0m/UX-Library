# Sources de code, effets et inspirations UI

Liste de depots et plateformes ou recuperer des effets, composants, animations et references de code. Avant import dans Nyx ou un dashboard, verifier la licence, les dependances, la performance, l'accessibilite et la compatibilite avec le projet.

## Priorite 1 - Effets front-end directement reutilisables

| Source | Type | Usage | Note |
| --- | --- | --- | --- |
| [CodePen](https://codepen.io/) | Plateforme HTML/CSS/JS | Effets rapides, prototypes, micro-interactions, tests isoles | Ideal pour capturer une idee, pas pour importer sans revue. |
| [CodePen Docs - Pens](https://blog.codepen.io/docs/pens/) | Documentation | Comprendre comment structurer un Pen, fichiers, blocks, deploiement | Utile pour normaliser les fiches `EFFECT-XXX`. |
| [CodePen Embeds](https://blog.codepen.io/docs/embeds/) | Documentation | Integrer un Pen en preview dans une doc ou un dashboard | Preferer `click-to-load` si la page devient lourde. |
| [Codrops](https://tympanus.net/codrops/) | Demos et tutoriels creatifs | Transitions, WebGL, GSAP, layouts experimentaux | Tres bon pour inspiration avancee ; verifier licence et poids. |
| [Uiverse](https://uiverse.io/) | Bibliotheque UI open source | Boutons, toggles, loaders, inputs, cards HTML/CSS/React/Tailwind | Bon vivier pour composants atomiques. |
| [Motion](https://motion.dev/) | Librairie animation | React, JS, Vue ; gestures, layout animations, scroll | Ancien Framer Motion ; bon choix pour animations produit. |
| [GSAP](https://gsap.com/) | Librairie animation | Timelines complexes, scroll, transitions choregraphiees | Puissant ; a garder pour effets qui justifient la complexite. |
| [Three.js](https://threejs.org/) | 3D/WebGL | Fonds interactifs, scenes 3D, visualisations | A reserver aux usages ou la 3D apporte une vraie lecture. |
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth scroll | Scroll fluide controle | Verifier l'accessibilite et l'effet sur la navigation clavier. |

## Priorite 2 - Repos GitHub de composants et effets

| Repo | Type | Usage | Note |
| --- | --- | --- | --- |
| [itsjwill/motion-primitives-website](https://github.com/itsjwill/motion-primitives-website) | React / Next.js / Framer Motion / GSAP / Three.js | Dock, spotlight cards, glass, scroll, 3D, chat UI | Bon pour Nyx si on extrait les patterns au lieu de copier tout le stack. |
| [motiondivision/motion](https://github.com/motiondivision/motion) | Librairie animation officielle | Base animation React/JS/Vue | Source de reference technique pour Motion. |
| [greensock/GSAP](https://github.com/greensock/GSAP) | Librairie animation | Timelines et effets complexes | Verifier la licence selon usage. |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | React renderer pour Three.js | 3D dans React | Pertinent si Nyx passe par React. |
| [pmndrs/drei](https://github.com/pmndrs/drei) | Helpers React Three Fiber | Camera, controls, loaders, abstractions 3D | Utile mais peut grossir le projet. |
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) | Scroll | Smooth scrolling | A tester avec `prefers-reduced-motion`. |
| [lottiefiles/lottie-web](https://github.com/airbnb/lottie-web) | Animations vectorielles | Animations UI exportees depuis After Effects | Bien pour loaders/status si les fichiers restent legers. |
| [rive-app/rive-wasm](https://github.com/rive-app/rive-wasm) | Animations interactives | UI animee, etats, illustrations interactives | Puissant mais dependance runtime a evaluer. |

## Priorite 3 - Design systems et bibliotheques utiles

| Source | Type | Usage | Note |
| --- | --- | --- | --- |
| [shadcn/ui](https://ui.shadcn.com/) | Composants React copiables | Base propre pour composants dashboard | Pas une librairie installee classique ; code a adapter. |
| [Radix UI](https://www.radix-ui.com/) | Primitives accessibles | Dialog, tabs, popover, select, tooltip | Bon socle pour interactions robustes. |
| [Base UI](https://base-ui.com/) | Primitives React | Composants headless accessibles | Alternative moderne pour UI complexe. |
| [Material Design](https://m3.material.io/) | Guidelines et composants | Comportements UI, etats, tokens | Source de decision plus que depot d'effets. |
| [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) | Guidelines | Effets macOS, sidebar, toolbar, permissions | Utile pour Nyx si vise sensation native. |
| [GOV.UK Design System](https://design-system.service.gov.uk/) | Design system public | Formulaires, erreurs, navigation, contenu clair | Peu spectaculaire, tres fiable pour UX. |

## Priorite 4 - Inspiration technique avancee

| Source | Type | Usage | Note |
| --- | --- | --- | --- |
| [ShaderToy](https://www.shadertoy.com/) | Shaders GLSL | Fonds, noise, distortion, glow, procedural | Ne pas importer sans optimisation et fallback. |
| [The Book of Shaders](https://thebookofshaders.com/) | Apprentissage shaders | Comprendre et adapter les shaders | Reference pedagogique. |
| [Observable](https://observablehq.com/) | Notebooks dataviz | Prototypes data et interactions graphiques | Bon pour explorer avant implementation. |
| [D3 Gallery](https://observablehq.com/@d3/gallery) | D3 exemples | Graphiques, transitions, data interaction | A utiliser si les donnees justifient D3. |
| [CodyHouse](https://codyhouse.co/) | UI patterns / snippets | Composants HTML/CSS/JS | Verifier les conditions de licence. |

## OpenCode et outils de code

| Source | Type | Usage | Note |
| --- | --- | --- | --- |
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | Agent de code open source | Automatisation, lecture repo, assistance dev | Repo actif a privilegier pour OpenCode. |
| [opencode-ai/opencode](https://github.com/opencode-ai/opencode) | Ancien repo OpenCode | Reference historique | Archive en lecture seule depuis 2025 ; ne pas prendre comme source active. |
| [Sourcegraph](https://sourcegraph.com/search) | Recherche de code | Trouver exemples reels dans repos publics | Utile pour verifier comment une API est employee en production. |
| [GitHub Topics - animation](https://github.com/topics/animation) | Index GitHub | Rechercher repos animation | Trier par maintenance recente. |
| [GitHub Topics - ui-components](https://github.com/topics/ui-components) | Index GitHub | Rechercher bibliotheques UI | Verifier issues, releases, licence. |
| [GitHub Topics - codepen](https://github.com/topics/codepen) | Index GitHub | Trouver collections de Pens exportes | Qualite tres variable. |

Les sources agents, scraping et recherche de projets sont maintenant detaillees dans [93_Agents-LLM](../93_Agents-LLM/INDEX.md), [94_Scraping-Crawlers](../94_Scraping-Crawlers/INDEX.md), [95_Repos-Projets-Code](../95_Repos-Projets-Code/INDEX.md) et [96_Queries-Recherche](../96_Queries-Recherche/INDEX.md).

## Requetes de recherche utiles

| Besoin | Requete |
| --- | --- |
| Effets panels Nyx | `site:codepen.io split panel resize collapse dashboard css js` |
| Tabs animees | `site:codepen.io animated tabs indicator vanilla js` |
| Command palette | `github command palette react radix cmdk` |
| Glass macOS | `codepen glassmorphism macos sidebar css` |
| Spotlight cards | `github spotlight card react motion` |
| Data hover | `codepen dashboard chart tooltip interaction` |
| Reduced motion | `github animation prefers-reduced-motion react` |

## Regle d'import

Pour chaque effet retenu :

- Creer une fiche `EFFECT-XXX-nom.md`.
- Garder le lien source original.
- Noter licence et dependances.
- Decrire l'usage projet avant le code.
- Tester clavier, mobile, performance et `prefers-reduced-motion`.
- Mettre en `90_Approved/` seulement apres adaptation reelle.
