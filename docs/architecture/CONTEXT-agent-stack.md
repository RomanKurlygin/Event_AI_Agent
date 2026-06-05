# CONTEXT: Agent Technology Stack

**Status**: Locked (updated)
**Date**: 2026-06-05
**Author**: EventGenie Team

---

## Decision

Использовать **Markdown-first** архитектуру с **OpenClaw Gateway + MiniMax** как основной runtime. Python/FastAPI — опциональный Phase 2.

## Context

PRD-driven workflow; домен EventGenie (Maestro, Planning, Finance); runtime — OpenClaw + LLM + MD workspace.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| A: GigaChat + FastAPI | Привычный Python-стек | Нет OpenClaw, другой LLM |
| B: OpenClaw + MiniMax + MD | Единый gateway, MD-промпты | Нужен npm/Node |
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
- Setup: `docs/OPENCLAW-SETUP.md`
