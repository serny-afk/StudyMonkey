# StudyMonkey MVP Postmortem

## Why This Document Exists

This is a short retrospective on the first real StudyMonkey MVP.

The goal is not to celebrate everything or criticize everything.
It is to capture:

- what we actually built
- what worked
- what hurt
- what we cut
- what we learned
- what should guide the next iteration

This matters because once a project starts "kind of working," it becomes easy to forget which decisions were deliberate and which were temporary.

## Original Goal

The original goal of StudyMonkey was to build a backend-focused Pomodoro study system where:

- users can register and log in
- users can create and manage study quests
- quests move through a real lifecycle
- completed study time turns into XP
- XP updates a persistent character

The frontend was important, but the real educational and engineering focus was:

- backend architecture
- database design
- authentication
- state transitions
- persistence
- backend-owned correctness

## What The MVP Actually Includes

By the end of the MVP, the project included:

- user registration
- user login
- JWT-protected routes
- persistent user and character records
- quest creation
- quest start / pause / resume / complete
- backend-owned duration tracking
- backend-owned XP and level updates
- quest history retrieval
- a room-based frontend that acts as a real client
- live deployment on Vercel with frontend and backend under one public site

This means the MVP is not just a local prototype.
It is a working deployed system with a real end-to-end product loop.

## What Went Well

### 1. The backend-first scope was the right call

This was probably the best decision in the project.

It kept the team focused on:

- data model first
- state transitions first
- real persistence first

That made the frontend easier to reason about later, because the frontend became a client of a real system instead of a fake shell with invented behavior.

### 2. The product loop was small but meaningful

The project had a clear loop:

1. authenticate
2. create quest
3. start quest
4. pause/resume if needed
5. complete quest
6. award XP
7. update progression

That loop is compact enough to finish, but rich enough to teach real backend engineering ideas.

### 3. The database model stayed simple

Keeping the main schema centered on:

- `users`
- `characters`
- `quest_sessions`

was the right move.

It avoided premature complexity and made the system easier to understand.

### 4. The project eventually became honest about MVP scope

At one point the frontend had more implied behavior than the backend actually supported.

Trimming that fake functionality was a good decision.

The project improved when it chose:

- truthful MVP behavior
- decorative flavor where appropriate
- fewer fake affordances

instead of trying to pretend unsupported features already existed.

### 5. Deployment happened

This is important.

A lot of student projects stop at "works on my machine."
StudyMonkey made it through the harder part:

- env configuration
- runtime issues
- service packaging
- public deployment

That exposed real-world problems that local development hides.

## What Was Harder Than Expected

### 1. Frontend direction-finding took longer than expected

The app did not want a generic dashboard.

It needed a stronger identity, and getting there involved:

- rejecting a too-generic generated UI
- experimenting with RPG/game-like framing
- simplifying toward a room-based interaction model

This was a useful lesson:

- visual direction is not just "make it pretty"
- it affects the whole product feel

### 2. Deployment friction was real

The first deployment was not just pushing code and getting a working app.

The Vercel setup exposed:

- service routing confusion
- environment variable setup
- runtime module packaging issues
- repeated function crashes

This was annoying, but also educational.

It reinforced that deployment is part of engineering, not an afterthought.

### 3. Generated UI sped things up, but also created cleanup work

Using generated UI gave the project a fast visual starting point.

But it also introduced:

- fake features
- awkward layout behavior
- mismatched hotspot positioning
- cleanup work to align the UI with the real backend scope

The lesson here is not "never use generated UI."
It is:

- generated UI is good for momentum
- but it still needs product judgment and integration discipline

### 4. The frontend orchestration got complicated quickly

Even with a small app, `MainRoomScreen` ended up doing a lot:

- token restore
- data bootstrap
- session derivation
- API mutations
- error handling
- UI state orchestration

This was manageable for MVP, but it also points to future refactor pressure.

## Bugs / Pain Points Encountered

The MVP surfaced several real issues during implementation and deployment:

- auth double-submit needed guarding
- the backend originally did not enforce one active quest at a time
- some frontend UI implied unsupported features
- hotspot bounds were initially misaligned with the room scene
- the study-session panel overflowed off-screen
- Vercel Services deployment initially crashed due to missing backend runtime modules

These were not catastrophic, but they are useful to remember because they show the kinds of issues that appear when moving from concept to real system.

## Scope Cuts And Deliberate Non-Features

Several ideas were intentionally not treated as real MVP systems:

- leaderboard
- advanced ambience controls
- rich monkey companion behavior
- extra progression systems beyond XP and level
- social features
- notifications
- realtime sync

This was the correct choice.

If those had been pursued in MVP, the project would likely have become broader but less complete.

## Technical Debt We Intentionally Accepted

The MVP is functional, but it is not clean in every area.

Known debt includes:

- frontend orchestration is concentrated in a few large components
- auth/session UX is still basic
- deployment config is practical rather than elegant
- some UI layout behavior was fixed incrementally rather than through a unified layout system
- test coverage is not yet strong enough for deep refactors

This is acceptable for MVP, but it should be acknowledged instead of forgotten.

## Biggest Lessons

### 1. Backend truth matters more than frontend polish

The project became stronger when the backend owned:

- quest lifecycle rules
- duration tracking
- XP calculation
- progression updates

That made the app feel more trustworthy and coherent.

### 2. MVP honesty is underrated

A smaller truthful system is better than a larger fake-feeling one.

This was one of the clearest product lessons in the whole build.

### 3. Deployment teaches things local development does not

The Vercel phase forced the project to confront:

- runtime bundling
- environment management
- route integration

That was frustrating, but also one of the most realistic engineering lessons in the project.

### 4. Good architecture reduces confusion later

Because the backend kept a reasonably clean shape:

- modules
- services
- database layer
- controlled state transitions

the project stayed understandable even while the frontend shifted around.

## What We Should Keep In The Next Iteration

- backend as source of truth
- simple relational model
- explicit quest lifecycle
- one-quest-at-a-time rule
- room-based UI concept
- small scope per iteration

## What We Should Improve In The Next Iteration

- frontend state structure
- auth/session polish
- documentation of deployment/runtime setup
- test coverage around business rules
- visual/layout consistency across room panels

## Final Assessment

The MVP should be considered a success.

Not because everything was perfect, but because it reached the most important threshold:

- it became a real deployed full-stack product loop

That is much more valuable than a prettier but fake prototype.

The project is now in a good position for a deliberate second iteration instead of continued improvisation.
