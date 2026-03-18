-- EDUSEPAL Seed Data Script
-- Populates core tables with coherent dummy data for local development.
-- This script is idempotent: it uses ON CONFLICT / WHERE NOT EXISTS guards.

BEGIN;

-- ==================== PROFILES (USERS) ====================
-- IMPORTANT: This script now assumes the foreign key
--   FOREIGN KEY (id) REFERENCES auth.users(id)
-- has been dropped from public.profiles so we can seed
-- standalone demo users.
INSERT INTO public.profiles (id, clerk_id, email, first_name, last_name, user_type, avatar_url, bio, phone, is_verified, is_active)
SELECT
  gen_random_uuid(),
  'user_admin_001',
  'admin@example.com',
  'Alice',
  'Admin',
  'admin',
  NULL,
  'Platform administrator for demo data.',
  NULL,
  TRUE,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'admin@example.com'
);

INSERT INTO public.profiles (id, clerk_id, email, first_name, last_name, user_type, avatar_url, bio, phone, is_verified, is_active)
SELECT
  gen_random_uuid(),
  'user_instr_001',
  'instructor@example.com',
  'Isaac',
  'Instructor',
  'instructor',
  NULL,
  'Demo instructor specializing in full-stack web development.',
  NULL,
  TRUE,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'instructor@example.com'
);

INSERT INTO public.profiles (id, clerk_id, email, first_name, last_name, user_type, avatar_url, bio, phone, is_verified, is_active)
SELECT
  gen_random_uuid(),
  'user_student_001',
  'student@example.com',
  'Sara',
  'Student',
  'learner',
  NULL,
  'Demo learner account for testing the platform.',
  NULL,
  TRUE,
  TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 'student@example.com'
);

-- ==================== INSTRUCTOR PROFILES ====================
INSERT INTO public.instructor_profiles (id, qualification, experience_years, specialization, teaching_style, bio_extended, social_links, is_verified)
SELECT
  p.id,
  'MSc Computer Science',
  7,
  ARRAY['Web Development', 'Databases'],
  'Project-based learning with lots of practical examples.',
  'Passionate educator focused on helping learners build real-world skills.',
  jsonb_build_object(
    'website', 'https://instructor.example.com',
    'linkedin', 'https://linkedin.com/in/instructor-example'
  ),
  TRUE
FROM public.profiles p
WHERE p.email = 'instructor@example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.instructor_profiles ip WHERE ip.id = p.id
);

-- ==================== ORGANIZATIONS ====================
INSERT INTO public.organizations (id, name, slug, description, website, owner_id, is_verified, is_active)
SELECT
  gen_random_uuid(),
  'Edusepal Academy',
  'edusepal-academy',
  'A demo organization representing a modern online academy.',
  'https://academy.example.com',
  p.id,
  TRUE,
  TRUE
FROM public.profiles p
WHERE p.email = 'instructor@example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.organizations WHERE slug = 'edusepal-academy'
);

WITH
  instructor_profile AS (
    SELECT id AS instructor_id FROM public.profiles WHERE email = 'instructor@example.com'
  ),
  demo_org AS (
    SELECT id AS org_id FROM public.organizations WHERE slug = 'edusepal-academy'
  )

-- ==================== COURSES ====================
INSERT INTO public.courses (id, title, slug, description, instructor_id, organization_id, pricing_type, price, level, language, status, visibility, is_featured)
SELECT
  gen_random_uuid(),
  'Full-Stack Web Development Bootcamp',
  'full-stack-web-dev-bootcamp',
  'Learn modern full-stack web development with TypeScript, React, and PostgreSQL.',
  ip.instructor_id,
  o.org_id,
  'paid',
  99.00,
  'beginner',
  'english',
  'published',
  'public',
  TRUE
FROM instructor_profile ip
JOIN demo_org o ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
);

WITH
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )

-- ==================== MODULES ====================
INSERT INTO public.modules (id, course_id, title, description, order_index, is_published, duration_hours)
SELECT
  gen_random_uuid(),
  dc.course_id,
  'Getting Started with Web Development',
  'Introduction, tooling, and project setup.',
  1,
  TRUE,
  1.5
FROM demo_course dc
WHERE NOT EXISTS (
  SELECT 1 FROM public.modules WHERE course_id = dc.course_id AND order_index = 1
);

INSERT INTO public.modules (id, course_id, title, description, order_index, is_published, duration_hours)
SELECT
  gen_random_uuid(),
  dc.course_id,
  'Building the First Feature',
  'Hands-on module where we build the first real feature.',
  2,
  TRUE,
  2.0
