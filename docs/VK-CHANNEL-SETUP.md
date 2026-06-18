# Подключение VK (ВКонтакте) к EventGenie

Общение с EventGenie через личные сообщения боту сообщества VK.

Плагин: [@openclaw-vk/vk](https://github.com/pfrankov/openclaw-vk)

## 1. Создайте сообщество VK

1. Создайте **группу** или **публичную страницу**
2. **Управление → Сообщения** — включите сообщения
3. **Управление → Работа с API → Long Poll API**:
   - Включите Long Poll API
   - Типы событий: **Входящие сообщения**

## 2. Получите токен

**Управление → Работа с API → Ключи доступа → Создать ключ**

Права (минимум):
- **Сообщения сообщества** (`messages`)
- **Управление сообществом** (`manage`)

Скопируйте токен вида `vk1.a...`

## 3. Добавьте токен в `.env`

```env
VK_GROUP_TOKEN=vk1.a_ваш_токен
```

Не коммитьте `.env`.

## 4. Установите и настройте канал

```powershell
cd Event_AI_Agent   # корень после git clone
.\scripts\setup-vk-channel.ps1
```

Скрипт:
- установит плагин `@openclaw-vk/vk`
- сохранит токен в `~\.openclaw\workspace\secrets\vk-token.txt`
- включит канал `vk` в `~\.openclaw\openclaw.json`

## 5. Запустите gateway

```powershell
.\scripts\start-gateway.ps1
```

Оставьте окно открытым.

## 6. Pairing (первый контакт)

1. Напишите боту в VK любое сообщение (например: «Привет»)
2. Бот ответит **кодом подтверждения**
3. Одобрите в терминале:

```powershell
npx openclaw pairing approve vk КОД_ИЗ_СООБЩЕНИЯ
```

После этого бот принимает ваши сообщения и отвечает через EventGenie.

## 7. Проверка

```powershell
npx openclaw channels status --probe
```

Ожидается: `vk` — configured, running.

## Примеры запросов в VK

```
Составь план свадьбы на 100 человек в Москве, 20 августа 2026
```

```
Сделай HTML-карточку приглашения на свадьбу Ивана и Марии
```

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Бот не отвечает | Gateway запущен? `channels status --probe` |
| Код pairing не приходит | Проверьте Long Poll + входящие сообщения |
| `Group authorization failed` | Перевыпустите токен в настройках сообщества |
| Rate limit OpenRouter | Подождите или смените модель |
| `vk` not in channel list | `npx openclaw plugins install @openclaw-vk/vk` |

## Безопасность

- `dmPolicy: pairing` — только одобренные пользователи
- Для открытого доступа (не рекомендуется): `dmPolicy: open` в `openclaw.json`
- Токен только в `.env` и `~\.openclaw\workspace\secrets\`

## Ссылки

- [openclaw-vk на GitHub](https://github.com/pfrankov/openclaw-vk)
- [OpenClaw channels CLI](https://docs.openclaw.ai/cli/channels)
