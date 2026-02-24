-- WHATSAPP ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  linked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_accounts_user_id ON public.whatsapp_accounts(user_id);
CREATE INDEX idx_whatsapp_accounts_phone_number ON public.whatsapp_accounts(phone_number);

ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own whatsapp accounts" ON public.whatsapp_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own whatsapp accounts" ON public.whatsapp_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own whatsapp accounts" ON public.whatsapp_accounts
  FOR UPDATE USING (auth.uid() = user_id);

-- CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_category_id ON public.subjects(category_id);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage subjects" ON public.subjects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- INSTRUCTOR PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.instructor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  expertise TEXT,
  education TEXT,
  experience_years INTEGER,
  status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED')) DEFAULT 'PENDING',
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_instructor_profiles_user_id ON public.instructor_profiles(user_id);
CREATE INDEX idx_instructor_profiles_status ON public.instructor_profiles(status);

ALTER TABLE public.instructor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approved instructors" ON public.instructor_profiles
  FOR SELECT USING (status = 'APPROVED');

CREATE POLICY "Instructors can view their own profile" ON public.instructor_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can create their profile" ON public.instructor_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Instructors can update their profile" ON public.instructor_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all instructor profiles" ON public.instructor_profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  type TEXT CHECK (type IN ('UNIVERSITY', 'NGO', 'COMPANY', 'TRAINING_CENTER')),
  description TEXT,
  website VARCHAR(255),
  logo_url TEXT,
  status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'SUSPENDED')) DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved organizations" ON public.organizations
  FOR SELECT USING (status = 'APPROVED');

CREATE POLICY "Admins can manage organizations" ON public.organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- ORGANIZATION ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.organization_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('ORG_ADMIN', 'ORG_EDITOR')) DEFAULT 'ORG_EDITOR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organization_admins_org_id ON public.organization_admins(organization_id);
CREATE INDEX idx_organization_admins_user_id ON public.organization_admins(user_id);

ALTER TABLE public.organization_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can manage their organization" ON public.organization_admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.organization_admins oa
      WHERE oa.organization_id = organization_id AND oa.user_id = auth.uid()
    )
  );

-- UPDATE COURSES TABLE WITH MISSING FIELDS
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED', 'SUSPENDED')) DEFAULT 'DRAFT';
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN DEFAULT TRUE;

CREATE INDEX idx_courses_subject_id ON public.courses(subject_id);
CREATE INDEX idx_courses_organization_id ON public.courses(organization_id);
CREATE INDEX idx_courses_status ON public.courses(status);

-- TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  price DECIMAL(10, 2) DEFAULT 0,
  certificate_enabled BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED')) DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_topics_subject_id ON public.topics(subject_id);
CREATE INDEX idx_topics_course_id ON public.topics(course_id);
CREATE INDEX idx_topics_instructor_id ON public.topics(instructor_id);
CREATE INDEX idx_topics_organization_id ON public.topics(organization_id);

ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published topics" ON public.topics
  FOR SELECT USING (status = 'PUBLISHED');

CREATE POLICY "Instructors can manage their topics" ON public.topics
  FOR ALL USING (auth.uid() = instructor_id);

CREATE POLICY "Admins can view all topics" ON public.topics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content_type TEXT CHECK (content_type IN ('TEXT', 'VIDEO', 'PDF', 'QUIZ')) DEFAULT 'TEXT',
  content_url TEXT,
  whatsapp_enabled BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_topic_id ON public.lessons(topic_id);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons in published topics" ON public.lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.topics WHERE id = topic_id AND status = 'PUBLISHED')
  );

CREATE POLICY "Instructors can manage their lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.topics WHERE id = topic_id AND instructor_id = auth.uid()
    )
  );

-- QUIZZES TABLE
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  total_marks INTEGER DEFAULT 100,
  passing_score INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quizzes_topic_id ON public.quizzes(topic_id);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quizzes in published topics" ON public.quizzes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.topics WHERE id = topic_id AND status = 'PUBLISHED')
  );

-- QUIZ ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER,
  total_marks INTEGER,
  passed BOOLEAN,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON public.quiz_attempts(user_id);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- UPDATE ENROLLMENTS TABLE WITH MISSING FIELDS
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS progress DECIMAL(5, 2) DEFAULT 0;

