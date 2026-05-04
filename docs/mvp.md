# StudyMonkey MVP

## Product Goal

Build a backend-driven Pomodoro study system where users complete timed study quests, gain XP, and level up a persistent character.

## Why This Is A Good MVP

This scope is small enough to finish but deep enough to teach:

- REST API design
- relational database modeling
- authentication and authorization
- layered backend architecture
- state transitions and business rules
- testing of services and endpoints

## In Scope

- User registration
- User login
- JWT-protected routes
- Persistent character stats for each user
- Quest creation with a planned duration
- Quest lifecycle management:
  - create
  - start
  - pause
  - resume
  - complete
- Actual duration tracking
- XP calculation on completion
- Character XP/level updates
- Quest history retrieval
- Basic health check endpoint

## Out Of Scope For MVP

- Social features
- Multiple avatars or cosmetics
- Leaderboards
- Realtime sync/websockets
- Notifications
- Advanced analytics dashboards
- Redis/caching
- Complex frontend polish

## Core Entities

### User

- `id`
- `email`
- `password_hash`
- `created_at`
- `updated_at`

### Character

- `id`
- `user_id`
- `xp`
- `level`
- `created_at`
- `updated_at`

### QuestSession

- `id`
- `user_id`
- `title`
- `planned_duration_minutes`
- `actual_duration_seconds`
- `status`
- `started_at`
- `paused_at`
- `ended_at`
- `created_at`
- `updated_at`

## MVP API Surface

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Character

- `GET /character/me`

### Quests

- `POST /quests`
- `POST /quests/:id/start`
- `POST /quests/:id/pause`
- `POST /quests/:id/resume`
- `POST /quests/:id/complete`
- `GET /quests`
- `GET /quests/:id`

### Health

- `GET /health`

## Key Business Rules

- A user owns their own character and quests
- XP is awarded only when a quest is completed
- XP calculation happens only on the backend
- Quest state transitions must be validated
- Actual duration is derived from timestamps, not trusted from the client
- The frontend is a consumer of API state, not the source of truth

## Recommended First Milestones

1. Set up config, database, and schema
2. Implement `users` and `auth`
3. Implement `character`
4. Implement `quests`
5. Add tests and API docs
