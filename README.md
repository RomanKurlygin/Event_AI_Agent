# AI Event Planner

AI-агент для планирования мероприятий: таймлайн, чек-листы задач, расчёт бюджета и рекомендации по оптимизации.

Проект построен на **Markdown-first** архитектуре: поведение агентов, промпты, PRD и документация живут в `.md` файлах. Runtime — **OpenClaw Gateway + MiniMax LLM**.

## Требования

- **Node.js 20+** и npm (для OpenClaw)
- **MiniMax API key** — в `.env`

## Быстрый старт (OpenClaw + MiniMax)

```powershell
git clone https://github.com/RomanKurlygin/Event_AI_Agent.git
cd Event_AI_Agent
```

1. Скопируй `.env.example` → `.env`, вставь **реальный** `MINIMAX_CODE_PLAN_KEY` (`sk-cp-...`) и `MINIMAX_OAUTH_TOKEN` (то же значение).
2. `npm install`
3. `.\scripts\setup-openclaw.ps1` — настройка workspace и MiniMax
4. **Всё сразу:** `.\scripts\start-eventgenie.ps1` → gateway + UI **http://127.0.0.1:3080**

Или вручную:
- `.\scripts\start-gateway.ps1` — gateway (терминал 1)
- `.\scripts\start-ui.ps1` — Web UI (терминал 2)

Остановить: `.\scripts\stop-all.ps1`

Альтернатива — OpenClaw dashboard: `.\scripts\start-dashboard.ps1` → `http://127.0.0.1:18789`

Подробнее: **docs/OPENCLAW-SETUP.md**, **docs/WEB-UI.md**, **docs/DEMO-MESSAGES.md** (готовые фразы для тестов).

Для разработки в Cursor: **SOUL.md**, **skills/event-planner/SKILL.md**, **docs/prds/**.

## Структура проекта

```
AI-Event-Planner/
├── AGENTS.md              # Правила для всех AI-инструментов
├── CLAUDE.md              # Claude Code: субагенты, команды, workflow
├── PROJECT.md             # Стек, команды, структура каталогов
├── SOUL.md                # Характер и голос агента
├── IDENTITY.md            # Имя, миссия, форматы ответов
├── USER.md                # Контекст о пользователе
├── MEMORY.md              # Стратегия долгосрочной памяти
├── TOOLS.md               # Локальные заметки по инструментам
├── HEARTBEAT.md           # Периодические проверки агента
├── gateway/config.yaml    # OpenClaw + MiniMax
├── web/                   # Web UI (чат → OpenClaw, порт 3080)
├── scripts/               # start-gateway, start-ui, stop-all, setup
├── channels/              # Каналы (cursor, VK, …)
├── package.json           # openclaw dependency
├── skills/
│   └── event-planner/
│       ├── SKILL.md       # Главный промпт + роутинг
│       ├── agents/        # Субагенты (maestro, planning, finance)
│       └── templates/     # HTML-шаблоны (приглашения)
├── docs/
│   ├── prds/              # Product Requirements Documents
│   ├── architecture/      # Технический дизайн
│   ├── plans/             # Планы реализации
│   ├── state/             # STATE.md для паузы/возобновления
│   └── templates/         # Шаблоны PRD и CONTEXT
└── .claude/
    ├── agents/            # Субагенты для разработки
    ├── commands/          # Slash-команды
    └── my-skill/          # Доменные навыки
```

## AI-агенты (домен)

| Агент | Роль |
|-------|------|
| **Maestro** | Оркестратор: intent, маршрутизация |
| **Planning Agent** | Таймлайн подготовки, задачи с приоритетами |
| **Finance Agent** | Бюджет по категориям, анализ, рекомендации |
| **Run-of-show Agent** | Программа дня по минутам |
| **Guest List Agent** | RSVP, рассадка, сводка для кейтеринга |
| **Invitation Writer** | Тексты приглашений + HTML-карточки (Google Fonts, Unsplash) |
| **Risk Checklist** | Риски, plan B, проверки перед событием |
| **Social Posts** | Анонсы и countdown для VK/Telegram |
| **Thank You Writer** | Благодарности после мероприятия |
| **Feedback Survey** | Опрос гостей (NPS, шкалы, open-вопросы) |
| **Image Generator** | Картинки для приглашений, VK-баннеров, афиш |

Подробнее: `skills/event-planner/agents/` и `docs/architecture/SYSTEM.md`.

## Документация

- **Web UI:** `docs/WEB-UI.md` — интерфейс чата (порт 3080)
- **Демо-фразы:** `docs/DEMO-MESSAGES.md` — тест всех скиллов
- **Презентация:** `docs/presentation/EventGenie.html` (открыть в браузере)
- Настройка OpenClaw: `docs/OPENCLAW-SETUP.md`
- PRD: `docs/prds/PRD-event-planning.md`
- Архитектура: `docs/architecture/SYSTEM.md`
- Репозиторий: [Event_AI_Agent](https://github.com/RomanKurlygin/Event_AI_Agent)