FROM demo_course dc
WHERE NOT EXISTS (
  SELECT 1 FROM public.modules WHERE course_id = dc.course_id AND order_index = 2
);

WITH
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  module_1 AS (
    SELECT id AS module_id FROM public.modules WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 1
  ),
  module_2 AS (
    SELECT id AS module_id FROM public.modules WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 2
  )

-- ==================== LESSONS ====================
INSERT INTO public.lessons (id, module_id, course_id, title, description, content, video_url, video_duration, order_index, lesson_type, is_published, is_free, estimated_duration)
SELECT
  gen_random_uuid(),
  m1.module_id,
  dc.course_id,
  'Welcome & Course Overview',
  'Overview of the course, structure, and expectations.',
  'Welcome to the Full-Stack Web Development Bootcamp! In this lesson, we''ll explore what you''ll build and how the course is structured.',
  'https://videos.example.com/welcome.mp4',
  600,
  1,
  'video',
  TRUE,
  TRUE,
  15
FROM demo_course dc
JOIN module_1 m1 ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.lessons WHERE course_id = dc.course_id AND order_index = 1
);

INSERT INTO public.lessons (id, module_id, course_id, title, description, content, video_url, video_duration, order_index, lesson_type, is_published, is_free, estimated_duration)
SELECT
  gen_random_uuid(),
  m2.module_id,
  dc.course_id,
  'Building Your First Page',
  'We build the first interactive page of the application.',
  'In this lesson we set up the project and implement the first interactive page.',
  'https://videos.example.com/first-page.mp4',
  900,
  2,
  'video',
  TRUE,
  FALSE,
  25
FROM demo_course dc
JOIN module_2 m2 ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.lessons WHERE course_id = dc.course_id AND order_index = 2
);

WITH
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  lesson_1 AS (
    SELECT id AS lesson_id FROM public.lessons WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 1
  ),
  lesson_2 AS (
    SELECT id AS lesson_id FROM public.lessons WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 2
  )

-- ==================== QUIZZES ====================
INSERT INTO public.quizzes (id, lesson_id, course_id, title, description, quiz_type, passing_score, time_limit, shuffle_questions, show_correct_answers, allows_retake, max_attempts, order_index, is_published)
SELECT
  gen_random_uuid(),
  l1.lesson_id,
  dc.course_id,
  'Intro Lesson Checkpoint',
  'Quick quiz to confirm understanding of core concepts.',
  'lesson',
  70,
  10,
  TRUE,
  TRUE,
  TRUE,
  3,
  1,
  TRUE
FROM demo_course dc
JOIN lesson_1 l1 ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.quizzes WHERE lesson_id = l1.lesson_id
);

WITH
  intro_quiz AS (
    SELECT id AS quiz_id FROM public.quizzes
    WHERE title = 'Intro Lesson Checkpoint'
  )

-- ==================== QUIZ QUESTIONS ====================
INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
SELECT
  gen_random_uuid(),
  iq.quiz_id,
  'Which stack does this bootcamp focus on?',
  'multiple_choice',
  jsonb_build_array('LAMP', 'MERN', 'TypeScript, React, PostgreSQL', 'Django & Vue'),
  'TypeScript, React, PostgreSQL',
  'The course focuses on a modern TypeScript + React + PostgreSQL stack.',
  1,
  1
FROM intro_quiz iq
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_questions WHERE quiz_id = iq.quiz_id AND order_index = 1
);

INSERT INTO public.quiz_questions (id, quiz_id, question_text, question_type, options, correct_answer, explanation, points, order_index)
SELECT
  gen_random_uuid(),
  iq.quiz_id,
  'What is the primary goal of this course?',
  'multiple_choice',
  jsonb_build_array(
    'Memorize theory only',
    'Build a real-world full-stack application',
    'Focus only on database design',
    'Learn only HTML & CSS'
  ),
  'Build a real-world full-stack application',
  'The bootcamp is project-based and focused on building a complete full-stack app.',
  1,
  2
FROM intro_quiz iq
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_questions WHERE quiz_id = iq.quiz_id AND order_index = 2
);

-- ==================== ENROLLMENTS ====================
WITH
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  )
INSERT INTO public.enrollments (id, user_id, course_id, enrollment_type, status, progress_percentage, lessons_completed, total_lessons)
SELECT
  gen_random_uuid(),
  sp.student_id,
  dc.course_id,
  'direct',
  'active',
  50,
  1,
  2
FROM demo_course dc
JOIN student_profile sp ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.enrollments WHERE user_id = sp.student_id AND course_id = dc.course_id
);

