-- Ensure default admin user exists for authentication
INSERT INTO admin_users (username, email, password_hash, created_at, updated_at)
VALUES (
  'admin',
  'admin@papem.local',
  '$2b$12$laxHbR.42vWvvqDpZLiaCu:QtC5KZMVuK5Jg/4BtzZvUH0fVf/CpoO',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO UPDATE
SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
