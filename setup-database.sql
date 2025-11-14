-- Script de configuração inicial do banco de dados para usuários administradores
-- Garante a existência do usuário padrão "admin" com senha "pco2025"
-- A senha é armazenada utilizando hash bcrypt (custo 12)

INSERT INTO admin_users (username, email, password_hash, created_at, updated_at)
VALUES (
    'admin',
    NULL,
    '$2b$12$3.p4JnP9sApX1TRGJ7aWyOsnVsxG5u0gNbRKSL546tRx7Eq6nvzFu',
    NOW(),
    NOW()
)
ON CONFLICT (username) DO UPDATE
SET
    email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();