-- ==================== LESSON PROGRESS ====================
WITH
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  enrollment AS (
    SELECT id AS enrollment_id FROM public.enrollments
    WHERE user_id = (SELECT student_id FROM student_profile)
      AND course_id = (SELECT course_id FROM demo_course)
  ),
  lesson_1 AS (
    SELECT id AS lesson_id FROM public.lessons WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 1
  ),
  lesson_2 AS (
    SELECT id AS lesson_id FROM public.lessons WHERE course_id = (SELECT course_id FROM demo_course) AND order_index = 2
  )
INSERT INTO public.lesson_progress (id, user_id, lesson_id, course_id, is_completed, watched_duration, watched_percentage, notes)
SELECT
  gen_random_uuid(),
  sp.student_id,
  l1.lesson_id,
  dc.course_id,
  TRUE,
  600,
  100,
  'Completed the introduction lesson.'
FROM demo_course dc
JOIN student_profile sp ON TRUE
JOIN enrollment e ON TRUE
JOIN lesson_1 l1 ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.lesson_progress WHERE user_id = sp.student_id AND lesson_id = l1.lesson_id
);

INSERT INTO public.lesson_progress (id, user_id, lesson_id, course_id, is_completed, watched_duration, watched_percentage, notes)
SELECT
  gen_random_uuid(),
  sp.student_id,
  l2.lesson_id,
  dc.course_id,
  FALSE,
  300,
  50,
  'Halfway through the first feature lesson.'
FROM demo_course dc
JOIN student_profile sp ON TRUE
JOIN enrollment e ON TRUE
JOIN lesson_2 l2 ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.lesson_progress WHERE user_id = sp.student_id AND lesson_id = l2.lesson_id
);

-- ==================== QUIZ ATTEMPTS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  intro_quiz AS (
    SELECT id AS quiz_id FROM public.quizzes WHERE title = 'Intro Lesson Checkpoint'
  )
INSERT INTO public.quiz_attempts (id, user_id, quiz_id, course_id, attempt_number, score, passed, time_spent_seconds, answers)
SELECT
  gen_random_uuid(),
  sp.student_id,
  iq.quiz_id,
  dc.course_id,
  1,
  80,
  TRUE,
  300,
  jsonb_build_object('q1', 'TypeScript, React, PostgreSQL', 'q2', 'Build a real-world full-stack application')
FROM student_profile sp
JOIN demo_course dc ON TRUE
JOIN intro_quiz iq ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.quiz_attempts WHERE user_id = sp.student_id AND quiz_id = iq.quiz_id AND attempt_number = 1
);

-- ==================== CERTIFICATES ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )
INSERT INTO public.certificates (id, user_id, course_id, certificate_number, verification_code, is_verified, final_score, completed_percentage)
SELECT
  gen_random_uuid(),
  sp.student_id,
  dc.course_id,
  'CERT-EDU-0001',
  'VERIFY-EDU-0001',
  TRUE,
  85,
  100
FROM student_profile sp
JOIN demo_course dc ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.certificates WHERE certificate_number = 'CERT-EDU-0001'
);

-- ==================== REVIEWS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )
INSERT INTO public.reviews (id, user_id, course_id, rating, title, comment, is_verified_purchase, helpful_count, is_published)
SELECT
  gen_random_uuid(),
  sp.student_id,
  dc.course_id,
  5,
  'Excellent practical bootcamp',
  'The course is very practical and easy to follow. Loved the real-world project structure.',
  TRUE,
  3,
  TRUE
FROM student_profile sp
JOIN demo_course dc ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.reviews WHERE user_id = sp.student_id AND course_id = dc.course_id
);

-- ==================== SUBSCRIPTION PLANS ====================
INSERT INTO public.subscription_plans (id, name, description, price, currency, billing_period, max_courses, features, is_active)
VALUES
  (
    gen_random_uuid(),
    'Basic',
    'Access to 3 courses per month.',
    19.00,
    'USD',
    'monthly',
    3,
    jsonb_build_object('certificates', TRUE, 'live_sessions', FALSE, 'mentoring', FALSE),
    TRUE
  ),
  (
    gen_random_uuid(),
    'Pro',
    'Unlimited course access and priority support.',
    39.00,
    'USD',
    'monthly',
    NULL,
    jsonb_build_object('certificates', TRUE, 'live_sessions', TRUE, 'mentoring', TRUE),
    TRUE
  )
ON CONFLICT (name) DO NOTHING;

-- ==================== SUBSCRIPTIONS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  pro_plan AS (
    SELECT id AS plan_id FROM public.subscription_plans WHERE name = 'Pro'
  )
