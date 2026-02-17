# Smart Bookmarks

A simple bookmark manager built with Next.js (App Router) and Supabase.

## Features
- Google OAuth login only  
- Add & delete bookmarks (URL + title)  
- Private data with Supabase Row Level Security  
- Real-time sync across tabs/devices  
- Minimal responsive UI with Tailwind CSS  

## Tech Stack
- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS


## Problems Faced & Solutions

**1. Google OAuth redirect issues**  
At first, login worked but users landed on a 404 after Google sign-in.  
**Solution:** Added an `/auth/callback` route to properly exchange the OAuth code for a Supabase session and redirect back to the app.

---

**2. Keeping bookmarks private**  
Initially all bookmarks were visible to every user because the database had no restrictions.  
**Solution:** Enabled Supabase Row Level Security (RLS) and wrote policies using `auth.uid()` so users can only read/write their own bookmarks.

---

**3. Real-time updates felt delayed**  
Supabase Realtime worked, but the UI didn’t update instantly after adding a bookmark.  
**Solution:** Added a local refresh trigger/state update after insert/delete so the UI updates immediately while realtime sync handles other tabs/devices.

---

**4. Package / import errors**  
Ran into issues with missing Supabase packages and SSR helpers.  
**Solution:** Simplified setup to use `@supabase/supabase-js` for client auth and reinstalled dependencies to fix linking issues.

---

**5. Next.js App Router quirks**  
Faced errors like missing root layout tags and client/server component confusion.  
**Solution:** Ensured correct `app/layout.tsx` structure, restarted the dev server, and clearly separated client components (`'use client'`) where needed.


