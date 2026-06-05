# STATE.md — Session Handoff

**Last updated:** 2026-06-05

## Current Focus

OpenClaw gateway запущен локально. Осталось: сохранить реальный MINIMAX_API_KEY в `.env` и выполнить `scripts/setup-openclaw.ps1`.

## Completed

- Markdown-first workspace (Phase 1)
- OpenClaw: `gateway/config.yaml`, `package.json`, `channels/cursor.yaml`
- MiniMax: `.env.example`, `TOOLS.md`, architecture docs
- Домен EventGenie: Maestro, Planning, Finance

## Decisions

- **Runtime:** OpenClaw Gateway + MiniMax (основной)
- **MD** — source of truth для промптов
- **Python/FastAPI** — Phase 2 (опционально)
- Язык интерфейса — русский

## Next Steps

1. Создать `.env` из `.env.example`, вставить `MINIMAX_API_KEY`
2. `npm install` → `npx openclaw gateway run`
3. Протестировать в dashboard: план, бюджет, полный пакет
4. Заполнить `USER.md`
5. (Опционально) Добавить VK/Telegram channel

## Open Questions

- Нужен ли VK-канал для EventGenie?
- Какая модель MiniMax оптимальна для JSON (MiniMax-Text-01 vs другие)?

## Blockers

None — нужен только ключ MiniMax в `.env`.
