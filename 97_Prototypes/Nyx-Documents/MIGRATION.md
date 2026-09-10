# Direction Nyx2 retenue

## Cible

Unifier progressivement Nyx, Dashboard et NoteCortex en conservant les fonctions utiles et les données. Nyx2 sera la version unifiée après validation, pas le nom d’une intégration déjà réalisée.

- Design blanc NoteCortex, explorateur Nyx conservé.
- Une Blade par onglet ; plusieurs instances et panneaux côte à côte.
- Divisions horizontales/verticales, déplacement, fenêtres détachables et dispositions par activité.
- Interface commune pour TXT, Markdown et notes NotePlan, avec provenance explicite.
- Préserver agenda, cartouche, prompts, queue, priorisation, suivi du temps, captures, filtres et archives.
- Restaurer documents, sélections et positions. Les choix manuels restent prioritaires ; pas de réorganisation pendant la saisie.

## Git et état réel

Direction discutée : une branche `migration` dans chacun des dépôts Nyx, Dashboard et NoteCortex. Ces branches ne sont pas créées par cette sauvegarde UX-Library. Les dépôts sources ne sont pas modifiés ; aucune fusion native n’est réalisée ici.

## Étapes restantes

1. Identifier et auditer les trois dépôts et leurs fonctions réellement disponibles.
2. Créer les branches migration dans des environnements isolés en préservant les travaux existants.
3. Définir le contrat commun des Blades, documents, fenêtres et sessions.
4. Intégrer une tranche native testable : explorateur → ouverture de notes → panneaux → sauvegarde et restauration.
5. Réintégrer les outils et vérifier chaque parcours avant promotion vers Nyx2.

## Critères de validation

Aucune perte de texte ou métadonnée, aucune écriture implicite dans un coffre, conservation du contexte lors des déplacements, restauration sur plusieurs écrans, accès clavier, tailles minimales lisibles et traitement explicite des erreurs.
