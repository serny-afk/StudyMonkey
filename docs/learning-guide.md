# StudyMonkey Learning Guide

This guide is not just about how to run the project.

It is about what this project is supposed to teach you and how to use the codebase as a study tool.

The goal is:

- understand what the system does
- understand why it was designed this way
- understand what each important backend/frontend part is doing
- use the project as a concrete introduction to backend engineering

Think of this document as a guided reading path through the code.

## How To Use This Guide

For each section:

1. read the concept here
2. open the referenced files
3. trace the flow yourself
4. ask: "why is the code written this way?"

Do not try to memorize everything at once.

The point is to build intuition for:

- API design
- backend architecture
- database design
- authentication
- state transitions
- transactions
- frontend/backend boundaries

## What This Project Is Teaching

At a high level, StudyMonkey teaches:

- how to design a backend around a real product loop
- how to model state in a relational database
- how to separate controllers, services, and database concerns
- how authentication works in practice
- how business rules live in the backend, not the UI
- how a frontend consumes backend state rather than inventing its own truth

This is not a "build a pretty website" project.

It is really a project about:

- persistent state
- correctness
- user ownership
- controlled state transitions
- backend-driven behavior

## How This Project Maps To Backend Projects In General

One of your goals is not just to understand StudyMonkey.
It is to use StudyMonkey as a model for how backend-focused projects are usually structured.

That is a good way to study.

This project is small, but the patterns inside it are very common:

- config loaded at startup
- a database schema that models the core product entities
- feature modules that group related backend behavior
- controllers that define routes
- services that hold business rules
- authentication that proves user identity
- authorization that protects private resources
- transactions for multi-step correctness
- a frontend or client that consumes API responses instead of owning truth

So when you study this codebase, try to read every section in two layers:

### Layer 1: What is this code doing in StudyMonkey?

Example:

- "This service starts and pauses study quests."

### Layer 2: What backend idea does this represent in general?

Example:

- "This is a stateful workflow service that enforces valid transitions."

That second layer is the one that transfers to future projects.

## Recurring Backend Patterns To Watch For

As you read the code, keep asking which general pattern you are looking at.

### Config and startup pattern

General idea:

- load configuration early
- validate it early
- fail fast if required settings are missing

StudyMonkey example:

- `backend/src/config/env.validation.ts`
- `backend/src/main.ts`

### Resource and schema pattern

General idea:

- identify the core domain entities
- model their relationships in the database
- use constraints to protect data quality

StudyMonkey example:

- `users`
- `characters`
- `quest_sessions`

### Module / controller / service pattern

General idea:

- group code by domain feature
- keep request routing separate from business logic

StudyMonkey example:

- `auth`
- `users`
- `character`
- `quests`

### Auth pattern

General idea:

- register users
- verify credentials
- issue tokens or sessions
- protect private routes

StudyMonkey example:

- login and register endpoints
- JWT guard
- protected `character` and `quest` routes

### State machine pattern

General idea:

- some domain objects are not just "data"
- they move through a controlled workflow

StudyMonkey example:

- quest lifecycle from `created` to `active`, `paused`, and `completed`

### Transaction pattern

General idea:

- if one user action changes multiple important records, bundle them atomically

StudyMonkey example:

- quest completion updates both quest state and character progression

### Thin-client pattern

General idea:

- the client triggers actions and renders results
- the server owns correctness

StudyMonkey example:

- the frontend can display a timer, but the backend still owns final duration and XP

## The Product Loop

Before reading code, make sure you understand the product loop:

1. a user creates an account
2. the user gets a character record
3. the user creates a study quest
4. the quest moves through statuses
5. completion awards XP
6. XP updates character progression
7. the frontend reads and displays that state

That loop is the heart of the entire project.

If you understand that loop, the codebase becomes much easier to follow.

## Lesson 1: Configuration And App Startup

### What this teaches

- environment-based configuration
- startup bootstrapping
- why ports, secrets, and DB URLs should not be hardcoded

### Read these files

- [backend/src/main.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/main.ts)
- [backend/src/app.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/app.module.ts)
- [backend/src/config/env.validation.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/config/env.validation.ts)
- [backend/.env](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/.env)

