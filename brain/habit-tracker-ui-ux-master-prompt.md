# HABIT TRACKER — PREMIUM PRODUCT UI/UX MASTER PROMPT

## 1. Product Vision

Build a premium **Habit + Daily Task + Goal + Progress + Notes** application.

This is NOT just a habit checklist.

The product should help the user:

1. Define long-term goals
2. Break goals into habits and daily tasks
3. Plan what needs to be done today
4. Mark tasks and habits complete
5. Track progress over time
6. Maintain streaks
7. Write daily notes
8. Review previous days
9. Understand weak areas
10. Measure progress toward goals

The product should feel like:

**Habit Tracker + Personal Planner + Goal Tracker + Progress Journal**

Do not copy an existing product. Create an original visual identity.

---

# 2. Core Product Relationship

The application should be built around:

```text
GOAL
  ↓
HABITS
  ↓
DAILY TASKS
  ↓
DAILY COMPLETION
  ↓
PROGRESS
  ↓
NOTES / REFLECTION
  ↓
WEEKLY / MONTHLY REVIEW
```

The user should always understand:

> What am I trying to achieve?

> What do I need to do today?

> How much have I completed?

> Am I moving toward my goal?

---

# 3. Primary Navigation

## Desktop Sidebar

```text
Overview
Today
Habits
Goals
Calendar
Progress
Notes
Achievements
Settings
```

## Mobile Bottom Navigation

```text
Today
Habits
Goals
Progress
Profile
```

The **Today** screen is the most important screen.

---

# 4. Dashboard / Overview

The dashboard must answer five questions immediately:

1. How am I doing today?
2. What do I need to complete?
3. What is my current streak?
4. Am I progressing toward my goals?
5. What did I learn from previous days?

---

# 5. Today Progress Hero

Create the most visually important card.

Example:

```text
TODAY'S PROGRESS

7 / 10 completed

70%

██████████████░░░░░░

3 tasks remaining
🔥 12 day streak
```

Include:

- Completion percentage
- Completed count
- Remaining count
- Progress bar or progress ring
- Current streak

Use the primary gradient subtly.

Do not make this card excessively large.

---

# 6. Today's Tasks

Create a focused task list.

Each task should contain:

```text
☐ Solve 2 DSA problems

Goal:
Get better at problem solving

⏱ 45 min

Priority:
High
```

Completed state:

```text
✓ Solve 2 DSA problems

Completed at 8:45 PM
```

Completed tasks should visually change but remain readable.

Use:

- Green check
- Muted text
- Slight background change
- Small completion animation

Do not completely hide completed tasks.

---

# 7. Habits

Habit cards represent recurring behaviors.

Example:

```text
🏃 Exercise

30 minutes

🔥 14 day streak

Mon Tue Wed Thu Fri Sat Sun

✓   ✓   ✓   ✓   ✓   ○   ○
```

Each habit should support:

- Daily completion
- Frequency
- Streak
- Goal association
- Reminder
- Notes
- History

---

# 8. Goals

Goals represent outcomes, not repeated actions.

Example:

```text
Become Job Ready

Deadline:
December 31, 2026

Progress:

████████████░░░░░ 72%

72% complete
```

Supporting habits:

```text
✓ Solve DSA problems
✓ Study Python
✓ Practice System Design
○ Build projects
```

---

# 9. Goal Creation

Create a simple goal creation flow.

Fields:

```text
Goal Name
Description
Category
Start Date
Target Date
Target
Priority
Color
```

Optional:

```text
Why this goal matters
```

Example:

```text
Goal:
Become Job Ready

Target:
Complete 300 DSA problems

Deadline:
December 31

Why:
Prepare for software engineering interviews
```

---

# 10. Goal → Habit Connection

When creating a habit, allow the user to select the goal it supports.

```text
Which goal does this support?

○ No goal
○ Become Job Ready
○ Improve Health
○ Learn React
○ Build Portfolio
```

The relationship should be:

```text
Goal
 ↓
Habit
 ↓
Daily completion
 ↓
Goal progress
```

The dashboard should make this relationship visible.

---

# 11. Daily Notes

Every day should have a simple journal/reflection area.

```text
TODAY'S NOTES

What did I accomplish?

[                              ]

What did I learn?

[                              ]

What was difficult?

[                              ]

What should I improve tomorrow?

[                              ]
```

Keep this simple. Do not turn it into a complicated document editor.

---

# 12. Daily Review

At the end of the day show:

```text
DAY COMPLETE

7 / 10 tasks completed

70%

🔥 12 day streak

Today's wins

✓ Python practice
✓ DSA
✓ Exercise

Still pending

○ System Design
○ Reading
```

Then provide:

```text
How was today?

😞   😐   🙂   😊   🤩
```

And:

```text
Tomorrow's priority

[________________________]
```

---

# 13. Calendar

Create a monthly calendar showing activity.

Example:

