# /new-feature

Запусти workflow новой фичи для AI Event Planner.

## Шаги

1. **Сбор требований** — уточни у пользователя: что строим, для кого, scope
2. **PRD** — создай `docs/prds/PRD-[feature].md` по шаблону
3. **Review** — покажи PRD пользователю, дождись approve
4. **Architecture** — при необходимости обнови `docs/architecture/`
5. **Plan** — `docs/plans/[feature]-plan.md`
6. **Implement** — MD-промпты и/или код
7. **Test** — acceptance criteria
8. **Validate** — validation command

## Правила

- Не пропускай PRD
- Связывай фичу с agent skills в `skills/event-planner/`
- Обновляй `docs/state/STATE.md` в конце