### What to notice

- `main.ts` starts the Nest app
- CORS is enabled so the frontend can talk to the backend
- validation pipe is global, meaning incoming DTOs are validated automatically
- `ConfigModule` loads env vars and validates them
- the backend defaults to `3001` locally to avoid clashing with the frontend

### Why this matters

In real systems, bugs often come from configuration problems, not just logic bugs.

This project teaches that:

- secrets belong in env vars
- DB connection settings belong in env vars
- port selection matters when multiple services run locally

### Questions to ask yourself

- Why validate env vars at startup instead of failing later?
- Why is CORS configured in the backend instead of the frontend?
- What breaks if `JWT_SECRET` is missing?

## Lesson 2: Relational Database Design

### What this teaches

- entity design
- one-to-one and one-to-many relationships
- constraints and indexes
- using the database to protect correctness

### Read these files

- [backend/sql/001_init.sql](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/sql/001_init.sql)

### What to notice

There are three core tables:

- `users`
- `characters`
- `quest_sessions`

Relationships:

- one user has one character
- one user has many quest sessions

Constraints do real work:

- `email` is unique
- XP cannot be negative
- level must stay positive
- quest status must be one of a fixed set
- planned duration must be positive

Indexes also matter:

- quest lookups by `user_id`
- quest history ordering
- filtering by `status`

### Why this matters

A lot of backend design is really database design.

This project teaches that good schema design reduces bugs before application code even runs.

### Questions to ask yourself

- Why is `characters.user_id` unique?
- Why is quest `status` constrained at the DB level?
- Why do we store timestamps like `started_at`, `paused_at`, `ended_at` instead of trusting the frontend timer?

## Lesson 3: Database Access Layer

### What this teaches

- how backend code talks to PostgreSQL
- when to use transactions
- keeping DB concerns centralized

### Read these files

- [backend/src/database/database.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/database/database.service.ts)
- [backend/src/database/database.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/database/database.module.ts)

### What to notice

- `DatabaseService` owns the Postgres pool
- `query(...)` is the basic escape hatch for SQL
- `withTransaction(...)` lets you run a multi-step operation safely
- SSL is enabled automatically for non-local DB URLs

### Why this matters

Even though this project does not use an ORM, it still has a database abstraction layer.

That teaches a useful lesson:

- "no ORM" does not mean "no structure"

The database service gives the rest of the app:

- one place to manage connections
- one place to add transaction behavior
- one place to adjust DB access strategy later

### Questions to ask yourself

- Why is `withTransaction(...)` useful for quest completion?
- Why not let every service create its own DB pool?

## Lesson 4: Modular Backend Architecture

### What this teaches

- how Nest modules organize a backend
- how to separate responsibilities cleanly

### Read these files

- [backend/src/app.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/app.module.ts)
- [backend/src/modules/auth/auth.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.module.ts)
- [backend/src/modules/character/character.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/character/character.module.ts)
- [backend/src/modules/quests/quests.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.module.ts)

### What to notice

The app is split by feature:

- auth
- users
- character
- quests
- health

That is important.

The code is not grouped by technical type alone. It is grouped by domain responsibility.

### Why this matters

Feature-based organization scales better than dumping everything into one giant service or controller.

This is one of the first backend design lessons worth learning early.

### Questions to ask yourself

- Why is `users` separate from `auth`?
- Why is `character` separate from `quests` even though quest completion affects XP?

## Lesson 5: Controllers Vs Services

### What this teaches

- API layer vs business logic layer
- thin controllers, thick services

### Read these files

- [backend/src/modules/auth/auth.controller.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.controller.ts)
- [backend/src/modules/auth/auth.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.service.ts)
- [backend/src/modules/quests/quests.controller.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.controller.ts)
- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)

### What to notice

Controllers mostly:

- define routes
- extract params/body/user from request
- call service methods

Services mostly:

- enforce business rules
- run SQL
- decide when to throw errors
- coordinate state changes

### Why this matters

This is one of the most important backend design habits in the project.

If controllers contain all the logic:

- testing gets harder
- reuse gets harder
- code becomes messy fast

### Questions to ask yourself

- What logic is intentionally not in the controller?
- Why is the service the right place for quest lifecycle rules?

