-- EDUSEPAL Migration: Supabase Auth to Clerk Authentication
-- This migration updates the schema to work with Clerk instead of Supabase Auth
-- Clerk uses string IDs (e.g., "user_2a4vDjKvCxxx") instead of UUIDs

-- ==================== PROFILES TABLE RESTRUCTURE ====================
-- RATIONALE: 
-- The profiles table is the central hub for all user data. We add clerk_id as a unique identifier
-- while keeping a local UUID id for database relationships. Clerk IDs are text strings, so we use TEXT type.
-- All other tables reference the UUID id column for efficient foreign keys.

-- Step 1: Drop existing constraints and RLS policies
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_pkey" CASCADE;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_select_own";
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_insert_own";
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_update_own";
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS "profiles_select_public";
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Add clerk_id column (nullable first, will be populated later)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS id UUID;

-- Step 3: If id column doesn't have values yet, populate it
UPDATE public.profiles SET id = gen_random_uuid() WHERE id IS NULL;

-- Step 4: Set id as primary key
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- Step 5: Add email column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Step 6: Create index on clerk_id for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_id) WHERE clerk_id IS NOT NULL;

-- ==================== UPDATE INSTRUCTOR PROFILES ====================
-- RATIONALE: Instructor profiles extend user profiles for teaching capabilities
-- They link to profiles(id) to track which users are instructors

ALTER TABLE public.instructor_profiles DROP CONSTRAINT IF EXISTS "instructor_profiles_id_fkey";
ALTER TABLE public.instructor_profiles ADD CONSTRAINT "instructor_profiles_id_fkey" 
  FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ==================== UPDATE ORGANIZATIONS ====================
-- RATIONALE: Organizations are created and owned by users (instructors)
-- They reference profiles(id) for the owner relationship

ALTER TABLE public.organizations DROP CONSTRAINT IF EXISTS "organizations_owner_id_fkey";
ALTER TABLE public.organizations ADD CONSTRAINT "organizations_owner_id_fkey" 
  FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ==================== UPDATE COURSES ====================
-- RATIONALE: Courses are created by instructors and reference their profile ID
-- Courses also reference organizations for institutional courses

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS "courses_instructor_id_fkey";
ALTER TABLE public.courses ADD CONSTRAINT "courses_instructor_id_fkey" 
  FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS "courses_organization_id_fkey";
ALTER TABLE public.courses ADD CONSTRAINT "courses_organization_id_fkey" 
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;

-- ==================== UPDATE ENROLLMENTS ====================
-- RATIONALE: Enrollments track which users are enrolled in which courses
-- Links students (profiles.id) to courses for learning tracking and progress

ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS "enrollments_user_id_fkey";
ALTER TABLE public.enrollments ADD CONSTRAINT "enrollments_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS "enrollments_course_id_fkey";
ALTER TABLE public.enrollments ADD CONSTRAINT "enrollments_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- ==================== UPDATE LESSON PROGRESS ====================
-- RATIONALE: Tracks individual student progress through lessons
-- Links students to specific lessons for completion and quiz tracking

ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS "lesson_progress_user_id_fkey";
ALTER TABLE public.lesson_progress ADD CONSTRAINT "lesson_progress_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS "lesson_progress_lesson_id_fkey";
ALTER TABLE public.lesson_progress ADD CONSTRAINT "lesson_progress_lesson_id_fkey" 
  FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

-- ==================== UPDATE QUIZ ATTEMPTS ====================
-- RATIONALE: Tracks when students attempt quizzes and their answers
-- Links students to quizzes for assessment and score tracking

ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS "quiz_attempts_user_id_fkey";
ALTER TABLE public.quiz_attempts ADD CONSTRAINT "quiz_attempts_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS "quiz_attempts_quiz_id_fkey";
ALTER TABLE public.quiz_attempts ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" 
  FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;

-- ==================== UPDATE CERTIFICATES ====================
-- RATIONALE: Certificates are issued to students upon course completion
-- Links students to completed courses with verification codes

ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS "certificates_user_id_fkey";
ALTER TABLE public.certificates ADD CONSTRAINT "certificates_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS "certificates_course_id_fkey";
ALTER TABLE public.certificates ADD CONSTRAINT "certificates_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- ==================== UPDATE REVIEWS ====================
-- RATIONALE: User reviews are tied to course creators and courses
-- Links reviewers (students) to courses for feedback and ratings

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS "reviews_user_id_fkey";
ALTER TABLE public.reviews ADD CONSTRAINT "reviews_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS "reviews_course_id_fkey";
ALTER TABLE public.reviews ADD CONSTRAINT "reviews_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- ==================== UPDATE PAYMENTS ====================
-- RATIONALE: Tracks all monetary transactions in the system
-- Links payers to courses or subscriptions for revenue tracking

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS "payments_user_id_fkey";
ALTER TABLE public.payments ADD CONSTRAINT "payments_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS "payments_course_id_fkey";
ALTER TABLE public.payments ADD CONSTRAINT "payments_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL;

ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS "payments_subscription_id_fkey";
ALTER TABLE public.payments ADD CONSTRAINT "payments_subscription_id_fkey" 
  FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(id) ON DELETE SET NULL;

-- ==================== UPDATE EARNINGS ====================
-- RATIONALE: Tracks instructor earnings from course sales
-- Links instructors to their courses and payments for payout management

