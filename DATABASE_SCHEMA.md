# EDUSEPAL Database Schema Documentation

## Overview
EDUSEPAL uses a comprehensive PostgreSQL database with Row Level Security (RLS) policies and Clerk for authentication. The database is designed to support a complete online learning platform with courses, enrollments, certificates, payments, and instructor management.

---

## Authentication Architecture

### Clerk Integration
- **Why Clerk**: Clerk provides enterprise-grade authentication with built-in support for email, social login, multi-factor authentication, and user management.
- **Clerk ID Field**: Each user profile has a `clerk_id` (TEXT) that matches Clerk's user ID format (e.g., "user_2a4vDjKvCxxx").
- **Local ID Field**: Profiles also have a `id` (UUID) field for efficient database relationships.
- **No auth.users dependency**: Unlike Supabase Auth, we don't depend on `auth.users` table, making the schema portable.

### RLS Policy Pattern
RLS policies use Clerk ID via application context:
```sql
-- Application sets: SELECT set_config('app.clerk_id', clerk_id_from_session, false);
-- Policies check: clerk_id = current_setting('app.clerk_id', true)
```

---

## Core Tables & Relationships

### 1. **profiles** (USER MANAGEMENT)
**Purpose**: Central user hub for all platform users

**Fields**:
- `id` (UUID PRIMARY KEY) - Local database identifier
- `clerk_id` (TEXT UNIQUE) - Clerk authentication ID
- `email` (TEXT UNIQUE NOT NULL) - User email
- `first_name` (TEXT) - User's first name
- `last_name` (TEXT) - User's last name
- `avatar_url` (TEXT) - Profile picture
- `bio` (TEXT) - User bio/description
- `user_type` (TEXT) - 'learner', 'instructor', or 'admin'
- `is_email_verified` (BOOLEAN) - Email verification status
- `created_at`, `updated_at` - Timestamps

**Relationships**:
- Referenced by: instructor_profiles, organizations, courses, enrollments, reviews, payments, earnings, certificates, subscriptions, etc.
- **Justification**: Single source of truth for all user information. Other tables link to profiles.id to track user involvement.

---

### 2. **instructor_profiles** (INSTRUCTOR SPECIALIZATION)
**Purpose**: Extends profiles with instructor-specific information

**Fields**:
- `id` (UUID PRIMARY KEY, FOREIGN KEY → profiles.id)
- `specialization` (TEXT) - Teaching specialization
- `bio` (TEXT) - Instructor bio
- `years_experience` (INTEGER) - Teaching experience
- `hourly_rate` (DECIMAL) - Teaching rate
- `rating` (DECIMAL) - Average instructor rating
- `total_students` (INTEGER) - Total students taught
- `is_verified` (BOOLEAN) - Instructor verification status

**Relationships**:
- Links to: profiles.id
- **Justification**: Not all users are instructors. This table adds teaching-specific metadata while keeping profiles table lean. One-to-one relationship (instructors only).

---

### 3. **organizations** (INSTITUTIONAL COURSES)
**Purpose**: Support institutional or organizational course management

**Fields**:
- `id` (UUID PRIMARY KEY)
- `owner_id` (UUID FOREIGN KEY → profiles.id)
- `name` (TEXT UNIQUE NOT NULL)
- `description` (TEXT)
- `website` (TEXT)
- `logo_url` (TEXT)
- `is_verified` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Owner: profiles.id (instructor/admin who owns org)
- Referenced by: courses (one org can have many courses)
- **Justification**: Organizations allow multiple instructors to collaborate. They're separate entities that can own courses, enabling enterprise use cases.

---

### 4. **courses** (CORE LEARNING CONTENT)
**Purpose**: Container for all course information and learning content