## Lesson 6: Authentication And Authorization

### What this teaches

- registration
- login
- password hashing
- JWT token issuance
- route protection

### Read these files

- [backend/src/modules/auth/auth.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.controller.ts)
- [backend/src/modules/auth/auth.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.service.ts)
- [backend/src/modules/auth/jwt-auth.guard.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/jwt-auth.guard.ts)
- [backend/src/modules/users/users.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/users/users.service.ts)

### What to notice

Register:

- email normalized
- password hashed with bcrypt
- user and character created transactionally
- JWT returned

Login:

- email normalized
- user looked up
- password checked
- JWT returned

Protected routes:

- use `JwtAuthGuard`
- can access `request.user.id`

### Why this matters

This project teaches that auth is not just "login page UI."

It is:

- identity
- credential verification
- token issuance
- backend route protection
- ownership checks

### Questions to ask yourself

- Why return a token instead of storing login state server-side?
- Why hash passwords instead of storing them directly?
- Why are quest routes protected with JWT?

## Lesson 7: State Machines And Quest Lifecycle

### What this teaches

- state transitions
- backend-enforced workflow
- why business rules matter

### Read these files

- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)
- [backend/src/modules/quests/quests.types.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.types.ts)

### What to notice

Quest statuses include:

- `created`
- `active`
- `paused`
- `completed`
- `cancelled`

But not every transition is allowed.

Rules include:

- only `created` quests can be started
- only `active` quests can be paused
- only `paused` quests can be resumed
- only `active` or `paused` quests can be completed
- only one in-progress quest is allowed per user

### Why this matters

This is one of the strongest backend lessons in the entire project.

The backend is enforcing a state machine.

That means the frontend cannot just invent invalid states.

### Questions to ask yourself

- Why is "one quest at a time" enforced on the backend instead of only in the UI?
- What bad data would exist if these transitions were not checked?

## Lesson 8: Time Tracking Without Trusting The Client

### What this teaches

- server-side derivation of duration
- why the backend must own time-sensitive logic

### Read these files

- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)

### What to notice

The frontend does not submit "I studied for 27 minutes."

Instead, the backend derives duration from:

- `started_at`
- `last_resumed_at`
- `paused_at`
- `ended_at`
- `actual_duration_seconds`

This protects the system from fake or inaccurate client timing.

### Why this matters

This is classic backend source-of-truth thinking.

If the client controlled final study duration, the XP system would be trivial to exploit.

### Questions to ask yourself

- Why is `actual_duration_seconds` accumulated on pause/complete?
- Why is `last_resumed_at` needed separately from `started_at`?

## Lesson 9: Transactions And Consistency

### What this teaches

- atomic updates
- consistency across tables

### Read these files

- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)
- [backend/src/database/database.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/database/database.service.ts)

### What to notice

Quest completion is done inside a transaction.

That matters because completion updates:

- the quest row
- the character row

Those two changes should either both succeed or both fail.

### Why this matters

Without a transaction, you could end up with:

- quest marked completed but no XP awarded
- XP awarded but quest not completed

That would corrupt product logic.

### Questions to ask yourself

- What would a partial failure look like here?
- Why is quest completion more transaction-sensitive than a simple read?

## Lesson 10: Character Progression

### What this teaches

- derived progression systems
- backend-owned reward updates

### Read these files

- [backend/src/modules/character/character.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/character/character.service.ts)
- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)

### What to notice

Character data is simple:

- XP
- level

Quest completion is what mutates it.

The frontend never "awards itself XP."

### Why this matters

This reinforces the core backend lesson:

- UI displays progression
- backend decides progression

## Lesson 11: Frontend As A Real Client

### What this teaches

- frontend/backend boundaries
- local token storage
- fetching protected data
- deriving UI state from backend records

### Read these files

- [frontend/lib/api.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/lib/api.ts)
- [frontend/components/main-room/MainRoomScreen.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/MainRoomScreen.tsx)
- [frontend/components/main-room/AuthPanel.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/AuthPanel.tsx)

### What to notice

Frontend responsibilities:

- submit login/register
- store access token locally
- fetch current character
- fetch quests
- call quest lifecycle endpoints
- render room UI from backend data

