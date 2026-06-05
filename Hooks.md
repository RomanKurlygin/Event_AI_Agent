# Hooks

Опциональная система lifecycle hooks для PRD-driven development.

Конфигурация: **`.claude/settings.json`**

## Events (planned)

| Hook | Matcher | Script |
|------|---------|--------|
| PreToolUse | `Skill` | `.claude/hooks/pre-prd-check.sh` |
| PostToolUse | `Skill` | `.claude/hooks/prd-quality-check.sh` |
| Stop | — | `.claude/hooks/session-report.sh` |

> Hooks не включены в Phase 1. Добавь скрипты в `.claude/hooks/` при необходимости.

## PRD-focused features

- Проверка структуры PRD
- Валидация GIVEN/WHEN/THEN
- Оценка качества требований

## Data

- Logs: `.claude/hooks/logs/*.jsonl`
- Metrics: `.claude/hooks/metrics/*.jsonl`
