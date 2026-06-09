# Risk Checklist Skill

Доменный навык для чек-листа рисков мероприятия.

## When to Use

- «Что может пойти не так?», риски, plan B
- Подготовка к outdoor / свадьбе / корпоративу
- Чек-лист перед днём события

## Source of Truth

- `skills/event-planner/agents/risk-checklist-agent.md`

## Key Outputs

- `risk_checklist.risks[]` — category, risk, likelihood, impact, mitigation, owner
- `risk_checklist.top_priorities[]`
- `risk_checklist.pre_event_checks[]`

## Rules

- 8–15 рисков, у каждого конкретный mitigation
- likelihood/impact: low | medium | high
- Учитывать event_type и format (outdoor, hybrid)
