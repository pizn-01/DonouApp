-- =============================================
-- DonauApp - Initial Database Schema
-- Migration: 20260127000001_initial_schema
-- Description: Complete schema for B2B marketplace
-- =============================================

-- =============================================
-- ENUM TYPES
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM ('brand', 'manufacturer');

-- Brief status pipeline
CREATE TYPE brief_status AS ENUM (
  'draft',
  'open',
  'matched',
  'in_progress',
  'completed',
  'archived'
);

-- Match types
CREATE TYPE match_type AS ENUM (
  'ai_algorithm',
  'manual_selection',
  'manufacturer_discovery'
);

-- Proposal status pipeline
CREATE TYPE proposal_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'accepted',
  'rejected',
  'counter_offer'
);

-- Verification status for manufacturers
CREATE TYPE verification_status AS ENUM (
  'pending',
  'in_review',
  'verified',
  'rejected'
);

-- =============================================
-- CORE TABLES
-- =============================================

-- =============================================
-- USER PROFILES (Base profile for all users)
-- =============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- =============================================
-- BRAND PROFILES
-- =============================================
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50), -- e.g., '1-10', '11-50', '51-200'
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX idx_brand_profiles_industry ON brand_profiles(industry);

-- =============================================
-- MANUFACTURER PROFILES
-- =============================================
CREATE TABLE manufacturer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  capabilities JSONB NOT NULL DEFAULT '[]'::jsonb, 
  -- Example: [{"category": "Electronics", "subcategories": ["PCB", "Assembly"]}]
  production_capacity VARCHAR(255), -- e.g., "10,000 units/month"
  factory_location VARCHAR(255),
  certifications JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"name": "ISO 9001", "expires_at": "2026-12-31"}]
  year_established INTEGER,
  employee_count VARCHAR(50),
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_manufacturer_profiles_user_id ON manufacturer_profiles(user_id);
CREATE INDEX idx_manufacturer_profiles_verification ON manufacturer_profiles(verification_status);
CREATE INDEX idx_manufacturer_capabilities ON manufacturer_profiles USING GIN(capabilities);

-- =============================================
-- BRIEFS (Project Requests)
-- =============================================
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example: {"material": "Steel", "quantity": 1000, "specs": {...}}
  budget_range_min DECIMAL(12, 2),
  budget_range_max DECIMAL(12, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  timeline VARCHAR(255), -- e.g., "2 months", "Q2 2026"
  target_delivery_date DATE,
  status brief_status NOT NULL DEFAULT 'draft',
  is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_briefs_brand_id ON briefs(brand_id);
CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_briefs_created_at ON briefs(created_at DESC);

-- =============================================
-- BRIEF MATCHES (N:M relationship)
-- =============================================
CREATE TABLE brief_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES manufacturer_profiles(id) ON DELETE CASCADE,
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  match_type match_type NOT NULL DEFAULT 'ai_algorithm',
  match_reason JSONB DEFAULT '{}'::jsonb,
  -- Example: {"capability_match": 95, "location_match": 80}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brief_id, manufacturer_id)
);

CREATE INDEX idx_brief_matches_brief ON brief_matches(brief_id);
CREATE INDEX idx_brief_matches_manufacturer ON brief_matches(manufacturer_id);
CREATE INDEX idx_brief_matches_score ON brief_matches(match_score DESC);

-- =============================================
-- PROPOSALS
-- =============================================
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  manufacturer_id UUID NOT NULL REFERENCES manufacturer_profiles(id) ON DELETE CASCADE,
  price DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  delivery_timeline VARCHAR(255) NOT NULL,
  estimated_delivery_date DATE,
  proposal_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Example: {"materials": "...", "process": "...", "samples": true}
  status proposal_status NOT NULL DEFAULT 'draft',
  attachments JSONB DEFAULT '[]'::jsonb,
  counter_offer_history JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_proposals_brief ON proposals(brief_id);
