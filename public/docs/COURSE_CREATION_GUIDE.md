# Complete Course Creation Guide for EDUSEPAL

## Overview
This guide walks you through creating a complete course on EDUSEPAL from start to finish. The course creation process involves multiple steps and utilizes several database tables to build a comprehensive learning experience.

---

## Step-by-Step Course Creation Process

### **PHASE 1: Basic Course Setup**

#### Step 1: Access Course Creation Page
- **URL:** `/instructor/create-course`
- **Who Can Access:** Authenticated instructors
- **What Happens:** Instructor dashboard displays form to create a new course

#### Step 2: Fill in Course Information
The create-course form captures:

1. **Course Title** (Required)
   - Example: "Web Development Fundamentals"
   - Used as: Course name and basis for slug generation
   - Database Table: `courses.title`

2. **Short Description** (Required)
   - Brief overview of the course
   - 2-3 sentences summarizing what students will learn
   - Database Table: `courses.description`

3. **Detailed Description** (Optional)
   - Rich text editor (Tiptap) for formatted content
   - Can include: Headers, lists, images, links, code blocks, quotes
   - Database Table: `courses.rich_description`

4. **Course Level** (Required)
   - Options: Beginner, Intermediate, Advanced
   - Helps students find courses matching their skill level
   - Database Table: `courses.level`

5. **Category** (Optional)
   - Select from predefined categories
   - Categories are fetched from `categories` table
   - Database Table: `courses.category_id` (Foreign key reference)

6. **Pricing Type** (Required)
   - Options: Free or Paid
   - If Paid selected: Must specify price in USD
   - Database Tables: `courses.pricing_type`, `courses.price`

#### Step 3: Submit Initial Course Creation
- **Form Validation:**
  - Title is required
  - Short description is required
  - Level is required
  - Price required if pricing_type is "paid"

- **What Gets Created:**
  ```sql
  INSERT INTO courses (
    title,
    slug,                          -- auto-generated from title
    description,
    rich_description,
    level,
    category_id,
    instructor_id,                 -- current user's ID
    pricing_type,
    price,
    status,                        -- set to 'draft'
    created_at,
    updated_at
  )
  ```

- **Default Values Set:**
  - `status: 'draft'` - Course is not yet published
  - `slug: title.toLowerCase().replace(/\s+/g, '-')` - URL-friendly identifier
  - `total_modules: 0` - Will increase as modules are added
  - `total_lessons: 0` - Will increase as lessons are added
  - `total_students: 0` - Incremented when students enroll
  - `rating: 0` - Updated based on reviews
  - `is_deleted: false` - Course is active

- **On Success:**
  - User is redirected to: `/instructor/courses/{courseId}/edit`
  - Course now exists as a draft and can be further edited

---

### **PHASE 2: Detailed Course Configuration** (At `/instructor/courses/{courseId}/edit`)

#### Step 4: Add Course Cover Image
- **Field:** `cover_image` (URL/path to image)
- **Recommendation:** Upload via Uploadthing
- **Size:** Should be ~1280x720px
- **Database Table:** `courses.cover_image`
- **Why Important:** Used for course thumbnail on listings

#### Step 5: Set Learning Outcomes
- **Field:** `learning_outcomes` (Array of strings)
- **Example:**
  ```
  - Learn HTML5 fundamentals
  - Understand CSS styling and layouts
  - Master JavaScript basics
  - Build responsive websites
  ```
- **Database Table:** `courses.learning_outcomes`
- **Why Important:** Shows students what they'll achieve

#### Step 6: Add Prerequisites
- **Field:** `prerequisites` (Array of strings or course IDs)
- **Example:**
  ```
  - Basic computer literacy
  - HTML fundamentals (optional)
  - JavaScript basics
  ```
- **Database Table:** `courses.prerequisites`
- **Why Important:** Helps students determine if they're ready

#### Step 7: Add Tags
- **Field:** `tags` (Array of strings)
- **Example:** `['web-development', 'frontend', 'javascript', 'beginner']`
- **Database Table:** `courses.tags`
- **Why Important:** Improves course discoverability

#### Step 8: Set Course Language
- **Field:** `language` (ISO language code)
- **Example:** `'en'` for English, `'es'` for Spanish
- **Database Table:** `courses.language`

#### Step 9: Configure Course Visibility
- **Field:** `visibility` (Options: public, private, draft)
- **Database Table:** `courses.visibility`
- **Meanings:**
  - `public`: Visible to all users and in course listings
  - `private`: Only visible to enrolled students
  - `draft`: Only visible to instructor, not published yet

