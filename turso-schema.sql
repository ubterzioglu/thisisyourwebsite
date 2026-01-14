-- Turso (SQLite) Schema
-- UUID extension yok, TEXT kullanacağız
-- JSONB yerine TEXT kullanacağız (JSON string olarak saklanacak)
-- TIMESTAMP WITH TIME ZONE yerine TEXT kullanacağız (ISO string)

-- Queue Items Table
CREATE TABLE IF NOT EXISTS queue_items (
  id TEXT PRIMARY KEY,
  order_index INTEGER NOT NULL,
  display_name TEXT NOT NULL,
  display_role TEXT,
  token TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('INVITED', 'SUBMITTED', 'IN_PROGRESS', 'DELIVERED')) DEFAULT 'INVITED',
  consent_showcase TEXT CHECK (consent_showcase IN ('PUBLIC', 'ANONYMIZED', 'PRIVATE')) DEFAULT 'PRIVATE',
  site_url TEXT,
  repo_url TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  delivered_at TEXT
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  queue_item_id TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'tr',
  answers_json TEXT NOT NULL DEFAULT '{}',
  customer_summary_tr TEXT NOT NULL,
  ai_payload_json TEXT NOT NULL DEFAULT '{}',
  submitted_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (queue_item_id) REFERENCES queue_items(id) ON DELETE CASCADE,
  UNIQUE(queue_item_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_queue_items_status ON queue_items(status);
CREATE INDEX IF NOT EXISTS idx_queue_items_token ON queue_items(token);
CREATE INDEX IF NOT EXISTS idx_queue_items_order ON queue_items(order_index);
CREATE INDEX IF NOT EXISTS idx_submissions_queue_item ON submissions(queue_item_id);

-- Trigger to update updated_at automatically (SQLite trigger syntax)
CREATE TRIGGER IF NOT EXISTS update_queue_items_updated_at 
AFTER UPDATE ON queue_items
BEGIN
  UPDATE queue_items SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Intakes Table (for wizard submissions)
CREATE TABLE IF NOT EXISTS intakes (
  id TEXT PRIMARY KEY,
  created_at TEXT DEFAULT (datetime('now')),
  public_slug TEXT UNIQUE NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  long_text TEXT,
  user_summary TEXT,
  ai_prompt TEXT,
  status TEXT DEFAULT 'submitted',
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Index for intakes
CREATE INDEX IF NOT EXISTS idx_intakes_slug ON intakes(public_slug);
CREATE INDEX IF NOT EXISTS idx_intakes_status ON intakes(status);

-- Trigger to update updated_at for intakes
CREATE TRIGGER IF NOT EXISTS update_intakes_updated_at 
AFTER UPDATE ON intakes
BEGIN
  UPDATE intakes SET updated_at = datetime('now') WHERE id = NEW.id;
END;
