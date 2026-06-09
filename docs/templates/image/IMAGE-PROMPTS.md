# Стиль и промпты для генерации изображений EventGenie

Image Generator Agent строит промпты **по этому каталогу**. Текст на изображении — только если пользователь явно просит (лучше без текста: текст добавляют в HTML/VK отдельно).

## Типы изображений (`image_type`)

| image_type | Назначение | aspect_ratio | Примечание |
|------------|------------|--------------|------------|
| `invitation_cover` | Обложка приглашения, фон для карточки | 3:4 или 2:3 | Без мелкого текста |
| `social_banner` | Баннер для VK/Telegram | 16:9 | Яркий, читаемый в ленте |
| `poster` | Афиша / печать A4 | 3:4 | Центральный фокус, воздух по краям |
| `mood_board` | Настроение / референс декора | 1:1 | Коллажное ощущение, палитра |

## Маппинг event_type → визуальный стиль

### birthday — `birthday-warm`

```yaml
palette: soft pink, coral, cream, gold confetti
subjects: balloons, cake, fairy lights, cheerful table
mood: warm, festive, intimate
negative: blurry text, watermark, logo, ugly faces, distorted hands
prompt_suffix: "soft natural lighting, editorial event photography, high quality, no text"
```

### wedding — `wedding-elegant`

```yaml
palette: ivory, blush, sage green, gold accents
subjects: flowers, rings, elegant table setting, soft bokeh
mood: romantic, elegant, timeless
negative: cartoon, neon, cluttered, readable text, brand logos
prompt_suffix: "fine art wedding photography style, soft golden hour light, no text overlay"
```

### corporate — `corporate-minimal`

```yaml
palette: navy, white, silver, subtle blue accent
subjects: modern venue, stage, networking, clean geometry
mood: professional, confident, minimal
negative: party balloons, casual clutter, meme style, text blocks
prompt_suffix: "corporate event photography, clean composition, modern, no text"
```

### conference — `conference-stage`

```yaml
palette: deep purple, dark blue, spotlight white
subjects: auditorium, stage, audience silhouette, screens
mood: dynamic, intellectual, focused
negative: wedding decor, birthday cake, illegible slides
prompt_suffix: "conference keynote atmosphere, cinematic lighting, no readable text on screens"
```

### private — `private-cozy`

```yaml
palette: warm beige, terracotta, candlelight amber
subjects: dinner table, cozy interior, wine glasses, soft textiles
mood: intimate, welcoming
negative: overcrowded, harsh flash, text
prompt_suffix: "cozy gathering atmosphere, warm ambient light, no text"
```

---

## Шаблон промпта (английский — для image models)

```
{subject_scene} for a {event_type} event "{event_name}",
{palette}, {mood}, {prompt_suffix from theme}
```

Пример (wedding, invitation_cover):

```
Elegant floral arch and soft bokeh lights for a wedding event,
ivory blush and sage green palette, romantic timeless mood,
fine art wedding photography style, soft golden hour light, no text overlay
```

## Именование файла

```
output/images/{slug}-{image_type}-{YYYY-MM-DD}.png
```

`slug` — транслит event_name, lowercase, дефисы.

## Провайдер (OpenClaw runtime)

При вызове `image_generate`:

| Приоритет | provider/model | Когда |
|-----------|----------------|-------|
| 1 | `minimax/image-01` | если MiniMax ключ валиден |
| 2 | `openrouter/google/gemini-3.1-flash-image-preview` | если есть OPENROUTER_API_KEY |
| 3 | `openrouter/openai/gpt-5.4-image-2` | fallback |

Параметры по типу:
- `social_banner` → aspect_ratio `16:9`
- `invitation_cover`, `poster` → `3:4` или `2:3`
- `mood_board` → `1:1`

## После генерации

Сообщи пользователю:
- путь к файлу
- использованный промпт (кратко)
- «Можно вставить в VK-пост или использовать как фон HTML-приглашения»
