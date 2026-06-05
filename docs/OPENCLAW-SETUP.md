# Подключение OpenClaw + MiniMax

Пошаговая инструкция для Windows.

## 1. Требования

- **Node.js 24+** (с npm): `winget install OpenJS.NodeJS.LTS`
- **MiniMax Coding Plan key** (`sk-cp-...`) или обычный API key в `.env`
- Перезапусти терминал после установки Node.js

## 2. Ключ MiniMax в `.env`

### Coding Plan key (`sk-cp-...`) — рекомендуется

Файл `c:\Users\Zazo\Desktop\AI-Event-Planner\.env`:

```env
MINIMAX_CODE_PLAN_KEY=sk-cp-ваш_ключ
MINIMAX_OAUTH_TOKEN=sk-cp-ваш_ключ
MINIMAX_BASE_URL=https://api.minimax.io/anthropic
MINIMAX_MODEL=MiniMax-M3
```

OAuth через браузер **не нужен** — ключ друга работает как bearer-токен для `minimax-portal`.

### OpenRouter (альтернатива, пока MiniMax не работает)

Ключ: [openrouter.ai/keys](https://openrouter.ai/keys)

```env
OPENROUTER_API_KEY=sk-or-ваш_ключ
OPENROUTER_MODEL=openrouter/openai/gpt-oss-20b:free
```

Если оба ключа заданы, OpenRouter станет **основной** моделью, MiniMax — fallback.

### Обычный API key (`sk-api-...`)

```env
MINIMAX_API_KEY=sk-api-ваш_ключ
MINIMAX_BASE_URL=https://api.minimax.io/anthropic
MINIMAX_MODEL=MiniMax-M3
```

Сохрани файл (Ctrl+S). Placeholder не подойдёт.

## 3. Установка зависимостей

```powershell
cd C:\Users\Zazo\Desktop\AI-Event-Planner
npm install
```

## 4. Автоматическая настройка (рекомендуется)

```powershell
.\scripts\setup-openclaw.ps1
```

Скрипт:
- читает `MINIMAX_CODE_PLAN_KEY` (`sk-cp-...`) из `.env`
- пишет ключ в `~\.openclaw\.env` для gateway
- обновляет auth profile `minimax-portal`
- ставит модель `minimax-portal/MiniMax-M3`
- создаёт gateway на порту `18789`

## 5. Ручная настройка (альтернатива)

```powershell
npx openclaw onboard --non-interactive --accept-risk `
  --mode local `
  --auth-choice minimax-global-api `
  --minimax-api-key "ВАШ_КЛЮЧ" `
  --workspace "C:\Users\Zazo\Desktop\AI-Event-Planner" `
  --gateway-port 18789 `
  --gateway-auth token `
  --skip-channels --no-install-daemon --skip-health
```

Или интерактивно:

```powershell
npx openclaw configure
```

Выбери **Model/auth** → **minimax-global-api** → вставь ключ.

## 6. Запуск Gateway

```powershell
npx openclaw gateway run
```

Оставь окно открытым. Gateway слушает `ws://127.0.0.1:18789`.

Фоновый сервис (опционально):

```powershell
npx openclaw gateway install
npx openclaw gateway start
```

## 7. Открыть Dashboard

```powershell
npx openclaw dashboard --no-open
```

Откроется `http://127.0.0.1:18789/` с токеном авторизации.

## 8. Проверка

```powershell
npx openclaw status
npx openclaw models list --provider minimax
npx openclaw doctor
```

В `status` должно быть:
- Gateway: **reachable**
- Workspace: `AI-Event-Planner`
- Model: `minimax/MiniMax-M3` (или M2.7)

## 9. Чат с EventGenie

**Вариант A — Dashboard:** браузер → `http://127.0.0.1:18789`

**Вариант B — TUI в терминале:**

```powershell
npx openclaw tui
```

**Вариант C — Cursor:** работай в этом workspace — агент читает `AGENTS.md`, `SOUL.md`, `skills/event-planner/SKILL.md`.

Пример запроса:

```
Составь полный план свадьбы на 150 человек в Москве, бюджет 1 млн ₽, 15 апреля 2026
```

## 10. Где что лежит

| Что | Путь |
|-----|------|
| Конфиг OpenClaw | `~\.openclaw\openclaw.json` |
| Workspace агента | `AI-Event-Planner\` (корень проекта) |
| Промпты EventGenie | `skills/event-planner\` |
| Логи gateway | `%TEMP%\openclaw\` |
| Старый конфиг (справка) | `gateway/config.yaml` |

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| `npm` не найден | Переустанови Node.js, перезапусти терминал |
| Gateway ECONNREFUSED | `npx openclaw gateway run` |
| MiniMax auth error | Для `sk-cp-` используй `MINIMAX_CODE_PLAN_KEY`, запусти `setup-openclaw.ps1` |
| `invalid api key` с `sk-cp-` | Не клади Coding Plan key в `MINIMAX_API_KEY` — только в `MINIMAX_CODE_PLAN_KEY` |
| MiniMax не работает | Добавь `OPENROUTER_API_KEY` в `.env` и запусти `setup-openclaw.ps1` |
| Модель gpt-5.5 вместо MiniMax | `npx openclaw models set minimax-portal/MiniMax-M3` |
| Переключиться на OpenRouter | `npx openclaw models set openrouter/auto` |
| Native Windows warnings | Работает, но для prod см. [Windows docs](https://docs.openclaw.ai/windows) |

## Ссылки

- [OpenClaw Install](https://docs.openclaw.ai/install)
- [MiniMax Provider](https://docs.openclaw.ai/providers/minimax)
- [Gateway Runbook](https://docs.openclaw.ai/gateway)