**Fields**:
- `id` (UUID PRIMARY KEY)
- `instructor_id` (UUID FOREIGN KEY → profiles.id)
- `organization_id` (UUID FOREIGN KEY → organizations.id, nullable)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `category` (TEXT) - Course category (programming, math, etc.)
- `level` (TEXT) - 'beginner', 'intermediate', 'advanced'
- `price` (DECIMAL) - Course price
- `currency` (TEXT) - Currency code
- `thumbnail_url` (TEXT) - Course image
- `rating` (DECIMAL) - Average course rating
- `student_count` (INTEGER) - Number of enrolled students
- `is_published` (BOOLEAN) - Publication status
- `created_at`, `updated_at`

**Relationships**:
- Instructor: profiles.id (who created course)
- Organization: organizations.id (optional, for org courses)
- Referenced by: modules, enrollments, reviews, certificates, payments, earnings, bundles
- **Justification**: Central content hub. All learning content (modules, lessons, quizzes) is organized under courses. Instructors create and own courses. Organizations can own courses for institutional learning.

---

### 5. **modules** (COURSE STRUCTURE)
**Purpose**: Organize courses into logical sections

**Fields**:
- `id` (UUID PRIMARY KEY)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `order_index` (INTEGER) - Display order
- `created_at`, `updated_at`

**Relationships**:
- Course: courses.id (one course has many modules)
- Referenced by: lessons (modules contain lessons)
- **Justification**: Modules provide structure within courses. Courses → Modules → Lessons → Quiz Questions creates a hierarchy for content organization.

---

### 6. **lessons** (LEARNING UNITS)
**Purpose**: Individual learning units within modules

