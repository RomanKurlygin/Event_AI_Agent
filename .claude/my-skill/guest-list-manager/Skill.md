# Guest List Manager Skill

Доменный навык для списка гостей, RSVP и рассадки.

## When to Use

- Список гостей и статусы RSVP
- Рассадка, столы, особые пожелания (дети, аллергии, +1)
- Сводка для кейтеринга и площадки

## Source of Truth

- `skills/event-planner/agents/guest-list-agent.md`

## Key Outputs

- `guest_list.summary` — total, confirmed, pending, declined, children_count
- `guest_list.guests[]` — name, rsvp_status, party_size, dietary, table_hint, notes
- `guest_list.seating_plan.tables[]` — table_id, capacity, guest_names
- `guest_list.action_items[]` — что сделать организатору дальше

## Rules

- RSVP: confirmed | pending | declined | maybe
- Если имён нет — дай шаблон таблицы + пример 3–5 строк
- Рассадка: семьи/пары вместе; детский стол при ≥5 детей
- dietary: vegetarian, vegan, halal, allergies — явно в guest row
- Не выдумывай реальные ФИО — используй placeholder или данные пользователя
