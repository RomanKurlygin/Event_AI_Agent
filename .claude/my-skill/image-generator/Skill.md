# Image Generator Skill

Доменный навык для генерации изображений мероприятий.

## When to Use

- Картинка для приглашения, афиша, баннер VK
- Обложка события, mood board, визуал для поста
- «Сгенерируй изображение», «нарисуй баннер», «картинка на свадьбу»

## Source of Truth

- Агент: `skills/event-planner/agents/image-generator-agent.md`
- Промпты и стили: `docs/templates/image/IMAGE-PROMPTS.md`

## Key Outputs

- `generated_image.file_path` — `output/images/{slug}-{type}-{date}.png`
- `generated_image.prompt_en` — промпт для модели
- `generated_image.theme_id`, `aspect_ratio`, `usage_hint`

## Runtime

OpenClaw tool: **`image_generate`**

Провайдеры (по приоритету):
1. `minimax/image-01`
2. `openrouter/google/gemini-3.1-flash-image-preview`

## Rules

- Промпты — по IMAGE-PROMPTS.md, на английском
- Без текста на изображении по умолчанию
- Файлы в `output/images/` — локальные, не коммитить
