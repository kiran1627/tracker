# HABIT TRACKER — NEXT.JS + POSTGRESQL MASTER BUILD PROMPT

## ROLE

You are a **senior full-stack Next.js engineer, PostgreSQL database architect, and premium product UI/UX designer**.

Build a production-quality personal **Habit + Daily Task + Goal + Progress + Notes Tracker**.

The application must be implemented using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM

Use the **Next.js App Router**.

The application should be a complete full-stack Next.js application. Do not create a separate FastAPI, Express, NestJS, or Node backend.

---

# 1. PRODUCT VISION

This is NOT simply a checklist.

The application should help the user:

- Create long-term goals
- Break goals into habits
- Create specific daily tasks
- Connect habits/tasks to goals
- Mark habits/tasks complete by date
- Track daily progress
- Track weekly progress
- Track monthly progress
- Calculate current and best streaks
- Write daily notes
- Review previous days
- Understand weak areas
- View goal progress
- View achievements
- Review consistency over time

The core relationship is:

```text
GOAL
  ↓
HABITS + TASKS
  ↓
DAILY EXECUTION
  ↓
COMPLETION LOGS
  ↓
DAILY PROGRESS
  ↓
WEEKLY / MONTHLY PROGRESS
  ↓
NOTES + REVIEW
```

The primary user question should always be:

> "What should I do today, how much have I completed, and am I moving toward my goals?"

---

# 2. TECHNOLOGY STACK

Use only the following core stack:

```text
Next.js
React
TypeScript
Tailwind CSS
PostgreSQL
Prisma ORM
```

Recommended architecture:

```text
Browser
   ↓
Next.js App Router
   ↓
Server Components / Server Actions / Route Handlers
   ↓
Prisma
   ↓
PostgreSQL
```

Do NOT create:

- FastAPI
- Express
- NestJS
- Separate Node server
- Supabase
- Firebase
- MongoDB
- Redis

unless explicitly requested later.

---

# 3. NEXT.JS ARCHITECTURE

Use the App Router.

Suggested structure:

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
│
├── today/
│   └── page.tsx
│
├── habits/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── goals/
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
│
├── tasks/
│   └── page.tsx
│
├── calendar/
│   └── page.tsx
│
├── progress/
│   └── page.tsx
│
├── notes/
│   └── page.tsx
│
├── achievements/
│   └── page.tsx
│
├── settings/
│   └── page.tsx
│
└── api/
    ├── goals/
    ├── habits/
    ├── tasks/
    ├── logs/
    ├── notes/
    └── progress/

components/
├── layout/
├── dashboard/
├── habits/
├── goals/
├── tasks/
├── calendar/
├── progress/
├── notes/
├── achievements/
└── ui/

lib/
├── prisma.ts
├── progress.ts
├── streaks.ts
├── dates.ts
├── validations.ts
└── utils.ts

prisma/
└── schema.prisma

types/
└── index.ts
```

Keep components small and reusable.

---

# 4. DATABASE

Use PostgreSQL as the source of truth.

Do NOT store application data in localStorage as the primary database.

The database must persist:

- Goals
- Habits
- Tasks
- Habit logs
- Task completions
- Daily notes
- Achievements
- User preferences

Use Prisma migrations.

Required commands should include:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Use environment variables:

```env
DATABASE_URL="postgresql://..."
```

Never hardcode credentials.

Add:

```text
.env
```

to `.gitignore`.

Provide:

```text
.env.example
```

with:

```env
DATABASE_URL=
```

---

# 5. DATABASE DESIGN

Use PostgreSQL relational modeling.

The core entities are:

```text
User
Goal
Habit
HabitLog
Task
TaskCompletion
DailyNote
Achievement
UserAchievement
```

Relationships:

```text
User
 ├── Goals
 ├── Habits
 ├── Tasks
 ├── DailyNotes
 └── UserAchievements

Goal
 ├── Habits
 └── Tasks

Habit
 └── HabitLogs

Task
 └── TaskCompletions
