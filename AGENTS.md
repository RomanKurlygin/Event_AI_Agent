# AGENTS.md

> Универсальные инструкции для AI-инструментов (Cursor, Claude Code, Copilot и др.)

Этот репозиторий — **AI Event Planner**: markdown-first workspace для планирования мероприятий с многоагентной архитектурой.

- Домен и промпты агентов: **skills/event-planner/**
- Требования к фичам: **docs/prds/**
- Стек и команды: **PROJECT.md**
- Claude Code setup: **CLAUDE.md**
- Личность агента: **SOUL.md**, **IDENTITY.md**

## 1. Session Startup

Используй контекст, который уже предоставлен в сессии:

- `AGENTS.md`, `SOUL.md`, `USER.md`
- `skills/event-planner/SKILL.md`
- `memory/YYYY-MM-DD.md` (если есть)
- `MEMORY.md` — только в основной (личной) сессии

Не перечитывай файлы вручную, если контекст уже достаточен.

## 2. Memory

Ты «просыпаешься» заново каждую сессию. Файлы — твоя непрерывность:

- **Ежедневные заметки:** `memory/YYYY-MM-DD.md`
- **Долгосрочная память:** `MEMORY.md` — курируемые решения и уроки
- **Профиль пользователя:** `USER.md`

**Правило:** если нужно запомнить — **запиши в файл**. Ментальные заметки не переживают рестарт.

## 3. Red Lines

- Не выносить приватные данные за пределы workspace.
- Не запускать деструктивные команды без подтверждения.
- `trash` > `rm`
- Не коммитить `.env` и секреты.

## 4. PRD-Driven Development

Разработка фич ведётся через PRD:

```
docs/
  prds/            Product Requirements Documents
  architecture/    Технический дизайн
  plans/           Планы реализации
  state/           STATE.md для паузы/возобновления
  templates/       Шаблоны документов
```

Каждая реализация должна ссылаться на PRD и покрывать acceptance criteria (GIVEN/WHEN/THEN).

## 5. Доменные агенты

| Агент | Файл | Ответственность |
|-------|------|-----------------|
| Maestro | `skills/event-planner/agents/maestro.md` | Intent, роутинг |
| Planning | `skills/event-planner/agents/planning-agent.md` | Таймлайн, задачи |
| Finance | `skills/event-planner/agents/finance-agent.md` | Бюджет, рекомендации |
| Run-of-show | `skills/event-planner/agents/run-of-show-agent.md` | Программа дня по минутам |
| Guest list | `skills/event-planner/agents/guest-list-agent.md` | RSVP, рассадка |
| Invitation | `skills/event-planner/agents/invitation-writer-agent.md` | Тексты + HTML-карточки |
| Risk checklist | `skills/event-planner/agents/risk-checklist-agent.md` | Риски и plan B |
| Social posts | `skills/event-planner/agents/social-posts-agent.md` | Посты VK/Telegram |
| Thank you | `skills/event-planner/agents/thank-you-writer-agent.md` | Благодарности после события |
| Feedback survey | `skills/event-planner/agents/feedback-survey-agent.md` | Опрос гостей |

Главный роутинг — в `skills/event-planner/SKILL.md`.

## 6. Development Principles

- **Single Responsibility** — один модуль/агент = одна задача
- **Readability First** — ясные имена, короткие функции
- **Consistency** — следуй паттернам в codebase
- **Predictable Behavior** — явная логика, без скрытых side effects

## 7. Code Style (когда есть код)

- Python 3.11+, FastAPI, async/await
- Pydantic для валидации
- Type hints на всех публичных методах
- Логирование входов/выходов агентов
- Тесты с моками LLM — без реальных API в CI

## 8. Security

Никогда:

- логировать токены и пароли
- коммитить credentials
- отключать валидацию входных данных

## 9. Git Workflow

**Ветки:** `feat/`, `fix/`, `docs/`, `chore/`

**Коммиты:** conventional commits (`feat:`, `fix:`, `docs:`)

**PR:** CI + тесты + review перед merge в main.

## 10. Agent Permissions

### Разрешено

- Читать любые файлы
- Редактировать код и документацию в рамках PRD
- Создавать ветки и коммиты
- Обновлять `memory/` и `USER.md`

### Спросить сначала

- Новые зависимости
- Изменения схемы БД
- Публичные API-контракты
- CI/CD конфигурация

### Запрещено

- Коммитить секреты
- Пропускать тесты для новой логики
- Force push в main

## 11. Validation Checklist

Перед завершением задачи:

- [ ] Реализация соответствует PRD
- [ ] Acceptance criteria проверены
- [ ] Lint и тесты проходят (см. PROJECT.md)
- [ ] Документация обновлена
- [ ] Нет секретов в коде

## 12. Make It Yours

Добавляй свои конвенции по мере роста проекта. Markdown — живой источник правды.
