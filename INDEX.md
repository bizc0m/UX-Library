# UX-Library — Catalogue transversal UX/UI

Version 1.0 · Revue documentaire du 7 septembre 2026.

**48 fiches, 4 patterns projets, 19 dossiers renseignés, 1 répertoire effets CodePen.** Socle documentaire utilisable pour concevoir et auditer ; aucune application n’a été certifiée ou testée à travers ce catalogue.

## Commencer par une tâche

- Concevoir un formulaire : UX-013 à UX-015, UX-019, UX-038, UX-048.
- Construire une liste filtrable : UX-016 à UX-018, UX-021, UX-033, UX-039.
- Vérifier une interface au clavier et au zoom : UX-011, UX-012, UX-023 à UX-027.
- Concevoir un dashboard : UX-028 à UX-033, UX-044.
- Préparer l’entrée dans une application : UX-040 à UX-042, UX-046, UX-047.

Choisir les fiches pertinentes, adapter l’exemple aux données du projet, exécuter la checklist et consigner le résultat avec le [template de recette](99_Templates/RECETTE-UX.md). Les cases des fiches sont des tests à réaliser, pas des tests déjà passés.

## Sections

- [00_Principes](00_Principes/INDEX.md)
- [01_Navigation](01_Navigation/INDEX.md)
- [02_Architecture-Information](02_Architecture-Information/INDEX.md)
- [03_Interactions](03_Interactions/INDEX.md)
- [04_Formulaires](04_Formulaires/INDEX.md)
- [05_Recherche-Filtres](05_Recherche-Filtres/INDEX.md)
- [06_Feedback-Etats-Erreurs](06_Feedback-Etats-Erreurs/INDEX.md)
- [07_Mobile-Responsive](07_Mobile-Responsive/INDEX.md)
- [08_Accessibilite](08_Accessibilite/INDEX.md)
- [09_DataViz](09_DataViz/INDEX.md)
- [10_Dashboards](10_Dashboards/INDEX.md)
- [11_Design-System](11_Design-System/INDEX.md)
- [12_AntiPatterns](12_AntiPatterns/INDEX.md)
- [13_Onboarding](13_Onboarding/INDEX.md)
- [14_Performance-Perception](14_Performance-Perception/INDEX.md)
- [15_Confiance-Securite](15_Confiance-Securite/INDEX.md)
- [90_Patterns-Projets](90_Patterns-Projets/INDEX.md)
- [91_References-Sources](91_References-Sources/INDEX.md)
- [92_Effets-CodePen](92_Effets-CodePen/INDEX.md)
- [99_Templates](99_Templates/INDEX.md)

## Toutes les fiches

