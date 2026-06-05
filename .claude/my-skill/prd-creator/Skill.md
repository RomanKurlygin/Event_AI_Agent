# PRD Creator Skill

Создание Product Requirements Documents для AI Event Planner.

## When to Use

- Новая фича в EventGenie
- Обновление требований существующей фичи
- Документирование acceptance criteria

## Template

Используй `docs/templates/PRD-TEMPLATE.md`.

## Required Sections

1. Objective
2. User Stories с GIVEN/WHEN/THEN
3. Technical Context (ссылки на skills/event-planner/)
4. Success Criteria
5. Out of Scope

## Rules

- Каждый acceptance criterion — проверяемый
- Связывай с agent MD-файлами
- Следуй `AGENTS.md` секция PRD-Driven Development
- Пример готового PRD: `docs/prds/PRD-event-planning.md`

## Quality Checks

- [ ] Все user stories имеют acceptance criteria
- [ ] Указаны complexity и dependencies
- [ ] Out of scope заполнен
- [ ] Technical context ссылается на реальные файлы
