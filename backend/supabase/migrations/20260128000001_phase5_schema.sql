-- Phase 5: Messaging Enhancements, Notifications & Active Pipeline
-- NOTE: conversations and messages tables already exist in initial_schema
-- This migration adds new columns and creates additional Phase 5 tables

-- =============================================
-- 1. ADD NEW COLUMNS TO EXISTING CONVERSATIONS TABLE
-- =============================================
-- Add direct brand/manufacturer references for easier lookups
ALTER TABLE conversations 
  ADD COLUMN IF NOT EXISTS brief_id UUID REFERENCES briefs(id),
  ADD COLUMN IF NOT EXISTS manufacturer_id UUID REFERENCES manufacturer_profiles(id),
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brand_profiles(id);

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_conversations_brief ON conversations(brief_id);
CREATE INDEX IF NOT EXISTS idx_conversations_manufacturer ON conversations(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_brand ON conversations(brand_id);

-- =============================================
-- 2. ADD NEW COLUMNS TO EXISTING MESSAGES TABLE
-- =============================================
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- =============================================
-- 3. NOTIFICATIONS TABLE (NEW)
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'PROPOSAL_RECEIVED', 'MESSAGE', 'BRIEF_MATCHED', 'PROPOSAL_ACCEPTED'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- For links or metadata
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- =============================================
-- 4. PROJECT UPDATES TABLE (NEW)
-- =============================================
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES briefs(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'MILESTONE', 'UPDATE', 'ISSUE'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_updates_brief ON project_updates(brief_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_author ON project_updates(author_id);
CREATE INDEX IF NOT EXISTS idx_project_updates_created ON project_updates(created_at DESC);

-- RLS for project updates
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Participants can view project updates" ON project_updates;
DROP POLICY IF EXISTS "Participants can create project updates" ON project_updates;

CREATE POLICY "Participants can view project updates"
ON project_updates FOR SELECT
USING (
  brief_id IN (
    SELECT id FROM briefs WHERE brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
  )
  OR
  brief_id IN (
    SELECT brief_id FROM proposals WHERE manufacturer_id IN (SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()) AND status = 'accepted'
  )
);

CREATE POLICY "Participants can create project updates"
ON project_updates FOR INSERT
WITH CHECK (
  author_id = auth.uid() AND (
    brief_id IN (
      SELECT id FROM briefs WHERE brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
    )
    OR
    brief_id IN (
      SELECT brief_id FROM proposals WHERE manufacturer_id IN (SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()) AND status = 'accepted'
    )
  )
);

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE notifications IS 'User notifications for system events';
COMMENT ON TABLE project_updates IS 'Updates and milestones for active projects';