```text
        OCTOBER 2026

Mon Tue Wed Thu Fri Sat Sun

          1   2   3   4
      ●   ●   ●   ●
5     6   7   8   9   10  11
●     ●   ●   ○   ●   ●   ○
```

Use activity intensity rather than multiple colors.

Recommended heatmap:

```text
#EEF2FF
#C7D2FE
#A5B4FC
#818CF8
#6366F1
```

Clicking a date should open:

- Date
- Tasks
- Habits
- Completion %
- Notes
- Mood

---

# 14. Progress Page

Create a dedicated analytics page.

## Overall Progress

```text
Completion Rate
78%
```

## Current Streak

```text
🔥 12 days
```

## Best Streak

```text
🔥 34 days
```

## Habits Completed

```text
247
```

## Goals

```text
4 active
2 completed
```

---

# 15. Weekly Progress

Show:

```text
THIS WEEK

Mon  ████████ 80%
Tue  ██████   60%
Wed  █████████ 90%
Thu  ███████  70%
Fri  ████████ 80%
Sat  █████     50%
Sun  ████████ 80%
```

Include:

```text
Weekly average: 73%

Best day:
Wednesday

Weakest day:
Saturday
```

---

# 16. Monthly Review

Show:

```text
OCTOBER REVIEW

Days tracked:
23

Average completion:
78%

Best streak:
14 days

Habits completed:
184

Goals progressed:
4
```

Then show:

```text
Top Habit

DSA Practice
92% consistency
```

And:

```text
Needs Attention

Reading
41% consistency
```

The analytics should provide actionable insight, not just numbers.

---

# 17. Notes History

Create a Notes page.

Each entry:

```text
October 7

Today's progress: 70%

"Completed Python practice and DSA.
System design was difficult today."

Tags:
#learning
#dsa
```

Allow:

- Search
- Date filtering
- Goal filtering
- Habit filtering
- Tags

---

# 18. Habit Creation

Use a modal or drawer.

## Step 1

```text
What habit do you want to build?

[______________________]
```

## Step 2

```text
Frequency

Daily
Weekdays
Custom
```

## Step 3

```text
Which goal does it support?

[Select goal]
```

## Step 4

```text
Target

30 minutes
5 problems
2 pages
10,000 steps
```

## Step 5

```text
Reminder

08:00 PM
```

Keep the creation flow short.

---

# 19. Task vs Habit

Clearly distinguish the two.

## Habit

Something repeated.

Examples:

```text
Exercise
Read
Meditate
Practice DSA
```

## Task

A specific action that needs completion.

Examples:

```text
Solve Two Sum
Complete FastAPI CRUD endpoint
Read Chapter 3
Deploy backend
```

The UI should visually communicate this difference.

---

# 20. Task Priority

Use:

```text
Low
Medium
High
```

Do not use excessive colors.

- High: small red indicator
- Medium: amber indicator
- Low: neutral indicator

---

# 21. Goal Categories

Use a small controlled category set:

```text
Career
Learning
Health
Fitness
Finance
Personal
Projects
Other
```

Each category gets a subtle icon.

Do not make every category a bright color.

---

# 22. Color System

Use a calm premium palette.

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

Muted Text:
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

# 23. Gradient System

Only use these gradients.

## Brand Gradient

```css
linear-gradient(135deg, #6366F1, #8B5CF6)
```

## Achievement Gradient

```css
linear-gradient(135deg, #8B5CF6, #EC4899)
```

## Success Gradient

```css
linear-gradient(135deg, #22C55E, #14B8A6)
```

Use gradients only for:

- Hero
- Primary CTA
- Major achievements
- Selected progress states

Never use gradients everywhere.

---

# 24. Visual Color Ratio

Follow:

```text
70% Neutral
20% Brand
10% Semantic / Achievement
```

The interface must remain calm.

---

# 25. Typography

Use:

```text
Inter
```

Recommended hierarchy:

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

Do not use excessive font weights.

---

# 26. Spacing

Use an 8px spacing system:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
```

Avoid random spacing values unless technically necessary.

---

# 27. Border Radius

Use:

```text
Small:
8px

Medium:
12px

Large:
16px

Extra Large:
20px

Pill:
999px
```

Recommended:

- Cards: 16px
- Buttons: 10–12px
- Inputs: 10–12px
- Badges: 999px

---

# 28. Shadows

Keep shadows subtle.

Small:

```css
box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
```

Medium:

```css
box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
```

Large:

```css
box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
```

Prefer borders and spacing over heavy shadows.

---

# 29. Component System

Create reusable components:

```text
AppShell
Sidebar
MobileNavigation
Header
ProgressCard
HabitCard
TaskCard
GoalCard
StreakCard
ProgressRing
ProgressBar
Calendar
Heatmap
NoteEditor
DailyReview
StatsCard
EmptyState
Modal
Toast
Badge
Button
Input
Select
```

Do not duplicate styling across components.

---

# 30. Responsive Design

Design mobile-first.

## Mobile

```text
320px–430px
```

Use:

- Bottom navigation
- Full-width cards
- Large touch targets
- Sticky Add button
- Collapsible sections

## Tablet

```text
768px+
```

Use a two-column dashboard.

## Desktop

```text
1024px+
```

Use:

```text
Sidebar
+
Main content
```

Maximum content width:

```text
1200–1400px
```

Do not stretch content across the entire screen.

---

# 31. Micro-interactions

When marking a habit or task complete:

```text
Click
 ↓
