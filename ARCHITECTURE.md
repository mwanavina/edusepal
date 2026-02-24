# EDUSEPAL - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js 16)                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Pages & Components                                     │ │
│  │  ├── Homepage (carousel, theme toggle)                 │ │
│  │  ├── Dashboard (learner view)                          │ │
│  │  ├── Courses (browse, enroll)                          │ │
│  │  ├── Instructor (course management)                    │ │
│  │  └── Admin (moderation)                                │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────┬────────────────────────────────┬───────────────┘
               │                                │
        ┌──────▼────────┐           ┌──────────▼──────────┐
        │ Clerk Auth    │           │ Supabase           │
        │ (Signup/Login)│           │ (Data Storage)     │
        │               │           │                    │
        │ - Email/Pass  │           │ - Profiles         │
        │ - OAuth       │           │ - Courses          │
        │ - MFA         │           │ - Enrollments      │
        │ - webhooks    │           │ - Certificates     │
        └──────┬────────┘           └──────────┬─────────┘
               │                               │
        ┌──────▼───────────────────────────────▼──────────┐
        │         User Sync (Automatic)                   │
        │  ┌───────────────────────────────────────────┐  │
        │  │ useSyncUser() Hook                        │  │
        │  │ - Triggers on dashboard load              │  │
        │  │ - Checks if profile exists                │  │
        │  │ - Creates/updates profile                 │  │
        │  │ - Stores clerk_id reference               │  │
        │  └───────────────────────────────────────────┘  │
        └────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Action                    System Response
─────────────────────────────────────────────────────

1. Visit signup page    →      Clerk signup form shown
                        
2. Enter email/password →      Clerk validates, creates account
                        
3. Verify email         →      Clerk sends verification link
                        
4. Navigate to dashboard →     useUser() hook runs
                        │
                        └──→ useSyncUser() activates
                             │
                             └──→ Query profiles table
                                  │
                                  ├─ If exists: update
                                  └─ If not: create new
                        
5. Dashboard loads       →      Fetch enrolled courses
                        │
                        └──→ Display user content
```

## Data Flow

```
┌──────────────┐
│ User Signs Up│
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Clerk Creates Account    │
│ - clerk_id generated     │
│ - Email verified         │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Webhook Triggered        │
│ /api/webhooks/clerk      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Database Profile Created         │
│ ├─ id (UUID)                     │
│ ├─ clerk_id (from webhook)       │
│ ├─ email                         │
│ ├─ first_name, last_name         │
│ ├─ avatar_url                    │
│ └─ user_type (learner/instructor)│
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ User Can Now             │
│ ├─ View dashboard        │
│ ├─ Enroll in courses     │
│ ├─ Create courses (if    │
│ │  instructor)           │
│ └─ Access features       │
└──────────────────────────┘
```

## Theme System Architecture

```
┌─────────────────────────────────────┐
│   next-themes Library               │
│   (handles system detection)         │
└──────────────┬──────────────────────┘
               │
         ┌─────▼─────┐
         │ HTML class│
         │ "dark"    │
         └─────┬─────┘
               │
    ┌──────────┼──────────┐
    │                     │
    ▼                     ▼
┌────────────┐      ┌────────────┐
│Light Theme │      │Dark Theme  │
│ - White bg │      │ - Gray bg  │
│ - Dark text│      │ - Light tx │
│ - Green acc│      │ - Green ac │
└────────────┘      └────────────┘
    │                     │
    └──────────┬──────────┘
               │
      ┌────────▼────────┐
      │CSS Variables    │
      │--background     │
      │--foreground     │
      │--primary        │
      │--border, etc    │
      └─────────────────┘
```

## Component Hierarchy

```
Layout (RootLayout)
├── ClerkProvider
│   └── ThemeProvider
│       └── Children Pages
│           ├── Navigation (theme toggle, clerk user)
│           ├── Page Content
│           │   ├── HeroCarousel
│           │   ├── CourseCards
│           │   ├── TiptapEditor
│           │   └── ...
│           └── Footer
```

## Database Schema Structure

```
User Management Layer
├── profiles
│   ├── id (UUID, PK)
│   ├── clerk_id (from Clerk) ◄── PRIMARY AUTH KEY
│   ├── email
│   ├── first_name, last_name
│   ├── avatar_url
│   └── user_type (learner/instructor/admin)

Content Layer
├── courses
│   ├── id (UUID, PK)
│   ├── instructor_id (FK → profiles.id)
│   ├── title, description
│   ├── rich_description (from Tiptap)
│   └── ...metadata
├── modules
│   ├── id (UUID, PK)
│   ├── course_id (FK → courses.id)
│   └── ...
└── lessons
    ├── id (UUID, PK)
    ├── module_id (FK → modules.id)
    └── ...

Learning Progress Layer
├── enrollments
│   ├── id (UUID, PK)
│   ├── user_id (FK → profiles.id)
│   ├── course_id (FK → courses.id)
│   └── progress_percentage
├── lesson_progress
│   ├── id (UUID, PK)
│   ├── user_id (FK → profiles.id)
│   ├── lesson_id (FK → lessons.id)
│   └── completed_at
└── quiz_attempts
    ├── id (UUID, PK)
    ├── user_id (FK → profiles.id)
    └── score