INSERT INTO public.subscriptions (id, user_id, plan_id, stripe_subscription_id, status, current_period_start, current_period_end, started_at, auto_renew)
SELECT
  gen_random_uuid(),
  sp.student_id,
  pp.plan_id,
  'sub_demo_123',
  'active',
  NOW() - INTERVAL '7 days',
  NOW() + INTERVAL '23 days',
  NOW() - INTERVAL '7 days',
  TRUE
FROM student_profile sp
JOIN pro_plan pp ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.subscriptions WHERE user_id = sp.student_id AND plan_id = pp.plan_id
);

-- ==================== PAYMENTS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )
INSERT INTO public.payments (id, user_id, course_id, amount, currency, payment_method, transaction_id, payment_status, payment_date, metadata)
SELECT
  gen_random_uuid(),
  sp.student_id,
  dc.course_id,
  99.00,
  'USD',
  'credit_card',
  'txn_demo_course_0001',
  'completed',
  NOW() - INTERVAL '5 days',
  jsonb_build_object('gateway', 'demo', 'note', 'Seed payment for demo course')
FROM student_profile sp
JOIN demo_course dc ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.payments WHERE transaction_id = 'txn_demo_course_0001'
);

-- ==================== EARNINGS ====================
WITH
  instructor_profile AS (
    SELECT id AS instructor_id FROM public.profiles WHERE email = 'instructor@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  ),
  course_payment AS (
    SELECT id AS payment_id, amount FROM public.payments WHERE transaction_id = 'txn_demo_course_0001'
  )
INSERT INTO public.earnings (id, instructor_id, course_id, payment_id, amount, commission_percentage, commission_amount, net_amount, earning_type, payout_status)
SELECT
  gen_random_uuid(),
  ip.instructor_id,
  dc.course_id,
  cp.payment_id,
  cp.amount,
  30,
  ROUND(cp.amount * 0.30, 2),
  ROUND(cp.amount * 0.70, 2),
  'course_sale',
  'pending'
FROM instructor_profile ip
JOIN demo_course dc ON TRUE
JOIN course_payment cp ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.earnings WHERE payment_id = cp.payment_id
);

-- ==================== BUNDLES & BUNDLE COURSES ====================
WITH
  instructor_profile AS (
    SELECT id AS instructor_id FROM public.profiles WHERE email = 'instructor@example.com'
  )
INSERT INTO public.bundles (id, title, description, instructor_id, price, currency, discount_percentage, total_courses, status, is_featured, is_deleted)
SELECT
  gen_random_uuid(),
  'Web Dev Starter Bundle',
  'A curated starter bundle for aspiring web developers.',
  ip.instructor_id,
  129.00,
  'USD',
  25.00,
  1,
  'published',
  TRUE,
  FALSE
FROM instructor_profile ip
WHERE NOT EXISTS (
  SELECT 1 FROM public.bundles WHERE title = 'Web Dev Starter Bundle'
);

WITH
  demo_bundle AS (
    SELECT id AS bundle_id FROM public.bundles WHERE title = 'Web Dev Starter Bundle'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )
INSERT INTO public.bundle_courses (id, bundle_id, course_id, order_index)
SELECT
  gen_random_uuid(),
  db.bundle_id,
  dc.course_id,
  1
FROM demo_bundle db
JOIN demo_course dc ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.bundle_courses WHERE bundle_id = db.bundle_id AND course_id = dc.course_id
);

-- ==================== NOTIFICATIONS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  ),
  demo_course AS (
    SELECT id AS course_id FROM public.courses WHERE slug = 'full-stack-web-dev-bootcamp'
  )
INSERT INTO public.notifications (id, user_id, type, title, message, related_course_id, is_read)
SELECT
  gen_random_uuid(),
  sp.student_id,
  'enrollment',
  'Welcome to the Full-Stack Web Development Bootcamp!',
  'You have been enrolled in the course. Start with the first lesson when you''re ready.',
  dc.course_id,
  FALSE
FROM student_profile sp
JOIN demo_course dc ON TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM public.notifications WHERE user_id = sp.student_id AND title LIKE 'Welcome to the Full-Stack%'
);

-- ==================== WHATSAPP ACCOUNTS ====================
WITH
  student_profile AS (
    SELECT id AS student_id FROM public.profiles WHERE email = 'student@example.com'
  )
INSERT INTO public.whatsapp_accounts (id, user_id, phone_number, is_verified, linked_at)
SELECT
  gen_random_uuid(),
  sp.student_id,
  '+15550000001',
  TRUE,
  NOW() - INTERVAL '1 day'
FROM student_profile sp
WHERE NOT EXISTS (
  SELECT 1 FROM public.whatsapp_accounts WHERE user_id = sp.student_id
);

COMMIT;

