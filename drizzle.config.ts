import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/drizzle/schema.ts',
  out: './src/lib/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
});