It does not own business truth.

### Why this matters

This project teaches a good frontend/backend relationship:

- frontend is interactive
- backend is authoritative

### Questions to ask yourself

- Why does the frontend compute display timer state from backend timestamps?
- Why is there still some frontend state even though the backend is source of truth?

## Lesson 12: MainRoomScreen As Integration Layer

### What this teaches

- orchestration in React
- mapping backend records into UI state

### Read this file carefully

- [frontend/components/main-room/MainRoomScreen.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/MainRoomScreen.tsx)

### What to notice

This file is the frontend's orchestration brain.

It does several jobs:

- restore token from local storage
- bootstrap character + quest data
- identify the active or paused quest
- derive `SessionState`
- wire UI actions to API calls
- handle auth errors defensively

This is one of the most educational frontend files in the project because it shows how a UI layer coordinates with a real backend.

## Lesson 13: The Room UI Is Presentation, Not Business Logic

### What this teaches

- separating presentation from application rules

### Read these files

- [frontend/components/main-room/RoomScene.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/RoomScene.tsx)
- [frontend/components/main-room/HotspotOverlay.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/HotspotOverlay.tsx)
- [frontend/components/main-room/DeskPanel.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/DeskPanel.tsx)
- [frontend/components/main-room/CorkBoardPanel.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/CorkBoardPanel.tsx)
- [frontend/components/main-room/ShelfPanel.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/ShelfPanel.tsx)

### What to notice

- `RoomScene` is mostly visual
- `HotspotOverlay` controls click targets
- the panels display or trigger backend-backed behavior

The UI was intentionally trimmed so fake functionality was removed.

That is a useful lesson too:

- a smaller truthful MVP is better than a larger fake one

## Lesson 14: Defensive Programming

### What this teaches

- preventing misuse
- handling invalid states safely

### Read these files

- [frontend/components/main-room/MainRoomScreen.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/MainRoomScreen.tsx)
- [frontend/components/main-room/AuthPanel.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/AuthPanel.tsx)
- [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)

### What to notice

Examples:

- auth submit is guarded by a frontend in-flight state flag
- stale client session is cleared when token-based bootstrap fails
- backend enforces one in-progress quest at a time
- backend rejects invalid state transitions instead of hoping the UI behaves

### Why this matters

Defensive programming is a big part of backend design maturity.

You are not only building "the happy path."
You are also deciding what happens when people do weird things.

## Lesson 15: MVP Scope And Tradeoffs

### What this teaches

- how to keep scope under control
- how to decide what belongs in MVP

### Current real MVP functionality

- register
- login
- fetch current character
- fetch quest list
- create quest
- start quest
- pause quest
- resume quest
- complete quest
- persist XP + level

### Things intentionally not treated as real systems

- companion behavior
- rich ambience systems
- leaderboard
- extra progression systems beyond XP/level

### Why this matters

One of the best engineering lessons from this project is:

- trim fake functionality
- keep backend truth clear
- ship the core loop first

## Suggested Reading Order In The Code

If you want to understand the whole project from top to bottom, use this order:

1. [docs/developer-guide.md](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/docs/developer-guide.md)
2. [backend/sql/001_init.sql](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/sql/001_init.sql)
3. [backend/src/main.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/main.ts)
4. [backend/src/app.module.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/app.module.ts)
5. [backend/src/database/database.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/database/database.service.ts)
6. [backend/src/modules/users/users.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/users/users.service.ts)
7. [backend/src/modules/auth/auth.controller.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.controller.ts)
8. [backend/src/modules/auth/auth.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/auth/auth.service.ts)
9. [backend/src/modules/character/character.controller.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/character/character.controller.ts)
10. [backend/src/modules/character/character.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/character/character.service.ts)
11. [backend/src/modules/quests/quests.controller.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.controller.ts)
12. [backend/src/modules/quests/quests.service.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/src/modules/quests/quests.service.ts)
13. [frontend/lib/api.ts](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/lib/api.ts)
14. [frontend/components/main-room/MainRoomScreen.tsx](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend/components/main-room/MainRoomScreen.tsx)
15. then read the room UI components

## Study Questions

