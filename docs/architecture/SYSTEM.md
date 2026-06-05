# Architecture: AI Event Planner

**Status**: Approved  
**Date**: 2026-06-05

## Overview

AI Event Planner — markdown-first многоагентная система для планирования мероприятий. Runtime: **OpenClaw Gateway + MiniMax**. Поведение определяется промптами в `skills/event-planner/`.

## High-Level Diagram

```
┌─────────────┐
│   User      │
│ (Dashboard /│
│  Cursor /   │
│  Channel)   │
└──────┬──────┘
       │ message + optional context
       ▼
┌─────────────┐
│  OpenClaw   │  gateway/config.yaml
│  Gateway    │  LLM: MiniMax (OpenAI-compatible)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ event-planner│  SKILL.md + agents/*.md
│    Skill     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Maestro   │  intent: create_event_plan | calculate_budget
│   Agent     │          | full_event_planning | unknown
└──────┬──────┘
       │
   ┌───┴───┐
   ▼       ▼
┌──────┐ ┌──────┐
│Planning│ │Finance│
│ Agent │ │ Agent │
└───┬───┘ └──┬───┘
    │        │
    ▼        ▼
 timeline   budget
 + tasks    + analysis
```

## Agent Responsibilities

### Maestro (`maestro.md`)

- Классификация intent (LLM + keyword fallback)
- Извлечение `event_data` из сообщения/context
- Маршрутизация к субагентам
- Агрегация результатов

### Planning Agent (`planning-agent.md`)

- Генерация `timeline_phases[]`
- Генерация `tasks[]` с priority и deadline_days
- Шаблоны по event_type

### Finance Agent (`finance-agent.md`)

- Распределение `budget_limit` по категориям
- `analysis` и `recommendations`
- Резерв 10–15%

## Data Models

### EventData

```json
{
  "event_name": "string",
  "event_type": "wedding | corporate | birthday | conference | private",
  "event_date": "ISO-8601 datetime",
  "location": "string",
  "expected_guests": "integer",
  "budget_limit": "number (optional)",
  "format": "offline | hybrid | online",
  "target_audience": "string (optional)"
}
```

### PlanResponse

```json
{
  "timeline": { "timeline_phases": [{ "time": "HH:MM", "activity": "string" }] },
  "tasks": { "tasks": [{ "title": "string", "description": "string", "deadline_days": 0, "priority": "CRITICAL|HIGH|MEDIUM|LOW" }] }
}
```

### BudgetResponse

```json
{
  "items": [{ "category": "string", "planned_amount": 0, "description": "string" }],
  "total_amount": 0,
  "reserve_amount": 0,
  "analysis": "string",
  "recommendations": "string"
}
```

## API Endpoints (runtime)

| Method | Path | Agent |
|--------|------|-------|
| POST | `/api/v1/agents/maestro/process` | Maestro |
| POST | `/api/v1/agents/planning/generate` | Planning |
| POST | `/api/v1/agents/finance/calculate` | Finance |
| GET | `/health` | — |

## LLM Integration (MiniMax)

| Параметр | Значение |
|----------|----------|
| Provider | MiniMax (custom, OpenAI-compatible) |
| baseURL | `MINIMAX_BASE_URL` (default: `https://api.minimax.io/v1`) |
| apiKey | `MINIMAX_API_KEY` |
| model | `MINIMAX_MODEL` (default: `MiniMax-Text-01`) |
| maxTokens | 8192 |
| temperature | 0.7 (gateway default); 0.3–0.5 для JSON |

Конфиг: `gateway/config.yaml`. Переменные — `.env`.

### JSON mode

Для intent classification, plan и budget — явно проси JSON в промпте субагента. При parse error — retry с temperature 0.3.

## OpenClaw Gateway

| Компонент | Путь |
|-----------|------|
| Gateway config | `gateway/config.yaml` |
| Skill | `skills/event-planner/` |
| Channel (dev) | `channels/cursor.yaml` |
| Logs | `logs/gateway.log` |
| Workspace state | `.openclaw/workspace-state.json` |

## Memory Layer

| Store | File | Content |
|-------|------|---------|
| User profile | `USER.md` | Preferences, event history |
| Long-term | `MEMORY.md` | Curated decisions |
| Session | `memory/YYYY-MM-DD.md` | Raw logs |

## Security

- Credentials только в `.env`
- Валидация входа через Pydantic (runtime)
- Не логировать MINIMAX_API_KEY

## References

- `docs/prds/PRD-event-planning.md`
- `docs/OPENCLAW-SETUP.md`
- [OpenClaw docs](https://docs.openclaw.ai/)
