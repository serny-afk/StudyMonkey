# StudyMonkey

## Project Overview

A Pomodoro-based study system where users complete timed study sessions (“quests”) to earn XP and level up a persistent character (monkey avatar). The system focuses on backend engineering: authentication, session tracking, and progression logic, with a minimal frontend for interaction (Postman initially, upgradeable to a UI later).

---

# Objectives

- RESTful API design
- Backend system design (layered architecture)
- Database design (PostgreSQL)
- Authentication & authorization (JWT-based)
- Time-based state tracking (Pomodoro sessions)
- Business logic design (XP + progression system)

---

# Tech Stack

## Backend
- Node.js + NestJS (TypeScript)

## Database
- PostgreSQL (Supabase)

## Frontend
- Next.js (React)
- Initial interaction via Postman (no frontend dependency for MVP)

## Hosting
- Backend: Render / Railway
- Frontend: Vercel

## Optional
- Redis (caching, not required for MVP)

---

# Architecture

Client-server layered architecture: Client (Postman / Next.js UI)
↓
Controller (API Layer)
↓
Service (Business Logic Layer)
↓
Repository (Data Access Layer)
↓
Database (PostgreSQL)


### Layer responsibilities:
- **Controller** → handles HTTP requests/responses
- **Service** → core logic (session handling, XP calculation)
- **Repository** → database queries only
- **Database** → persistent storage

---

# Core Concept Model

## User = Character
Each user has a persistent character with progression stats:
- XP
- Level
- (Optional) streak / consistency metrics

---

## Quest = Pomodoro Session
A quest represents a timed study session:
- 30 / 45 / 60 minutes
- Has lifecycle (created → started → completed)
- Tracks actual study duration

---

## Progression System
- Completing quests grants XP
- XP determines level progression
- All progression is persistent per user

---

# User Experience (Backend-driven behavior)

1. User registers and logs in (JWT authentication)
2. User creates or accesses their character
3. User starts a quest (study session timer begins)
4. User pauses/resumes or completes the session
5. System calculates actual completed study time
6. XP is awarded based on session completion
7. User level and XP are updated and persisted
8. User can retrieve progress at any time

---

# API Scope (High-Level)

## Authentication
- Register user
- Login user

## Character / User Progress
- Get character stats (XP, level)

## Quests (Pomodoro sessions)
- Create quest
- Start quest
- Pause / resume quest (optional)
- Complete quest
- Get quest history

---

# Data Model (High-Level)

- **User**
  - id
  - email
  - password

- **Character (Progress)**
  - user_id
  - xp
  - level

- **QuestSession**
  - id
  - user_id
  - title
  - planned_duration
  - actual_duration
  - status (active/completed/paused)
  - timestamps (start/end)

---

# Frontend Strategy

- Phase 1: Postman (API testing only)
- Phase 2: Next.js UI (minimal interface)
- Phase 3 (optional): gamified UI with avatar + animations

Frontend is strictly a **presentation layer**, not responsible for business logic.

---

# Key Design Principles

- Backend is source of truth for all progression data
- All XP/level calculations happen server-side
- Session timing is validated by backend
- Frontend only displays state and triggers actions

---

# Final Summary

A backend-driven Pomodoro study system where authenticated users complete timed study sessions (“quests”) that generate XP, level progression, and persistent character growth, supported by a clean layered architecture and RESTful API design.
