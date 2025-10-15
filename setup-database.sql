-- Atualiza ou insere o usuário administrador padrão com a senha tel@p@pem2025
-- Hash armazenado no formato salt:hash usando bcrypt (Blowfish, cost=12)
INSERT INTO admin_users (username, email, password_hash)
VALUES (
  'admin',
  'admin@papem.mil.br',
  '$2b$12$y.rYwSucyyIv1eu0WxOYhujbcw63NhmQKjCy07IuSWa/vIOKtC3Lq'
)
ON CONFLICT (username) DO UPDATE
SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