---

### **PHASE 3: Create Course Structure (Modules)**

#### Step 10: Create Modules
Modules are the main organizational units within a course. Each module contains lessons.

- **Module Fields:**
  - `title` (Required) - e.g., "Module 1: HTML Basics"
  - `description` - What students will learn in this module
  - `order_index` - Position in course (1, 2, 3...)
  - `duration_hours` - Estimated time to complete
  - `is_published` - If true, students can access

- **Database Insert:**
  ```sql
  INSERT INTO modules (
    course_id,      -- Foreign key to courses table
    title,
    description,
    order_index,
    duration_hours,
    is_published,
    created_at
  )
  ```

- **Best Practices:**
  - Create 5-15 modules for a typical course
  - Each module should take 2-8 hours to complete
  - Order modules logically (beginner to advanced)

---

### **PHASE 4: Add Course Content (Lessons)**

#### Step 11: Create Lessons Within Modules
Lessons are individual learning units within a module.

- **Lesson Types:**
  - `video` - Video-based lessons (with `video_url`, `video_duration`)
  - `text` - Written lessons with rich text
  - `quiz` - Assessment lessons
  - `assignment` - Student work

- **Lesson Fields:**
  ```
  title              - Lesson name
  description        - Brief overview
  lesson_type        - video, text, quiz, assignment
  content            - Rich text content
  video_url          - YouTube/Vimeo URL (if video type)
  video_duration     - Length in minutes
  estimated_duration - Time to complete in minutes
  order_index        - Position in module
  is_free            - Free preview or enrolled-only
  resources          - JSON array of downloadable files
  is_published       - Can students access?
  ```

- **Database Insert:**
  ```sql
  INSERT INTO lessons (
    course_id,
    module_id,       -- Foreign key to modules
    title,
    description,
    content,
    lesson_type,
    video_url,
    video_duration,
    order_index,
    is_free,
    is_published,
    created_at
  )
  ```

- **Typical Course Structure:**
  - Beginner Course: 25-50 lessons
  - Intermediate Course: 40-80 lessons
  - Advanced Course: 50-100+ lessons

---

### **PHASE 5: Add Assessments (Quizzes)**

#### Step 12: Create Quizzes
Quizzes assess student understanding and can be required to pass.

- **Quiz Fields:**
  ```
  title              - "Module 1 Quiz"
  description        - What topics are covered
  quiz_type          - 'graded' or 'practice'
  lesson_id          - (Optional) Attached to specific lesson
  passing_score      - Percentage needed to pass (e.g., 70)
  max_attempts       - Number of retakes allowed
  allows_retake      - Can students retake the quiz?
  time_limit         - Minutes allowed (optional)
  shuffle_questions  - Randomize question order?
  show_correct_answers - Show answers after completion?
  ```

- **Database Insert:**
  ```sql
  INSERT INTO quizzes (
    course_id,
    lesson_id,
    title,
    description,
    quiz_type,
    passing_score,
    max_attempts,
    allows_retake,
    time_limit,
    shuffle_questions,
    show_correct_answers,
    is_published,
    created_at
  )
  ```

#### Step 13: Add Quiz Questions
Each quiz contains multiple questions.

- **Question Fields:**
  ```
  question_text   - The actual question
  question_type   - 'multiple_choice', 'true_false', 'short_answer'
  options         - JSON array of answer choices
  correct_answer  - The correct answer
  explanation     - Why this is correct
  points          - Score for this question
  order_index     - Position in quiz
  ```

- **Example Multiple Choice:**
  ```json
  {
    "question_text": "What does HTML stand for?",
    "question_type": "multiple_choice",
    "options": [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language"
    ],
    "correct_answer": "Hyper Text Markup Language",
    "explanation": "HTML stands for HyperText Markup Language",
    "points": 5
  }
  ```

---

### **PHASE 6: Publish Course**

#### Step 14: Review Course Completeness
Before publishing, ensure:
- ✓ Course title and descriptions are compelling
- ✓ Cover image is uploaded
- ✓ At least 5-10 modules created
- ✓ Each module has 3-5 lessons
- ✓ Learning outcomes clearly defined
- ✓ Pricing is set correctly
- ✓ Category selected
- ✓ At least one free lesson available

#### Step 15: Publish Course
- **Update `status` from `draft` to `published`**
- **Set `visibility` to `public`**
- **Ensure `is_published = true` for modules and lessons you want visible**

- **Database Update:**
  ```sql
  UPDATE courses
  SET status = 'published',
      visibility = 'public',
      updated_at = NOW()
  WHERE id = {courseId}
  AND instructor_id = {instructorId}
  ```

