import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create database if it doesn't exist
try {
  console.log('Creating database...');

  // Check platform and use appropriate command
  const isWindows: boolean = process.platform === 'win32';
  
  // Set password environment variable
  process.env.PGPASSWORD = process.env.PG_PASSWORD || 'postgres';

  if (isWindows) {
    execSync(`psql -U postgres -c "CREATE DATABASE online_store_dev;"`, { stdio: 'inherit', shell: true as any });
  } else {
    execSync(`createdb -U postgres online_store_dev`, { stdio: 'inherit' });
  }

  console.log('Database created successfully');
} catch (error: any) {
  console.log('Database might already exist or there was an error creating it');
  console.error(error.message);
}

// Run the seed script
try {
  console.log('Seeding database...');
  execSync('ts-node src/scripts/seed-db.ts', { stdio: 'inherit' });
  console.log('Database setup complete!');
} catch (error: any) {
  console.error('Error seeding database:', error.message);
  process.exit(1);
}
