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
| Настройка | `.\scripts\setup-openclaw.ps1` |
| Gateway + Web UI | `.\scripts\start-eventgenie.ps1` |
| Только gateway | `.\scripts\start-gateway.ps1` |
| Только Web UI | `.\scripts\start-ui.ps1` → `http://127.0.0.1:3080` |
| Остановить всё | `.\scripts\stop-all.ps1` |
| Dashboard | `.\scripts\start-dashboard.ps1` → `http://127.0.0.1:18789` |
| Тест skill | `npx openclaw test skills/event-planner` |
| Логи | `npx openclaw logs` |

### Validation Command

```bash
npx openclaw test skills/event-planner && npx openclaw lint
```

### Запуск на Windows (PowerShell)

```powershell
git clone https://github.com/RomanKurlygin/Event_AI_Agent.git
cd Event_AI_Agent
copy .env.example .env
# Вставь MINIMAX_CODE_PLAN_KEY (sk-cp-...) в .env
npm install
.\scripts\setup-openclaw.ps1
.\scripts\start-eventgenie.ps1
```

---

## Directory Structure

```
AI-Event-Planner/
├── AGENTS.md, SOUL.md, IDENTITY.md, USER.md, MEMORY.md
├── gateway/config.yaml          # OpenClaw + MiniMax провайдер
├── web/                         # Web UI (React + server.mjs)
├── scripts/                     # start-gateway, start-ui, stop-all, setup
├── channels/cursor.yaml         # Локальный канал (dev)
├── skills/event-planner/
│   ├── SKILL.md                 # Главный промпт
│   └── agents/                  # maestro, planning, finance, …
├── docs/
│   ├── prds/
│   ├── architecture/
│   ├── WEB-UI.md
│   ├── DEMO-MESSAGES.md
│   └── state/
├── .claude/                     # Claude Code: agents, commands, skills
├── logs/                        # Логи gateway (gitignored)
└── output/                      # Результаты агента (gitignored)
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

- `MINIMAX_CODE_PLAN_KEY` — Coding Plan key (`sk-cp-...`)
- `MINIMAX_OAUTH_TOKEN` — то же значение (для minimax-portal)
- `MINIMAX_BASE_URL`, `MINIMAX_MODEL` — см. `.env.example`
- `OPENROUTER_API_KEY` — опционально, fallback LLM

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
