# PROJECT.md — AI Event Planner

> AI-сервис планирования мероприятий: таймлайн, задачи, бюджет.
> Основа — Markdown-промпты и PRD; runtime — **OpenClaw Gateway + MiniMax**.

---

## Product Overview

| Поле | Значение |
|------|----------|
| Название | AI Event Planner (EventGenie) |
| Описание | Многоагентный AI-помощник для планирования мероприятий |
| Целевая аудитория | Организаторы событий, event-менеджеры, частные лица |
| Проблема | Планирование разрознено: нет единого таймлайна, задач и сметы |
| Ключевые концепции | Maestro, Planning Agent, Finance Agent, PRD, intent routing |

### Цели продукта

1. Генерировать детальный план события (таймлайн + задачи).
2. Рассчитывать бюджет по категориям с рекомендациями.
3. Оркестрировать запросы через Maestro Agent.
4. Хранить поведение агентов в Markdown — код как тонкий runtime-слой.

---

## Tech Stack

| Слой | Технология |
|------|------------|
| Документация | Markdown (основной артефакт) |
| Platform | OpenClaw Gateway |
| LLM | MiniMax (OpenAI-compatible API) |
| Language | JavaScript (Node.js 20) + Python 3.11+ (опционально) |
| Package manager | npm |
| Framework (опц.) | FastAPI 0.109+ |
| Orchestration (опц.) | LangChain |
| Validation | Pydantic 2.x (опц.) |
| Database | PostgreSQL (опционально) |
| AI Tools | Cursor, Claude Code, OpenClaw Dashboard |

---

## Commands

| Задача | Команда |
|--------|---------|
| Установка | `npm install` |
| Запуск gateway | `npx openclaw gateway run` |
| Dev mode | `npx openclaw dev` |
| Тест skill | `npx openclaw test skills/event-planner` |
| Логи | `npx openclaw logs` |
| Dashboard | `npx openclaw dashboard --no-open` → `http://localhost:18789` |
| Python (опц.) | `uvicorn src.main:app --reload --port 8001` |
| Тесты (опц.) | `pytest` |

### Validation Command

```bash
npx openclaw test skills/event-planner && npx openclaw lint
```

### Запуск на Windows (PowerShell)

```powershell
cd C:\Users\Zazo\Desktop\AI-Event-Planner
copy .env.example .env
# Вставь MINIMAX_API_KEY в .env
npm install
node node_modules\openclaw\openclaw.mjs gateway run
```

---

## Directory Structure

```
AI-Event-Planner/
├── AGENTS.md, SOUL.md, IDENTITY.md, USER.md, MEMORY.md
├── gateway/config.yaml          # OpenClaw + MiniMax провайдер
├── channels/cursor.yaml         # Локальный канал (dev)
├── skills/event-planner/
│   ├── SKILL.md                 # Главный промпт
│   └── agents/
│       ├── maestro.md
│       ├── planning-agent.md
│       └── finance-agent.md
├── docs/
│   ├── prds/
│   ├── architecture/
│   ├── plans/
│   ├── state/
│   └── templates/
├── .claude/                     # Claude Code: agents, commands, skills
├── logs/                        # Логи gateway (gitignored)
└── src/                         # (опционально) FastAPI runtime
    ├── main.py
    ├── api/routes.py
    ├── agents/
    │   ├── maestro.py
    │   ├── planning_agent.py
    │   └── finance_agent.py
    ├── chains/
    │   ├── planning_chain.py
    │   └── budget_chain.py
    ├── llm/gigachat_client.py
    └── models/
        ├── event.py
        └── budget.py
```

---

## File Conventions

| Тип | Паттерн |
|-----|---------|
| Субагенты (промпты) | `skills/event-planner/agents/*.md` |
| PRD | `docs/prds/PRD-*.md` |
| Архитектура | `docs/architecture/*.md` |
| Claude sub-agents | `.claude/agents/*.md` |
| Domain skills | `.claude/my-skill/*/Skill.md` |
| Python агенты | `src/agents/*_agent.py` |
| Тесты | `tests/unit/`, `tests/integration/` |

---

## Environment Variables

См. `.env.example`. Обязательные для OpenClaw runtime:

- `MINIMAX_API_KEY` — ключ MiniMax API
- `MINIMAX_BASE_URL` — `https://api.minimax.io/v1` (international) или `https://api.minimax.chat/v1` (domestic)
- `MINIMAX_MODEL` — например `MiniMax-Text-01`

Опционально: `GIGACHAT_*` (Python Phase 2), `DATABASE_URL`

---

## Architecture Pattern

```
User Message (Cursor / OpenClaw Dashboard / Channel)
    ↓
OpenClaw Gateway (MiniMax LLM)
    ↓
skills/event-planner/SKILL.md
    ↓
Maestro Agent (intent classification)
    ↓
┌───────────────┬────────────────┐
│ Planning Agent│ Finance Agent  │
│ (timeline +   │ (budget +      │
│  tasks)       │  recommendations)│
└───────────────┴────────────────┘
    ↓
Structured JSON Response → User / Backend
```

Intent-ы:

- `create_event_plan` → Planning Agent
- `calculate_budget` → Finance Agent
- `full_event_planning` → оба агента
- `unknown` → уточняющий вопрос

---

## Code Standards

- Async/await для всех API и LLM вызовов
- Pydantic модели на границах API
- Промпты агентов — в MD; Python только оркестрирует
- User-facing текст — на русском
- Ошибки LLM — логировать + понятное сообщение пользователю

---

## Permissions Guidance

```json
"Bash(npm install*)",
"Bash(npx openclaw test*)",
"Bash(npx openclaw logs*)",
"Bash(npx openclaw gateway*)",
"Bash(pytest*)"
```
