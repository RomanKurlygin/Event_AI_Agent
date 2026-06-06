# Открытые источники дизайна для HTML-карточек приглашений

Invitation Writer Agent выбирает ресурсы **только из этого каталога**. Не придумывай случайные URL.

## Лицензии (кратко)

| Источник | Лицензия | Как использовать |
|----------|----------|------------------|
| [Google Fonts](https://fonts.google.com) | SIL Open Font License | `<link>` в `<head>` |
| [Unsplash](https://unsplash.com/license) | Unsplash License (бесплатно, атрибуция приветствуется) | фоновое фото через `images.unsplash.com` |
| [Lucide Icons](https://lucide.dev/license) | ISC | inline SVG или CDN (опционально) |
| CSS gradients | — | палитры ниже, без внешних зависимостей |

В футере карточки (мелким шрифтом): `Фото: Unsplash` + ссылка на автора, если указан в теме.

---

## Темы по `event_type`

### birthday — «Тёплый праздник»

```yaml
theme_id: birthday-warm
fonts:
  heading: "Playfair Display"
  body: "Montserrat"
  accent_script: "Great Vibes"
google_fonts_url: "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600&family=Playfair+Display:wght@600;700&display=swap"
colors:
  bg_overlay: "rgba(255, 107, 129, 0.75)"
  card_bg: "#fffaf7"
  text_primary: "#2d1b2e"
  text_secondary: "#6b4c6d"
  accent: "#ff6b81"
background:
  url: "https://images.unsplash.com/photo-1530103862676-de8c9deb7800?w=1200&q=80"
  credit: "Photo by Al Elmes on Unsplash"
  credit_url: "https://unsplash.com/photos/party-balloons"
decoration: "confetti — CSS radial-gradient dots или emoji 🎉 умеренно"
```

### wedding — «Классическая элегантность»

```yaml
theme_id: wedding-elegant
fonts:
  heading: "Cormorant Garamond"
  body: "Lato"
  accent_script: "Great Vibes"
google_fonts_url: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Lato:wght@300;400&display=swap"
colors:
  bg_overlay: "rgba(45, 35, 35, 0.55)"
  card_bg: "#fdfbf9"
  text_primary: "#2c2420"
  text_secondary: "#6b5e58"
  accent: "#b8860b"
background:
  url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80"
  credit: "Photo by Nathan Dumlao on Unsplash"
  credit_url: "https://unsplash.com/photos/wedding-flowers"
decoration: "тонкая золотая рамка, serif-заголовок"
```

### corporate — «Современный минимализм»

```yaml
theme_id: corporate-minimal
fonts:
  heading: "Inter"
  body: "Inter"
google_fonts_url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
colors:
  bg_overlay: "rgba(15, 23, 42, 0.82)"
  card_bg: "#ffffff"
  text_primary: "#0f172a"
  text_secondary: "#64748b"
  accent: "#2563eb"
background:
  url: "https://images.unsplash.com/photo-1540575467063-178a503c6727?w=1200&q=80"
  credit: "Photo by Headway on Unsplash"
  credit_url: "https://unsplash.com/photos/conference-room"
decoration: "геометрические линии, без script-шрифтов"
```

### conference — «Сцена и фокус»

```yaml
theme_id: conference-stage
fonts:
  heading: "Space Grotesk"
  body: "Source Sans 3"
google_fonts_url: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Source+Sans+3:wght@400;600&display=swap"
colors:
  bg_overlay: "rgba(17, 24, 39, 0.78)"
  card_bg: "#f8fafc"
  text_primary: "#111827"
  text_secondary: "#4b5563"
  accent: "#7c3aed"
background:
  url: "https://images.unsplash.com/photo-1475721027785-f9eccf877659?w=1200&q=80"
  credit: "Photo by Headway on Unsplash"
  credit_url: "https://unsplash.com/photos/audience"
decoration: "badge с датой, акцент на agenda/локацию"
```

### private (fallback) — «Уютный вечер»

```yaml
theme_id: private-cozy
fonts:
  heading: "Libre Baskerville"
  body: "Nunito"
google_fonts_url: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Nunito:wght@400;600&display=swap"
colors:
  bg_overlay: "rgba(55, 48, 44, 0.65)"
  card_bg: "#faf6f1"
  text_primary: "#2a2520"
  text_secondary: "#5c534a"
  accent: "#c17f59"
background:
  url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
  credit: "Photo by Eaters Collective on Unsplash"
  credit_url: "https://unsplash.com/photos/dinner-table"
decoration: "мягкие скругления, тёплые тона"
```

---

## Маппинг event_type → theme

| event_type | theme_id |
|------------|----------|
| birthday | birthday-warm |
| wedding | wedding-elegant |
| corporate | corporate-minimal |
| conference | conference-stage |
| private, other | private-cozy |

---

## Структура HTML-карточки

1. Полноэкранный фон: `background-image` из темы + `bg_overlay`
2. Центрированная карточка `max-width: 520px`, тень, `border-radius: 16px`
3. Блоки: заголовок события → дата/время → локация → текст formal → RSVP → footer с credit
4. `@media print` — белый фон, без overlay, карточка на всю ширину
5. `@media (max-width: 480px)` — padding уменьшен, шрифт заголовка −10%

Базовый шаблон: `skills/event-planner/templates/invitation/base.html`

---

## Именование файла

```
output/invitations/{slug}-{YYYY-MM-DD}.html
```

`slug` — транслит event_name, lowercase, дефисы: `den-rozhdeniya-mashi`.

После записи файла сообщи пользователю путь и: «Откройте файл в браузере или распечатайте (Ctrl+P)».
