# CONTEXT: Agent Technology Stack

**Status**: Locked (updated)
**Date**: 2026-06-05
**Author**: EventGenie Team

---

## Decision

Использовать **Markdown-first** архитектуру с **OpenClaw Gateway + MiniMax** как основной runtime. Python/FastAPI — опциональный Phase 2.

## Context

Курс дал PRD-driven workflow; eventgenie-agents — домен (Maestro, Planning, Finance); Glevelll/Agents — OpenClaw + MiniMax + MD workspace. Пользователь имеет ключ MiniMax.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A: GigaChat + FastAPI | Как eventgenie-agents | Нет OpenClaw, другой LLM |
| B: OpenClaw + MiniMax + MD | Как Glevelll/Agents, ключ есть | Нужен npm/Node |
| C: Только Cursor без gateway | Проще | Нет единого runtime |

## Chosen Approach

**Option B** — OpenClaw Gateway, MiniMax LLM, промпты в `skills/event-planner/`.

## Stack

```
OpenClaw Gateway
  → MiniMax API (MINIMAX_API_KEY)
  → skills/event-planner/SKILL.md
  → agents/maestro | planning-agent | finance-agent
```

## Consequences

- **Positive:** Единый runtime; dashboard; skill-тесты через `npx openclaw test`.
- **Negative:** Зависимость от Node.js и openclaw npm package.
- **Follow-up:** Опционально VK/Telegram channel; Phase 2 Python API.

## References

- PRD: `docs/prds/PRD-event-planning.md`
- Architecture: `docs/architecture/SYSTEM.md`
- Reference: [Glevelll/Agents](https://github.com/Glevelll/Agents)
