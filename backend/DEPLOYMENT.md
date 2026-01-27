# Database Deployment Guide

## ✅ RECOMMENDED: Deploy via Supabase Web Dashboard

The easiest and most reliable way to deploy is through the Supabase web interface.

### Quick Steps:

1. **Open Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/fprfhtawqygnvpsvwurr
   - Login if needed

2. **Go to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query" button

3. **Copy the Migration SQL**
   - The migration file is located at: `d:\DonouAPP\backend\supabase\migrations\20260127000001_initial_schema.sql`
   - Open it in any text editor (VS Code, Notepad++, etc.)
   - **Select ALL** (Ctrl+A) and **Copy** (Ctrl+C)

4. **Paste and Execute**
   - Paste the SQL into the Supabase SQL Editor
   - Click **"Run"** button (or press Ctrl+Enter)
   - Wait 10-30 seconds for execution

5. **Verify Success**
   - Look for "Success. No rows returned" or similar message
   - Go to "Database" → "Tables" in the left sidebar
   - You should see these 9 tables:
     * `user_profiles`
     * `brand_profiles`
     * `manufacturer_profiles`
     * `briefs`
     * `brief_matches`
     * `proposals`
     * `conversations`
     * `conversation_participants`
     * `messages`

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

## Option 3: Deploy via Direct PostgreSQL Connection

If you have the database password, you can use psql or any PostgreSQL client:

### Using psql:
```bash
psql "postgresql://postgres.fprfhtawqygnvpsvwurr:[YOUR-PASSWORD]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260127000001_initial_schema.sql
```

### Using TablePlus, DBeaver, or pgAdmin:
1. Create new connection with these details:
   - Host: `aws-1-ap-south-1.pooler.supabase.com`
   - Port: `6543`
   - Database: `postgres`
   - Username: `postgres.fprfhtawqygnvpsvwurr`
   - Password: [Your database password]
2. Open the migration SQL file
3. Execute it

---

## Verification After Deployment

After running the migration, verify:

1. **Check Tables Exist:**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```

2. **Check Enums Created:**
   ```sql
   SELECT t.typname as enum_name, e.enumlabel as enum_value
   FROM pg_type t 
   JOIN pg_enum e ON t.oid = e.enumtypid  
   ORDER BY enum_name, e.enumlabel;
   ```

3. **Check RLS Enabled:**
   ```sql
   SELECT schemaname, tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```
   All tables should have `rowsecurity = true`

4. **Check Policies:**
   ```sql
   SELECT schemaname, tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename;
   ```
   You should see 20+ policies.

---

## Next Steps After Successful Deployment

Once the database is deployed:

1. ✅ Create test users in Supabase Auth
2. ✅ Insert sample data for testing
3. ✅ Begin Phase 2: Backend API Development
   - Set up TypeScript types
   - Create Supabase client
   - Build authentication endpoints
   - Implement CRUD operations

---

## Need Help?

If you encounter any errors during deployment:
- Check the SQL Editor for error messages
- Ensure no other migrations have been run that might conflict
- Verify the Supabase project is active and accessible
