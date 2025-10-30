import { defineConfig } from '@prisma/config';
import 'dotenv/config';

export default defineConfig({
  schema: './prisma/schema.prisma', // ✅ Always use relative path with './'
  migrations: {
    path: './prisma/migrations', // ✅ Also include './' prefix
  },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL || '', // ✅ Direct env call (no env() helper)
  },
});
