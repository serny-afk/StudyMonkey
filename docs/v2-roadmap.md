# StudyMonkey V2 Roadmap

## Why This Document Exists

The MVP is deployed and functional.

That means the next step should not be "add random things that sound cool."
It should be a deliberate next iteration.

This roadmap exists to answer:

- what should happen next
- what order it should happen in
- what we are intentionally not doing yet

## V2 Goal

V2 should make StudyMonkey feel:

- more stable
- more coherent
- more intentional

without exploding the scope.

The goal is not to turn it into a giant productivity platform.
The goal is to improve the existing core loop and the product experience around it.

## Recommended Strategy

Do V2 in phases.

That keeps the project from mixing:

- product redesign
- architecture refactor
- feature expansion

all at once.

## Phase 1: Stabilize And Clean Up

### Goal

Reduce friction and make the current MVP easier to maintain.

### Work in scope

- document Vercel deployment setup clearly
- clean up env/documentation gaps
- review current frontend layout behavior across panels
- improve session/auth UX
- improve empty, loading, and error states
- clean up obviously awkward UI interactions

### Why this phase matters

This phase makes the project easier to iterate on without changing its identity.

### Success criteria

- the deployed app feels reliable
- the main flow feels less rough
- new work can build on a cleaner base

## Phase 2: Frontend Structure Improvements

### Goal

Reduce growing frontend complexity before it becomes annoying to work with.

### Work in scope

- split orchestration logic more cleanly
- reduce pressure on `MainRoomScreen`
- unify panel layout behavior
- make hotspot/panel interactions easier to reason about
- improve shared UI patterns for room overlays

### Why this phase matters

The frontend is still small enough to refactor without pain.
That may not stay true if more features are added first.

### Success criteria

- room UI is easier to extend
- less duplicated panel logic
- fewer one-off layout fixes

## Phase 3: Product Polish

### Goal

Make the app feel better to use without changing the core loop.

### Work in scope

- better visual feedback during focus sessions
- cleaner quest/history presentation
- more polished status/progression presentation
- improved typography and spacing consistency
- room ambiance enhancements that remain mostly cosmetic

### Important rule

Do not let decorative features become fake systems unless the backend supports them.

### Success criteria

- the room UI feels more cohesive
- the app feels less like an MVP shell
- visual polish supports the product instead of distracting from it

## Phase 4: Carefully Chosen Feature Expansion

### Goal

Add depth only where it strengthens the core experience.

### Best candidates

- better quest history and filtering
- simple logout / session management improvements
- cancel quest flow
- more visible progression milestones
- streaks if backed by real backend logic

### Features to avoid for now

- social features
- realtime collaboration
- leaderboards
- heavy gamification systems
- complicated avatar systems
- large-scale analytics dashboards

### Why

These features would increase complexity much faster than they increase product clarity.

## Engineering Priorities

These can happen alongside the phases above when appropriate.

### Testing

Priority areas:

- quest lifecycle rules
- auth flows
- one-active-quest enforcement
- XP/progression updates

### Documentation

Priority docs:

- deployment setup
- env var setup
- local run instructions
- architectural notes for the frontend room system

### Refactoring

Priority refactors:

- frontend orchestration
- reusable room panel layout
- API handling consistency

## What Not To Do Yet

This is just as important as the positive roadmap.

Do not immediately add:

- a bunch of new gameplay systems
- multiple dashboards
- a large social layer
- live sync features
- extensive new data models
- cosmetic systems with no backend meaning

The project is still at the stage where depth in the core loop is more valuable than breadth.

## Suggested Order

If only one thing can happen at a time, this is the recommended order:

1. deployment/docs cleanup
2. auth/session polish
3. room panel/layout cleanup
4. frontend refactor around `MainRoomScreen`
5. tests for core backend rules
6. quest/history UX improvements
7. carefully selected feature expansion

## Decision Rule For New Ideas

Before adding a new feature, ask:

1. does this strengthen the core study loop?
2. does the backend need to support it for it to feel real?
3. does it make the app clearer or just bigger?
4. will this create more technical debt than value right now?

If the answer is mostly "it just sounds cool," it probably belongs later.

## Final Direction

V2 should be about:

- making the current product loop cleaner
- making the frontend easier to maintain
- improving the honesty and quality of the experience

The project does not need more surface area yet.
It needs better depth, clarity, and structure.
