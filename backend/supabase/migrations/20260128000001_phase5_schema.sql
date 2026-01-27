-- Phase 5: Messaging, Notifications & Active Pipeline

-- 1. Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID REFERENCES briefs(id),
  manufacturer_id UUID REFERENCES manufacturer_profiles(id),
  brand_id UUID REFERENCES brand_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversations they are part of"
ON conversations FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM brand_profiles WHERE id = brand_id
    UNION
    SELECT user_id FROM manufacturer_profiles WHERE id = manufacturer_id
  )
);

CREATE POLICY "Users can create conversations they are part of"
ON conversations FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM brand_profiles WHERE id = brand_id
    UNION
    SELECT user_id FROM manufacturer_profiles WHERE id = manufacturer_id
  )
);

-- 2. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM conversations WHERE 
      auth.uid() IN (
        SELECT user_id FROM brand_profiles WHERE id = brand_id
        UNION
        SELECT user_id FROM manufacturer_profiles WHERE id = manufacturer_id
      )
  )
);

CREATE POLICY "Users can send messages to their conversations"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  conversation_id IN (
    SELECT id FROM conversations WHERE 
      auth.uid() IN (
        SELECT user_id FROM brand_profiles WHERE id = brand_id
        UNION
        SELECT user_id FROM manufacturer_profiles WHERE id = manufacturer_id
      )
  )
);

-- 3. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'PROPOSAL_RECEIVED', 'MESSAGE', 'BRIEF_MATCHED', 'PROPOSAL_ACCEPTED'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- For links or metadata
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications (read status)"
ON notifications FOR UPDATE
USING (user_id = auth.uid());

-- System can insert notifications (bypass RLS or use service key, but for simple app allow insert from authenticated users securely?)
-- Usually notifications are system-generated. For MVP, we might allow triggered inserts via backend service role.
-- But let's add a policy just in case backend runs as effective user for some things.
-- Actually, the backend service uses `service_role` key usually? Or just authenticated user?
-- If backend uses `supabase-js` with service role key, RLS is bypassed. 
-- If backend passes user token, RLS applies. 
-- We'll assume service invocations for notification creation, so no INSERT policy needed for users.

-- 4. Project Updates
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'MILESTONE', 'UPDATE', 'ISSUE'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for project updates
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view project updates"
ON project_updates FOR SELECT
USING (
  brief_id IN (
    SELECT id FROM briefs WHERE brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid()) -- Brand Owner
  )
  OR
  brief_id IN (
      SELECT brief_id FROM proposals WHERE manufacturer_id IN (SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()) AND status = 'ACCEPTED' -- Accepted Manufacturer
  )
);

CREATE POLICY "Participants can create project updates"
ON project_updates FOR INSERT
WITH CHECK (
  brief_id IN (
    SELECT id FROM briefs WHERE brand_id IN (SELECT id FROM brand_profiles WHERE user_id = auth.uid())
  )
  OR
  brief_id IN (
      SELECT brief_id FROM proposals WHERE manufacturer_id IN (SELECT id FROM manufacturer_profiles WHERE user_id = auth.uid()) AND status = 'ACCEPTED'
  )
);
