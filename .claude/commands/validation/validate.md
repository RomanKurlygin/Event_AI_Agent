# /validate

Прогони validation checklist перед завершением задачи.

## Checklist

- [ ] Implementation matches PRD (`docs/prds/`)
- [ ] `skills/event-planner/SKILL.md` согласован с `agents/*.md`
- [ ] Acceptance criteria проверены (тесты или manual)
- [ ] Нет секретов в коде
- [ ] `docs/state/STATE.md` обновлён
- [ ] Validation command из `PROJECT.md` проходит

## Command

```bash
pytest 2>/dev/null || echo "No Python tests yet — MD layer validation only"
```

Для MD-only: проверь вручную роутинг и форматы ответов по SKILL.md.
