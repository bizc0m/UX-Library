# Reprise de Nyx Blanc avec OpenCode

## Cible

Continuer le travail sur Nyx Blanc existant, en conservant son interface compacte et ses noms. Ne pas reconstruire une nouvelle interface. La prochaine modification visuelle ou fonctionnelle précise reste à définir avec l’utilisateur.

## Dépôt et fichier

- Dépôt : https://github.com/bizc0m/UX-Library
- Branche au transfert : `main`.
- Commit du prototype : `4c29e195b02dde05f0a8d2c3b6e525763f2b7149`.
- Fichier à ouvrir : `97_Prototypes/Nyx-Blanc/Nyx-Blanc.html`.
- HTML autonome avec CSS et JavaScript intégrés ; aucun build requis pour cet aperçu.
- Il provient de la version Nyx Blanc embarquée dans le catalogue Moteur-UX. La copie téléchargée originale avait une dépendance support.js manquante : repartir du fichier versionné ici.

## Vérification du 15 septembre 2026

Sur M5, dans Chrome automatisé, requêtes HTTP/HTTPS bloquées :

- Le dashboard se charge hors ligne.
- Le clic sur « + pane » passe de 3 à 4 panneaux.
- Aucune erreur JavaScript de page détectée pendant ce parcours.
- Capture du rendu inspectée.

Ces tests ne prouvent ni tous les boutons, ni une connexion aux données réelles, ni une application native. Les scripts de test et captures de cette session ne sont pas inclus dans ce dépôt. Refaire les tests après toute modification.

## Cadre de travail

1. Lire les instructions locales applicables ; vérifier machine, répertoire, racine Git, remote, branche et modifications avant intervention.
2. Ouvrir le fichier existant et observer son rendu avant édition.
3. Préserver les changements présents ; faire un diff ciblé et conserver la compacité et les interactions existantes.
4. Tester dans un navigateur l’affichage et les actions modifiées ; distinguer lecture du code, test automatisé et observation visuelle.
5. Ne pas modifier les autres prototypes ou applications sans demande. Ne pas effectuer de nouvelles opérations Git de publication sans autorisation.

## Contexte plus large et limites

Le projet de machine à skins commune reste partiel. Distinguer catalogue de références, UX Lib, générateur, pack exportable et moteur d’application réel. Un aperçu ou export JSON ne prouve pas l’application d’un skin.

Une copie isolée de NoteMistress avec un premier adaptateur AppKit et un générateur Moteur-UX existe dans les livrables locaux de la session Codex ; elle n’est pas incluse dans ce transfert Git. Le catalogue compact Moteur-UX n’est pas inclus non plus. Ne pas supposer leur présence sur une autre machine.

La cible envisagée reste : aperçu direct, pack skin.json et ressources, validation/import/export/retour au défaut, couleurs fonctionnelles protégées, capacités déclarées par application. Les adaptateurs NoteMistress et KATA 0SEC nécessitent des preuves séparées ; aucune compatibilité web vers AppKit/SwiftUI n’est acquise.

## Prompt de reprise

Lis ce fichier REPRISE.md et les instructions du dépôt. Reprends Nyx Blanc à partir de Nyx-Blanc.html dans ce même dossier. Vérifie d’abord Git et le rendu actuel. Conserve l’interface compacte et ses fonctions existantes. Résume brièvement ce qui fonctionne réellement et demande quelle modification précise travailler avant de changer l’interface.
