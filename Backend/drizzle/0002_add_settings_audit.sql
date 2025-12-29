-- Add settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id INTEGER,
  details TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add timestamps to existing tables
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Insert default settings
INSERT INTO settings (key, value) VALUES
  ('shop_name', 'Bashir Flour Shop'),
  ('shop_name_urdu', 'بشیر آٹے کی دکان'),
  ('whatsapp_number', '+923001234567'),
  ('phone_number', '+92421234567'),
  ('email', 'info@bashirflour.com'),
  ('address_en', '123 Main Street, Lahore, Pakistan'),
  ('address_urdu', '123 مرکزی سڑک، لاہور، پاکستان'),
  ('working_hours', '9:00 AM - 10:00 PM (Monday - Sunday)'),
  ('enable_whatsapp_button', 'true'),
  ('enable_online_orders', 'false'),
  ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- Create admin user if not exists (password: basheer111)
INSERT INTO users (username, password, role) 
VALUES ('basheer000@gmail.com', '$2b$10$YourHashedPasswordHere', 'admin')
ON CONFLICT (username) DO NOTHING;