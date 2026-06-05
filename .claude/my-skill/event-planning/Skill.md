# Event Planning Skill

Доменный навык для Planning Agent EventGenie.

## When to Use

- Генерация таймлайна мероприятия
- Создание чек-листа задач с приоритетами
- Адаптация плана под event_type

## Source of Truth

- `skills/event-planner/agents/planning-agent.md`
- `docs/prds/PRD-event-planning.md` (US-1)

## Key Outputs

- `timeline.timeline_phases[]` — время + активность
- `tasks.tasks[]` — title, description, deadline_days, priority

## Rules

- 5–12 фаз в таймлайне
- 8–20 задач
- CRITICAL — не более 5
- deadline_days отсчитываются до event_date

## Event Type Templates

| Type | Focus |
|------|-------|
| wedding | церемония, фуршет, банкет |
| corporate | регистрация, сессии, нетворкинг |
| birthday | программа, угощение, развлечения |
| conference | доклады, кофе-брейки, hybrid slots |
