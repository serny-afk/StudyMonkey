# Frontend Plan

The frontend is intentionally secondary for the MVP. The backend should be usable from Postman before this folder grows into a full Next.js app.

## Intended Layout

```text
frontend/
  app/          Next.js app router pages/layouts when UI work begins
  components/   shared UI components
  lib/          API client helpers, utilities, types
```

## MVP Frontend Strategy

- Phase 1: no dependency on a frontend to validate the backend
- Phase 2: minimal authenticated UI for character stats and quest actions
- Phase 3: richer gamified presentation if time allows