- **On Publish:**
  - Course appears in public course listings
  - Students can browse and enroll
  - Course is searchable
  - Ratings and reviews become visible
  - Instructor earnings can be tracked

---

### **PHASE 7: Student Experience**

#### Step 16: Students Discover & Enroll
- Students find course via:
  - Search bar
  - Category browse
  - Course listings page
  - Direct link

- **When Student Enrolls:**
  ```sql
  INSERT INTO enrollments (
    user_id,
    course_id,
    status,              -- 'active'
    enrolled_at,
    progress_percentage, -- 0
    certificate_earned   -- false
  )
  ```

#### Step 17: Track Student Progress
- **System tracks:**
  - Lessons watched: `lesson_progress`
  - Quiz attempts: `quiz_attempts`
  - Module completion: Aggregate lesson progress
  - Overall progress: `enrollments.progress_percentage`

- **Database Tables Used:**
  - `lesson_progress` - Per-lesson tracking
  - `quiz_attempts` - Quiz scores and answers
  - `enrollments` - Overall enrollment status

#### Step 18: Certificate Generation
- **When Student Completes Course:**
  - Progress = 100%
  - All required quizzes passed
  - Final score calculated

- **Certificate Record Created:**
  ```sql
  INSERT INTO certificates (
    user_id,
    course_id,
    certificate_number,    -- Unique ID
    verification_code,     -- Can be verified via URL
    issued_at,
    final_score,
    completed_percentage
  )
  ```

---

## Database Table References

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `courses` | Main course data | id, title, instructor_id, status, pricing_type, price |
| `modules` | Course modules | id, course_id, title, order_index |
| `lessons` | Course lessons | id, module_id, course_id, lesson_type, content |
| `quizzes` | Course assessments | id, course_id, lesson_id, passing_score |
| `quiz_questions` | Quiz questions | id, quiz_id, question_text, correct_answer |
| `enrollments` | Student enrollments | id, user_id, course_id, progress_percentage |
| `lesson_progress` | Lesson tracking | id, user_id, lesson_id, is_completed |
| `quiz_attempts` | Quiz results | id, user_id, quiz_id, score, passed |
| `certificates` | Course completion | id, user_id, course_id, certificate_number |
| `categories` | Course categories | id, name, icon |

---

## Status Flow Diagram

```
DRAFT (Initial Creation)
   ↓
EDITING (Add modules, lessons, quizzes)
   ↓
REVIEW (Final checks)
   ↓
PUBLISHED (Visible to students)
   ↓
ACTIVE (Students enrolling)
   ↓
ARCHIVED (No longer accepting enrollments)
```

---

## Timeline Estimates

| Phase | Time | Task |
|-------|------|------|
| Phase 1 | 15 min | Basic course info |
| Phase 2 | 30 min | Detailed config |
| Phase 3 | 2-3 hrs | Create modules |
| Phase 4 | 10-20 hrs | Record/write lessons |
| Phase 5 | 2-4 hrs | Create quizzes |
| Phase 6 | 30 min | Review & publish |
| **Total** | **15-30 hrs** | Complete course |

---

## Key Best Practices

1. **Course Structure**
   - Always create modules before lessons
   - 1-2 week worth of content per course
   - Mix video, text, and interactive content

2. **Pricing Strategy**
   - Beginner courses: $9.99-$29.99
   - Intermediate courses: $29.99-$79.99
   - Advanced courses: $79.99-$199.99
   - Always offer 1-2 free lessons as preview

3. **Engagement**
   - Include quizzes after each module
   - Add downloadable resources
   - Use descriptive lesson titles
   - Include clear learning outcomes

4. **Quality**
   - Proofread all descriptions
   - Test all video links
   - Verify quiz questions
   - Get peer review before publishing

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Course not appearing in search | Check visibility is 'public' and status is 'published' |
| Students can't see lessons | Set `lessons.is_published = true` |
| Quiz not working | Ensure quiz_questions exist and quiz_type is valid |
| Progress not updating | Check lesson_progress table has records |
| Certificate not generating | Verify passing_score is met on all required quizzes |

---

## Next Steps After Publishing

1. **Monitor Enrollments** - Track via instructor dashboard
2. **Respond to Reviews** - Engage with student feedback
3. **Update Content** - Fix issues students report
4. **Add Promotions** - Offer discounts during promotions
5. **Create Bundles** - Combine multiple courses
6. **Collect Earnings** - Withdraw instructor profits

