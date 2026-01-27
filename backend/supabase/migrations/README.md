# DonauApp Backend - Supabase Migrations

This directory contains all Supabase database migrations for the DonauApp B2B marketplace.

## Migration Files

### `20260127000001_initial_schema.sql`
Complete initial database schema including:
- 9 core tables (user_profiles, brand_profiles, manufacturer_profiles, briefs, brief_matches, proposals, conversations, conversation_participants, messages)
- 5 enum types for status pipelines
- Indexes for query performance
- Triggers for automatic timestamp updates
- Row Level Security (RLS) policies for data access control

## Setup Instructions

### Prerequisites
1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Initialize Supabase in your project (if not already done):
   ```bash
   cd d:\DonouAPP\backend
   supabase init
   ```

### Local Development

1. **Start local Supabase:**
   ```bash
   supabase start
   ```

2. **Apply migrations:**
   ```bash
   supabase db reset
   ```
   This will create all tables, enums, and policies in your local Supabase instance.

3. **View the database:**
   ```bash
   supabase db diff
   ```

### Production Deployment

1. **Link to your Supabase project:**
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

2. **Push migrations to production:**
   ```bash
   supabase db push
   ```

## Database Schema Overview

### Core Entities

#### Authentication & Users
- `auth.users` (Supabase managed)
- `user_profiles` - Base profile for all users
- `brand_profiles` - Brand-specific data
- `manufacturer_profiles` - Manufacturer-specific data with verification

#### Brief & Matching System
- `briefs` - Project requests from brands
- `brief_matches` - AI/manual matches between briefs and manufacturers
- `proposals` - Manufacturer proposals for briefs

#### Communication
- `conversations` - Conversation threads (proposal-specific or general)
- `conversation_participants` - Multi-party conversation support
- `messages` - Individual messages with attachments

### Status Pipelines

**Briefs:** `draft → open → matched → in_progress → completed → archived`

**Proposals:** `draft → submitted → under_review → accepted | rejected | counter_offer`

**Verification:** `pending → in_review → verified | rejected`

## Security

All tables have Row Level Security (RLS) enabled with policies ensuring:
- Users can only access their own profile data
- Brands see only their own briefs and related proposals
- Manufacturers see only "open" or "matched" briefs
- Conversation participants have exclusive message access

## JSONB Fields

Several tables use JSONB for flexible data storage:

- `manufacturer_profiles.capabilities` - Product categories and subcategories
- `manufacturer_profiles.certifications` - Certification details with expiry dates
- `briefs.requirements` - Product specifications and requirements
- `proposals.proposal_details` - Detailed proposal information
- `messages.attachments` - File metadata

## Indexing

Indexes are created on:
- All foreign key columns
- Status fields (for filtering)
- Timestamp fields (for sorting)
- JSONB fields (GIN index for efficient querying)

## Next Steps

After running migrations:
1. Create seed data for testing (optional)
2. Set up backend API with TypeScript types matching this schema
3. Implement authentication endpoints
4. Build CRUD operations for each entity