```

---

# 6. USER MODEL

Create a User model.

Minimum fields:

```text
id
name
email
createdAt
updatedAt
```

Use a unique email.

All user-owned data must contain a `userId`.

Never allow one user to access another user's records.

---

# 7. GOAL MODEL

Create:

```text
Goal
```

Fields:

```text
id
userId
title
description
category
startDate
targetDate
status
createdAt
updatedAt
```

Status:

```text
ACTIVE
COMPLETED
PAUSED
```

Do not store calculated progress permanently unless there is a strong reason.

Calculate goal progress from associated activities.

---

# 8. HABIT MODEL

Create:

```text
Habit
```

Fields:

```text
id
userId
goalId
title
description
frequency
target
unit
reminderTime
color
startDate
active
createdAt
updatedAt
```

Frequency:

```text
DAILY
WEEKDAYS
CUSTOM
```

Examples:

```text
Study Python
Exercise
Read
Practice DSA
Meditate
```

---

# 9. HABIT LOG MODEL

This is critical.

Create:

```text
HabitLog
```

Fields:

```text
id
habitId
date
completed
completedAt
createdAt
updatedAt
```

Add a unique constraint:

```text
(habitId, date)
```

This prevents duplicate logs for the same habit and day.

The date should represent the user's calendar day.

Do not use timestamps as the primary identity for daily completion.

---

# 10. TASK MODEL

Create:

```text
Task
```

Fields:

```text
id
userId
goalId
habitId
title
description
date
priority
completed
createdAt
updatedAt
```

Priority:

```text
LOW
MEDIUM
HIGH
```

A task can optionally belong to:

- A goal
- A habit

But neither relationship should be mandatory.

---

# 11. TASK COMPLETION

For a simple daily task system, completion can be stored on the Task itself because each task belongs to a specific date.

If recurring tasks are introduced later, create a separate:

```text
TaskCompletion
```

model.

For version 1:

```text
Task
 ├── date
 └── completed
```

is acceptable.

Do not unnecessarily over-engineer the schema.

---

# 12. DAILY NOTE MODEL

Create:

```text
DailyNote
```

Fields:

```text
id
userId
date
accomplishment
learning
difficulty
tomorrow
mood
createdAt
updatedAt
```

Add:

```text
unique(userId, date)
```

One user should have one daily reflection record per day.

---

# 13. ACHIEVEMENT MODEL

Create:

```text
Achievement
```

Fields:

```text
id
name
description
icon
requirement
```

Examples:

```text
7 Day Streak
30 Day Streak
100 Tasks Completed
First Goal Completed
30 Days Tracked
90% Weekly Consistency
```

Create:

```text
UserAchievement
```

to track which achievements each user unlocked.

---

# 14. INDEXES

Add PostgreSQL indexes for frequent queries.

Important indexes:

```text
Habit.userId
Habit.goalId

HabitLog.habitId
HabitLog.date
HabitLog(habitId, date)

Task.userId
Task.date
Task.goalId

DailyNote.userId
DailyNote.date
DailyNote(userId, date)
```

Do not add indexes blindly.

Index fields used frequently in filtering, joining, or date-based history queries.

---

# 15. DATABASE RULES

Always:

- Use Prisma queries
- Validate input
- Scope queries by userId
- Use transactions where multiple related records must change together
- Use unique constraints for daily records
- Avoid N+1 queries
- Select only required fields when appropriate
- Never expose database credentials

---

# 16. TODAY PAGE

The Today page is the application's primary screen.

The user should understand the day's status within 3 seconds.

Layout:

```text
Good evening, Kiran 👋

Wednesday, October 7

TODAY'S PROGRESS

72%

7 / 10 completed

██████████████░░░░░

🔥 12 day streak
```

Then:

```text
Today's Tasks
```

Then:

```text
Today's Habits
```

Then:

```text
Goal Progress
```

Then:

```text
Today's Note
```

---

# 17. DAILY PROGRESS CALCULATION

Do NOT hardcode progress.

Define a clear calculation.

Example:

```text
Total daily activities = today's tasks + today's scheduled habits

Completed activities =
completed today's tasks + completed today's habits