**Fields**:
- `id` (UUID PRIMARY KEY)
- `module_id` (UUID FOREIGN KEY → modules.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `title` (TEXT NOT NULL)
- `content` (TEXT) - Rich HTML/markdown content
- `video_url` (TEXT) - Optional lesson video
- `duration_minutes` (INTEGER) - Estimated duration
- `order_index` (INTEGER) - Display order
- `has_quiz` (BOOLEAN) - Whether lesson has associated quiz
- `is_published` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Module: modules.id (module contains lessons)
- Course: courses.id (for quick filtering)
- Referenced by: lesson_progress, quiz_attempts
- **Justification**: Lessons are atomic learning units. Storing course_id denormalizes for query efficiency. Students progress through lessons, tracked in lesson_progress.

---

### 7. **quiz_questions** (ASSESSMENT ITEMS)
**Purpose**: Individual quiz questions for knowledge assessment

**Fields**:
- `id` (UUID PRIMARY KEY)
- `quiz_id` (UUID FOREIGN KEY → quizzes.id)
- `question_text` (TEXT NOT NULL)
- `question_type` (TEXT) - 'multiple_choice', 'true_false', 'short_answer'
- `options` (JSONB) - For multiple choice: {option1, option2, option3, option4}
- `correct_answer` (TEXT) - Correct answer
- `explanation` (TEXT) - Explanation shown after answer
- `points` (INTEGER) - Points for correct answer
- `order_index` (INTEGER) - Display order
- `created_at`, `updated_at`

**Relationships**:
- Quiz: quizzes.id (one quiz has many questions)
- Referenced by: quiz_attempts
- **Justification**: Quiz questions are atomic assessment items. Stored separately to support randomization, retakes, and different question types per quiz.

---

### 8. **quizzes** (ASSESSMENTS)
**Purpose**: Assessment tools for lessons and courses

**Fields**:
- `id` (UUID PRIMARY KEY)
- `lesson_id` (UUID FOREIGN KEY → lessons.id, nullable)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `passing_score` (INTEGER) - Percentage needed to pass (e.g., 70)
- `max_attempts` (INTEGER) - Number of allowed attempts
- `time_limit_minutes` (INTEGER) - Time limit per attempt
- `is_published` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Lesson: lessons.id (optional, quiz can be standalone or lesson-specific)
- Course: courses.id (for quiz reference)
- Referenced by: quiz_questions, quiz_attempts
- **Justification**: Quizzes assess learning. They can be lesson-specific or course-wide. quiz_questions are stored separately for flexible question management.

---

### 9. **enrollments** (STUDENT COURSE REGISTRATION)
**Purpose**: Track student enrollment in courses

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `status` (TEXT) - 'active', 'completed', 'paused', 'dropped'
- `progress_percentage` (INTEGER) - Overall progress (0-100)
- `lessons_completed` (INTEGER) - Count of completed lessons
- `enrolled_at` (TIMESTAMP)
- `completed_at` (TIMESTAMP, nullable)
- `UNIQUE(user_id, course_id)` - Prevent duplicate enrollments

**Relationships**:
- Student: profiles.id (who enrolled)
- Course: courses.id (which course)
- Referenced by: lesson_progress
- **Justification**: Junction table linking students to courses. Tracks enrollment status and progress. One student can enroll in multiple courses; one course has multiple students.

---

### 10. **lesson_progress** (LEARNING PROGRESS TRACKING)
**Purpose**: Track individual student progress through lessons

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `lesson_id` (UUID FOREIGN KEY → lessons.id)
- `enrollment_id` (UUID FOREIGN KEY → enrollments.id)
- `is_completed` (BOOLEAN)
- `completion_date` (TIMESTAMP, nullable)
- `time_spent_minutes` (INTEGER) - Time spent on lesson
- `notes` (TEXT) - Student notes
- `UNIQUE(user_id, lesson_id)` - One progress record per student per lesson

**Relationships**:
- Student: profiles.id
- Lesson: lessons.id
- Enrollment: enrollments.id (parent course enrollment)
- **Justification**: Granular progress tracking. Every lesson a student views is tracked here. Enables progress bars, certificates (when all lessons complete), and analytics.

---

### 11. **quiz_attempts** (QUIZ SUBMISSIONS)
**Purpose**: Track student quiz submissions and scores

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `quiz_id` (UUID FOREIGN KEY → quizzes.id)
- `enrollment_id` (UUID FOREIGN KEY → enrollments.id)
- `attempt_number` (INTEGER) - Which attempt (1st, 2nd, etc.)
- `score` (INTEGER) - Points earned
- `percentage` (INTEGER) - Percentage score
- `is_passed` (BOOLEAN) - Whether passed based on passing_score
- `answers` (JSONB) - Student's answers
- `started_at` (TIMESTAMP)
- `submitted_at` (TIMESTAMP)

**Relationships**:
- Student: profiles.id
- Quiz: quizzes.id
- Enrollment: enrollments.id
- **Justification**: Track all quiz attempts. Supports multiple retakes and progress analytics. JSONB stores flexible answer data.

---

### 12. **certificates** (CREDENTIAL ISSUANCE)
**Purpose**: Issue and track completion certificates

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `certificate_code` (TEXT UNIQUE) - Verification code
- `issue_date` (TIMESTAMP)
- `expiry_date` (TIMESTAMP, nullable)
- `score` (INTEGER) - Final course score
- `is_verified` (BOOLEAN) - Public visibility
- `download_url` (TEXT) - Certificate PDF
- `created_at`, `updated_at`

**Relationships**:
- Student: profiles.id (who earned it)
- Course: courses.id (from which course)
- Referenced by: payments (proof of completion for payment)
- **Justification**: Certificates are issued upon course completion. Verification code allows public viewing without account. RLS allows users to view own certs and public verified certs.

---

### 13. **reviews** (COURSE FEEDBACK)
**Purpose**: Student reviews and ratings for courses

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `rating` (INTEGER) - 1-5 stars
- `title` (TEXT)
- `comment` (TEXT)
- `is_verified_purchase` (BOOLEAN) - Did they actually enroll?
- `helpful_count` (INTEGER) - Upvote count
- `is_published` (BOOLEAN)
- `UNIQUE(user_id, course_id)` - One review per student per course
- `created_at`, `updated_at`

**Relationships**:
- Reviewer: profiles.id (student who reviewed)
- Course: courses.id (course being reviewed)
- **Justification**: Social proof and feedback. Only published reviews are shown publicly. RLS allows reviewers to manage their own reviews.

---

### 14. **payments** (TRANSACTION TRACKING)
**Purpose**: Track all monetary transactions in the platform

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `course_id` (UUID FOREIGN KEY → courses.id, nullable)
- `subscription_id` (UUID FOREIGN KEY → subscriptions.id, nullable)
- `amount` (DECIMAL) - Transaction amount
- `currency` (TEXT) - Currency code
- `payment_method` (TEXT) - 'credit_card', 'paypal', etc.
- `transaction_id` (TEXT UNIQUE) - Payment gateway transaction ID
- `payment_status` (TEXT) - 'pending', 'completed', 'failed', 'refunded'
- `payment_date` (TIMESTAMP)
- `refund_date` (TIMESTAMP, nullable)
- `refund_reason` (TEXT)
- `invoice_number` (TEXT)
- `metadata` (JSONB) - Gateway-specific data
- `created_at`, `updated_at`

**Relationships**:
- Payer: profiles.id (who paid)
- Course: courses.id (for course purchase, nullable for subscriptions)
- Subscription: subscriptions.id (for subscription payment, nullable for course purchase)
- Referenced by: earnings
- **Justification**: Single source of truth for all revenue. Supports both one-time course purchases and recurring subscriptions. JSONB stores payment gateway details.

---

### 15. **earnings** (INSTRUCTOR REVENUE)
**Purpose**: Track instructor earnings from course sales

**Fields**:
- `id` (UUID PRIMARY KEY)
- `instructor_id` (UUID FOREIGN KEY → profiles.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `payment_id` (UUID FOREIGN KEY → payments.id, nullable)
- `amount` (DECIMAL) - Sale amount
- `commission_percentage` (DECIMAL) - Platform fee percentage
- `commission_amount` (DECIMAL) - Platform fee amount
- `net_amount` (DECIMAL) - Instructor earnings (amount - commission)
- `earning_type` (TEXT) - 'course_sale', 'subscription', 'bundle'
- `payout_status` (TEXT) - 'pending', 'approved', 'paid', 'cancelled'
- `payout_date` (TIMESTAMP)
- `created_at`, `updated_at`

**Relationships**:
- Instructor: profiles.id (who earned)
- Course: courses.id (from which course)
- Payment: payments.id (associated transaction)
- **Justification**: Tracks instructor revenue. Separate from payments to isolate instructor concerns. Supports payout processing and revenue analytics.

---

### 16. **subscription_plans** (RECURRING BILLING PLANS)
**Purpose**: Define subscription plan options

**Fields**:
- `id` (UUID PRIMARY KEY)
- `name` (TEXT UNIQUE NOT NULL) - 'Basic', 'Pro', 'Premium'
- `description` (TEXT)
- `price` (DECIMAL) - Monthly/yearly price
- `currency` (TEXT) - Currency code
- `billing_period` (TEXT) - 'monthly', 'quarterly', 'yearly'
- `max_courses` (INTEGER) - Max courses in subscription
- `features` (JSONB) - Feature list: {certificates, live_sessions, mentoring}
- `is_active` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Referenced by: subscriptions (plans have many subscribers)
- **Justification**: Plans define pricing and feature tiers. Stored separately to allow easy plan creation/editing without affecting active subscriptions.

---

### 17. **subscriptions** (RECURRING USER SUBSCRIPTIONS)
**Purpose**: Track student subscriptions for unlimited course access

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `plan_id` (UUID FOREIGN KEY → subscription_plans.id, nullable)
- `stripe_subscription_id` (TEXT) - Stripe subscription ID
- `status` (TEXT) - 'active', 'paused', 'cancelled', 'expired'
- `current_period_start` (TIMESTAMP)
- `current_period_end` (TIMESTAMP)
- `started_at` (TIMESTAMP)
- `ended_at` (TIMESTAMP, nullable)
- `auto_renew` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Subscriber: profiles.id (who subscribed)
- Plan: subscription_plans.id (which plan)
- Referenced by: payments (subscription payments)
- **Justification**: Tracks active subscriptions. Stores Stripe ID for webhook handling. Supports pause, cancel, and renewal logic.

---

### 18. **bundles** (COURSE PACKAGES)
**Purpose**: Group courses for discounted pricing

**Fields**:
- `id` (UUID PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `price` (DECIMAL)
- `currency` (TEXT)
- `discount_percentage` (DECIMAL)
- `thumbnail_url` (TEXT)
- `is_published` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Referenced by: bundle_courses (bundles contain many courses)
- **Justification**: Enables promotional bundles. Courses can be in multiple bundles. Supports pricing strategies like "3-course bundle for 30% off".

---

### 19. **bundle_courses** (BUNDLE MEMBERSHIP)
**Purpose**: Junction table linking courses to bundles

**Fields**:
- `id` (UUID PRIMARY KEY)
- `bundle_id` (UUID FOREIGN KEY → bundles.id)
- `course_id` (UUID FOREIGN KEY → courses.id)
- `order_index` (INTEGER) - Display order

**Relationships**:
- Bundle: bundles.id
- Course: courses.id
- **Justification**: Many-to-many relationship. A course can be in multiple bundles; a bundle contains multiple courses.

---

### 20. **notifications** (USER ALERTS)
**Purpose**: System notifications for users about courses, progress, etc.

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `type` (TEXT) - 'course_update', 'completion', 'announcement'
- `title` (TEXT)
- `message` (TEXT)
- `is_read` (BOOLEAN)
- `action_url` (TEXT, nullable) - Link to action
- `created_at`
- `read_at` (TIMESTAMP, nullable)

**Relationships**:
- Recipient: profiles.id
- **Justification**: User notifications. Supports email and in-app notifications. RLS ensures users only see own notifications.

---

### 21. **whatsapp_accounts** (MESSAGING INTEGRATION)
**Purpose**: WhatsApp integration for course notifications and support

**Fields**:
- `id` (UUID PRIMARY KEY)
- `user_id` (UUID FOREIGN KEY → profiles.id)
- `phone_number` (TEXT)
- `whatsapp_business_id` (TEXT)
- `is_verified` (BOOLEAN)
- `created_at`, `updated_at`

**Relationships**:
- Owner: profiles.id
- **Justification**: Optional WhatsApp integration for notifications, allowing students to receive course updates and support via WhatsApp.

---

## Row Level Security (RLS) Summary

| Table | Policy | Purpose |
|-------|--------|---------|
| profiles | Users can view all profiles; edit only own | Public profiles, user-owned data |
| enrollments | Users can view/create/update own enrollments | Students manage their courses |
| lesson_progress | Users can view/update own progress | Track personal progress |
| quiz_attempts | Users can view/create own attempts | Submit and review quizzes |
| certificates | Users view own; public view if verified | Privacy + social proof |
| reviews | Public for published; users manage own | Feedback + ownership |
| payments | Users view own only | Financial privacy |
| earnings | Instructors view own only | Revenue privacy |
| subscriptions | Users view own only | Subscription privacy |
| notifications | Users view own only | Notification privacy |

---

## Indexes for Performance

Key indexes for query optimization:
```sql
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_reviews_course_id ON reviews(course_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_earnings_instructor_id ON earnings(instructor_id);
```

---

## Key Design Principles

1. **Denormalization for Performance**: Some fields (e.g., course_id in lessons) are denormalized for query efficiency.
2. **Clerk Independence**: Uses clerk_id for auth, not auth.users, making schema portable.
3. **Flexible JSONB Fields**: Stores payment metadata, quiz options, and features as JSONB for flexibility.
4. **Cascade Deletes**: Deleted users cascade to related records for data integrity.
5. **RLS Privacy**: All user-sensitive tables have RLS to prevent data leakage.
6. **Status Enums**: Uses TEXT CHECK constraints for status fields (more flexible than enums).
7. **Timestamps**: All tables have created_at and updated_at for audit trails.

