# PRD: Event Planning & Budget

**Status**: Approved
**Author**: EventGenie Team
**Created**: 2026-06-05
**Priority**: P0 (critical)

---

## 1. Objective

Создать AI-агента, который по описанию мероприятия генерирует план (таймлайн + задачи) и/или бюджет с рекомендациями. Поведение агентов определяется Markdown-промптами.

## 2. Mission

Сделать планирование событий доступным: один запрос → структурированный результат без ручного шаблона.

### Core Principles

1. **Markdown-first** — промпты и правила в `.md`, код тонкий.
2. **Мультиагентность** — Maestro маршрутизирует к специалистам.
3. **Практичность** — actionable задачи и реалистичные сметы.

## 3. Background

EventGenie — мультиагентный планировщик мероприятий (Maestro, Planning, Finance) на **OpenClaw Gateway + MiniMax/OpenRouter** с **Markdown-first** workspace и PRD-driven workflow.

**Runtime:** OpenClaw Gateway + MiniMax LLM (`gateway/config.yaml`).

## 4. Target Users

- Организаторы корпоративов и частных праздников
- Event-менеджеры на старте проекта
- Студенты / разработчики, изучающие agentic AI

## 5. User Stories

### US-1: Генерация плана события

**As a** организатор
**I want to** получить таймлайн и чек-лист задач
**So that** я знаю программу и что делать до даты события

**Acceptance Criteria:**

```
GIVEN валидные event_name, event_type, event_date, location, expected_guests
WHEN пользователь запрашивает план
THEN возвращается timeline с 5+ фазами
AND возвращается список задач с priority и deadline_days
AND каждая CRITICAL-задача имеет deadline_days >= 30
```

**Complexity**: M

---

### US-2: Расчёт бюджета

**As a** организатор
**I want to** получить смету по категориям
**So that** я понимаю распределение расходов

**Acceptance Criteria:**

```
GIVEN budget_limit и expected_guests
WHEN пользователь запрашивает бюджет
THEN возвращается минимум 5 категорий с planned_amount
AND total_amount в пределах ±5% от budget_limit
AND есть analysis и минимум 2 recommendations
```

**Complexity**: M

---

### US-3: Полное планирование через Maestro

**As a** пользователь
**I want to** одним запросом получить план и бюджет
**So that** не переключаться между режимами

**Acceptance Criteria:**

```
GIVEN сообщение с упоминанием плана и бюджета
WHEN Maestro обрабатывает запрос
THEN intent = full_event_planning
AND вызываются planning-agent и finance-agent
AND результат содержит plan и budget
```

**Complexity**: L

---

### US-4: Уточнение недостающих данных

**As a** пользователь
**I want to** чтобы агент спросил недостающие поля
**So that** план не строился на выдуманных данных

**Acceptance Criteria:**

```
GIVEN отсутствует event_date или expected_guests
WHEN пользователь запрашивает план или бюджет
THEN агент задаёт 1-3 уточняющих вопроса
AND не генерирует полный план до получения критичных полей
```

**Complexity**: S

## 6. Technical Context

| File | Purpose |
|------|---------|
| `skills/event-planner/SKILL.md` | Роутинг и форматы ответов |
| `skills/event-planner/agents/maestro.md` | Intent classification |
| `skills/event-planner/agents/planning-agent.md` | Timeline + tasks |
| `skills/event-planner/agents/finance-agent.md` | Budget + recommendations |
| `src/agents/*.py` | Runtime (опционально) |

## 7. Success Criteria

### Functional

- [ ] US-1–US-4 acceptance criteria выполняются в чате Cursor/Claude
- [ ] JSON-структуры соответствуют схемам в agent MD-файлах

### Quality

- [ ] Промпты согласованы между SKILL.md и agents/*.md
- [ ] PRD синхронизирован с реализацией

## 8. Out of Scope

- Интеграция с календарём и email-рассылками
- Бронирование вендоров
- Мультиязычность (кроме русского)
- Мобильное приложение

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Неточные цены LLM | Medium | Оговорка «ориентировочно», диапазоны |
| Неполный ввод | High | US-4: уточняющие вопросы |
| Расхождение MD и кода | Medium | MD — source of truth |
