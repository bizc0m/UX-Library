# UX-Library

**[Sélecteur des applications et interfaces — fichiers réels, aperçus et composeur](98-Selecteur-UX/README.md)** · 39 familles / 211 références.


Bibliothèque transversale de bonnes pratiques UX/UI pour concevoir et auditer les parcours de différents projets.

## Entrées principales

- [Catalogue complet et recherche par tâche](INDEX.md)
- [Registre des sources](91_References-Sources/INDEX.md)
- [Méthode, niveaux de confiance et déduplication](91_References-Sources/METHODE.md)
- [Relevé de vérification documentaire](91_References-Sources/VERIFICATION.json)
- [Template de fiche de bonne pratique](99_Templates/FICHE-BP.md)
- [Template de recette UX](99_Templates/RECETTE-UX.md)

## Contenu

Le socle comprend **48 fiches UX**, **5 patterns projets (4 propositions et 1 design documenté)** et **19 sections UX**, avec problèmes, règles, explications, actions, exceptions, exemples originaux, checklists et sources.

Les sections `00` à `15` couvrent les principes, la navigation, l’architecture de l’information, les interactions, les formulaires, la recherche et les filtres, les états et erreurs, le responsive, l’accessibilité, la visualisation de données, les dashboards, les design systems, les anti-patterns, l’onboarding, la performance perçue et la confiance.

- [90 — Patterns projets](90_Patterns-Projets/INDEX.md)
- [91 — Références et sources](91_References-Sources/INDEX.md)
- [99 — Templates](99_Templates/INDEX.md)

Des répertoires complémentaires recensent aussi des ressources techniques :

- [92 — Effets CodePen et sources de code](92_Effets-CodePen/INDEX.md)
- [93 — Agents et LLM](93_Agents-LLM/INDEX.md)
- [94 — Scraping et crawlers](94_Scraping-Crawlers/INDEX.md)
- [95 — Dépôts et projets de code](95_Repos-Projets-Code/INDEX.md)
- [96 — Requêtes de recherche](96_Queries-Recherche/INDEX.md)

Design de référence : [NoteCortex — cockpit blanc](90_Patterns-Projets/PAT-005.md), avec capture, mécaniques repérées et liens vers le code.

## Prototype multi-documents

[Nyx Documents](97_Prototypes/Nyx-Documents/README.md) : prototype HTML, sources, tests de logique, maquettes et direction de migration vers Nyx2. Validation des gestes dans le navigateur encore incomplète.

## Utilisation

1. Choisir un parcours dans l’index et lire les fiches associées.
2. Vérifier le périmètre, les exceptions et les sources avant adaptation.
3. Adapter les exemples au projet et réaliser les vérifications de la checklist.
4. Consigner les résultats observés et leurs limites avec le template de recette UX.

Avant tout ajout, rechercher une fiche équivalente dans l’index. Conserver les identifiants stables, les liens de provenance et la date de consultation ; distinguer recommandation sourcée, hypothèse et résultat de test.

## Provenance et limites

Ce dépôt reprend le catalogue produit dans le Work associé à la conversation « Dossier bibliothèque UX ». La revue documentaire du socle est datée du **7 septembre 2026** ; les dates et statuts de consultation figurent dans les fiches et le registre. La publication Git ne constitue pas une nouvelle vérification des sources.

Les checklists décrivent des tests à réaliser. Quatre patterns projets sont des propositions ; la fiche NoteCortex documente une capture et du code lu. Aucune fiche ne prouve la conformité ou le fonctionnement testé des applications concernées. Les ressources tierces restent soumises à leurs propres licences et conditions ; leur référencement ne vaut pas autorisation de réutiliser leur code ou contenu.

Le catalogue est conservé dans un dépôt dédié : [bizc0m/UX-Library](https://github.com/bizc0m/UX-Library).
