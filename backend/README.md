# DonauApp Backend API

Backend API for DonauApp B2B Marketplace - connecting Brands with Manufacturers.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **Validation**: Zod

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Required Environment Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret key for JWT signing (min 32 characters)

### 3. Run Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Onboarding

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/onboarding/brand` | Complete brand profile | Yes | Brand |
| POST | `/api/onboarding/manufacturer` | Complete manufacturer profile | Yes | Manufacturer |
| GET | `/api/onboarding/status` | Get onboarding status | Yes | Any |

## Example Requests

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@example.com",
    "password": "SecurePass123",
    "full_name": "John Doe",
    "role": "brand"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "brand@example.com",
    "password": "SecurePass123"
  }'
```

### Brand Onboarding

```bash
curl -X POST http://localhost:3000/api/onboarding/brand \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "TechBrand Inc",
    "industry": "Electronics",
    "company_size": "11-50",
    "website": "https://techbrand.com",
    "description": "We create innovative electronic products"
  }'
```

### Manufacturer Onboarding

```bash
curl -X POST http://localhost:3000/api/onboarding/manufacturer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "ProMFG Ltd",
    "capabilities": [
      {
        "category": "Electronics",
        "subcategories": ["PCB Manufacturing", "Assembly"]
      }
    ],
    "production_capacity": "10,000 units/month",
    "factory_location": "Shenzhen, China"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   ├── validators/      # Zod schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## Security Features

- ✅ JWT-based authentication (15min access, 7day refresh)
- ✅ bcrypt password hashing (10 salt rounds)
- ✅ Role-based access control (Brand/Manufacturer)
- ✅ Request validation with Zod
- ✅ Helmet security headers
- ✅ CORS configuration

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## License

MIT
