INSERT INTO "admin_users" ("username", "email", "password_hash", "created_at", "updated_at")
VALUES
  ('admin', NULL, '$2b$12$3.p4JnP9sApX1TRGJ7aWyOsnVsxG5u0gNbRKSL546tRx7Eq6nvzFu', now(), now())
ON CONFLICT ("username") DO UPDATE
SET
  "password_hash" = EXCLUDED."password_hash",
  "updated_at" = now();

UPDATE "admin_users"
SET
  "password_hash" = '$2b$12$3.p4JnP9sApX1TRGJ7aWyOsnVsxG5u0gNbRKSL546tRx7Eq6nvzFu',
  "updated_at" = now()
WHERE "username" = 'admin'
  AND "password_hash" <> '$2b$12$3.p4JnP9sApX1TRGJ7aWyOsnVsxG5u0gNbRKSL546tRx7Eq6nvzFu';
