# Frontend-Backend Integration Guide

## Quick Start

### 1. Start Backend (Already Running ✅)
```bash
cd d:\DonouAPP\backend
npm run dev
```
Backend runs on: `http://localhost:3000`

### 2. Start Frontend
```bash
cd d:\DonouAPP\frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## What Was Updated

### ✅ Updated Files

1. **`src/config/api.ts`** - Updated API endpoints to match new backend
2. **`src/lib/apiClient.ts`** - Fixed JWT refresh logic
3. **`src/services/auth.service.ts`** - NEW: Auth & onboarding service functions
4. **`src/hooks/useAuth.ts`** - Enhanced with login/signup/logout functions
5. **`.env`** - NEW: Frontend environment variables


---

## Using the Auth Service in Your Components

### Example: Login Form

```tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example: Signup Form

```tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function SignupForm() {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'brand' as 'brand' | 'manufacturer',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup(formData);
      navigate('/onboarding');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        placeholder="Password (min 8 chars)"
        required
      />
      <input
        type="text"
        value={formData.full_name}
        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        placeholder="Full Name"
        required
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
      >
        <option value="brand">Brand</option>
        <option value="manufacturer">Manufacturer</option>
      </select>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### Example: Brand Onboarding

```tsx
import { useState } from 'react';
import { onboardingService } from '@/services/auth.service';

export function BrandOnboarding() {
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    company_size: '11-50' as const,
    website: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onboardingService.completeBrandOnboarding(formData);
      alert('Onboarding complete!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Onboarding failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.company_name}
        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
        placeholder="Company Name"
        required
      />
      <input
        type="text"
        value={formData.industry}
        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
        placeholder="Industry"
      />
      <select
        value={formData.company_size}
        onChange={(e) => setFormData({ ...formData, company_size: e.target.value as any })}
      >
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="501-1000">501-1000 employees</option>
        <option value="1000+">1000+ employees</option>
      </select>
      <input
        type="url"
        value={formData.website}
        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        placeholder="Website"
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Company Description"
      />
      <button type="submit">Complete Onboarding</button>
    </form>
  );
}
```

---

## Testing the Integration

### 1. Test Signup

Open browser console and run:
```javascript
// In browser console at http://localhost:5173
const response = await fetch('http://localhost:3000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@brand.com',
    password: 'SecurePass123',
    full_name: 'Test User',
    role: 'brand'
  })
});

const data = await response.json();
console.log('Signup response:', data);
```

### 2. Test Login from Frontend

```javascript
// In your React component or browser console
import { authService } from '@/services/auth.service';

const result = await authService.login({
  email: 'test@brand.com',
  password: 'SecurePass123'
});

console.log('Logged in user:', result.user);
console.log('Access token:', result.accessToken);
```

### 3. Check Protected Route

```javascript
// After login, test /me endpoint
const user = await authService.me();
console.log('Current user:', user);
```

---

## Common Issues & Solutions

### ❌ CORS Error
If you see: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:** Backend already has CORS configured for `http://localhost:5173`. Make sure:
1. Backend is running on port 3000
2. Frontend is running on port 5173
3. Restart both if needed

### ❌ 401 Unauthorized on Protected Routes
**Solution:** Make sure you're logged in and token is in localStorage:
```javascript
console.log('Token:', localStorage.getItem('accessToken'));
```

### ❌ Network Request Failed
**Solution:** Check backend is running:
```bash
curl http://localhost:3000/api/health
```

---

## Next Steps

1. ✅ **Update your existing login/register forms** to use the new `useAuth` hook
2. ✅ **Create onboarding pages** for brands and manufacturers
3. ✅ **Test the complete flow**: Signup → Login → Onboarding
4. ✅ **Add error handling** and loading states in your UI

---

## API Response Format

All responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## Available API Endpoints

### Auth
- ✅ `POST /api/auth/signup` - Register
- ✅ `POST /api/auth/login` - Login
- ✅ `GET /api/auth/me` - Get current user
- ✅ `POST /api/auth/refresh` - Refresh token
- ✅ `POST /api/auth/logout` - Logout

### Onboarding
- ✅ `POST /api/onboarding/brand` - Brand onboarding (Brand only)
- ✅ `POST /api/onboarding/manufacturer` - Manufacturer onboarding (Manufacturer only)
- ✅ `GET /api/onboarding/status` - Check onboarding status
