# PRD: [Feature Name]

**Status**: Draft | In Review | Approved | In Progress | Complete
**Author**: [name]
**Created**: [date]
**Priority**: P0 (critical) | P1 (high) | P2 (medium) | P3 (low)

---

## 1. Objective

[1-2 sentences: What are we building and why?]

## 2. Mission

[Product mission statement for this feature.]

### Core Principles
1. [Principle 1]
2. [Principle 2]
3. [Principle 3]

## 3. Background

[Brief context: current state, motivation.]

## 4. Target Users

[Who benefits? Technical level? Key needs?]

## 5. User Stories

### US-1: [Title]

**As a** [persona]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**

```
GIVEN [precondition]
WHEN [action]
THEN [expected result]
```

**Complexity**: S | M | L
**Dependencies**: None

---

## 6. Technical Context

### Relevant Files

| File | Purpose |
|------|---------|
| `skills/event-planner/SKILL.md` | Main routing |
| `skills/event-planner/agents/*.md` | Sub-agent prompts |

## 7. Non-Functional Requirements

| Requirement | Target | How to Validate |
|-------------|--------|----------------|
| Response structure | Valid JSON schema | Unit tests |
| LLM latency | < 30s p95 | Manual / load test |

## 8. Success Criteria

- [ ] All acceptance criteria pass
- [ ] Agent prompts updated in sync
- [ ] Documentation updated

## 9. Out of Scope

- [What this PRD does NOT cover]

## 10. Validation Checklist

- [ ] Acceptance criteria validated
- [ ] No secrets in code
- [ ] MD prompts match behavior
