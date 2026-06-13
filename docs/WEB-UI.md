# EventGenie Web UI

Собственный интерфейс чата вместо VK или стандартного OpenClaw dashboard.

Дизайн вдохновлён [Figma: AI Agent Interface for Events](https://www.figma.com/make/zL7swD9TcoE87jbUvBHtas/AI-Agent-Interface-for-Events).

## Архитектура

```
Браузер (http://127.0.0.1:3080)
        ↓
web/server.mjs  — прокси + статика
        ↓
openclaw agent  — CLI к Gateway
        ↓
EventGenie (skills/event-planner) → Maestro → субагенты
```

## Запуск

### Вариант A — всё сразу

```powershell
cd C:\Users\Zazo\Desktop\AI-Event-Planner
.\scripts\start-eventgenie.ps1
```

Откроется окно gateway + браузер с UI.

### Вариант B — вручную

**Терминал 1** (держать открытым):
```powershell
.\scripts\start-gateway.ps1
```

**Терминал 2**:
```powershell
.\scripts\start-ui.ps1
```

UI: [http://127.0.0.1:3080](http://127.0.0.1:3080)

## Возможности UI

- Форма события (название, тип, дата, гости, бюджет) — контекст в каждый запрос
- Чат с EventGenie
- Быстрые действия для всех скиллов (план, бюджет, invite, риски…)
- Индикатор статуса OpenClaw gateway
- «Новый чат» — новая сессия OpenClaw

## Выключить

```powershell
# UI — закрыть окно start-ui.ps1 (Ctrl+C)
npx openclaw gateway stop
```

## Файлы

| Путь | Назначение |
|------|------------|
| `web/frontend/` | React UI из Figma (Vite + Tailwind) |
| `web/frontend/src/app/components/` | Вкладки: Чат, Событие, Результаты, Настройки |
| `web/server.mjs` | Сервер + `/api/chat`, `/api/results` |
| `web/public/` | Legacy UI (fallback, если нет build) |

## Порт

По умолчанию **3080**. Изменить:

```powershell
$env:EVENTGENIE_UI_PORT = "3090"
.\scripts\start-ui.ps1
```

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| «Gateway не запущен» | `.\scripts\start-gateway.ps1` |
| Долгий ответ | LLM думает 30–90 сек — нормально |
| Rate limit | Подождать, сменить модель в setup-openclaw |
| Пустой ответ | Новый чат, повторить запрос |
