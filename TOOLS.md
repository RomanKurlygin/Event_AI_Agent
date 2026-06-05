# TOOLS.md — Локальные заметки

Skills описывают _как_ работают инструменты. Этот файл — _ваши_ специфики: API, ключи, предпочтения.

## LLM: MiniMax (основной)

```markdown
### MiniMax API
- Ключ: MINIMAX_API_KEY (в .env, не коммитить)
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

### Дополнительно (опционально)
- VK: openclaw-vk plugin (см. Glevelll/Agents)
- Telegram: добавить channel config при необходимости
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
