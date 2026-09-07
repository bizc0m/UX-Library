# 92_Effets-CodePen

Repertoire de depot pour les effets CodePen, prototypes CSS/JS et micro-interactions a reutiliser dans Nyx ou dans un autre dashboard. Chaque effet doit rester tracable : source, intention UX, dependances, risques, accessibilite et etat de test.

## Regle de depot

Un effet n'entre ici que si son role produit un gain utilisable : orientation, feedback, perception de vitesse, hierarchie visuelle, manipulation directe ou lisibilite. Un effet purement decoratif doit etre marque `exploration` tant qu'il n'est pas relie a un usage projet.

## Classement recommande

| Dossier | Usage | Exemples |
| --- | --- | --- |
| `00_Inbox/` | Effets bruts a qualifier | lien CodePen, capture, note courte |
| `01_Panels/` | Effets de panneaux et split views | resize, collapse, zoom, reveal |
| `02_Tabs-Navigation/` | Navigation et onglets | tab hover, active indicator, reorder hint |
| `03_Feedback-States/` | Feedback utilisateur | loading, saved, error, success, empty |
| `04_DataViz/` | Graphiques et data surfaces | highlight, focus series, tooltip, transition |
| `05_Command-Bar/` | Commandes rapides | palette, search, shortcuts, suggestions |
| `06_Backgrounds/` | Ambiances controles | glass, noise, grid, depth, glow |
| `90_Approved/` | Effets valides pour projet | effet teste, contraintes connues |
| `99_Rejected/` | Effets ecartes | raison documentee pour eviter doublons |

## Template de fiche effet

Copier ce bloc dans un nouveau fichier `EFFECT-XXX-nom.md`.

```markdown
# EFFECT-XXX - Nom de l'effet

## Source

- CodePen :
- Auteur :
- Date de consultation :
- Licence / conditions :
- Assets externes :

## Intention UX

- Probleme traite :
- Moment d'interface :
- Gain attendu :
- Fiches UX-Library liees :

## Adaptation projet

- Projet cible :
- Composant cible :
- Donnees reelles necessaires :
- Etats couverts :

## Contraintes techniques

- HTML :
- CSS :
- JavaScript :
- Dependances :
- Cout performance :

## Accessibilite

- Clavier :
- Focus visible :
- Contraste :
- Reduced motion :
- Alternative sans effet :

## Anti-patterns a surveiller

- Animation qui masque le contenu :
- Effet qui ralentit la tache :
- Dependance externe fragile :
- Comportement non tactile :

## Niveau

- Statut : inbox | test | approved | rejected
- Confiance : faible | moyenne | elevee
- Risque : faible | moyen | eleve

## Tests

- [ ] Desktop verifie
- [ ] Mobile verifie
- [ ] Clavier verifie
- [ ] Reduced motion verifie
- [ ] Performance verifiee
- [ ] Source et licence verifiees
```

## Conventions

- Nommer les fichiers `EFFECT-001-nom-court.md`.
- Ne pas coller le code complet d'un CodePen tiers si la licence n'est pas claire ; garder le lien et decrire l'adaptation.
- Ajouter une capture locale seulement si elle est necessaire a la selection visuelle.
- Marquer `rejected` quand un effet est abandonne, au lieu de le supprimer, pour conserver la decision.

## Liens utiles dans la bibliotheque

- Effets de feedback : [UX-019](../06_Feedback-Etats-Erreurs/UX-019.md), [UX-020](../06_Feedback-Etats-Erreurs/UX-020.md), [UX-021](../06_Feedback-Etats-Erreurs/UX-021.md)
- Interaction clavier et focus : [UX-011](../03_Interactions/UX-011.md), [UX-026](../08_Accessibilite/UX-026.md), [UX-027](../08_Accessibilite/UX-027.md)
- Responsive et cibles : [UX-022](../07_Mobile-Responsive/UX-022.md), [UX-023](../07_Mobile-Responsive/UX-023.md), [UX-024](../07_Mobile-Responsive/UX-024.md)
- Performance percue : [UX-043](../14_Performance-Perception/UX-043.md), [UX-044](../14_Performance-Perception/UX-044.md), [UX-045](../14_Performance-Perception/UX-045.md)
- Design system : [UX-034](../11_Design-System/UX-034.md), [UX-035](../11_Design-System/UX-035.md), [UX-036](../11_Design-System/UX-036.md)
