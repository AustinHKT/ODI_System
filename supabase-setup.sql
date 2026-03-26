-- =============================================
-- ODI System - Supabase Database Setup
-- =============================================
-- Run this SQL in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. สร้างตาราง odi_records (เก็บผลแบบสอบถาม)
CREATE TABLE IF NOT EXISTS odi_records (
  id TEXT PRIMARY KEY,
  patient JSONB NOT NULL,
  answers JSONB NOT NULL,
  skipped_sections JSONB DEFAULT '[]',
  total_score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  level TEXT NOT NULL,
  level_th TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. สร้างตาราง odi_users (เก็บข้อมูลผู้ใช้ระบบหลังบ้าน)
CREATE TABLE IF NOT EXISTS odi_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. เพิ่ม Admin เริ่มต้น
INSERT INTO odi_users (id, username, password, display_name, role)
VALUES ('admin', 'admin', '1234', 'ผู้ดูแลระบบ', 'admin')
ON CONFLICT (id) DO NOTHING;

-- 4. เปิด RLS (Row Level Security)
ALTER TABLE odi_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE odi_users ENABLE ROW LEVEL SECURITY;

-- 5. สร้าง Policy อนุญาตทุกคนอ่าน/เขียน (เพราะใช้ anon key)
CREATE POLICY "Allow all on odi_records" ON odi_records
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all on odi_users" ON odi_users
  FOR ALL USING (true) WITH CHECK (true);

-- 6. สร้าง Index สำหรับค้นหาเร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_records_submitted ON odi_records (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_percentage ON odi_records (percentage);
CREATE INDEX IF NOT EXISTS idx_users_username ON odi_users (username);