Progress =
completed activities / total activities * 100
```

Handle zero activity:

```text
0 / 0
```

as:

```text
No activity planned
```

not:

```text
NaN%
```

Round percentages appropriately.

---

# 18. TASK SYSTEM

A task represents a specific action.

Example:

```text
☐ Solve Two Sum

Goal:
DSA Preparation

Priority:
High

45 min
```

Completed:

```text
✓ Solve Two Sum

Completed
```

Actions:

```text
Complete
Undo
Edit
Delete
```

The user must be able to:

- Add task
- Edit task
- Delete task
- Complete task
- Undo completion
- Assign date
- Set priority
- Assign goal
- Assign habit

---

# 19. HABIT SYSTEM

A habit represents recurring behavior.

Example:

```text
🏃 Exercise

30 minutes

🔥 14 day streak

Today's status

[ Complete ]
```

Each habit should show:

- Name
- Target
- Frequency
- Current streak
- Goal
- Today's status
- History

---

# 20. HABIT COMPLETION

When the user clicks Complete:

```text
UI
 ↓
Server Action / Route Handler
 ↓
Validate user
 ↓
Upsert HabitLog
 ↓
Recalculate progress
 ↓
Recalculate streak
 ↓
Update UI
```

Use an upsert for the daily log where appropriate.

Never create duplicate records for the same habit/date.

---

# 21. HABIT UNDO

If a habit is already complete:

```text
Completed ✓
```

clicking it again should either:

- Toggle completion off

or provide:

```text
Undo
```

The database must reflect the new state.

---

# 22. STREAK CALCULATION

Create:

```text
lib/streaks.ts
```

Implement:

```text
getCurrentStreak()
getBestStreak()
```

Current streak should be based on consecutive completed scheduled days.

Handle:

- Today completed
- Today not completed
- Yesterday completed
- Missed days
- Habit start date
- Weekday frequency
- Custom frequency

Do not simply count total completed logs.

Example:

```text
Mon ✓
Tue ✓
Wed ✓
Thu ✓
Fri ✓
Sat ✗
Sun ✓
```

The current streak should respect the habit's schedule.

---

# 23. GOAL PROGRESS

Goal progress should be derived from associated habits/tasks.

Example:

```text
Goal:
Become Job Ready

Supporting habits:
DSA
Python
System Design

Supporting tasks:
Build project
Complete resume
Apply to jobs
```

Calculate progress from actual completion data.

Do not fake:

```text
72%
```

The number must come from the database.

---

# 24. GOAL PAGE

Goal card:

```text
Become Job Ready

72%

████████████░░░░

Deadline:
December 31

4 habits
8 tasks
```

Goal detail page:

```text
Goal Overview

Progress

Supporting Habits

Supporting Tasks

Timeline

Completion History
```

---

# 25. GOAL CREATION

Fields:

```text
Goal name
Description
Category
Start date
Target date
```

Optional:

```text
Why this matters
```

After creation:

- Save to PostgreSQL
- Update UI immediately
- Show success feedback
- Do not reload the entire page

---

# 26. HABIT CREATION

Fields:

```text
Habit name
Description
Goal
Frequency
Target
Unit
Reminder time
Start date
Color
```

Example:

```text
Study Python
Goal: Become Job Ready
Frequency: Daily
Target: 60
Unit: minutes
```

---

# 27. TASK CREATION

Fields:

```text
Task name
Description
Date
Goal
Habit
Priority
```

Save to PostgreSQL.

After creation:

```text
Database update
 ↓
Refresh/revalidate affected data
 ↓
Update Today page
```

---

# 28. CALENDAR

Create a monthly calendar.

Each date should show completion intensity.

Use:

```text
0%
#F1F5F9

25%
#E0E7FF

50%
#C7D2FE

75%
#818CF8

100%
#6366F1
```

Clicking a date opens:

```text
Day Details

Tasks
Habits
Completion
Notes
```

The calendar must query real PostgreSQL data.

Do not generate fake activity.

---

# 29. PROGRESS PAGE

Top metrics:

```text
Current Streak
Best Streak
Completion Rate
Tasks Completed
Habit Completions
Goals Completed
```

Example:

```text
🔥 12
Current Streak

