# Database & Backend Deployment Guide

## ✅ RECOMMENDED: Deploy via Supabase Web Dashboard (Database)

The easiest and most reliable way to deploy the database schema is through the Supabase web interface.

### Quick Steps:

1. **Open Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/fprfhtawqygnvpsvwurr
   - Login if needed

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query" button

3. **Copy the Migration SQL**
   - The migration file is located at: `d:\DonouAPP\backend\supabase\migrations\20260127000001_initial_schema.sql` (and subsequent migrations)
   - Open it in any text editor (VS Code, Notepad++, etc.)
   - **Select ALL** (Ctrl+A) and **Copy** (Ctrl+C)

4. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait 10-30 seconds for execution

---

## Vercel Deployment (Frontend & Backend)

The project is configured to run on Vercel.

### 1. Frontend Deployment
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.vercel.app/api`)

### 2. Backend Deployment
- **Root Directory**: `backend`
- **Framework Preset**: Other (or select "Express" if available, otherwise it auto-detects Node.js)
- **Environment Variables**:
  You MUST set these in Vercel Project Settings:
  - `NODE_ENV`: `production`
  - `SUPABASE_URL`: Your Supabase URL
  - `SUPABASE_ANON_KEY`: Your Supabase Anon Key
  - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
  - `JWT_SECRET`: A strong secret key
  - `JWT_EXPIRES_IN`: `15m`
  - `JWT_REFRESH_EXPIRES_IN`: `7d`
  - `BCRYPT_SALT_ROUNDS`: `10`

**Note**: The backend includes a `vercel.json` and `api/index.ts` adapter to run as a Serverless Function on Vercel.

---

## Option 2: Deploy via CLI (After Login)

If you want to use the CLI:

### 1. Login to Supabase
```bash
npx supabase login
```
This will open a browser for authentication. Complete the login process.

### 2. Link to Project
```bash
npx supabase link --project-ref fprfhtawqygnvpsvwurr
```

### 3. Push Migration
```bash
npx supabase db push
```

---

## Verification After Deployment

After running the migration, verify table creation and policies as described in previous sections.
