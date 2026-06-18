# STATE.md — Session Handoff

**Last updated:** 2026-06-14

## Current Focus

EventGenie с Web UI на порту 3080: чат, форма события, сохранение/удаление результатов. Runtime — OpenClaw Gateway + MiniMax (fallback OpenRouter).

## Completed

- Markdown-first workspace (Phase 1)
- OpenClaw: `gateway/config.yaml`, `package.json`, `channels/cursor.yaml`
- MiniMax: `.env.example`, `TOOLS.md`, architecture docs
- Домен EventGenie: Maestro + 10+ субагентов (planning, finance, run-of-show, guests, invitation, risks, social, thank-you, survey, image)
- VK-канал: `docs/VK-CHANNEL-SETUP.md`, `scripts/setup-vk-channel.ps1`
- **Web UI:** `web/frontend/` (React), `web/server.mjs`, скрипты `start-ui.ps1`, `start-eventgenie.ps1`, `stop-all.ps1`
- Документация: `docs/WEB-UI.md`, `docs/DEMO-MESSAGES.md`, презентация `docs/presentation/EventGenie.html`

## Decisions

- **Runtime:** OpenClaw Gateway + MiniMax (`MINIMAX_CODE_PLAN_KEY` для `sk-cp-...`)
- **MD** — source of truth для промптов
- **Web UI** — основной способ работы (порт 3080), не VK
- **Результаты** — ручное сохранение из чата в `output/saved/`
- **Gateway autostart** — отключён (`gateway uninstall`); запуск вручную через скрипты
- Язык интерфейса — русский

## Next Steps

1. (Опционально) CI: сборка frontend при push
2. (Опционально) Phase 2: FastAPI runtime
3. Заполнить `USER.md` под реального пользователя

## Open Questions

- Нужен ли автозапуск gateway при старте Windows?
- Какая модель оптимальна при rate limit на free OpenRouter?

## Blockers

None — нужны ключи в `.env` и запущенный gateway.
