# Deploying DonouApp to Vercel (Monorepo Guide)

This repository contains both the `frontend` and `backend` code in separate folders. The best practice for deploying this structure on Vercel is to create **two separate Vercel projects** linked to the same Git repository.

## Strategy: The "Two-Project" Setup

You will import this Git repository into Vercel **twice**:
1.  **Project A (Frontend)** - Serves the React UI.
2.  **Project B (Backend)** - Serves the Express API (Serverless).

---

## Step 1: Deploy Backend (Project B)

Do this first so you can get the API URL for the frontend.

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** -> **"Project"**.
2.  Import your `DonouApp` repository.
3.  **Project Name**: name it something like `donou-backend`.
4.  **Framework Preset**: It should auto-detect "Other" or "Express". If not, select **Other**.
5.  **Root Directory**: Click "Edit" and select `backend`. **(Crucial Step)**.
6.  **Environment Variables**:
    You **MUST** add these variables in the Vercel configurations:
    -   `NODE_ENV`: `production`
    -   `SUPABASE_URL`: (Your Supabase URL)
    -   `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
    -   `SUPABASE_SERVICE_ROLE_KEY`: (Your Supabase Service Role Key)
    -   `JWT_SECRET`: (Your JWT Secret)
    -   `JWT_EXPIRES_IN`: `15m`
    -   `JWT_REFRESH_EXPIRES_IN`: `7d`
    -   `BCRYPT_SALT_ROUNDS`: `10`
7.  Click **Deploy**.

**Result**: You will get a URL like `https://donou-backend.vercel.app`. **Copy this URL.**

---

## Step 2: Deploy Frontend (Project A)

1.  Go back to the Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2.  Import the **SAME** `DonouApp` repository again.
3.  **Project Name**: name it something like `donou-frontend` (or just `donou-app`).
4.  **Framework Preset**: It should auto-detect **Vite**.
5.  **Root Directory**: Click "Edit" and select `frontend`. **(Crucial Step)**.
6.  **Environment Variables**:
    -   `VITE_API_URL`: Paste your Backend URL (e.g., `https://donou-backend.vercel.app/api`).
        *Note: Make sure to append `/api` at the end!*
7.  Click **Deploy**.

---

## Troubleshooting

### CORS Errors
If you see "CORS" errors or "Network Error":
1.  Check that your `frontend` environment variable `VITE_API_URL` is set correctly and ends with `/api`.
2.  Ensure you have redeployed the **Backend** *after* we pushed the latest CORS fix (which allows `.vercel.app` domains).

### 500 Server Errors
1.  Check the "Logs" tab in your **Backend** Vercel project.
2.  Verify that all `SUPABASE_*` and `JWT_*` environment variables are set correctly in the Backend project settings.
