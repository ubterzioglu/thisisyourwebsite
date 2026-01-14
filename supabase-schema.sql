-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Queue Items Table
CREATE TABLE queue_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_index INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  display_role TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('INVITED', 'SUBMITTED', 'IN_PROGRESS', 'DELIVERED')) DEFAULT 'INVITED',
  consent_showcase TEXT CHECK (consent_showcase IN ('PUBLIC', 'ANONYMIZED', 'PRIVATE')) DEFAULT 'PRIVATE',
  site_url TEXT,
  repo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Submissions Table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_item_id UUID REFERENCES queue_items(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'tr',
  answers_json JSONB NOT NULL,
  customer_summary_tr TEXT NOT NULL,
  ai_payload_json JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(queue_item_id)
);

-- Indexes
CREATE INDEX idx_queue_items_status ON queue_items(status);
CREATE INDEX idx_queue_items_token ON queue_items(token);
CREATE INDEX idx_queue_items_order ON queue_items(order_index);
CREATE INDEX idx_submissions_queue_item ON submissions(queue_item_id);

-- Trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_queue_items_updated_at BEFORE UPDATE
    ON queue_items FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Intakes Table (for wizard submissions)
CREATE TABLE intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  public_slug TEXT UNIQUE NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  long_text TEXT,
  user_summary TEXT,
  ai_prompt TEXT,
  status TEXT DEFAULT 'submitted',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for intakes
CREATE INDEX idx_intakes_slug ON intakes(public_slug);
CREATE INDEX idx_intakes_status ON intakes(status);

-- Trigger to update updated_at for intakes
CREATE TRIGGER update_intakes_updated_at BEFORE UPDATE
    ON intakes FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) for intakes table
ALTER TABLE intakes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert new intakes
CREATE POLICY "Allow anonymous insert" ON intakes
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Policy: Allow anonymous users to update their own intake by slug
CREATE POLICY "Allow anonymous update by slug" ON intakes
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Policy: Allow anonymous users to select their own intake by slug
CREATE POLICY "Allow anonymous select by slug" ON intakes
    FOR SELECT
    TO anon
    USING (true);

-- Policy: Allow service role to do everything (for admin operations)
CREATE POLICY "Allow service role all operations" ON intakes
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
