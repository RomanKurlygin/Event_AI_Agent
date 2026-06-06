# Invitation Writer Skill

Доменный навык для текстов приглашений и HTML-карточек.

## When to Use

- Приглашение в мессенджер, email, печатная открытка
- **HTML-карточка** — красивая страница для браузера или печати
- Напоминание / save-the-date
- Короткий и развёрнутый вариант одного приглашения

## Source of Truth

- Агент: `skills/event-planner/agents/invitation-writer-agent.md`
- Дизайн (открытые источники): `docs/templates/invitation/DESIGN-SOURCES.md`
- HTML-шаблон: `skills/event-planner/templates/invitation/base.html`
- Пример: `skills/event-planner/templates/invitation/examples/birthday-sample.html`

## Key Outputs

### Текст

- `invitation.event_title`, `invitation.tone`
- `invitation.variants.short` — WhatsApp / Telegram
- `invitation.variants.formal` — email / карточка
- `invitation.checklist[]` — что обязательно указать

### HTML-карточка

- `invitation.html_card.file_path` — `output/invitations/{slug}-{date}.html`
- `invitation.html_card.theme_id` — тема из DESIGN-SOURCES
- Самодостаточный HTML: Google Fonts + Unsplash фон + inline CSS

## Workflow (HTML)

1. Определить `event_type` → выбрать тему из DESIGN-SOURCES
2. Сгенерировать тексты (short + formal)
3. Заполнить `base.html`, записать в `output/invitations/`
4. Вернуть путь и подсказку «открыть в браузере / Ctrl+P»

## Rules

- Тон по event_type: birthday — тёплый; corporate — нейтральный; wedding — торжественный
- Язык ответа — русский (если пользователь не просит иное)
- Дизайн **только** из DESIGN-SOURCES — не выдумывать URL
- Не придумывать точный адрес — placeholder, если не дан
- RSVP: дедлайн = event_date минус 7–14 дней
- Без давления на подарки, если пользователь не просил
- `output/invitations/` — пользовательские файлы, не коммитить
