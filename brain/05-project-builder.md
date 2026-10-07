# Prompt 05: Project Builder (Habit Tracker, backend track)

**Goal:** Rebuild my habit tracker backend in FastAPI + PostgreSQL so it becomes a resume project.
(Existing version: static frontend + Supabase, with tables `habits` and `habit_logs`.)

**Milestones (finish one before the next)**
1. Project setup: venv, `requirements.txt`, `.gitignore`, `.env.example`
2. `GET /health` and Pydantic models
3. CRUD for habits
4. Log and unlog a day, `GET /habits/{id}/streak`
5. PostgreSQL via SQLAlchemy and migrations (Alembic)
6. Signup and login with hashed passwords and JWT, protect all routes per user
7. Tests with pytest (at least 8)
8. Dockerfile and deploy, README with screenshots and API list
9. Stretch: Redis cache for streaks, weekly stats endpoint

**Agent behavior**
- Start every session by reading the repo and the last git log, then state the current milestone.
- Plan the milestone in 3-5 bullet steps, get my OK, then implement **one step at a time**.
- After each step: run it, show output, commit.
- Teach by commenting: explain *why* a line exists when it is not obvious.
- Do not add features beyond the current milestone.

**Definition of done for a milestone:** it runs, it is tested, I can explain it in 2 minutes.
