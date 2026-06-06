# Invitation Writer Skill

Доменный навык для текстов приглашений.

## When to Use

- Приглашение в мессенджер, email, печатная открытка
- Напоминание / save-the-date
- Короткий и развёрнутый вариант одного приглашения

## Source of Truth

- `skills/event-planner/agents/invitation-writer-agent.md`

## Key Outputs

- `invitation.event_title`, `invitation.tone`
- `invitation.variants.short` — WhatsApp / Telegram
- `invitation.variants.formal` — email / карточка
- `invitation.checklist[]` — что обязательно указать (дата, адрес, RSVP)

## Rules

- Тон по event_type: birthday — тёплый; corporate — нейтральный; wedding — торжественный
- Язык ответа — русский (если пользователь не просит иное)
- Не придумывать точный адрес — [адрес] placeholder, если не дан
- RSVP: дата дедлайна = event_date минус 7–14 дней
- Без давления на подарки, если пользователь не просил
