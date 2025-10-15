-- Atualiza a senha do administrador padrão para tel@p@pem2025
UPDATE "admin_users"
SET
  "email" = COALESCE("email", 'admin@papem.mil.br'),
  "password_hash" = '$2b$12$y.rYwSucyyIv1eu0WxOYhujbcw63NhmQKjCy07IuSWa/vIOKtC3Lq',
  "updated_at" = NOW()
WHERE "username" = 'admin';
