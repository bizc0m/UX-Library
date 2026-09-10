# Nyx Documents — prototype local

Date : 2026-09-10. Prototype HTML issu du mockup fourni par l’utilisateur, complété par une Blade Documents. Ce dossier sauvegarde le travail préparatoire ; ce n’est pas une intégration native Nyx2.

- [Ouvrir le prototype](Nyx-Documents.html) — télécharger puis ouvrir dans un navigateur ; GitHub affiche le code HTML.
- [Maquette initiale](assets/nyx-concept-initial.png)
- [Maquette complète](assets/nyx-concept-complet.png)
- [Design source NoteCortex](../../90_Patterns-Projets/PAT-005.md)
- [Décisions pour Nyx2](MIGRATION.md)

## Comportements codés

Import multiple TXT/Markdown et texte UTF-8 sans extension, onglets, divisions imbriquées, déplacement, redimensionnement, édition explicite, lecture simplifiée, fenêtres liées, export de copies et de l’espace JSON. Le mockup initial reste accessible par un bouton.

Les copies et la disposition sont conservées dans localStorage ; les fichiers sources ne sont pas écrasés. Le stockage dépend du navigateur et de l’origine. Exporter l’espace constitue la sauvegarde portable. Aucun accès direct au coffre NotePlan : importer ses fichiers ou son texte. Un lien noteplan:// seul ne contient pas la note.

## Sources

`src/mockup-original.html` : fichier utilisateur « Nyx Dashboard Mockup (standalone).html », conservé sans modification, incluant ses dépendances embarquées. `src/documents-module.html` : ajouts de cette session. Les PNG sont des concepts générés, avec contenu fictif. Leur texte ne constitue pas une preuve de fonctionnalités ou de services disponibles. Aucun droit supplémentaire sur les dépendances tierces n’est accordé par cette sauvegarde.

## Reconstruction et vérification

Depuis ce dossier, avec Python 3 et Node.js disposant de node:buffer.File :

```sh
python3 build.py
node tests/documents.cjs
```

Tests de logique : import multiple, Unicode/CRLF, marqueurs NotePlan, divisions imbriquées, transfert de document, sérialisation et validation, conservation après fermeture, fichiers sans extension et refus de binaire. Les événements et le stockage sont simulés dans ces tests ; ils ne prouvent pas les interactions du navigateur.

La session a aussi importé les 16 octets du fichier utilisateur TESTDroopy dans le traitement et vérifié le SHA-256 de la source inchangée. Ce fichier personnel n’est pas inclus ; une fixture synthétique couvre désormais le cas sans extension.

## Limites de validation

L’automatisation du navigateur a refusé la page file://. Le glisser-déposer réel, le rechargement avec restauration, le détachement/rattachement, les téléchargements et le rendu responsive restent à tester dans le navigateur. L’utilisateur a signalé un échec de dépôt ; les filtres et le traitement ont été corrigés, sans confirmation visuelle finale.

[Retour à la bibliothèque](../../INDEX.md)
