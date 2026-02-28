# EDUSEPAL Database Schema Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLERK AUTHENTICATION                          │
│              (External auth service)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ webhooks
                             ▼
                    ┌────────────────┐
                    │    profiles    │ ◄─── Central Hub
                    │  (clerk_id)    │
                    └────────────────┘
                             │
         ┌───────────┬────────┼────────┬──────────┐
         │           │        │        │          │
         ▼           ▼        ▼        ▼          ▼
   instructors  orgs  notify  whatsapp payments earning
   profiles    owner  user_id  user_id  user_id  instr_id
```

---

## Complete Entity Relationship Diagram

```
                    ┌──────────────────────────────────────────────────────┐
                    │                    AUTHENTICATION                     │
                    │                                                       │
                    │  Clerk (External)  ──webhook──>  profiles            │
                    │                                   ├─ clerk_id (PK)   │
                    │                                   ├─ id (UUID-PK)    │
                    │                                   ├─ email            │
                    │                                   ├─ first_name       │
                    │                                   ├─ last_name        │
                    │                                   ├─ user_type        │
                    │                                   └─ ...              │
                    └──────────────────────────────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────────┐
                    │                     │                      │
                    ▼                     ▼                      ▼
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
          │ instructor_      │  │ organizations    │  │ whatsapp_        │
          │ profiles         │  │                  │  │ accounts         │
          ├─ id (FK) ◄──────┤  ├─ id (PK)        │  ├─ id (PK)        │
          ├─ specialization │  ├─ owner_id (FK) ├──┤ user_id (FK) ◄──┤
          ├─ bio            │  ├─ name           │  ├─ phone_number    │
          ├─ rating         │  ├─ website        │  ├─ is_verified     │
          └──────────────────┘  └──────────────────┘  └──────────────────┘
                    │                     │
                    │                     ▼
                    │         ┌──────────────────────────┐
                    │         │      courses             │
                    │         ├─ id (PK)                │
                    └────────►├─ instructor_id (FK) ◄───┤
                              ├─ organization_id (FK)  ├─ Can be created by
                              ├─ title, description    │  instructor or org
                              ├─ price, level          │
                              ├─ is_published          │
                              └──────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
          │    modules       │  │   enrollments    │  │    bundles       │
          ├─ id (PK)        │  ├─ id (PK)        │  ├─ id (PK)        │
          ├─ course_id (FK) │  ├─ user_id (FK)  │  ├─ title, price    │
          ├─ title, order   │  ├─ course_id(FK) │  ├─ discount_pct    │
          └──────────────────┘  ├─ progress      │  └──────────────────┘
                    │           ├─ status        │         │
                    │           └──────────────────┘        │
                    │                    │                   │
                    ▼                    ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
          │    lessons       │  │ lesson_progress  │  │ bundle_courses   │
          ├─ id (PK)        │  ├─ id (PK)        │  ├─ bundle_id(FK)  │
          ├─ module_id (FK) │  ├─ user_id (FK)  │  ├─ course_id(FK)  │
          ├─ course_id (FK) │  ├─ lesson_id (FK) │  └──────────────────┘
          ├─ title, content │  ├─ is_completed   │
          ├─ video_url      │  └──────────────────┘
          ├─ has_quiz       │
          └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │     quizzes      │
          ├─ id (PK)        │
          ├─ lesson_id (FK) │
          ├─ course_id (FK) │
          ├─ passing_score  │
          ├─ time_limit     │
          └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │ quiz_questions   │
          ├─ id (PK)        │
          ├─ quiz_id (FK)   │
          ├─ question_text  │
          ├─ options (JSONB)│
          ├─ correct_answer │
          └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │  quiz_attempts   │
          ├─ id (PK)        │
          ├─ user_id (FK)  │
          ├─ quiz_id (FK)   │
          ├─ score          │
          ├─ percentage     │
          ├─ is_passed      │
          ├─ answers (JSONB)│
          └──────────────────┘


                    CREDENTIALS & SOCIAL PROOF

          ┌──────────────────┐      ┌──────────────────┐
          │ certificates     │      │     reviews      │
          ├─ id (PK)        │      ├─ id (PK)        │
          ├─ user_id (FK)  │      ├─ user_id (FK)  │
          ├─ course_id (FK) │      ├─ course_id (FK) │
          ├─ certificate_code│     ├─ rating (1-5)   │
          ├─ issue_date     │      ├─ title, comment │
          ├─ download_url   │      ├─ is_published   │
          └──────────────────┘      └──────────────────┘


                    COMMERCE

    ┌─────────────────────────────────┬──────────────────────────┐
    │                                 │                          │
    ▼                                 ▼                          ▼
┌──────────────────┐      ┌──────────────────────┐   ┌──────────────────┐
│   payments       │      │ subscription_plans   │   │ subscriptions    │
├─ id (PK)        │      ├─ id (PK)            │   ├─ id (PK)        │
├─ user_id (FK)  │      ├─ name (Basic,Pro)   │   ├─ user_id (FK)  │
├─ course_id(FK) │      ├─ price, currency    │   ├─ plan_id (FK)   │
├─ subscription  │      ├─ billing_period     │   ├─ status         │
│ _id (FK)        │      ├─ max_courses        │   ├─ current_period │
├─ amount        │      ├─ features (JSONB)   │   ├─ auto_renew     │
├─ payment_method│      └──────────────────────┘   └──────────────────┘
├─ transaction_id│
├─ status        │
└──────────────────┘
    │
    ▼
