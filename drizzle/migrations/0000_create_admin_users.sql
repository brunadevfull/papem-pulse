CREATE TABLE IF NOT EXISTS "admin_users" (
  "id" serial PRIMARY KEY NOT NULL,
  "username" varchar(255) NOT NULL,
  "email" varchar(255),
  "password_hash" varchar(255) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_username_unique" ON "admin_users" ("username");
