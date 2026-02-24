# EDUSEPAL - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Setup Environment Variables

Create `.env.local` with:
```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

### 2. Install Dependencies

```bash
pnpm install
# or npm install / yarn install
```

### 3. Database Setup

The database schema is already created. If you're starting fresh:

```bash
# Execute migration scripts in order
# 001_complete_schema.sql - Main schema
# 002_migrate_to_clerk.sql - Clerk integration
# 003_add_rich_description.sql - Rich text support
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📍 Key Routes

| Route | Purpose | Auth Required |
|-------|---------|:-------------:|
| `/` | Homepage with carousel | ❌ |
| `/auth/sign-up` | User registration | ❌ |
| `/auth/login` | User login | ❌ |
| `/dashboard` | Learner dashboard | ✅ |
| `/courses` | Browse all courses | ✅ |
| `/instructor` | Instructor dashboard | ✅ Instructor |
| `/instructor/create-course` | Create course with Tiptap | ✅ Instructor |
| `/pricing` | Subscription plans | ❌ |
| `/certificates` | View earned certs | ✅ |
| `/admin` | Admin dashboard | ✅ Admin |

## 🎨 Theme Toggle

- Located in top navbar (sun/moon icon)
- Persists across sessions
- System preference auto-detection
- Smooth light ↔ dark transitions

## 📝 Using Tiptap Editor

In course creation form:

```typescript
import { TiptapEditor } from '@/components/tiptap-editor'

<TiptapEditor
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="Enter course content..."
/>
```

Features:
- **Bold/Italic/Underline** - Select text, click button
- **Lists** - Click bullet/numbered list icons
- **Links** - Highlight text, click link icon, paste URL
- **Code** - Use code block button
- **Clear** - Remove all formatting from selection

## 👤 User Sync Flow

```
1. User creates account via Clerk signup
2. useSyncUser() hook activates
3. Profile automatically created in database
4. clerk_id stored for future authentication
5. User can access dashboard immediately
```

## 🔐 Authentication Flow

```
Clerk (Frontend Auth) → Supabase (Data Layer)
    ↓
User signs up with email
    ↓
Clerk provides clerk_id
    ↓
useSyncUser() creates profile
    ↓
All queries use clerk_id for security
```

## 📊 Database Structure

**Key Tables:**
- `profiles` - Users with clerk_id
- `courses` - Course content
- `enrollments` - Student registrations
- `lessons` - Course modules
- `certificates` - Earned credentials

**All tables have:**
- Row Level Security (RLS)
- Proper foreign keys
- Timestamp tracking
- Index optimization

## 🛠 Common Tasks

### Create a New Course
1. Go to `/instructor`
2. Click "Create New Course"
3. Fill in title, description, level
4. Use Tiptap editor for rich description
5. Save course (draft status)

### Enroll in Course
1. Go to `/courses`
2. Click on course card
3. Click "Enroll Now"
4. Start learning

### Switch Theme
1. Click sun/moon icon in navbar
2. Select Light, Dark, or System
3. Preference auto-saved

### View Certificates
1. Go to `/certificates`
2. Browse earned certificates
3. Verify certificate (with code)

## 🐛 Troubleshooting

### User Not Showing in Dashboard
- Check Clerk is connected in layout
- Verify environment variables
- Ensure `.env.local` has Clerk keys

### Tiptap Editor Not Working
- Check `@tiptap/*` packages installed
- Clear node_modules and reinstall
- Ensure imports are correct

### Theme Not Persisting
- Check ThemeProvider in layout
- Clear browser cookies
- Verify `next-themes` installed

### User Sync Issues
- Check webhook configuration
- Verify Supabase RLS policies
- Check database logs for errors

## 📚 Learn More

- **Auth:** See `CLERK_SETUP.md`
- **Database:** See `DATABASE_SCHEMA.md`
- **Full Setup:** See `SETUP_GUIDE.md`
- **Features:** See `FEATURES_IMPLEMENTED.md`

## 🎯 Next Steps

1. **Test signup flow** - Create account via Clerk
2. **Create course** - Try Tiptap editor
3. **Toggle theme** - Test light/dark modes
4. **Enroll in course** - Complete flow
5. **Deploy** - Push to Vercel

## 💡 Pro Tips

- Use Clerk dashboard for user management
- Test RLS policies with different user roles
- Use browser DevTools to inspect theme switching
- Check Supabase logs for query debugging
- Use Vercel Edge Functions for faster APIs

## 📞 Support

- Clerk docs: https://clerk.com/docs
- Supabase docs: https://supabase.com/docs
- Tiptap docs: https://tiptap.dev
- Next.js docs: https://nextjs.org/docs

---

**You're all set! Start building with EDUSEPAL 🎓**