Checkbox animation
 ↓
Progress updates
 ↓
Streak updates
 ↓
Small success feedback
```

Use subtle 150–400ms animations.

Do not animate everything.

---

# 32. Achievements

Create meaningful milestones:

```text
🔥 7 Day Streak
🔥 30 Day Streak
🔥 100 Tasks Completed
🎯 First Goal Completed
💪 90% Weekly Consistency
📅 30 Days Tracked
```

Achievements should feel earned.

---

# 33. Empty States

Example:

```text
No goals yet

Create a goal and turn your
daily actions into measurable progress.

[Create Goal]
```

For habits:

```text
No habits for today

Start with one small habit.

[Create Habit]
```

Never show an unexplained blank screen.

---

# 34. Dark Mode

If dark mode is implemented, create a dedicated dark palette instead of simply inverting colors.

```text
Background:
#0B1120

Surface:
#111827

Surface Secondary:
#1E293B

Primary Text:
#F8FAFC

Secondary Text:
#CBD5E1

Border:
#334155

Primary:
#818CF8

Accent:
#A78BFA
```

---

# 35. Data Model Concept

Design the frontend around these entities:

```text
User

Goal
 ├── Habits
 └── Tasks

Habit
 └── Habit Logs

Task
 └── Task Completion

Daily Note

Daily Review

Achievement
```

Core backend concepts:

```text
Goals
Habits
Habit Logs
Tasks
Task Logs
Notes
Daily Reviews
Statistics
Streaks
Achievements
```

The frontend must not hardcode production data.

---

# 36. API-Ready Architecture

Use service/API layers:

```text
services/
    authApi
    goalsApi
    habitsApi
    tasksApi
    notesApi
    progressApi
```

The frontend should be ready to connect to:

```text
FastAPI
+
PostgreSQL
```

Every API-driven section must have:

- Loading state
- Error state
- Empty state
- Success state

---

# 37. Accessibility

Follow WCAG principles.

Minimum requirements:

- 44px touch targets
- Keyboard navigation
- Visible focus states
- Accessible labels
- Semantic HTML
- Strong contrast
- Color + icon/text for status

Never communicate completion using color alone.

---

# 38. UX Speed Goals

The user should be able to do this in under 5 seconds:

```text
Open app
 ↓
See today's progress
 ↓
Find task
 ↓
Mark complete
```

And under 30 seconds:

```text
Create habit
 ↓
Connect it to goal
 ↓
Set frequency
 ↓
Save
```

---

# 39. Dashboard Priority

Visual hierarchy:

```text
1. Today's Progress
2. Today's Tasks
3. Today's Habits
4. Goal Progress
5. Streak
6. Notes / Reflection
7. Analytics
```

Do not put analytics above today's actions.

The application exists to help the user act first and analyze later.

---

# 40. Product Personality

The application should feel:

```text
Calm
Focused
Premium
Motivating
Minimal
Personal
Data-driven
Professional
```

Visual direction:

```text
Apple Health
+
Linear
+
Notion
+
modern productivity applications
```

Use these only as general inspiration. Create an original interface.

---

# 41. Implementation Rules

Before changing code:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Identify existing components.
4. Do not rewrite unrelated files.
5. Define design tokens.
6. Build reusable components.
7. Implement one section at a time.
8. Run the application after each major change.
9. Test desktop and mobile.
10. Fix visual inconsistencies before moving forward.

Do not make random styling decisions while coding.

---

# 42. Final Acceptance Test

## Daily Workflow

```text
Can I see today's tasks?
Can I mark them complete?
Can I undo completion?
Can I see today's progress?
Can I write a note?
```

## Habit Workflow

```text
Can I create a habit?
Can I connect it to a goal?
Can I mark it complete?
Can I see the streak?
Can I see history?
```

## Goal Workflow

```text
Can I create a goal?
Can I set a deadline?
Can I connect habits?
Can I see progress?
Can I complete the goal?
```

## Review Workflow

```text
Can I inspect previous days?
Can I see calendar activity?
Can I read old notes?
Can I see weekly progress?
Can I see monthly progress?
```

## Visual Quality

```text
No visual clutter
No random colors
No excessive gradients
No inconsistent spacing
No oversized cards
No unnecessary animations
No confusing navigation
No dead buttons
No fake statistics
No hardcoded production data
```

---

# FINAL PRODUCT GOAL

The finished application should make the user feel:

> "I know what I need to do today, I can see whether I did it, I understand how it contributes to my goals, and I can look back and see whether I'm actually improving."

Build the entire experience around that feeling.