ALTER TABLE public.earnings DROP CONSTRAINT IF EXISTS "earnings_instructor_id_fkey";
ALTER TABLE public.earnings ADD CONSTRAINT "earnings_instructor_id_fkey" 
  FOREIGN KEY (instructor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.earnings DROP CONSTRAINT IF EXISTS "earnings_course_id_fkey";
ALTER TABLE public.earnings ADD CONSTRAINT "earnings_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

ALTER TABLE public.earnings DROP CONSTRAINT IF EXISTS "earnings_payment_id_fkey";
ALTER TABLE public.earnings ADD CONSTRAINT "earnings_payment_id_fkey" 
  FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL;

-- ==================== UPDATE SUBSCRIPTIONS ====================
-- RATIONALE: Manages user subscription plans for unlimited course access
-- Links students to subscription plans for access control

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_user_id_fkey";
ALTER TABLE public.subscriptions ADD CONSTRAINT "subscriptions_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS "subscriptions_plan_id_fkey";
ALTER TABLE public.subscriptions ADD CONSTRAINT "subscriptions_plan_id_fkey" 
  FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id) ON DELETE SET NULL;

-- ==================== UPDATE COURSE BUNDLES ====================
-- RATIONALE: Bundles group multiple courses for discounted pricing
-- Tracks which courses are in bundles for sales and access management

ALTER TABLE public.bundle_courses DROP CONSTRAINT IF EXISTS "bundle_courses_bundle_id_fkey";
ALTER TABLE public.bundle_courses ADD CONSTRAINT "bundle_courses_bundle_id_fkey" 
  FOREIGN KEY (bundle_id) REFERENCES public.bundles(id) ON DELETE CASCADE;

ALTER TABLE public.bundle_courses DROP CONSTRAINT IF EXISTS "bundle_courses_course_id_fkey";
ALTER TABLE public.bundle_courses ADD CONSTRAINT "bundle_courses_course_id_fkey" 
  FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE;

-- ==================== UPDATE NOTIFICATIONS ====================
-- RATIONALE: System notifications sent to users about courses, progress, and platform updates
-- Links notifications to their recipient users for inbox management

ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS "notifications_user_id_fkey";
ALTER TABLE public.notifications ADD CONSTRAINT "notifications_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ==================== UPDATE ACTIVITY LOGS ====================
-- RATIONALE: Audit trail of all user actions in the platform
-- Links actions to users for compliance, debugging, and analytics

ALTER TABLE IF EXISTS public.activity_logs DROP CONSTRAINT IF EXISTS "activity_logs_user_id_fkey";
ALTER TABLE IF EXISTS public.activity_logs ADD CONSTRAINT "activity_logs_user_id_fkey" 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- ==================== RE-ENABLE ROW LEVEL SECURITY ====================
-- RATIONALE: RLS policies ensure users can only access their own data
-- Updated to use clerk_id for authentication context instead of auth.uid()

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_manage_own" ON public.profiles;
DROP POLICY IF EXISTS "enrollments_select_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_manage_own" ON public.enrollments;
DROP POLICY IF EXISTS "lesson_progress_select_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_manage_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_update_own" ON public.lesson_progress;
DROP POLICY IF EXISTS "quiz_attempts_select_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "quiz_attempts_insert_own" ON public.quiz_attempts;
DROP POLICY IF EXISTS "certificates_select_own" ON public.certificates;
DROP POLICY IF EXISTS "reviews_select_published" ON public.reviews;
DROP POLICY IF EXISTS "reviews_manage_own" ON public.reviews;
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
DROP POLICY IF EXISTS "earnings_select_own" ON public.earnings;
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;

-- Profiles: Users can view public profile info, edit their own
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_manage_own" ON public.profiles FOR ALL 
  USING (clerk_id = current_setting('app.clerk_id', true));

-- Enrollments: Users can view and manage their own enrollments
CREATE POLICY "enrollments_select_own" ON public.enrollments FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));
CREATE POLICY "enrollments_manage_own" ON public.enrollments FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Lesson Progress: Users can view and update their own progress
CREATE POLICY "lesson_progress_select_own" ON public.lesson_progress FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));
CREATE POLICY "lesson_progress_manage_own" ON public.lesson_progress FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));
CREATE POLICY "lesson_progress_update_own" ON public.lesson_progress FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Quiz Attempts: Users can view and create their own attempts
CREATE POLICY "quiz_attempts_select_own" ON public.quiz_attempts FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));
CREATE POLICY "quiz_attempts_insert_own" ON public.quiz_attempts FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Certificates: Users can view their own certificates, public view of verified certs
CREATE POLICY "certificates_select_own" ON public.certificates FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)) OR is_verified = true);

-- Reviews: Users can manage their own reviews
CREATE POLICY "reviews_select_published" ON public.reviews FOR SELECT USING (is_published = TRUE);
CREATE POLICY "reviews_manage_own" ON public.reviews FOR ALL 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Payments: Users can view their own payment history
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Earnings: Instructors can view their own earnings
CREATE POLICY "earnings_select_own" ON public.earnings FOR SELECT 
  USING (instructor_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Subscriptions: Users can view and manage their subscriptions
CREATE POLICY "subscriptions_select_own" ON public.subscriptions FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));

-- Notifications: Users can view their own notifications
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE clerk_id = current_setting('app.clerk_id', true)));


