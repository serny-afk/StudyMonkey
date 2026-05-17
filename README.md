# StudyMonkey

StudyMonkey is a backend-driven Pomodoro study app where users complete timed study quests, earn XP, and level up a persistent character.

The project was built primarily as a backend engineering exercise, then connected to a room-based frontend so the full loop could run as a real deployed product.

## Current MVP

The MVP currently supports:

- user registration
- user login
- JWT-protected API routes
- persistent character XP and level
- quest creation
- quest start / pause / resume / complete
- backend-owned duration tracking
- backend-owned XP calculation
- quest history retrieval
- deployed frontend and backend under one public site

## Tech Stack

### Backend

- NestJS
- TypeScript
- PostgreSQL via `pg`
- JWT authentication
- bcrypt password hashing

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Database

- Supabase Postgres

### Hosting

- Frontend: Vercel
- Backend: Vercel

Redis is **not** part of the current MVP.

## Architecture

At a high level, the system looks like this:

```text
Browser UI (Next.js room frontend)
        ↓
NestJS API
        ↓
PostgreSQL (Supabase)
```

The core design principle is:

- backend owns truth
- database owns persistence
- frontend owns presentation and user interaction

## Repo Layout

```text
StudyMonkey/
  backend/      NestJS API
  frontend/     Next.js client
  docs/         learning guide, MVP notes, postmortem, roadmap
```

## Local Development

### Backend

From [backend](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend):

```powershell
npm install
npm run start:dev
```

Expected local backend port:

- `3001`

### Frontend

From [frontend](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/frontend):

```powershell
npm install
npm run dev
```

Expected local frontend port:

- `3000`

### Local Env

Backend env values live in:

- [backend/.env](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/backend/.env)

Important backend env vars:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV`
- `PORT`

The frontend currently defaults to:

- `http://localhost:3001` in development
- `/api` in production

## Deployment

The app is currently deployed on Vercel using a single project with services routing configured in [vercel.json](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/vercel.json).

Current deployed shape:

- frontend service mounted at `/`
- backend service mounted at `/api`

That means the public site behaves like one website even though the frontend and backend are still separate services internally.

### Required Production Env Vars

Set these in Vercel:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `NODE_ENV=production`

### Important Deployment Note

The current [vercel.json](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/vercel.json) includes:

- `backend/node_modules/**`

for the backend service bundle.

This is a practical MVP fix for Vercel Services packaging issues encountered during deployment. It works, but it is broader than an ideal long-term bundle configuration.

## Main Product Flow

1. user registers or logs in
2. user creates a quest
3. user starts the quest
4. user pauses/resumes or completes it
5. backend calculates actual duration
6. backend awards XP and updates level
7. frontend reloads and displays the updated state

## API Surface

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Character

- `GET /character/me`

### Quests

- `GET /quests`
- `GET /quests/:id`
- `POST /quests`
- `POST /quests/:id/start`
- `POST /quests/:id/pause`
- `POST /quests/:id/resume`
- `POST /quests/:id/complete`

### Health

- `GET /health`

## Important Business Rules

- backend is the source of truth for XP and progression
- quest duration is derived from backend timestamps, not trusted from the client
- quest state transitions are validated on the backend
- only one in-progress quest is allowed per user
- frontend displays backend state instead of inventing its own progression

## Documentation

If you want the guided explanation of the codebase, start here:

- [docs/learning-guide.md](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/docs/learning-guide.md)

Project planning and reflection docs:

- [docs/mvp.md](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/docs/mvp.md)
- [docs/postmortem.md](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/docs/postmortem.md)
- [docs/v2-roadmap.md](/C:/Users/Administrator/Desktop/School/Y2S2/summer/StudyMonkey/docs/v2-roadmap.md)

## Current Status

StudyMonkey is past the prototype stage and into a deployed MVP stage.

The current priority is:

- stabilize the existing product loop
- clean up documentation and UX rough edges
- make the codebase easier to extend for the next iteration
