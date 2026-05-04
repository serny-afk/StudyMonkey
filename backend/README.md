# Backend Plan

This backend is the core of StudyMonkey. The MVP is intentionally backend-first so the project teaches API design, data modeling, authentication, validation, service-layer logic, and testing before UI concerns take over.

## MVP Responsibilities

- Authenticate users with email/password and JWT
- Persist a user character with XP and level
- Create and manage Pomodoro-style quest sessions
- Track quest lifecycle: `created`, `active`, `paused`, `completed`, `cancelled`
- Award XP on completion based on actual study time
- Return current character stats and quest history

## Proposed Source Layout

```text
src/
  common/       shared helpers, guards, decorators, pipes, interceptors
  config/       env validation and application configuration
  database/     ORM client, database module, migrations/seeds references
  modules/
    auth/       registration, login, JWT strategy, auth DTOs
    users/      user entity/profile access
    character/  XP, level, progression reads/updates
    quests/     quest session lifecycle and history
    health/     simple service health/readiness endpoint
```

## Suggested Build Order

1. Configuration and environment handling
2. Database connection and schema
3. `users` + `auth`
4. `character`
5. `quests`
6. Validation, tests, and API documentation

## Near-Term Improvements

- Add a real ORM and migrations
- Add DTO validation with `class-validator`
- Add auth guards and password hashing
- Add OpenAPI/Swagger for local exploration
- Replace the starter controller with feature modules