🔥 34
Best Streak

78%
Completion

247
Tasks

184
Habit Completions

2
Goals Completed
```

Every number must be calculated from real data.

---

# 30. WEEKLY PROGRESS

Show:

```text
MON  ████████ 80%
TUE  ██████   60%
WED  █████████ 90%
THU  ███████  70%
FRI  ████████ 80%
SAT  █████     50%
SUN  ████████ 80%
```

Calculate:

```text
Weekly Average
Best Day
Weakest Day
```

Use PostgreSQL aggregation where practical.

Do not fetch the entire database unnecessarily.

---

# 31. MONTHLY PROGRESS

Show:

```text
October

Average completion
78%

Days tracked
23

Best streak
14

Completed tasks
184

Habit completions
247
```

Include a monthly heatmap.

---

# 32. DAILY NOTES

Allow the user to select a date.

Show:

```text
October 7

What did I accomplish?

[........................]

What did I learn?

[........................]

What was difficult?

[........................]

What should I improve tomorrow?

[........................]

Mood

😞 😐 🙂 😊 🤩
```

Save to PostgreSQL.

Auto-save may be implemented, but avoid excessive database writes.

A Save button is acceptable.

---

# 33. NOTES HISTORY

Show:

```text
October 7

Progress: 72%

"Completed Python and DSA.
System design was difficult."

October 6

Progress: 84%

"Good study session."
```

Provide:

- Search
- Date filter
- Goal filter where relevant

---

# 34. ACHIEVEMENTS

Achievements should be calculated from real activity.

Examples:

```text
🔥 7 Day Streak
🔥 30 Day Streak
🔥 100 Tasks Completed
🎯 First Goal Completed
📅 30 Days Tracked
💪 90% Weekly Consistency
```

Locked:

```text
🔒
30 Day Streak
Keep going...
```

Unlocked:

```text
🔥
30 Day Streak
Unlocked October 2
```

---

# 35. API / SERVER ACTION DESIGN

Use Next.js Server Actions for simple mutations where appropriate.

Examples:

```text
createGoal()
updateGoal()
deleteGoal()

createHabit()
updateHabit()
deleteHabit()

completeHabit()
undoHabit()

createTask()
updateTask()
deleteTask()
completeTask()

saveDailyNote()
```

Use Route Handlers when an HTTP API endpoint is genuinely useful.

Suggested:

```text
app/api/goals/route.ts
app/api/habits/route.ts
app/api/tasks/route.ts
app/api/progress/route.ts
```

Do not create duplicate Server Actions and API endpoints for the exact same operation without a reason.

---

# 36. VALIDATION

Use strong server-side validation.

Validate:

- Required strings
- Dates
- Enums
- IDs
- Ownership
- Numeric targets
- Frequency values

Never trust client-side validation alone.

If using a validation library, keep dependencies minimal.

---

# 37. SECURITY

Every database operation must verify ownership.

Example logic:

```text
Current user
 ↓
Find requested record
 ↓
Verify record.userId === current user
 ↓
Only then update/delete/read
```

Never allow:

```text
GET /goals/123
```

to return another user's goal.

Never trust a client-provided `userId`.

---

# 38. AUTHENTICATION

Authentication is not required for the first visual prototype, but the database architecture must be user-aware.

If authentication is implemented:

- Use a secure authentication solution compatible with Next.js
- Store user identity server-side
- Protect application routes
- Scope every query to the authenticated user

Do not invent a custom insecure authentication system.

---

# 39. DATABASE TRANSACTIONS

Use Prisma transactions when an operation requires multiple related updates.

Example:

```text
Complete final task
 ↓
Update task
 ↓
Potentially unlock achievement
 ↓
Record achievement
```

These related operations should remain consistent.

---

# 40. DATABASE PERFORMANCE

Avoid:

```text
Fetch all logs
 ↓
Calculate everything in JavaScript
```

for large datasets.

Prefer database filtering/aggregation:

```text
WHERE userId = ?
AND date >= ?
AND date <= ?
```

Use:

- Proper indexes
- Date ranges
- Aggregations
- Pagination for notes/history where needed
- Select only required columns

---

# 41. UI COLOR SYSTEM

Use a premium neutral-first palette.

## Foundation

```text
Background:
#F8FAFC