┌──────────────────┐
│    earnings      │
├─ id (PK)        │
├─ instructor_id  │
│ (FK)            │
├─ course_id (FK) │
├─ payment_id (FK)│
├─ amount         │
├─ commission%    │
├─ net_amount     │
└──────────────────┘


                    ENGAGEMENT

          ┌──────────────────┐
          │  notifications   │
          ├─ id (PK)        │
          ├─ user_id (FK)  │
          ├─ type           │
          ├─ title, message │
          ├─ is_read        │
          └──────────────────┘
```

---

## Key Relationships Summary

### One-to-Many (1:N)
```
profiles → instructor_profiles (1 user can be 1 instructor)
profiles → organizations (1 user can own multiple organizations)
profiles → courses (1 instructor can create multiple courses)
profiles → enrollments (1 student can enroll in multiple courses)
profiles → lesson_progress (1 student can have progress in multiple lessons)
profiles → quiz_attempts (1 student can attempt multiple quizzes)
profiles → certificates (1 student can earn multiple certificates)
profiles → reviews (1 student can review multiple courses)
profiles → payments (1 student can make multiple payments)
profiles → earnings (1 instructor can earn from multiple courses)
profiles → subscriptions (1 student can have multiple subscriptions)
profiles → notifications (1 user can receive multiple notifications)
profiles → whatsapp_accounts (1 user can have multiple WhatsApp accounts)

organizations → courses (1 org can have multiple courses)

courses → modules (1 course has multiple modules)
courses → enrollments (1 course has multiple students)
courses → bundles (through bundle_courses: many-to-many)
courses → reviews (1 course can have multiple reviews)
courses → certificates (1 course can have multiple certificates)

modules → lessons (1 module has multiple lessons)

lessons → lesson_progress (1 lesson can be tracked by multiple students)
lessons → quizzes (1 lesson can have multiple quizzes)

quizzes → quiz_questions (1 quiz has multiple questions)
quizzes → quiz_attempts (1 quiz can have multiple attempts)

enrollments → lesson_progress (tracks individual lesson progress per enrollment)

bundles → bundle_courses (1 bundle has multiple courses)
bundle_courses → courses (many-to-many via bundle_courses)

subscription_plans → subscriptions (1 plan can have many subscribers)
```

### Many-to-Many (M:N)
```
courses ←→ bundles (through bundle_courses)
  - 1 course can be in multiple bundles
  - 1 bundle can contain multiple courses
```

### One-to-One (1:1)
```
profiles → instructor_profiles (optional: only instructors have this)
```

---

## Data Flow Examples

### Sign Up → Profile Creation
```
User signs up in Clerk
        ↓
Clerk webhook fires (user.created)
        ↓
Webhook handler creates profile record
        ↓
User sees dashboard with empty enrollment list
```

### Course Enrollment → Certificate
```
Student enrolls in course
        ↓
Creates enrollment record
        ↓
Student completes lessons
        ↓
lesson_progress updated (is_completed = true)
        ↓
Student attempts quiz & passes
        ↓
Quiz attempt marked as passed
        ↓
System triggers certificate creation
        ↓
Certificate issued with verification code
```

### Payment → Earnings
```
Student purchases course
        ↓
Payment record created (amount = $29.99)
        ↓
Earnings record created for instructor
        ├─ amount = $29.99
        ├─ commission_percentage = 30%
        ├─ commission_amount = $9.00
        └─ net_amount = $20.99
        ↓
Payout scheduled when net_amount reaches threshold
```

### Instructor Content Creation
```
Instructor creates course
        ↓
Course record created with instructor_id
        ↓
Instructor adds 3 modules
        ↓
Module 1 gets 4 lessons
        ↓
Lesson 2 has a quiz
        ↓
Quiz gets 10 questions
        ↓
Instructor publishes course
        ↓
Students can search and enroll
```

---

## Index Strategy

### Primary Indexes (Automatic)
- All PRIMARY KEY columns are indexed

### Performance Indexes (Recommended)
```sql
-- Fast user lookups by clerk_id
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);

-- Fast enrollment queries
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- Fast progress tracking
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);

-- Fast quiz tracking
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Fast certificate lookups
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_course_id ON certificates(course_id);

-- Fast payment/earning queries
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_course_id ON payments(course_id);
CREATE INDEX idx_earnings_instructor_id ON earnings(instructor_id);

-- Fast review lookups
CREATE INDEX idx_reviews_course_id ON reviews(course_id);

-- Fast notification queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

---

## Cascade Rules

```
profiles DELETED
    → instructor_profiles (CASCADE)
    → organizations (SET NULL or CASCADE)
    → courses (SET NULL or CASCADE)
    → enrollments (CASCADE)
    → lesson_progress (CASCADE)
    → quiz_attempts (CASCADE)
    → certificates (CASCADE)
    → reviews (CASCADE)
    → payments (CASCADE)
    → earnings (CASCADE)
    → subscriptions (CASCADE)
    → notifications (CASCADE)
    → whatsapp_accounts (CASCADE)

courses DELETED
    → modules (CASCADE)
    → lessons (CASCADE)
    → enrollments (CASCADE)
    → reviews (CASCADE)
    → certificates (CASCADE)
    → payments (CASCADE)
    → earnings (CASCADE)
    → bundle_courses (CASCADE)

enrollments DELETED
    → lesson_progress (CASCADE)
    → quiz_attempts (CASCADE)

quizzes DELETED
    → quiz_questions (CASCADE)
    → quiz_attempts (CASCADE)
```

This ensures no orphaned records when data is deleted.

