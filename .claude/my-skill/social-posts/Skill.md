# Social Posts Skill

Доменный навык для постов в соцсетях о мероприятии.

## When to Use

- Анонс, countdown, напоминание в VK / Telegram
- Контент-план публикаций до события
- Итоговый пост после мероприятия

## Source of Truth

- `skills/event-planner/agents/social-posts-agent.md`

## Key Outputs

- `social_posts.posts` — announcement, countdown, reminder, recap
- `social_posts.hashtags[]`
- `social_posts.posting_schedule[]`

## Rules

- VK: до 500 символов, умеренно эмодзи
- Разные тексты для announcement vs countdown
- Язык — русский
