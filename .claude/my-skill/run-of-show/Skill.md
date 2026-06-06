# Run of Show Skill

Доменный навык для поминутной программы дня события.

## When to Use

- Программа на день мероприятия (не подготовительный таймлайн)
- Run-of-show, cue sheet, сетка «кто / где / когда»
- Координация команды в день X

## Source of Truth

- `skills/event-planner/agents/run-of-show-agent.md`
- `docs/prds/PRD-event-planning.md` (дополнение к US-1)

## Key Outputs

- `run_of_show.start_time`, `run_of_show.duration_minutes`
- `run_of_show.cues[]` — time, duration_min, activity, owner, notes
- `run_of_show.contingency_notes[]`

## Rules

- Интервал cue: 5–15 мин (крупные блоки — до 30 мин)
- У каждого cue — owner (ведущий, техник, кейтеринг, организатор)
- Буфер 5–10 мин между ключевыми блоками
- Не дублирует подготовительные задачи из planning-agent

## Distinction vs event-planning

| event-planning | run-of-show |
|----------------|-------------|
| Фазы подготовки до события | Минутная сетка в день события |
| deadline_days, CRITICAL tasks | time, owner, cue notes |
