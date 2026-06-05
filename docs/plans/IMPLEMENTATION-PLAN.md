# Implementation Plan: AI Event Planner

**Based on:** `docs/prds/PRD-event-planning.md`  
**Status:** Phase 1 complete (MD layer)

---

## Phase 1: Markdown Workspace + OpenClaw ✅

**Goal:** MD-first workspace + OpenClaw Gateway + MiniMax.

| Task | Status |
|------|--------|
| Корневые файлы (AGENTS, SOUL, IDENTITY, PROJECT) | ✅ |
| skills/event-planner/SKILL.md + agents | ✅ |
| PRD и architecture docs | ✅ |
| .claude/ agents, commands, skills | ✅ |
| Templates (PRD, CONTEXT) | ✅ |
| gateway/config.yaml + package.json | ✅ |
| MiniMax в .env.example, TOOLS.md | ✅ |
| channels/cursor.yaml | ✅ |

**Validation:** `npm install` → `npx openclaw gateway run` → dashboard → запрос на план свадьбы.

---

## Phase 2: Python Runtime (optional)

**Goal:** FastAPI сервис как в eventgenie-agents.

1. `src/main.py` — FastAPI app, CORS, /health
2. `src/llm/gigachat_client.py` — GigaChat SDK
3. `src/agents/maestro.py`, `planning_agent.py`, `finance_agent.py`
4. `src/chains/planning_chain.py`, `budget_chain.py`
5. `src/models/event.py`, `budget.py`
6. `src/api/routes.py` — REST endpoints
7. `requirements.txt`, `Dockerfile`
8. `tests/unit/` — mock LLM

**Validation:** `pytest && uvicorn src.main:app --port 8001`

---

## Phase 3: Integration & Polish

1. Синхронизация промптов: MD → Python chain templates
2. PostgreSQL для истории событий (опционально)
3. Hooks для PRD quality (из курса)
4. CI: lint + pytest

---

## Next Session

См. `docs/state/STATE.md` для текущего фокуса.
