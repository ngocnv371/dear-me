# Supabase Integration Guide

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: dear-me (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Select the region closest to you
4. Click "Create new project"

### 2. Run Database Migrations

Once your project is created:

1. Go to the SQL Editor in your Supabase dashboard
2. Run the migrations in order:
   - First run `supabase/migrations/00_profile.sql`
   - Then run `supabase/migrations/01_project.sql`

### 3. Get Your API Keys

1. Go to Project Settings → API
2. Find your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public key (starts with `eyJ...`)

### 4. Configure Environment Variables

1. In the `web/` directory, create a `.env` file:
   ```bash
   cd web
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Enable Authentication Providers (Optional)

For Google Sign-In:

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### 6. Run the Application

```bash
cd web
npm run dev
```

## Database Schema

### Profiles Table
- `id`: Serial primary key
- `user_id`: UUID reference to auth.users
- `name`: User's display name

### Projects Table
- `id`: UUID primary key
- `profile_id`: Integer reference to profiles
- `title`: Project title
- `tags`: Array of tags
- `tone`: Tone of the script
- `theme`: Theme/topic
- `summary`: Project summary/tagline
- `transcript`: Generated script
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Features Implemented

✅ User authentication (email/password and Google OAuth)
✅ Row Level Security (RLS) policies
✅ Automatic profile creation on signup
✅ CRUD operations for scenarios/projects
✅ User-specific data isolation
✅ Real-time auth state management

## Migration from localStorage

The app previously used localStorage for data storage. After integrating Supabase:
- Existing localStorage data will not be automatically migrated
- Users will need to create new scenarios after signing in
- If you want to migrate data, you'll need to manually export and import

## Troubleshooting

### "User not authenticated" error
- Make sure you're signed in
- Check that your Supabase URL and anon key are correct in `.env`

### Database connection issues
- Verify your Supabase project is active
- Check that migrations were run successfully
- Confirm RLS policies are enabled

### Google Sign-In not working
- Verify OAuth credentials are set up correctly
- Check redirect URIs match exactly
- Ensure Google provider is enabled in Supabase

## Next Steps

- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add profile editing
- [ ] Implement real-time updates with Supabase Realtime
- [ ] Add file storage for audio/images using Supabase Storage
