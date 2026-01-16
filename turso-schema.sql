-- Turso / SQLite schema additions for thisisyour.website

-- Status tracking table (as requested)
CREATE TABLE IF NOT EXISTS status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  site_url TEXT,
  status INTEGER NOT NULL CHECK (status BETWEEN 0 AND 5),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_status_full_name ON status(full_name);

-- Seed data (20 rows) - initial status = 0
INSERT INTO status (full_name, status) VALUES ('Akın Özkan', 0);
INSERT INTO status (full_name, status) VALUES ('Aydın Serhat Onay', 0);
INSERT INTO status (full_name, status) VALUES ('Ahmet Şengül', 0);
INSERT INTO status (full_name, status) VALUES ('Duygu Yılmaz Hancılar', 0);
INSERT INTO status (full_name, status) VALUES ('Habil Kaynak', 0);
INSERT INTO status (full_name, status) VALUES ('Serdar Güven', 0);
INSERT INTO status (full_name, status) VALUES ('Ömer Sakarya', 0);
INSERT INTO status (full_name, status) VALUES ('Halil İbrahim Bayezit', 0);
INSERT INTO status (full_name, status) VALUES ('Begüm Kodalak Bilik', 0);
INSERT INTO status (full_name, status) VALUES ('Kasım Hanik', 0);
INSERT INTO status (full_name, status) VALUES ('Evrim Eriş', 0);
INSERT INTO status (full_name, status) VALUES ('Yusuf Yalçınkaya', 0);
INSERT INTO status (full_name, status) VALUES ('Yusuf Altan', 0);
INSERT INTO status (full_name, status) VALUES ('Uğur Aşcı', 0);
INSERT INTO status (full_name, status) VALUES ('Mehmet Coşkun', 0);
INSERT INTO status (full_name, status) VALUES ('Fatih Uslu', 0);
INSERT INTO status (full_name, status) VALUES ('Veysel Cenk Karakuz', 0);
INSERT INTO status (full_name, status) VALUES ('Alpaslan Arınç', 0);
INSERT INTO status (full_name, status) VALUES ('Oğuzhan Dirice', 0);
INSERT INTO status (full_name, status) VALUES ('Nazli Kocak', 0);

