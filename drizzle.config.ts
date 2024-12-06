import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement

export default defineConfig({
  out: './drizzle',
  schema: './server/database/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