Credentials & Commerce
├── certificates
│   ├── id (UUID, PK)
│   ├── user_id (FK → profiles.id)
│   └── ...
├── payments
│   ├── id (UUID, PK)
│   ├── user_id (FK → profiles.id)
│   └── ...
└── subscriptions
    ├── id (UUID, PK)
    ├── user_id (FK → profiles.id)
    └── ...
```

## API Route Structure

```
app/
├── api/
│   ├── webhooks/
│   │   └── clerk/route.ts (Webhook handler)
│   │       ├── user.created → Create profile
│   │       ├── user.updated → Update profile
│   │       └── user.deleted → Delete profile
│   │
│   ├── users/
│   │   └── sync/route.ts (Manual sync endpoint)
│   │       ├── POST → Sync user from Clerk
│   │       └── Returns sync status
│   │
│   └── auth/ (if needed)
│       └── callback/route.ts (OAuth redirect)
│
└── (auth)/
    ├── sign-up/page.tsx (Clerk form)
    ├── login/page.tsx (Clerk form)
    └── sign-up-success/page.tsx
```

## User Journey Map

```
┌─────────────────────────────────────────────────┐
│ Visitor Lands on Homepage                       │
└──────────┬──────────────────────────────────────┘
           │
           ├──► Clicks "Get Started"
           │    │
           │    └──► Clerk signup page
           │         │
           │         └──► Creates account
           │              │
           │              └──► Email verification
           │                   │
           │                   └──► Profile auto-created
           │                        │
           │                        └──► Redirected to dashboard
           │
           ├──► Clicks "Sign In"
           │    │
           │    └──► Clerk login page
           │         │
           │         └──► Logs in
           │              │
           │              └──► Dashboard loads
           │                   │
           │                   └──► useSyncUser() confirms profile
           │
           └──► Clicks "Explore Courses"
                │
                └──► Course listing page

Dashboard Actions:
- Browse courses
- Enroll in courses
- View progress
- Access certificates
- Toggle theme

Instructor Actions:
- Switch to instructor dashboard
- Create course
- Use Tiptap editor for details
- Manage enrollments
```

## Security Model

```
┌─────────────────────────┐
│ Clerk Authentication    │
│ (External SaaS)         │
│ - Manages credentials   │
│ - Provides clerk_id     │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Database Row Level Security (RLS)   │
│                                     │
│ Policy: "Users can see own data"    │
│ ├─ SELECT if user_id matches      │
│ ├─ UPDATE if user_id matches      │
│ ├─ DELETE if user_id matches      │
│ └─ INSERT with own user_id        │
│                                     │
│ Policy: "Admins see all"           │
│ └─ Full access if admin = true     │
└─────────────────────────────────────┘
```

## File Organization

```
/vercel/share/v0-project/
├── app/
│   ├── layout.tsx (ClerkProvider, ThemeProvider)
│   ├── page.tsx (Homepage with theme toggle)
│   ├── globals.css (Theme colors)
│   ├── auth/
│   ├── dashboard/
│   ├── courses/
│   ├── instructor/
│   ├── admin/
│   ├── api/
│   │   ├── webhooks/clerk/
│   │   └── users/sync/
│   └── middleware.ts
│
├── components/
│   ├── theme-toggle.tsx (UI component)
│   ├── theme-provider.tsx (Setup provider)
│   ├── tiptap-editor.tsx (Rich text editor)
│   ├── tiptap-editor.css (Editor styles)
│   ├── hero-carousel.tsx (Carousel)
│   └── ui/ (shadcn/ui components)
│
├── hooks/
│   └── use-sync-user.ts (Auto-sync hook)
│
├── lib/
│   ├── clerk-sync.ts (Sync utilities)
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   └── utils.ts
│
├── scripts/
│   ├── 001_complete_schema.sql
│   ├── 002_migrate_to_clerk.sql
│   └── 003_add_rich_description.sql
│
├── public/ (static assets)
│
├── .env.local.example
├── package.json
├── tsconfig.json
├── next.config.mjs
│
└── Documentation/
    ├── README.md
    ├── QUICK_START.md
    ├── SETUP_GUIDE.md
    ├── CLERK_SETUP.md
    ├── DATABASE_SCHEMA.md
    ├── FEATURES_IMPLEMENTED.md
    ├── CHANGES_SUMMARY.md
    └── ARCHITECTURE.md (this file)
```

## Technology Stack

```
Frontend
├── Next.js 16 (React framework)
├── TypeScript
├── Tailwind CSS v4
├── shadcn/ui (component library)
├── next-themes (theme management)
├── Tiptap (rich text editor)
└── Clerk (authentication)

Backend
├── Next.js API Routes
├── Supabase (PostgreSQL database)
├── Row Level Security
└── Webhooks (Clerk integration)

Deployment
└── Vercel (recommended)
```

## Environment Variables

```
CLERK_KEYS:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  CLERK_SECRET_KEY
  CLERK_WEBHOOK_SECRET

SUPABASE_KEYS:
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY

APP_CONFIG:
  NEXT_PUBLIC_APP_URL
```

---

**This architecture ensures:**
✅ Secure user authentication (Clerk)
✅ Automatic data syncing
✅ Theme flexibility
✅ Rich content creation (Tiptap)
✅ Scalable database (RLS)
✅ Professional UI/UX