Surface:
#FFFFFF

Surface Secondary:
#F1F5F9

Border:
#E2E8F0

Primary Text:
#0F172A

Secondary Text:
#475569

Muted:
#94A3B8
```

## Brand

```text
Primary:
#6366F1

Primary Dark:
#4F46E5

Accent:
#8B5CF6
```

## Semantic

```text
Success:
#22C55E

Warning:
#F59E0B

Danger:
#EF4444

Info:
#3B82F6
```

---

# 42. GRADIENT SYSTEM

Use gradients sparingly.

Primary:

```css
linear-gradient(135deg, #6366F1, #8B5CF6)
```

Achievement:

```css
linear-gradient(135deg, #8B5CF6, #EC4899)
```

Success:

```css
linear-gradient(135deg, #22C55E, #14B8A6)
```

Only use gradients for:

- Main progress hero
- Primary CTA
- Major achievement
- Important progress highlight

Never make every card a gradient.

---

# 43. COLOR RATIO

Follow:

```text
70% Neutral
20% Brand
10% Semantic / Achievement
```

The interface should feel calm and professional.

---

# 44. TYPOGRAPHY

Use:

```text
Inter
```

Hierarchy:

```text
Page title:
32px / 700

Section:
20–24px / 600

Card:
16–18px / 600

Body:
14–16px / 400–500

Caption:
12–13px
```

---

# 45. SPACING

Use an 8px system:

```text
4
8
12
16
24
32
40
48
64
```

Avoid arbitrary spacing.

---

# 46. BORDER RADIUS

Use:

```text
Cards:
16px

Buttons:
10–12px

Inputs:
10–12px

Badges:
999px

Large containers:
20px
```

---

# 47. SHADOWS

Use subtle shadows.

```css
box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
```

Elevated:

```css
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
```

Prefer borders and spacing over heavy shadows.

---

# 48. RESPONSIVE DESIGN

## Mobile

Support:

```text
320px
375px
390px
430px
```

Use:

- Bottom navigation
- Single-column layout
- Full-width cards
- 44px+ touch targets
- Sticky Add button
- Compact charts

## Tablet

Support:

```text
768px
1024px
```

Use two-column layouts where appropriate.

## Desktop

Support:

```text
1280px
1440px
1920px
```

Use:

```text
Sidebar
+
Main Content
```

Maximum content width:

```text
1200–1400px
```

---

# 49. MOBILE TODAY SCREEN

Order:

```text
Header

Today's Progress

Today's Tasks

Today's Habits

Goal Progress

Daily Note

Bottom Navigation
```

Do not force the desktop dashboard onto mobile.

---

# 50. MICRO-INTERACTIONS

When completing a task:

```text
Click
 ↓
Checkbox animation
 ↓
Database update
 ↓
Progress recalculation
 ↓
Stats update
 ↓
Success toast
```

When completing a habit:

```text
Click
 ↓
HabitLog upsert
 ↓
Streak recalculation
 ↓
Progress recalculation
 ↓
Goal progress recalculation
 ↓
UI update
```

Animation duration:

```text
150–400ms
```

Do not animate everything.

---

# 51. UNDO

After completing:

```text
Task completed ✓

Undo
```

or:

```text
Habit completed ✓

Undo
```

Undo must update PostgreSQL immediately.

---

# 52. EMPTY STATES

Every major page must have a useful empty state.

Example:

```text
No habits yet

Start with one small habit
and build consistency.

[Create Habit]
```

Goals:

```text
No goals yet

Define what you want to achieve.

[Create Goal]
```

Tasks:

```text
No tasks today

Your day is clear.

[Add Task]
```

---

# 53. LOADING STATES

Use skeleton components:

```text
SkeletonCard
SkeletonList
SkeletonStats
SkeletonCalendar
```

Avoid displaying "Loading..." everywhere.

---

# 54. ERROR STATES

Example:

```text
Something went wrong.

We couldn't load your progress.

[Try Again]
```

Do not expose raw PostgreSQL or Prisma errors to users.

Log technical errors appropriately on the server.

---

# 55. SEARCH AND FILTER

Global search should support:

```text
Goals
Habits
Tasks
Notes
```

Progress filters:

```text
All
Goals
Habits
Tasks
```

Calendar:

```text
All Activity
Habits
Tasks
```

Keep filtering simple and useful.

---

# 56. STATE MANAGEMENT

Prefer:

```text
Server Components
+
Server Actions
+
React state for local interaction
```

Do not introduce a global state library unless the application genuinely requires one.

Keep business calculations in:

```text
lib/progress.ts
lib/streaks.ts
lib/dates.ts
```

Do not put complex calculations directly inside JSX.

---

# 57. DATABASE MIGRATION WORKFLOW

When changing the database:

```bash
npx prisma migrate dev --name descriptive_change
npx prisma generate
```

For development:

```bash
npx prisma studio
```

Before declaring the database work complete:

```bash
npx prisma validate
```

---

# 58. SEED DATA

Create optional development seed data.

Example:

```text
Goal:
Become Job Ready

Habits:
Study Python
Practice DSA
System Design

Tasks:
Solve Two Sum
Build FastAPI endpoint
Review SQL

Notes:
A few example daily reflections
```

Clearly label seed/demo data.

Do not ship fake statistics as real user data.

---

# 59. TESTING

Add tests for critical business logic.

At minimum test:

```text
Daily progress calculation
Current streak calculation
Best streak calculation
Goal progress calculation
Habit daily completion
Task completion
Duplicate habit log prevention
Date boundaries
```

Test important edge cases.

Example:

```text
No tasks
No habits
One task
All tasks complete
No activities complete
Missed day
Consecutive days
Weekend frequency
Habit with no goal
Goal with no activities
```

---

# 60. DATE HANDLING

Date logic is critical.

Use a consistent date strategy.

Store daily activity dates in a format appropriate for calendar-day semantics.

Do not accidentally shift a user's day because of UTC conversion.

For example:

```text
October 7
```

must remain October 7 for the user even if the server is running in another timezone.

Centralize date logic in:

```text
lib/dates.ts
```

Do not scatter date calculations throughout components.

---

# 61. UX PRINCIPLES

### Principle 1

Action first, analytics second.

### Principle 2

Today's progress must always be visible.

### Principle 3

Completing a task should require minimal effort.

### Principle 4

Goal → Habit → Task relationships must be clear.

### Principle 5

Progress must come from real PostgreSQL data.

### Principle 6

Do not overwhelm users with charts.

### Principle 7

Every interaction needs immediate feedback.

### Principle 8

Empty states should guide the user.

### Principle 9

The interface should feel calm enough for daily use.

---

# 62. DO NOT BUILD

Do NOT add unless explicitly requested:

```text
❌ FastAPI
❌ Express
❌ MongoDB
❌ Supabase
❌ Firebase
❌ Redis
❌ Microservices
❌ AI chatbot
❌ Social feed
❌ Team collaboration
❌ Payments
❌ Complex notification infrastructure
❌ Excessive charts
❌ Excessive animations
❌ Rainbow UI
❌ Random gradients
```

Keep version 1 focused.

---

# 63. IMPLEMENTATION ORDER

Build in this exact order.

## Phase 1 — Foundation

```text
1. Inspect existing repository
2. Configure Next.js
3. Configure Tailwind
4. Configure PostgreSQL
5. Configure Prisma
6. Create environment variables
7. Create database schema
8. Run first migration
```

## Phase 2 — Application Shell

```text
1. App layout
2. Sidebar
3. Mobile navigation
4. Header
5. Design tokens
6. Responsive container
```

## Phase 3 — Goals

```text
1. Goal schema
2. Goal CRUD
3. Goal list
4. Goal detail
5. Goal progress
```

## Phase 4 — Habits

```text
1. Habit schema
2. Habit CRUD
3. Habit completion
4. Habit logs
5. Streak calculation
6. Habit history
```

## Phase 5 — Tasks

```text
1. Task schema
2. Task CRUD
3. Daily tasks
4. Completion
5. Undo
6. Goal linking
```

## Phase 6 — Today

```text
1. Today's progress
2. Today's tasks
3. Today's habits
4. Goal progress
5. Streak
6. Daily notes
```

## Phase 7 — Calendar

```text
1. Monthly calendar
2. Activity intensity
3. Day details
4. Historical progress
```

## Phase 8 — Progress

```text
1. Daily statistics
2. Weekly statistics
3. Monthly statistics
4. Streak statistics
5. Goal statistics
```

## Phase 9 — Notes

```text
1. Daily notes
2. Notes history
3. Search
4. Date filtering
```

## Phase 10 — Achievements

```text
1. Achievement rules
2. Unlock detection
3. Achievement UI
```

## Phase 11 — Quality

```text
1. Tests
2. Responsive audit
3. Accessibility audit
4. Performance audit
5. Database query audit
6. Error handling
7. Production build
```

---

# 64. DEVELOPMENT RULE

Work incrementally.

Before each major change:

```text
1. Explain what you will change.
2. Implement one logical feature.
3. Run the application.
4. Check for TypeScript errors.
5. Check database operations.
6. Test the feature.
7. Check mobile responsiveness.
8. Fix issues.
9. Continue.
```

Do not make a massive rewrite.

Do not modify unrelated files.

---

# 65. FINAL DATABASE ACCEPTANCE TEST

Verify:

```text
[ ] PostgreSQL connection works
[ ] Prisma schema validates
[ ] Migrations work
[ ] Goals persist
[ ] Habits persist
[ ] Habit logs persist
[ ] Tasks persist
[ ] Daily notes persist
[ ] Achievements persist
[ ] Unique daily habit logs are enforced
[ ] User ownership is enforced
[ ] Date queries work correctly
```

---

# 66. FINAL PRODUCT ACCEPTANCE TEST

## Daily Workflow

```text
[ ] See today's tasks
[ ] See today's habits
[ ] Mark task complete
[ ] Undo task
[ ] Mark habit complete
[ ] Undo habit
[ ] See progress increase
[ ] See streak update
[ ] Write daily note
```

## Goal Workflow

```text
[ ] Create goal
[ ] Edit goal
[ ] Delete goal
[ ] Connect habit
[ ] Connect task
[ ] See goal progress
[ ] Complete goal
```

## Review Workflow

```text
[ ] Open previous date
[ ] See historical tasks
[ ] See historical habits
[ ] See completion percentage
[ ] Read daily note
[ ] View calendar
[ ] View weekly progress
[ ] View monthly progress
```

---

# 67. FINAL VISUAL QUALITY BAR

The final application should feel:

```text
Premium
Minimal
Calm
Focused
Professional
Modern
Motivating
Data-driven
Consistent
```

Visual direction:

```text
Apple Health
+
Linear
+
Notion
+
Modern productivity SaaS
```

These are references for quality and hierarchy only. Do not copy their UI.

Create an original visual system.

---

# 68. FINAL PERFORMANCE BAR

The application should:

- Avoid unnecessary client components
- Use Server Components where appropriate
- Keep database queries efficient
- Avoid N+1 queries
- Use indexes
- Avoid fetching unnecessary records
- Keep charts lightweight
- Avoid unnecessary global state
- Keep bundle size reasonable
- Build successfully in production

Run:

```bash
npm run build
```

before declaring the project complete.

---

# 69. FINAL COMMANDS

The README must document:

## Install

```bash
npm install
```

## Environment

```bash
cp .env.example .env
```

Set:

```env
DATABASE_URL="postgresql://..."
```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
npm start
```

---

# 70. FINAL PRODUCT GOAL

The finished application should make the user feel:

> "I know what I need to do today, I can mark it complete immediately, I can see exactly how much progress I made, I understand how my daily actions contribute to my goals, and I can look back to see whether I am actually improving."

The product is successful only when:

```text
GOAL
 ↓
PLAN
 ↓
DO
 ↓
MARK COMPLETE
 ↓
SEE PROGRESS
 ↓
REFLECT
 ↓
IMPROVE
```

Build the entire product around this loop.