CREATE INDEX idx_enrollments_topic_id ON public.enrollments(topic_id);

-- UPDATE LESSON PROGRESS - add more fields
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS score DECIMAL(5, 2);
ALTER TABLE public.lesson_progress ADD COLUMN IF NOT EXISTS time_spent_minutes INTEGER;

-- CERTIFICATES TABLE - Update if exists
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  certificate_code VARCHAR(255) UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_course_id ON public.certificates(course_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can verify a certificate with code" ON public.certificates
  FOR SELECT USING (TRUE);

-- PURCHASES TABLE
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_purchases_payment_id ON public.purchases(payment_id);
CREATE INDEX idx_purchases_course_id ON public.purchases(course_id);
CREATE INDEX idx_purchases_topic_id ON public.purchases(topic_id);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases" ON public.purchases
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.payments WHERE id = payment_id AND user_id = auth.uid()
    )
  );

-- PLATFORM COMMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.platform_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  percentage DECIMAL(5, 2) NOT NULL,
  effective_from DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.platform_commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage commissions" ON public.platform_commissions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- INSTRUCTOR EARNINGS TABLE
CREATE TABLE IF NOT EXISTS public.instructor_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  gross_amount DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  net_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_instructor_earnings_instructor_id ON public.instructor_earnings(instructor_id);
CREATE INDEX idx_instructor_earnings_purchase_id ON public.instructor_earnings(purchase_id);

ALTER TABLE public.instructor_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can view their own earnings" ON public.instructor_earnings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles WHERE id = instructor_id AND user_id = auth.uid()
    )
  );

-- ORGANIZATION EARNINGS TABLE
CREATE TABLE IF NOT EXISTS public.organization_earnings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  purchase_id UUID NOT NULL REFERENCES public.purchases(id) ON DELETE CASCADE,
  net_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_organization_earnings_org_id ON public.organization_earnings(organization_id);

ALTER TABLE public.organization_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org admins can view earnings" ON public.organization_earnings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.organization_admins
      WHERE organization_id = organization_id AND user_id = auth.uid()
    )
  );

-- PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES public.instructor_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payout_method TEXT CHECK (payout_method IN ('MOBILE_MONEY', 'BANK')),
  status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'PAID')) DEFAULT 'PENDING',
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payouts_instructor_id ON public.payouts(instructor_id);
CREATE INDEX idx_payouts_status ON public.payouts(status);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can view their payouts" ON public.payouts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.instructor_profiles WHERE id = instructor_id AND user_id = auth.uid()
    )
  );

-- SUBSCRIPTION PLANS TABLE
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  duration TEXT CHECK (duration IN ('MONTHLY', 'YEARLY')) DEFAULT 'MONTHLY',
  description TEXT,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans
  FOR SELECT USING (TRUE);

-- USER SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- COURSE BUNDLES TABLE
CREATE TABLE IF NOT EXISTS public.course_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_bundles_instructor_id ON public.course_bundles(instructor_id);

ALTER TABLE public.course_bundles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Instructors can manage their bundles" ON public.course_bundles
  FOR ALL USING (auth.uid() = instructor_id);

-- BUNDLE ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.bundle_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id UUID NOT NULL REFERENCES public.course_bundles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  order_index INTEGER
);

CREATE INDEX idx_bundle_items_bundle_id ON public.bundle_items(bundle_id);

ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view bundle items" ON public.bundle_items
  FOR SELECT USING (TRUE);

-- WHATSAPP ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  action VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_whatsapp_activity_logs_user_id ON public.whatsapp_activity_logs(user_id);
CREATE INDEX idx_whatsapp_activity_logs_lesson_id ON public.whatsapp_activity_logs(lesson_id);
CREATE INDEX idx_whatsapp_activity_logs_created_at ON public.whatsapp_activity_logs(created_at);

ALTER TABLE public.whatsapp_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs" ON public.whatsapp_activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Instructors can view student activity in their lessons" ON public.whatsapp_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.topics t ON l.topic_id = t.id
      WHERE l.id = lesson_id AND t.instructor_id = auth.uid()
    )
  );
