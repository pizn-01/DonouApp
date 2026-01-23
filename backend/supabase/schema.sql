-- DonauApp Master Database Schema
-- Run this ENTIRE file in Supabase SQL Editor to initialize a fresh project.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enum Types
CREATE TYPE public.user_role AS ENUM ('BRAND', 'MANUFACTURER', 'ADMIN');
CREATE TYPE public.verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE public.brief_status AS ENUM ('DRAFT', 'ACTIVE', 'MATCHING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE public.proposal_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'COUNTER_OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE public.match_status AS ENUM ('SUGGESTED', 'VIEWED', 'CONTACTED', 'DISMISSED');
CREATE TYPE public.notification_type AS ENUM ('NEW_MATCH', 'NEW_PROPOSAL', 'PROPOSAL_ACCEPTED', 'PROPOSAL_REJECTED', 'COUNTER_OFFER', 'NEW_MESSAGE', 'VERIFICATION_UPDATE', 'BRIEF_UPDATE');

-- 3. Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  role public.user_role NOT NULL DEFAULT 'BRAND',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Brand profiles
CREATE TABLE public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Manufacturer profiles
CREATE TABLE public.manufacturer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  production_capacity TEXT,
  minimum_order_quantity INTEGER,
  location TEXT NOT NULL,
  verification_status public.verification_status DEFAULT 'PENDING',
  verification_documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Briefs (project requests from brands)
CREATE TABLE public.briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '{}',
  budget JSONB NOT NULL DEFAULT '{"min": 0, "max": 0, "currency": "USD"}',
  timeline TEXT,
  category TEXT NOT NULL,
  status public.brief_status DEFAULT 'DRAFT',
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Matches (AI/algorithm matching results)
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  match_reasons TEXT[] DEFAULT '{}',
  status public.match_status DEFAULT 'SUGGESTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brief_id, manufacturer_id)
);

-- 8. Proposals (from manufacturers to briefs)
CREATE TABLE public.proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  pricing JSONB NOT NULL DEFAULT '{}',
  timeline TEXT,
  status public.proposal_status DEFAULT 'PENDING',
  counter_offer_history JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brief_id, manufacturer_id)
);

-- 9. Conversations (message threads)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  brief_id UUID REFERENCES public.briefs(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_brand_profiles_user ON public.brand_profiles(user_id);
CREATE INDEX idx_manufacturer_profiles_user ON public.manufacturer_profiles(user_id);
CREATE INDEX idx_briefs_brand ON public.briefs(brand_id);
CREATE INDEX idx_briefs_status ON public.briefs(status);

-- 13. Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manufacturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 14. Helper Function for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON public.brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON public.briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 15. User Creation Trigger (The Critical Part)
-- Automatically inserts into public.users when a new Auth user is created.
-- Explicitly casts role string to public.user_role to avoid security definer issues.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'BRAND'::public.user_role),
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger to the auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policies (Basic Examples)
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);
