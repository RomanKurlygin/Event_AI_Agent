# EventGenie Web UI (frontend)

React-приложение для чата с EventGenie. Собирается Vite, стили — Tailwind + shadcn/ui.

## Запуск для пользователя

Обычно UI запускается через корневой скрипт (сборка + сервер):

```powershell
# из корня репозитория
.\scripts\start-ui.ps1
```

Требуется запущенный gateway: `.\scripts\start-gateway.ps1`.

## Разработка

```powershell
cd web/frontend
npm install
npm run dev
```

Dev-сервер Vite проксирует `/api` и `/output` на `http://127.0.0.1:3080` — для hot reload нужен отдельно запущенный `web/server.mjs` или полный `start-ui.ps1`.

Сборка production:

```powershell
npm run build
```

Артефакты — `web/frontend/dist/` (в git не коммитятся).

## Структура

| Путь | Описание |
|------|----------|
| `src/app/App.tsx` | Оболочка, вкладки |
| `src/app/components/ChatTab.tsx` | Чат, шаблоны, сохранение |
| `src/app/components/EventTab.tsx` | Форма события → localStorage |
| `src/app/components/ResultsTab.tsx` | Список `output/`, удаление |
| `src/context/AppContext.tsx` | Событие, сессия, health gateway |
| `src/lib/api.ts` | Запросы к `web/server.mjs` |

Подробнее: **docs/WEB-UI.md**.

## Дизайн

Оригинал Figma: [EventGenie веб-приложение](https://www.figma.com/design/H20zYviXcOeKUI81UqQbFl/EventGenie-%D0%B2%D0%B5%D0%B1-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5).
