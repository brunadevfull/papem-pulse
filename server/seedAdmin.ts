import 'dotenv/config';
import { db, closeConnection } from './db';
import { adminUsers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from './utils/bcrypt';

async function main() {
  const username = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin').trim();
  const email = process.env.ADMIN_EMAIL?.trim() || null;
  const rawPassword = process.env.ADMIN_PASSWORD;
  const cost = Number.parseInt(process.env.ADMIN_BCRYPT_COST ?? '12', 10);

  if (!rawPassword) {
    console.error('❌ ADMIN_PASSWORD must be provided to seed the admin user.');
    process.exit(1);
  }

  if (Number.isNaN(cost) || cost < 4 || cost > 31) {
    console.error('❌ ADMIN_BCRYPT_COST must be a number between 4 and 31.');
    process.exit(1);
  }

  try {
    const passwordHash = await hashPassword(rawPassword, cost);

    const existing = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);

    if (existing.length > 0) {
      await db
        .update(adminUsers)
        .set({
          email,
          passwordHash,
          updatedAt: new Date(),
        })
        .where(eq(adminUsers.id, existing[0].id));

      console.log(`✅ Updated credentials for admin user "${username}".`);
    } else {
      await db.insert(adminUsers).values({
        username,
        email,
        passwordHash,
      });

      console.log(`✅ Created admin user "${username}".`);
    }
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
    process.exitCode = 1;
  } finally {
    await closeConnection();
  }
}

main();