| ID | Bonne pratique | Section | Source |
| --- | --- | --- | --- |
| [UX-001](00_Principes/UX-001.md) | Employer le vocabulaire de la tâche | 00_Principes | [N01](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| [UX-002](00_Principes/UX-002.md) | Révéler les options avancées à la demande | 00_Principes | [N02](https://www.nngroup.com/articles/progressive-disclosure/) |
| [UX-003](00_Principes/UX-003.md) | Observer une tâche avant de valider le design | 00_Principes | [N03](https://www.nngroup.com/articles/usability-testing-101/) |
| [UX-004](01_Navigation/UX-004.md) | Situer une page avec un fil d’Ariane | 01_Navigation | [N04](https://www.nngroup.com/articles/breadcrumbs/) |
| [UX-005](01_Navigation/UX-005.md) | Réserver les onglets à des panneaux liés | 01_Navigation | [W13](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) |
| [UX-006](01_Navigation/UX-006.md) | Accompagner les icônes ambiguës d’un libellé | 01_Navigation | [N05](https://www.nngroup.com/articles/icon-usability/) |
| [UX-007](02_Architecture-Information/UX-007.md) | Construire les catégories avec les modèles mentaux | 02_Architecture-Information | [N06](https://www.nngroup.com/articles/card-sorting-definition/) |
| [UX-008](02_Architecture-Information/UX-008.md) | Donner aux titres une fonction de repérage | 02_Architecture-Information | [W01](https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html) |
| [UX-009](02_Architecture-Information/UX-009.md) | Utiliser un tableau pour comparer des valeurs | 02_Architecture-Information | [G05](https://design-system.service.gov.uk/components/table/) |
| [UX-010](03_Interactions/UX-010.md) | Nommer le résultat du bouton | 03_Interactions | [G01](https://design-system.service.gov.uk/components/button/) |
| [UX-011](03_Interactions/UX-011.md) | Gérer entièrement le focus d’une modale | 03_Interactions | [W12](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| [UX-012](03_Interactions/UX-012.md) | Proposer une alternative au glisser-déposer | 03_Interactions | [W02](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) |
| [UX-013](04_Formulaires/UX-013.md) | Garder un label visible pendant la saisie | 04_Formulaires | [G02](https://design-system.service.gov.uk/components/text-input/) |
| [UX-014](04_Formulaires/UX-014.md) | Distinguer choix unique et choix multiples | 04_Formulaires | [G03](https://design-system.service.gov.uk/components/checkboxes/) |
| [UX-015](04_Formulaires/UX-015.md) | Permettre la relecture avant envoi | 04_Formulaires | [G10](https://design-system.service.gov.uk/patterns/check-answers/) |
| [UX-016](05_Recherche-Filtres/UX-016.md) | Rendre la recherche visible et son périmètre clair | 05_Recherche-Filtres | [N07](https://www.nngroup.com/articles/search-visible-and-simple/) |
| [UX-017](05_Recherche-Filtres/UX-017.md) | Afficher les filtres actifs et leur retrait | 05_Recherche-Filtres | [B01](https://baymard.com/blog/how-to-design-applied-filters) |
| [UX-018](05_Recherche-Filtres/UX-018.md) | Rendre la logique des filtres prévisible | 05_Recherche-Filtres | [B02](https://baymard.com/blog/allow-applying-of-multiple-filter-values) |
| [UX-019](06_Feedback-Etats-Erreurs/UX-019.md) | Relier les erreurs au champ à corriger | 06_Feedback-Etats-Erreurs | [G04](https://design-system.service.gov.uk/components/error-summary/) |
| [UX-020](06_Feedback-Etats-Erreurs/UX-020.md) | Annoncer les mises à jour sans voler le focus | 06_Feedback-Etats-Erreurs | [W03](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) |
| [UX-021](06_Feedback-Etats-Erreurs/UX-021.md) | Distinguer vide initial, aucun résultat et erreur | 06_Feedback-Etats-Erreurs | [N08](https://www.nngroup.com/articles/empty-state-interface-design/) |
| [UX-022](07_Mobile-Responsive/UX-022.md) | Adapter la disposition à la fenêtre disponible | 07_Mobile-Responsive | [M01](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes) |
| [UX-023](07_Mobile-Responsive/UX-023.md) | Permettre le reflow au zoom | 07_Mobile-Responsive | [W04](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) |
| [UX-024](07_Mobile-Responsive/UX-024.md) | Dimensionner les cibles au-delà du seul pictogramme | 07_Mobile-Responsive | [W05](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |
| [UX-025](08_Accessibilite/UX-025.md) | Contraster le texte selon sa taille | 08_Accessibilite | [W06](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| [UX-026](08_Accessibilite/UX-026.md) | Accomplir la tâche au clavier | 08_Accessibilite | [W07](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) |
| [UX-027](08_Accessibilite/UX-027.md) | Maintenir le focus visible malgré les éléments fixes | 08_Accessibilite | [W08](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) |
| [UX-028](09_DataViz/UX-028.md) | Choisir une forme qui facilite la comparaison | 09_DataViz | [N09](https://www.nngroup.com/articles/dashboards-preattentive/) |
| [UX-029](09_DataViz/UX-029.md) | Rendre les graphiques compréhensibles sans image | 09_DataViz | [W14](https://www.w3.org/WAI/tutorials/images/complex/) |
| [UX-030](09_DataViz/UX-030.md) | Documenter le sens d’une mesure | 09_DataViz | [N10](https://www.nngroup.com/articles/complex-application-design/) |
| [UX-031](10_Dashboards/UX-031.md) | Relier le dashboard à une décision | 10_Dashboards | [N09](https://www.nngroup.com/articles/dashboards-preattentive/) |
| [UX-032](10_Dashboards/UX-032.md) | Afficher le périmètre et la fraîcheur des données | 10_Dashboards | [N01](https://www.nngroup.com/articles/ten-usability-heuristics/) |
| [UX-033](10_Dashboards/UX-033.md) | Conserver le contexte entre synthèse et détail | 10_Dashboards | [N10](https://www.nngroup.com/articles/complex-application-design/) |
| [UX-034](11_Design-System/UX-034.md) | Nommer les couleurs par leur rôle | 11_Design-System | [G13](https://design-system.service.gov.uk/styles/colour/) |
| [UX-035](11_Design-System/UX-035.md) | Admettre un composant sur preuve d’utilité | 11_Design-System | [G14](https://design-system.service.gov.uk/community/contribution-criteria/) |
| [UX-036](11_Design-System/UX-036.md) | Documenter quand éviter un composant | 11_Design-System | [G09](https://design-system.service.gov.uk/components/accordion/) |
| [UX-037](12_AntiPatterns/UX-037.md) | Éviter les choix trompeurs | 12_AntiPatterns | [D01](https://deceptive.design/types/) |
| [UX-038](12_AntiPatterns/UX-038.md) | Éviter les saisies répétées dans un même processus | 12_AntiPatterns | [W09](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) |
| [UX-039](12_AntiPatterns/UX-039.md) | Éviter un défilement infini qui piège le parcours | 12_AntiPatterns | [G06](https://design-system.service.gov.uk/components/pagination/) |
| [UX-040](13_Onboarding/UX-040.md) | Rendre l’introduction brève et facultative | 13_Onboarding | [A01](https://developer.apple.com/design/human-interface-guidelines/onboarding?changes=_1_1) |
| [UX-041](13_Onboarding/UX-041.md) | Placer l’aide secondaire près de la difficulté | 13_Onboarding | [G07](https://design-system.service.gov.uk/components/details/) |
| [UX-042](13_Onboarding/UX-042.md) | Confirmer l’accomplissement et la suite | 13_Onboarding | [G11](https://design-system.service.gov.uk/patterns/confirmation-pages/) |
| [UX-043](14_Performance-Perception/UX-043.md) | Adapter le feedback à la durée perçue | 14_Performance-Perception | [N11](https://www.nngroup.com/articles/response-times-3-important-limits/) |
| [UX-044](14_Performance-Perception/UX-044.md) | Mesurer chargement, réactivité et stabilité | 14_Performance-Perception | [P01](https://web.dev/articles/vitals) |
| [UX-045](14_Performance-Perception/UX-045.md) | Réserver la place des contenus différés | 14_Performance-Perception | [P02](https://web.dev/articles/cls) |
| [UX-046](15_Confiance-Securite/UX-046.md) | Demander une permission au moment du besoin | 15_Confiance-Securite | [A02](https://developer.apple.com/design/human-interface-guidelines/privacy?changes=_10_7) |
| [UX-047](15_Confiance-Securite/UX-047.md) | Permettre une authentification sans épreuve cognitive imposée | 15_Confiance-Securite | [W10](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) |
| [UX-048](15_Confiance-Securite/UX-048.md) | Prévenir les erreurs aux conséquences importantes | 15_Confiance-Securite | [W11](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) |

## Recherche et synonymes

| Chercher aussi | Fiches |
| --- | --- |
| loading, attente, spinner, latence | UX-043, UX-044, UX-045 |
| empty state, zéro résultat, aucune donnée | UX-021, UX-030 |
| focus, clavier, modale, dialog | UX-011, UX-026, UX-027 |
| touch target, cible tactile, taille bouton | UX-024 |
| chips, facettes, ET, OU, filtres | UX-017, UX-018 |
| onboarding, première utilisation, aide | UX-040, UX-041, UX-042 |
| dark patterns, consentement, permission | UX-037, UX-046 |
| accessibilité, WCAG, contraste, zoom | UX-023 à UX-027, UX-047 |
| design tokens, composants, réutilisation | UX-034 à UX-036 |
| KPI, métrique, provenance, dashboard | UX-028 à UX-033 |
| CodePen, effets, micro-interactions, thèmes, animations | 92_Effets-CodePen, UX-011, UX-020, UX-027, UX-043 à UX-045 |

## Usage et limites

Sources primaires et professionnelles : W3C/WAI, Nielsen Norman Group, GOV.UK, Apple HIG, Google Android/Material, Baymard et web.dev. Les références sont datées, les recommandations reformulées, les exemples originaux. Voir le [registre détaillé](91_References-Sources/INDEX.md) et la [méthode](91_References-Sources/METHODE.md), notamment les limites Apple et Material.

L’architecture est reprise exactement de la conversation « Dossier bibliothèque UX ». La copie livrée est préparée dans les sorties de la tâche. La Library utilisateur et ses éventuels contenus existants n’ont pas été localisés : aucun remplacement, import ou contrôle de doublons avec cette destination ne peut être affirmé.

Le catalogue est un socle, pas une encyclopédie de toutes les situations UX ni une certification 8/10. Les patterns Nyx, GroceryNanny, KountR et Mirae sont des propositions de recette, sans audit du code ou des données de ces applications.