If you want to actively learn from this project, answer these in your own words:

1. Why is the backend the source of truth for XP and duration?
2. Why is quest completion transactional?
3. Why does the frontend still need local state if the backend owns truth?
4. Why separate controller logic from service logic?
5. What is the difference between authentication and authorization in this project?
6. Why is one active quest at a time a backend rule?
7. What would break if the UI invented its own XP updates?

## Quick Reference

Use this section when you already understand the concepts and just need to find the code quickly.

### Repo shape

```text
StudyMonkey/
  backend/      NestJS API
  frontend/     Next.js client
  docs/         project notes and learning docs
```

### Main backend areas

- `backend/src/main.ts`
  App startup, CORS, global validation, port binding.
- `backend/src/app.module.ts`
  Root Nest module and module wiring.
- `backend/src/database/`
  PostgreSQL pool, query helper, transaction helper.
- `backend/src/modules/auth/`
  Register, login, JWT, route protection.
- `backend/src/modules/users/`
  User creation and lookup.
- `backend/src/modules/character/`
  Read current character state.
- `backend/src/modules/quests/`
  Quest lifecycle rules and progression updates.
- `backend/sql/001_init.sql`
  Schema, constraints, indexes, initial table design.

### Main frontend areas

- `frontend/app/page.tsx`
  Frontend entry page.
- `frontend/lib/api.ts`
  All current API calls and shared frontend request types.
- `frontend/components/main-room/MainRoomScreen.tsx`
  Frontend orchestration layer.
- `frontend/components/main-room/AuthPanel.tsx`
  Login and register form UI.
- `frontend/components/main-room/DeskPanel.tsx`
  Create, start, pause, resume, and complete quest actions.
- `frontend/components/main-room/CorkBoardPanel.tsx`
  Quest list display.
- `frontend/components/main-room/ShelfPanel.tsx`
  XP and level display.
- `frontend/components/main-room/RoomScene.tsx`
  Room visuals.
- `frontend/components/main-room/HotspotOverlay.tsx`
  Clickable room hotspots.

### If you want to change...

#### Auth behavior

Look at:

- `backend/src/modules/auth/*`
- `frontend/components/main-room/AuthPanel.tsx`
- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/lib/api.ts`

#### Quest lifecycle rules

Look at:

- `backend/src/modules/quests/quests.service.ts`

#### Schema or persistence rules

Look at:

- `backend/sql/001_init.sql`
- `backend/src/database/database.service.ts`

#### Room visuals or hotspot placement

Look at:

- `frontend/components/main-room/RoomScene.tsx`
- `frontend/components/main-room/HotspotOverlay.tsx`
- `frontend/app/globals.css`

#### Desk / timer behavior

Look at:

- `frontend/components/main-room/DeskPanel.tsx`
- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/lib/api.ts`

#### XP / level display

Look at:

- `frontend/components/main-room/ShelfPanel.tsx`
- `frontend/components/main-room/StatusRibbon.tsx`

## Backend Foundations Primer

If you are new to backend development, this section gives you the mental model you need before diving deeper into the code.

### What a backend actually is

A backend is the part of the system that:

- receives requests from clients
- validates input
- applies business rules
- reads and writes persistent data
- decides what response the client gets back

In this project:

- the browser UI is the client
- the NestJS app is the backend
- PostgreSQL is the persistent storage

### The core backend mindset

Frontend code is about interaction.
Backend code is about truth.

That means the backend is responsible for:

- deciding whether a request is valid
- deciding whether a user is allowed to do something
- enforcing workflow rules
- protecting data from invalid states

This is why StudyMonkey does not let the frontend award itself XP or invent fake quest states.

### The request-response cycle in this project

Every backend feature here follows roughly the same path:

1. the frontend sends an HTTP request
2. a Nest controller receives it
3. the controller passes the work to a service
4. the service validates business rules
5. the service reads or updates PostgreSQL
6. the service returns data
7. the controller sends the response back
8. the frontend updates the UI

Whenever you feel lost, try mapping the current feature to that sequence.

### Why backend design matters

Without backend design, code often becomes:

- duplicated
- insecure
- hard to test
- easy to corrupt with invalid state

