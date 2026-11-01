# Sélecteur visuel des applications et interfaces UX

**39 applications ou familles, 211 interfaces et variantes.** Les vrais fichiers HTML, styles, scripts et ressources retrouvés sont inclus dans `references/`.

## Ouvrir en ligne

**https://bizc0m.github.io/UX-Library/** — sans serveur à installer.

## Copie locale facultative

Télécharger le dépôt, puis lancer depuis sa racine :

```sh
python3 -m http.server 8875 --bind 127.0.0.1
```

Ouvrir ensuite http://127.0.0.1:8875/98-Selecteur-UX/index.html

KM Search est la première entrée. « Ouvrir l’application » lance l’outil ; « Ouvrir la fiche » ouvre la référence et permet de sélectionner ses fonctions. Les versions d’un même outil sont regroupées. Le composeur reste accessible dans un onglet distinct.

## Contenu

- `index.html` : sélecteur existant complété.
- `references/` : fichiers réels des interfaces, pas uniquement des liens vers les projets.
- `thumbnails/` : repères visuels et textuels des références supplémentaires.
- `Rapport-rescan.json` : périmètre du scan, provenance et ressources manquantes.

La grille affiche directement les interfaces réelles dans des miniatures isolées, chargées à la demande, ainsi que les captures existantes. Le bouton Agrandir ouvre le grand aperçu. Les interfaces qui ne peuvent pas afficher de contenu sont signalées comme indisponibles. KM Search a été vérifié en aperçu, en sélection de fonctions et dans le composeur. Les autres sources historiques ne sont pas toutes revalidées. Les chemins de provenance désignent le Mac d’origine ; les fichiers embarqués sont chargés depuis ce dossier. Certaines fonctions dépendent d’un serveur ou de ressources non disponibles. Les valeurs ressemblant à des identifiants secrets ont été retirées de trois copies publiées ; les originaux locaux sont conservés. Les empreintes du rapport désignent les sources inventoriées.

Les cinq sites d’inspiration sont accessibles en haut du sélecteur.
