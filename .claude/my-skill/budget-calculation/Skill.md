# Budget Calculation Skill

Доменный навык для Finance Agent EventGenie.

## When to Use

- Расчёт сметы мероприятия
- Распределение budget_limit по категориям
- Анализ и рекомендации по оптимизации

## Source of Truth

- `skills/event-planner/agents/finance-agent.md`
- `docs/prds/PRD-event-planning.md` (US-2)

## Key Outputs

- `items[]` — category, planned_amount, description
- `total_amount`, `reserve_amount`
- `analysis`, `recommendations`

## Rules

- total ≈ budget_limit (±5%)
- Резерв 10–15%
- Минимум 5 категорий
- Суммы — «ориентировочно»
- Кейтеринг: ~2500–5000 ₽/гость (Москва, ориентир)

## Categories

Площадка, Кейтеринг, Развлечения, Декор, Фото/видео, Техника, Прочее, Резерв
