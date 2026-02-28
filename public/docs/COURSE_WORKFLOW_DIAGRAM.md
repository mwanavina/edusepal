# EDUSEPAL Course Creation Workflow

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     INSTRUCTOR COURSE CREATION FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

                          START: /instructor/create-course
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────┐
│              PHASE 1: BASIC COURSE INFORMATION               │
├──────────────────────────────────────────────────────────────┤
│  Input Form Fields:                                          │
│  ├─ Course Title (required)                                 │
│  ├─ Short Description (required)                            │
│  ├─ Detailed Description (Tiptap editor)                    │
│  ├─ Course Level: Beginner/Intermediate/Advanced            │
│  ├─ Category Selection                                      │
│  ├─ Pricing Type: Free or Paid                              │
│  └─ Price (if Paid selected)                                │
│                                                              │
│  Database Action:                                            │
│  INSERT INTO courses (title, description, level, ...)       │
│  Status: 'draft'                                            │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ✓ Course Created Successfully
                                │
                                ▼
                Redirect to: /instructor/courses/{id}/edit
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│           PHASE 2: DETAILED COURSE CONFIGURATION             │
├──────────────────────────────────────────────────────────────┤
│  Add Advanced Settings:                                      │
│  ├─ Cover Image Upload (Uploadthing)                        │
│  ├─ Learning Outcomes (array of strings)                    │
│  ├─ Prerequisites (array of strings)                        │
│  ├─ Tags (for discoverability)                              │
│  ├─ Language Selection                                      │
│  └─ Visibility: Public/Private/Draft                        │
│                                                              │
│  Database Updates:                                           │
│  UPDATE courses SET cover_image, tags, prerequisites, ...   │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│             PHASE 3: CREATE COURSE STRUCTURE                 │
├──────────────────────────────────────────────────────────────┤
│  Create Modules (5-15 modules recommended)                  │
│                                                              │
│  Module Creation:                                            │
│  INSERT INTO modules (course_id, title, order_index, ...)   │
│                                                              │
│  Example Structure:                                          │
│  ├─ Module 1: Foundations (order_index: 1)                  │
│  ├─ Module 2: Core Concepts (order_index: 2)                │
│  ├─ Module 3: Advanced Topics (order_index: 3)              │
│  ├─ Module 4: Projects (order_index: 4)                     │
│  └─ Module 5: Capstone (order_index: 5)                     │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│          PHASE 4: ADD LESSONS TO EACH MODULE                 │
├──────────────────────────────────────────────────────────────┤
│  For Each Module, Add Lessons (3-10 per module)             │
│                                                              │
│  Lesson Types:                                               │
│  ├─ VIDEO LESSON                                            │
│  │   ├─ video_url (YouTube/Vimeo)                           │
│  │   ├─ video_duration (minutes)                            │
│  │   ├─ content (description)                               │
│  │   └─ resources (downloadable files)                      │
│  │                                                          │
│  ├─ TEXT LESSON                                             │
│  │   ├─ content (rich text)                                 │
│  │   ├─ resources (PDFs, images)                            │
│  │   └─ estimated_duration (minutes)                        │
│  │                                                          │
│  ├─ ASSIGNMENT LESSON                                       │
│  │   ├─ content (instructions)                              │
│  │   ├─ resources (starter files)                           │
│  │   └─ submission_type (file/link/text)                    │
│  │                                                          │
│  └─ QUIZ LESSON (covered in Phase 5)                        │
│                                                              │
│  Database Action:                                            │
│  INSERT INTO lessons (module_id, course_id, content, ...)   │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│          PHASE 5: CREATE ASSESSMENTS (QUIZZES)               │
├──────────────────────────────────────────────────────────────┤
│  Create Quiz Structure:                                      │
│                                                              │
│  1. Create Quiz Record                                       │
│  INSERT INTO quizzes (                                       │
│    course_id,                                                │
│    lesson_id,                                                │
│    title,                                                    │
│    passing_score (e.g., 70%),                                │
│    max_attempts,                                             │
│    time_limit (optional),                                    │
│    shuffle_questions,                                        │
│    show_correct_answers                                      │
│  )                                                           │
│                                                              │
│  2. Add Quiz Questions                                       │
│  INSERT INTO quiz_questions (                                │
│    quiz_id,                                                  │
│    question_text,                                            │
│    question_type (multiple_choice/true_false),               │
│    options (JSON),                                           │
│    correct_answer,                                           │
│    explanation,                                              │
│    points,                                                   │
│    order_index                                               │
│  )                                                           │
│                                                              │
│  Best Practice: 1 quiz per module or per 2-3 lessons        │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│              PHASE 6: FINAL REVIEW & PUBLISH                 │
├──────────────────────────────────────────────────────────────┤
│  Checklist:                                                  │
│  ☑ Course title and description are clear                   │
│  ☑ Cover image is high quality                              │
│  ☑ All modules are structured logically                     │
│  ☑ All lessons have content and resources                   │
│  ☑ Quizzes are created for assessment                       │
│  ☑ Learning outcomes are defined                            │
│  ☑ At least 1 free lesson available                         │
│  ☑ Prerequisites are listed                                 │
│  ☑ Pricing is appropriate                                   │
│  ☑ Course has minimum 25-50 lessons                         │
│                                                              │
│  Publish Action:                                             │
│  UPDATE courses SET                                          │
│    status = 'published',                                     │
│    visibility = 'public'                                     │
│  WHERE id = {courseId}                                       │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        ✓ COURSE PUBLISHED
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    STUDENT DISCOVERS COURSE                  │
├──────────────────────────────────────────────────────────────┤
│  Discovery Methods:                                          │
│  ├─ Course Search (search bar at top)                        │
│  ├─ Browse Categories                                       │
│  ├─ Featured Courses                                        │
│  ├─ Direct Link                                             │
│  └─ Course Listings Page                                    │
│                                                              │
│  Display:                                                    │
│  ├─ Course title and cover image                            │
│  ├─ Rating and reviews                                      │
│  ├─ Price and level indicator                               │
│  ├─ Learning outcomes                                       │
│  ├─ Preview video or free lessons                           │
│  └─ "Enroll Now" button                                     │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                        Student Clicks "Enroll"
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                      ENROLLMENT PROCESS                      │
├──────────────────────────────────────────────────────────────┤
│  For Free Courses: Immediate enrollment                      │
│  INSERT INTO enrollments (user_id, course_id, ...)           │
│                                                              │
│  For Paid Courses:                                           │
│  ├─ Redirect to payment (Stripe)                            │
│  ├─ Process payment                                          │
│  ├─ Create payment record                                    │
│  ├─ Create enrollment record                                │
│  └─ Track instructor earnings                               │
│                                                              │
│  Enrollment Record:                                          │
│  {                                                           │
│    user_id,                                                  │
│    course_id,                                                │
│    status: 'active',                                         │
│    progress_percentage: 0,                                   │
│    lessons_completed: 0,                                     │
│    enrolled_at: NOW()                                        │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    STUDENT LEARNS & PROGRESSES               │
├──────────────────────────────────────────────────────────────┤
│  Student Journey:                                            │
│                                                              │
│  1. Access Dashboard/Browse Courses                          │
│     └─ See enrolled courses and progress                     │
│                                                              │
│  2. Select Course and View Modules                           │
│     └─ List of modules with progress indicators              │
│                                                              │
│  3. Watch/Read Lessons                                       │
│     ├─ Video lessons stream                                  │
│     ├─ Track watch percentage                                │
│     ├─ Access downloadable resources                         │
│     └─ Update lesson_progress table                          │
│                                                              │
│  4. Complete Quizzes                                         │
│     ├─ Answer questions                                      │
│     ├─ Get instant feedback                                  │
│     ├─ See score and correct answers                         │
│     └─ Attempt again if retakes allowed                      │
│                                                              │
│  5. Submit Assignments (if applicable)                       │
│     ├─ Upload files or submit work                           │
│     └─ Get instructor feedback                               │
│                                                              │
│  Tracking Database:                                          │
│  ├─ lesson_progress (per-lesson tracking)                    │
│  ├─ quiz_attempts (quiz scores)                              │
│  ├─ enrollments (overall progress %)                         │
│  └─ assignments (submissions if applicable)                  │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    Course Progress = 100%
                        All Quizzes Passed
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                 CERTIFICATE GENERATION                       │
├──────────────────────────────────────────────────────────────┤
│  Trigger Conditions:                                         │
│  ├─ All lessons marked complete                              │
│  ├─ All required quizzes passed (≥ passing_score)            │
│  ├─ Progress percentage = 100%                               │
│  └─ Course status = published                                │
│                                                              │
│  Certificate Record Created:                                 │
│  INSERT INTO certificates (                                  │
│    user_id,                                                  │
│    course_id,                                                │
│    certificate_number (unique),                              │
│    verification_code (shareable),                            │
│    issued_at: NOW(),                                         │
│    final_score,                                              │
│    completed_percentage: 100                                 │
│  )                                                           │
│                                                              │
│  Student Receives:                                           │
│  ├─ Digital certificate                                      │
│  ├─ Certificate number                                       │
│  ├─ Verification link                                        │
│  ├─ Badge for profile                                        │
│  └─ Shareable LinkedIn credentials                           │
└──────────────────────────────────────────────────────────────┘
                                │
                                ▼
                         END: Certificate Earned
```

---

## Data Relationships Diagram

```
                    ┌─────────────┐
                    │  Profiles   │
                    │  (Students/ │
                    │ Instructors)│
                    └──────┬──────┘
                           │
                   ┌───────┴────────┐
                   │                │
              (teaches)        (enrolls)
                   │                │
                   ▼                ▼
           ┌─────────────┐  ┌──────────────┐
           │  Instructors│  │ Enrollments  │
           │  (Profile)  │  │              │
           └──────┬──────┘  └──────┬───────┘
                  │                │
            (creates)         (tracks)
                  │                │
                  ▼                ▼
           ┌─────────────┐  ┌──────────────┐
           │   Courses   │  │  Lessons_    │
           │             │  │  Progress    │
           └──────┬──────┘  └──────────────┘
                  │
        ┌─────────┴──────────┬──────────────┐
        │                    │              │
   (contains)          (has review)   (generates)
        │                    │              │
        ▼                    ▼              ▼
   ┌──────────┐      ┌─────────────┐  ┌──────────────┐
   │ Modules  │      │  Reviews    │  │ Certificates │
   │          │      │  (Ratings)  │  │              │
   └────┬─────┘      └─────────────┘  └──────────────┘
        │
   (contains)
        │
        ▼
   ┌──────────┐
   │ Lessons  │
   │(Text,    │
   │Video,    │
   │Quiz)     │
   └────┬─────┘
        │
    (includes)
        │
        ▼
   ┌──────────┐      ┌──────────────┐
   │ Quizzes  │──→   │ Quiz_        │
   │          │      │ Questions    │
   └──────────┘      └──────────────┘
        │
   (attempts)
        │
        ▼
   ┌──────────────┐
   │ Quiz_        │
   │ Attempts     │
   │ (Results)    │
   └──────────────┘
```

---

## Time Allocation Breakdown

```
Creating a Complete Course (Total: 15-30 hours)

Phase 1: Basic Setup               │ 15 min  │ 1%
Phase 2: Configuration             │ 30 min  │ 3%
Phase 3: Create Modules (5-15)     │ 2-3 hrs │ 15%
Phase 4: Add Lessons (25-50)       │ 10-20 hrs│ 65%  ← Most time here
Phase 5: Create Quizzes            │ 2-4 hrs │ 12%
Phase 6: Review & Publish          │ 30 min  │ 3%

Time Breakdown by Lesson:
├─ Video Lesson: 15-30 min (includes recording/editing)
├─ Text Lesson: 10-15 min
├─ Quiz Questions (10 questions): 20-30 min
└─ Assignment Setup: 10-15 min
```

---

## Status & State Transitions

```
Course Lifecycle:

DRAFT (Created)
  │
  ├─→ (Add content) → DRAFT (Editing)
  │
  └─→ (Publish) → PUBLISHED (Active)
                    │
                    ├─→ (Pause) → PAUSED (Archived)
                    │
                    ├─→ (Update content) → PUBLISHED
                    │
                    └─→ (End enrollment) → ARCHIVED


Student Enrollment Status:

active    → Learning course, making progress
paused    → Temporarily stopped
completed → Finished and earned certificate
dropped   → Did not complete
archived  → Course no longer available
```

---

## Required Fields Checklist

### Minimum for Draft:
- [x] Title
- [x] Description
- [x] Level
- [x] Pricing

### Recommended for Publishing:
- [x] Cover image
- [x] 5+ modules
- [x] 25+ lessons
- [x] Learning outcomes
- [x] At least 1 free lesson
- [x] Category
- [x] Tags
- [x] Prerequisites (optional)
- [x] 5+ quizzes

### Nice to Have:
- [x] Rich description with formatting
- [x] Course banner
- [x] Instructor bio
- [x] Resource downloads
- [x] Certification requirements
- [x] Student testimonials
