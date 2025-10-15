-- Script de configuração inicial do banco de dados para usuários administradores
-- Garante a existência do usuário padrão "admin" com senha "pco2025"
-- A senha é armazenada no formato salt:hash (compatível com bcrypt)

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
