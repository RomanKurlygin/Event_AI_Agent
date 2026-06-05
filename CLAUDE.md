# CLAUDE.md

> Claude Code–специфичная конфигурация. Универсальные правила — **AGENTS.md**. Стек — **PROJECT.md**.

## Проект

**AI Event Planner (EventGenie)** — markdown-first AI-агент для планирования мероприятий.

Доменные агенты описаны в `skills/event-planner/agents/`. Runtime — **OpenClaw + MiniMax** (`gateway/config.yaml`). Разработка фич — через PRD в `docs/prds/`.

## Запуск OpenClaw

```powershell
cd C:\Users\Zazo\Desktop\AI-Event-Planner
npm install
node node_modules\openclaw\openclaw.mjs gateway run
```

Дашборд: `http://localhost:18789` (токен через `npx openclaw dashboard --no-open`)

## Важно

- `.env` содержит `MINIMAX_API_KEY` — никогда не коммитить
- `logs/` gitignored — логи gateway хранятся локально
- Skill: `skills/event-planner/SKILL.md`

## Agent Team Structure

| Agent | Роль | Когда использовать |
|-------|------|-------------------|
| `product-manager` | PRD, user stories, acceptance criteria | Новые фичи |
| `architect` | Дизайн системы, API, модели данных | Технические решения |
| `implementer` | Код, интеграция агентов | Реализация |
| `code-reviewer` | Качество, безопасность | После изменений |
| `tester` | Тесты vs acceptance criteria | Валидация |
| `docs-writer` | Документация, changelog | Обновление MD |

## Slash Commands (`.claude/commands/`)

| Команда | Назначение |
|---------|------------|
| `plan` | Создать план реализации из PRD |
| `new-feature` | Начать новую фичу (PRD → design → code) |
| `execute` | Выполнить план из `docs/plans/` |
| `validation/validate` | Прогнать validation command |

## Domain Skills (`.claude/my-skill/`)

| Skill | Описание |
|-------|----------|
| `event-planning` | Промпты и правила Planning Agent |
| `budget-calculation` | Промпты и правила Finance Agent |
| `prd-creator` | Создание PRD по шаблону |

## Directory Structure

```
.claude/
  agents/           # Субагенты разработки (*.md)
  commands/         # Slash-команды
  my-skill/         # Доменные навыки
  settings.json     # Permissions
skills/
  event-planner/    # Доменные AI-агенты (промпты)
docs/
  prds/             # PRD
  architecture/     # Дизайн
  plans/            # Планы
  state/            # STATE.md
```

## Development Workflow

### Новая фича

1. **product-manager** → PRD в `docs/prds/` (шаблон: `docs/templates/PRD-TEMPLATE.md`)
2. Review PRD
3. **architect** → `docs/architecture/`
4. **implementer** → код + обновление `skills/event-planner/agents/*.md`
5. **tester** → тесты
6. **code-reviewer** → review
7. Merge через PR

### Планирование события (runtime)

1. Пользователь пишет запрос
2. Читай `skills/event-planner/SKILL.md`
3. Maestro определяет intent
4. Делегируй planning-agent или finance-agent
5. Верни структурированный ответ (таймлайн / смета / оба)

## Session Continuity

Используй `docs/state/STATE.md` для паузы длинных сессий: фокус, решения, next steps.

## Boundaries

### Разрешено

- Читать и редактировать MD-промпты агентов
- Реализовывать код по PRD
- Обновлять `USER.md` и `memory/`

### Спросить

- Новые pip-зависимости
- Изменения API-контрактов
- Схема БД

### Запрещено

- Коммитить секреты
- Push напрямую в main