CREATE INDEX idx_proposals_manufacturer ON proposals(manufacturer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_submitted_at ON proposals(submitted_at DESC);

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  -- NULL for general conversations not tied to proposals
  title VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_proposal ON conversations(proposal_id);

-- =============================================
-- CONVERSATION PARTICIPANTS (N:M)
-- =============================================
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- =============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_manufacturer_profiles_updated_at
  BEFORE UPDATE ON manufacturer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manufacturer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- =============================================
-- USER PROFILES POLICIES
-- =============================================

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- BRAND PROFILES POLICIES
-- =============================================

CREATE POLICY "Brand profiles are viewable by all authenticated users"
  ON brand_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Brands can manage own profile"
  ON brand_profiles FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- MANUFACTURER PROFILES POLICIES
-- =============================================

CREATE POLICY "Verified manufacturer profiles are viewable by all"
  ON manufacturer_profiles FOR SELECT
  TO authenticated
  USING (verification_status = 'verified' OR auth.uid() = user_id);

CREATE POLICY "Manufacturers can manage own profile"
  ON manufacturer_profiles FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- BRIEFS POLICIES
-- =============================================

CREATE POLICY "Brands can manage own briefs"
  ON briefs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM brand_profiles
      WHERE brand_profiles.id = briefs.brand_id
      AND brand_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Manufacturers can view open briefs"
  ON briefs FOR SELECT
  TO authenticated
  USING (
    status IN ('open', 'matched') 
    OR EXISTS (
      SELECT 1 FROM brand_profiles
      WHERE brand_profiles.id = briefs.brand_id
      AND brand_profiles.user_id = auth.uid()
    )
  );

-- =============================================
-- BRIEF MATCHES POLICIES
-- =============================================

CREATE POLICY "Brief matches visible to relevant parties"
  ON brief_matches FOR SELECT
  TO authenticated
  USING (
    -- Brief owner
    EXISTS (
      SELECT 1 FROM briefs b
      JOIN brand_profiles bp ON b.brand_id = bp.id
      WHERE b.id = brief_matches.brief_id
      AND bp.user_id = auth.uid()
    )
    OR
    -- Matched manufacturer
    EXISTS (
      SELECT 1 FROM manufacturer_profiles mp
      WHERE mp.id = brief_matches.manufacturer_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Brands can create matches for their briefs"
  ON brief_matches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM briefs b
      JOIN brand_profiles bp ON b.brand_id = bp.id
      WHERE b.id = brief_matches.brief_id
      AND bp.user_id = auth.uid()
    )
  );

-- =============================================
-- PROPOSALS POLICIES
-- =============================================

CREATE POLICY "Proposals visible to relevant parties"
  ON proposals FOR SELECT
  TO authenticated
  USING (
    -- Brief owner
    EXISTS (
      SELECT 1 FROM briefs b
      JOIN brand_profiles bp ON b.brand_id = bp.id
      WHERE b.id = proposals.brief_id
      AND bp.user_id = auth.uid()
    )
    OR
    -- Proposal manufacturer
    EXISTS (
      SELECT 1 FROM manufacturer_profiles mp
      WHERE mp.id = proposals.manufacturer_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Manufacturers can manage own proposals"
  ON proposals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM manufacturer_profiles mp
      WHERE mp.id = proposals.manufacturer_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Brands can update proposal status"
  ON proposals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM briefs b
      JOIN brand_profiles bp ON b.brand_id = bp.id
      WHERE b.id = proposals.brief_id
      AND bp.user_id = auth.uid()
    )
  );

-- =============================================
-- CONVERSATIONS POLICIES
-- =============================================

CREATE POLICY "Conversation participants can view conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversations.id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- =============================================
-- CONVERSATION PARTICIPANTS POLICIES
-- =============================================

CREATE POLICY "Users can view their conversation participations"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can join conversations"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their participation"
  ON conversation_participants FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================
-- MESSAGES POLICIES
-- =============================================

CREATE POLICY "Conversation participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- =============================================
-- COMMENTS & METADATA
-- =============================================

COMMENT ON TABLE user_profiles IS 'Base profile for all users (both brands and manufacturers)';
COMMENT ON TABLE brand_profiles IS 'Extended profile data for brand users';
COMMENT ON TABLE manufacturer_profiles IS 'Extended profile data for manufacturer users';
COMMENT ON TABLE briefs IS 'Project requests created by brands';
COMMENT ON TABLE brief_matches IS 'N:M relationship tracking matched manufacturers to briefs';
COMMENT ON TABLE proposals IS 'Manufacturer proposals submitted for briefs';
COMMENT ON TABLE conversations IS 'Conversation threads (can be proposal-specific or general)';
COMMENT ON TABLE conversation_participants IS 'N:M relationship for conversation participation';
COMMENT ON TABLE messages IS 'Individual messages within conversations';