This project teaches backend design by showing the same ideas repeatedly:

- clear ownership of responsibilities
- a stable database schema
- state transitions enforced on the server
- transactions for multi-step correctness
- a frontend that consumes truth instead of inventing it

## Core Concepts You Should Learn From This Codebase

You do not need to master everything at once.
These are the main ideas worth understanding well.

### 1. Resource-oriented API design

The backend exposes resources such as:

- users
- character
- quests

Instead of one giant endpoint, the API is split into meaningful operations like:

- `POST /auth/register`
- `POST /auth/login`
- `GET /character/me`
- `GET /quests`
- `POST /quests/:id/start`

This teaches a very common backend habit:

- model the product as resources and actions

### 2. Modular service design

Nest encourages grouping code by feature.
That is why this project has separate modules for:

- auth
- users
- character
- quests

This is a good beginner architecture because each module has a clear job.

### 3. Persistence and schema design

A relational database is not just a storage bucket.
It is part of your correctness model.

The schema is teaching you:

- how to model relationships
- how to use constraints
- how timestamps support stateful workflows

### 4. Authentication and authorization

A lot of beginners blur these together.

In this project:

- authentication = proving who the user is
- authorization = deciding what that user is allowed to access

Examples:

- login authenticates the user
- JWT guard authorizes access to protected routes
- ownership checks ensure one user cannot mutate another user's quest

### 5. State machines

One of the strongest lessons in this project is that some data is not just "records."
It is a workflow.

Quests move through states:

- `created`
- `active`
- `paused`
- `completed`
- `cancelled`

That means the backend is not just saving values.
It is protecting a process.

### 6. Transactions

A transaction matters when multiple updates must succeed or fail together.

In StudyMonkey, quest completion updates both:

- the quest record
- the character progression record

That is why transactions are important here.

### 7. Thin client, authoritative server

The frontend still has state, but that state is mostly a local view of backend truth.

This is a valuable architecture lesson:

- UI can be optimistic or convenient
- server must be correct

## Glossary

Use this section whenever a term feels fuzzy.

### API

Application Programming Interface.
In this project, it mostly means the HTTP endpoints exposed by the Nest backend.

### Controller

A Nest class that defines request routes and hands work to services.

### Service

A class that contains business logic.
Services decide what should happen.

### Module

A Nest organizational unit that groups related controllers and providers.

### Provider

A Nest-managed class or value that can be injected elsewhere.
Most services in this codebase are providers.

### DTO

Data Transfer Object.
A class used to validate and describe request input shape.

### Guard

A Nest mechanism that decides whether a request is allowed to continue.
`JwtAuthGuard` protects private routes.

### JWT

JSON Web Token.
A signed token the frontend stores and sends with protected requests to prove user identity.

### Hashing

A one-way transformation used for passwords.
The backend stores hashed passwords, not raw passwords.

### Transaction

A group of database operations treated as one all-or-nothing unit.

### Constraint

A database rule that rejects invalid data, such as negative XP or duplicate email.

### Source of truth

The system component whose data should be trusted as authoritative.
In this project, that is mostly the backend + database, not the frontend.

### State machine

A model where an entity can only move through certain allowed states.
Quest lifecycle logic is a state machine.

## How To Read A Feature End-To-End

When studying any feature, use this repeatable reading pattern.

### Step 1: Start at the user action

Ask:

- what did the user click?
- what request does the frontend send?

Good frontend entry files:

- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/components/main-room/DeskPanel.tsx`
- `frontend/lib/api.ts`

### Step 2: Find the backend route

Look for the matching controller method.

Examples:

- auth actions live in `backend/src/modules/auth/auth.controller.ts`
- quest actions live in `backend/src/modules/quests/quests.controller.ts`

### Step 3: Follow the service logic

This is where the real rules usually live.

Ask:

- what validations happen?
- what errors can be thrown?
- what DB queries run?
- what state changes happen?

### Step 4: Check the database implications

Open the schema and ask:

- which table changes?
- which columns matter?
- what constraints are involved?

### Step 5: Return to the UI

Ask:

- how does the frontend react to the backend response?
- what data is refreshed?
- what state is derived locally?

If you repeat this enough times, backend design starts to feel much less mysterious.

## Guided Study Plan

This plan assumes you are comfortable programming, but new to backend engineering.

### Stage 1: Understand the product loop

Goal:

- understand what the system is supposed to do before worrying about implementation details

Read:

- this guide from the start through "The Product Loop"
- `docs/mvp.md`

Checkpoint:

- explain the full quest lifecycle in your own words

### Stage 2: Understand the data model

Goal:

- understand what information the system stores and why

Read:

- `backend/sql/001_init.sql`
- the database sections of this guide

Checkpoint:

- explain why `users`, `characters`, and `quest_sessions` are separate tables

### Stage 3: Understand Nest structure

Goal:

- understand how the backend is organized

Read:

- `backend/src/main.ts`
- `backend/src/app.module.ts`
- `backend/src/modules/*/*.module.ts`

Checkpoint:

- explain what a module, controller, and service each do

### Stage 4: Understand auth deeply

Goal:

- understand how identity is created and protected

Read:

- `backend/src/modules/auth/auth.controller.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/auth/jwt-auth.guard.ts`
- `backend/src/modules/users/users.service.ts`
- `frontend/components/main-room/AuthPanel.tsx`
- `frontend/lib/api.ts`

Checkpoint:

- explain register, login, JWT storage, and protected requests end-to-end

### Stage 5: Understand quest lifecycle deeply

Goal:

- understand backend state transitions and server-owned timing

Read:

- `backend/src/modules/quests/quests.controller.ts`
- `backend/src/modules/quests/quests.service.ts`
- `frontend/components/main-room/DeskPanel.tsx`
- `frontend/components/main-room/MainRoomScreen.tsx`

Checkpoint:

- explain exactly how start, pause, resume, and complete work

### Stage 6: Understand consistency and transactions

Goal:

- understand why completing a quest is more than just one update

Read:

- `backend/src/database/database.service.ts`
- quest completion logic in `backend/src/modules/quests/quests.service.ts`

Checkpoint:

- explain what could go wrong if quest completion was not transactional

### Stage 7: Understand frontend-backend boundaries

Goal:

- understand what the frontend should and should not own

Read:

- `frontend/lib/api.ts`
- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/components/main-room/ShelfPanel.tsx`
- `frontend/components/main-room/CorkBoardPanel.tsx`

Checkpoint:

- explain which state is authoritative and which state is derived for display

## Exercises

These are ordered from easiest to more architectural.
Do them one at a time.

### Exercise 1: Add logout

Goal:

- understand client-side auth session handling

What to change:

- add a logout button somewhere in the room UI
- clear the saved token
- reset character and quest state
- return to the auth panel

Files to inspect first:

- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/components/main-room/StatusRibbon.tsx`

What this teaches:

- local storage
- session bootstrap
- clearing client state safely

### Exercise 2: Add a quest status badge color system

Goal:

- understand how backend state maps to presentation

What to change:

- show each quest status with a distinct visual style

Files to inspect first:

- `frontend/components/main-room/CorkBoardPanel.tsx`

What this teaches:

- display logic
- keeping visual mapping separate from backend truth

### Exercise 3: Add cancel quest

Goal:

- extend the state machine safely

What to change:

- add a backend endpoint for canceling a quest
- decide which statuses can transition to `cancelled`
- expose it in the UI

Files to inspect first:

- `backend/src/modules/quests/quests.controller.ts`
- `backend/src/modules/quests/quests.service.ts`
- `frontend/lib/api.ts`
- `frontend/components/main-room/DeskPanel.tsx`

What this teaches:

- API evolution
- state transition design
- keeping frontend and backend in sync

### Exercise 4: Change the XP formula

Goal:

- understand progression rules and their coupling to backend truth

What to change:

- modify how XP is awarded on quest completion

Questions to answer before coding:

- should longer planned sessions award more XP?
- should only actual time matter?
- should there be diminishing returns?

Files to inspect first:

- `backend/src/modules/quests/quests.service.ts`
- `frontend/components/main-room/ShelfPanel.tsx`

What this teaches:

- business rule ownership
- how one backend change affects multiple UI surfaces

### Exercise 5: Add backend tests for one-active-quest enforcement

Goal:

- learn how to test business rules instead of just UI behavior

What to change:

- add tests around the "only one in-progress quest at a time" rule

What this teaches:

- verification of domain rules
- confidence when refactoring backend logic

### Exercise 6: Add empty and error states

Goal:

- understand the difference between core logic and resilient user experience

What to change:

- handle "no quests yet"
- handle failed fetches more gracefully
- handle expired token messaging more clearly

Files to inspect first:

- `frontend/components/main-room/MainRoomScreen.tsx`
- `frontend/components/main-room/CorkBoardPanel.tsx`
- `frontend/components/main-room/AuthPanel.tsx`

What this teaches:

- UI resilience
- operational thinking
- defensive frontend design

## Additional Reading

If you are new to these tools, focus on official docs first.
Do not try to read everything at once.
Use them to support the section of this guide you are currently studying.

### TypeScript and JavaScript prerequisites

Read these before going too deep into the backend code if TypeScript is new to you:

- TypeScript basics and interfaces
- JavaScript promises
- JavaScript `await`
- JavaScript modules

Why:

- This project uses TypeScript to describe the shape of objects and function inputs, especially in API types, DTOs, and service method signatures.
- TypeScript interfaces are about the shape of values, which is why they are useful for request and response types in this codebase. citeturn0search8
- A `Promise` represents the eventual completion or failure of an asynchronous operation, which is the core model behind `fetch`, async service calls, and most frontend API work here. citeturn0search3
- `await` pauses an async function until the promise settles and can only be used inside an async function or at the top level of a module. citeturn0search1turn0search7
- JavaScript modules explain imports, exports, and top-level await, which helps make sense of modern TypeScript project structure. citeturn0search7

Suggested order:

1. JavaScript promises
2. JavaScript `await`
3. JavaScript modules
4. TypeScript basics and interfaces

If you do not understand a file because of syntax, pause and learn the syntax first.
Do not force yourself to read backend architecture through syntax confusion.

### NestJS

Read when learning backend structure:

- modules
- controllers
- authentication

Why:

- Nest uses modules to organize related capabilities and dependency injection. citeturn1search0
- Controllers define routes and are registered through modules. citeturn1search6turn1search0
- The authentication docs show the common Nest pattern of controller + service + JWT module wiring. citeturn1search3

### PostgreSQL

Read when learning schema design and correctness:

- constraints
- transactions

Why:

- PostgreSQL constraints are the database-level way to reject invalid data. citeturn1search9
- Transactions group multiple steps into one all-or-nothing operation, which is exactly the idea used in quest completion. citeturn1search1

### Next.js

Read when learning how the frontend is organized:

- App Router project structure
- data fetching overview

Why:

- Next.js App Router uses file and folder conventions such as `app`, `page`, and `layout`. citeturn0search0turn0search6
- Its data-fetching docs explain where client and server fetching can live in App Router apps. citeturn0search2

### Fetch API / browser networking

Read when learning `frontend/lib/api.ts`:

- Fetch API overview
- using `fetch`

Why:

- `fetch()` is the browser-native request primitive used by this frontend API layer, and it returns a promise for a `Response` object even when the HTTP status is an error. citeturn0search1turn0search7

## Suggested Pace

If you want this guide to feel like a textbook instead of a one-time read, use this pace:

### Pass 1: Orientation

- read the whole guide quickly
- do not worry about full understanding yet
- just build a map in your head

### Pass 2: Trace flows

- pick one flow like register or complete quest
- trace it end-to-end
- write down each file involved

### Pass 3: Modify safely

- do one small exercise
- run the app
- inspect the database
- confirm your mental model matches reality

### Pass 4: Explain it back

- explain a feature out loud or in notes
- if you cannot explain it simply, revisit the code path

That cycle is where the real learning happens.

## Best Way To Learn From This Project

The best workflow is:

1. read one section of this guide
2. open the referenced files
3. trace one complete flow end-to-end
4. write your own explanation of what happened
5. then change one small thing in code and observe the effect

This will teach you much more than reading passively.

The goal is to move from:

- "I can run it"

to:

- "I know why it is structured this way"

to:

- "I can safely extend it"
