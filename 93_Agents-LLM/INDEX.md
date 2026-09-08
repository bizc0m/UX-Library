# 93_Agents-LLM

Catalogue de sources pour construire, comparer ou auditer des agents LLM. Cette section sert a choisir une base technique avant de developper : framework, agent de code, memoire, orchestration, outils, sandbox et observabilite.

## Selection rapide

| Source | Type | Usage | Decision |
| --- | --- | --- | --- |
| [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) | SDK Python agents | Agents, tools, handoffs, guardrails, tracing, sandbox agents | Bon choix si le projet utilise deja OpenAI et veut un agent explicite, lisible, outille. |
| [LangGraph](https://github.com/langchain-ai/langgraph) | Orchestration stateful | Workflows agents durables, graphes, reprises, human-in-the-loop | Bon choix pour pipeline complexe ou workflow long. |
| [CrewAI](https://docs.crewai.com/) | Framework crews/flows | Agents par roles, automatisations collaboratives, flows | Bon choix pour prototypage multi-agent rapide. |
| [Pydantic AI](https://pydantic.dev/docs/ai/capabilities/overview/) | Framework Python type | Agents structures, outputs typés, validation Pydantic | Bon choix quand la qualite des schemas prime. |
| [smolagents](https://github.com/huggingface/smolagents) | Framework agent minimal | Code agents, tool calling, apprentissage, prototypes locaux | Bon choix pour comprendre vite et tester localement. |
| [Agno](https://github.com/agno-agi) | Plateforme agentique | Services agents, runtime, controle d'une stack agent | A evaluer pour plateforme agent plutot que script simple. |
| [Letta](https://docs.letta.com/) | Agents avec memoire | Agents stateful, memoire, identite, long terme | Bon choix pour assistants persistants. |
| [OpenHands](https://github.com/OpenHands/openhands) | Agent dev complet | Agent logiciel avec fichiers, commandes, navigateur, CLI/SDK | Pertinent pour agent de code autonome. |
| [anomalyco/opencode](https://github.com/anomalyco/opencode) | Agent de code open source | Assistant terminal, code, automatisation dev | Source active pour OpenCode. |
| [opencode-ai/opencode](https://github.com/opencode-ai/opencode) | Ancien OpenCode | Reference historique | Archive en lecture seule depuis 2025 ; ne pas demarrer dessus. |

## Axes de comparaison

| Axe | Question | Sources a regarder |
| --- | --- | --- |
| Controle du workflow | Le parcours doit-il etre deterministe ? | LangGraph, OpenAI Agents SDK, Pydantic AI |
| Rapidite de prototype | Faut-il montrer un POC vite ? | CrewAI, smolagents, OpenAI Agents SDK |
| Agent de code | Faut-il modifier des fichiers et lancer des commandes ? | OpenHands, OpenCode, OpenAI Agents SDK sandbox |
| Memoire longue | Faut-il retenir l'historique et apprendre ? | Letta, LangGraph avec memoire explicite |
| Local-first | Faut-il fonctionner avec Ollama/LM Studio/local endpoint ? | smolagents, LangGraph, CrewAI, OpenCode |
| Observabilite | Faut-il tracer, rejouer, auditer ? | OpenAI Agents SDK, LangGraph, CrewAI |

## Requetes utiles

| Besoin | Requete |
| --- | --- |
| Agent local avec fichiers | `github local coding agent llm filesystem shell sandbox` |
| Multi-agent durable | `github langgraph durable execution human in the loop agent` |
| Agent avec memoire | `github llm agent memory stateful letta memgpt` |
| Agent browser | `github llm browser automation agent playwright` |
| Agent RAG | `github agent rag tools pydantic langgraph` |

## Regle d'ajout

- Ajouter le repo source, la licence et la date de consultation.
- Noter si le projet est actif : releases, commits recents, issues traitees.
- Distinguer framework agent, agent de code complet et plateforme low-code.
- Tester un exemple minimal avant de marquer une source comme `approved`.
- Ne pas stocker de cles API, tokens, historiques ou configs privees dans la fiche.
