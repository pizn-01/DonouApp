-- DonauApp Database Schema for Supabase
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('BRAND', 'MANUFACTURER', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE brief_status AS ENUM ('DRAFT', 'ACTIVE', 'MATCHING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE proposal_status AS ENUM ('PENDING', 'UNDER_REVIEW', 'COUNTER_OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE match_status AS ENUM ('SUGGESTED', 'VIEWED', 'CONTACTED', 'DISMISSED');
CREATE TYPE notification_type AS ENUM ('NEW_MATCH', 'NEW_PROPOSAL', 'PROPOSAL_ACCEPTED', 'PROPOSAL_REJECTED', 'COUNTER_OFFER', 'NEW_MESSAGE', 'VERIFICATION_UPDATE', 'BRIEF_UPDATE');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'BRAND',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand profiles
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Manufacturer profiles
CREATE TABLE manufacturer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  capabilities TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  production_capacity TEXT,
  minimum_order_quantity INTEGER,
  location TEXT NOT NULL,
  verification_status verification_status DEFAULT 'PENDING',
  verification_documents TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Briefs (project requests from brands)
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '{}',
  budget JSONB NOT NULL DEFAULT '{"min": 0, "max": 0, "currency": "USD"}',
  timeline TEXT,
  category TEXT NOT NULL,
  status brief_status DEFAULT 'DRAFT',
  ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches (AI/algorithm matching results)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  match_reasons TEXT[] DEFAULT '{}',
  status match_status DEFAULT 'SUGGESTED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brief_id, manufacturer_id)
);

-- Proposals (from manufacturers to briefs)
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  pricing JSONB NOT NULL DEFAULT '{}',
  timeline TEXT,
  status proposal_status DEFAULT 'PENDING',
  counter_offer_history JSONB[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brief_id, manufacturer_id)
);

-- Conversations (message threads)
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participants UUID[] NOT NULL,
  brief_id UUID REFERENCES briefs(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  ai_generated BOOLEAN DEFAULT FALSE,
  read_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_brand_profiles_user ON brand_profiles(user_id);
CREATE INDEX idx_manufacturer_profiles_user ON manufacturer_profiles(user_id);
CREATE INDEX idx_manufacturer_profiles_status ON manufacturer_profiles(verification_status);
CREATE INDEX idx_briefs_brand ON briefs(brand_id);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_briefs_category ON briefs(category);
CREATE INDEX idx_matches_brief ON matches(brief_id);
CREATE INDEX idx_matches_manufacturer ON matches(manufacturer_id);
CREATE INDEX idx_matches_score ON matches(score DESC);
CREATE INDEX idx_proposals_brief ON proposals(brief_id);
CREATE INDEX idx_proposals_manufacturer ON proposals(manufacturer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Brand profiles policies
CREATE POLICY "Brand profiles are viewable by all authenticated users" ON brand_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own brand profile" ON brand_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Manufacturer profiles policies
CREATE POLICY "Manufacturer profiles are viewable by all authenticated users" ON manufacturer_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own manufacturer profile" ON manufacturer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Briefs policies
CREATE POLICY "Active briefs are viewable by manufacturers" ON briefs
  FOR SELECT USING (
    status IN ('ACTIVE', 'MATCHING', 'IN_PROGRESS') 
    OR brand_id = auth.uid()
  );

CREATE POLICY "Brands can manage their own briefs" ON briefs
  FOR ALL USING (brand_id = auth.uid());

-- Matches policies
CREATE POLICY "Users can view their related matches" ON matches
  FOR SELECT USING (
    manufacturer_id = auth.uid() 
    OR EXISTS (SELECT 1 FROM briefs WHERE briefs.id = brief_id AND briefs.brand_id = auth.uid())
  );

-- Proposals policies
CREATE POLICY "Users can view related proposals" ON proposals
  FOR SELECT USING (
    manufacturer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM briefs WHERE briefs.id = brief_id AND briefs.brand_id = auth.uid())
  );

CREATE POLICY "Manufacturers can manage their own proposals" ON proposals
  FOR ALL USING (manufacturer_id = auth.uid());

-- Conversations policies
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations they're part of" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = ANY(participants));

-- Messages policies
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_id AND auth.uid() = ANY(participants))
  );

CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() 
    AND EXISTS (SELECT 1 FROM conversations WHERE conversations.id = conversation_id AND auth.uid() = ANY(participants))
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_manufacturer_profiles_updated_at BEFORE UPDATE ON manufacturer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON briefs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create user record on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'BRAND')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
