# TOOLS.md — Локальные заметки

Skills описывают _как_ работают инструменты. Этот файл — _ваши_ специфики: API, ключи, предпочтения.

## LLM: MiniMax (основной)

```markdown
### MiniMax API
- Ключ Coding Plan: `MINIMAX_CODE_PLAN_KEY` + `MINIMAX_OAUTH_TOKEN` (в `.env`, не коммитить)
- Обычный ключ: `MINIMAX_API_KEY` (`sk-api-...`) — только если не Coding Plan
- International: https://api.minimax.io/v1
- Domestic (Китай): https://api.minimax.chat/v1
- Модель: MiniMax-Text-01 (или из dashboard MiniMax)
- Конфиг: gateway/config.yaml
```

## Platform: OpenClaw

```markdown
### Команды
- Запуск: npx openclaw gateway run
- Dev: npx openclaw dev
- Тест skill: npx openclaw test skills/event-planner
- Логи: npx openclaw logs
- Dashboard: http://localhost:18789

### Skill path
- skills/event-planner/SKILL.md
- Субагенты: skills/event-planner/agents/*.md
```

## Каналы

```markdown
### cursor.yaml (локальная разработка)
- channels/cursor.yaml — dmPolicy: open

### Генерация изображений

- OpenClaw tool: `image_generate`
- Стили промптов: `docs/templates/image/IMAGE-PROMPTS.md`
- Выход: `output/images/`
- Модели: `minimax/image-01` или OpenRouter image (Gemini flash image)

### VK (ВКонтакте)
- Плагин: `@openclaw-vk/vk` — `npx openclaw plugins install @openclaw-vk/vk`
- Настройка: `.\scripts\setup-vk-channel.ps1`
- Гайд: `docs/VK-CHANNEL-SETUP.md`
- Токен: `VK_GROUP_TOKEN` в `.env`

### Дополнительно (опционально)
- Telegram: `npx openclaw channels add --channel telegram --token <token>`
```

## Предпочтения

```markdown
### Валюта
- По умолчанию: RUB (₽)

### Формат дат
- ISO 8601: 2026-04-15T18:00:00
- Дедлайны задач: в днях до event_date

### Temperature (gateway/config.yaml)
- 0.7 — общий чат и планы
- 0.3–0.5 — JSON-структуры (intent, budget items)
```

---

Добавляй сюда всё, что уникально для твоей среды.
