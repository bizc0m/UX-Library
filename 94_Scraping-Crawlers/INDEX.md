# 94_Scraping-Crawlers

Catalogue de sources pour scraping, crawling, extraction web et ingestion LLM/RAG. Objectif : choisir l'outil adapte au type de site et au niveau de controle voulu.

## Selection rapide

| Source | Type | Usage | Decision |
| --- | --- | --- | --- |
| [Scrapy](https://docs.scrapy.org/en/latest/index.html) | Framework Python crawling | Crawls structures, spiders, pipelines, exports | Reference robuste pour extraction a grande echelle. |
| [Crawlee](https://crawlee.dev/python/docs/guides) | Framework crawler Python/Node | Sites modernes, cookies, retries, sessions, anti-blocage raisonnable | Bon choix pour crawlers production et sites JS. |
| [Playwright](https://playwright.dev/) | Automatisation navigateur | Cliquer, attendre JavaScript, tester rendu, extraire depuis SPA | Bon choix quand le DOM final depend d'interactions. |
| [Puppeteer](https://pptr.dev/) | Automatisation Chrome | Controle Chrome/Chromium cote Node | Alternative Node si Chrome suffit. |
| [Crawl4AI](https://docs.crawl4ai.com/) | Crawler LLM-friendly | Markdown, extraction schema, pipelines RAG, local-first | Bon choix pour transformer des pages en contexte LLM. |
| [Firecrawl](https://www.firecrawl.dev/) | API / open source extraction | Markdown/JSON, crawling oriente LLM | Pratique, verifier licence et cout selon mode. |
| [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | Scraping avec LLM | Extraction guidee par prompt | Utile pour layouts instables ; a valider contre donnees reelles. |
| [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) | Parsing HTML Python | Extraction simple page par page | Suffisant pour HTML statique simple. |
| [Colly](https://github.com/gocolly/colly) | Crawler Go | Crawling rapide et concurrent | Bon pour pipelines Go legers. |
| [Katana](https://github.com/projectdiscovery/katana) | Crawler URL/endpoints | Decouverte technique, cartographie, securite | A utiliser pour inventaire technique, pas comme extracteur metier. |

## Choix par cas

| Cas | Choix de depart | Pourquoi |
| --- | --- | --- |
| Site HTML simple | BeautifulSoup ou Scrapy | Rapide, peu de dependances. |
| Gros crawl structure | Scrapy | Projet complet, spiders, pipelines, exports. |
| Site JavaScript | Playwright ou Crawlee | Le rendu depend du navigateur. |
| Donnees pour LLM/RAG | Crawl4AI ou Firecrawl | Sortie Markdown/JSON orientee contexte. |
| Crawler Node production | Crawlee | Sessions, retries, stockage, files d'attente. |
| Cartographie endpoints | Katana | Decouverte rapide d'URLs et chemins. |

## Regles de prudence

- Respecter les conditions d'utilisation, `robots.txt` quand applicable, rythme de requetes et limites de charge.
- Ne pas contourner authentification, paywall, protections techniques ou restrictions d'acces.
- Separer donnees brutes, extraction nettoyee, hypotheses et decisions.
- Conserver URL source, date, selecteur ou methode d'extraction.
- Pour donnees personnelles, documenter base legale, minimisation et duree de conservation.

## Requetes utiles

| Besoin | Requete |
| --- | --- |
| Spider Scrapy exemple | `github scrapy spider pipeline example csv json` |
| Crawl Playwright SPA | `github playwright crawler extract data spa example` |
| Crawler LLM Markdown | `github crawl4ai firecrawl markdown extraction rag` |
| Crawlee cookies sessions | `github crawlee cookies session pool crawler example` |
| Scraping safe rate limit | `scrapy autothrottle robots txt rate limit docs` |
