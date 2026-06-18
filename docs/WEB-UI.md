# EventGenie Web UI

Собственный интерфейс чата вместо VK или стандартного OpenClaw dashboard.

Дизайн вдохновлён [Figma: AI Agent Interface for Events](https://www.figma.com/make/zL7swD9TcoE87jbUvBHtas/AI-Agent-Interface-for-Events).

## Архитектура

```
Браузер (http://127.0.0.1:3080)
        ↓
web/server.mjs  — прокси + статика + API
        ↓
openclaw agent  — CLI к Gateway
        ↓
EventGenie (skills/event-planner) → Maestro → субагенты
```

## Требования

- Node.js 20+ (рекомендуется 24 LTS)
- Настроенный `.env` и `.\scripts\setup-openclaw.ps1` (см. **docs/OPENCLAW-SETUP.md**)
- Gateway должен быть запущен **до** или **вместе** с UI

## Запуск

### Вариант A — всё сразу (рекомендуется)

```powershell
git clone https://github.com/RomanKurlygin/Event_AI_Agent.git
cd Event_AI_Agent
.\scripts\start-eventgenie.ps1
```

Откроется окно gateway + браузер с UI на **http://127.0.0.1:3080**.

### Вариант B — вручную (два терминала)

**Терминал 1** (держать открытым):

```powershell
.\scripts\start-gateway.ps1
```

**Терминал 2**:

```powershell
.\scripts\start-ui.ps1
```

`start-ui.ps1` сам собирает React-приложение (`npm run build`) при каждом запуске.

## Остановка

```powershell
.\scripts\stop-all.ps1
```

Или вручную: закрыть окна `start-gateway.ps1` / `start-ui.ps1` (Ctrl+C), затем `npx openclaw gateway stop`.

## Вкладки UI

| Вкладка | Назначение |
|---------|------------|
| **Чат** | Диалог с EventGenie, быстрые шаблоны запросов |
| **Событие** | Форма: название, тип, дата, гости, бюджет — контекст уходит в каждый запрос |
| **Результаты** | Файлы из `output/` (тексты, HTML, картинки) |
| **Настройки** | Статус gateway, ссылка на dashboard |

### Чат

- Индикатор **Gateway онлайн / выключен**
- Кнопка **«Новый чат»** — новая сессия OpenClaw
- Под каждым ответом ИИ — **«Сохранить текст»** или **«Сохранить изображение»** (если в ответе есть картинка)
- Быстрые кнопки: план, бюджет, приглашение, риски, VK-пост и др.

### Результаты

- Список файлов из папки `output/` (рекурсивно)
- Фильтры: Все / Тексты / HTML / Картинки
- Действия: открыть, скачать, копировать, **удалить**

Сохранённые из чата файлы попадают в `output/saved/`.

## API сервера (`web/server.mjs`)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/health` | Статус gateway и UI |
| POST | `/api/chat` | Отправить сообщение агенту |
| GET | `/api/results` | Список артефактов в `output/` |
| POST | `/api/results/save` | Сохранить ответ из чата |
| POST | `/api/results/delete` | Удалить файл по пути |
| GET | `/output/...` | Раздача сохранённых файлов |

## Файлы проекта

| Путь | Назначение |
|------|------------|
| `web/frontend/` | React UI (Vite + Tailwind) |
| `web/frontend/src/app/components/` | Вкладки: Чат, Событие, Результаты, Настройки |
| `web/server.mjs` | Node-сервер + API |
| `web/frontend/dist/` | Сборка (создаётся при `start-ui.ps1`, в git не входит) |
| `web/public/` | Legacy UI (fallback, если нет build) |

## Порт

По умолчанию **3080**. Изменить:

```powershell
$env:EVENTGENIE_UI_PORT = "3090"
.\scripts\start-ui.ps1
```

## Демо-запросы

Готовые фразы для тестирования всех скиллов: **docs/DEMO-MESSAGES.md**.

## Автозапуск gateway при входе в Windows

Если при включении ПК сам открывается OpenClaw:

```powershell
npx openclaw gateway uninstall
```

Чтобы снова включить автозапуск:

```powershell
npx openclaw gateway install
```

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| «Gateway не запущен» | `.\scripts\start-gateway.ps1` |
| `Unexpected token '<'` при сохранении | Перезапустить UI: `.\scripts\start-ui.ps1` (старый сервер без новых API) |
| Долгий ответ | LLM думает 30–90 сек — нормально |
| Rate limit | Подождать 1–3 мин, сменить модель через `setup-openclaw.ps1` |
| Пустой ответ / документация вместо плана | «Новый чат», повторить; см. правила Web UI в `skills/event-planner/SKILL.md` |
| Результаты пустые | Нажать «Сохранить» под ответом ИИ в чате |
