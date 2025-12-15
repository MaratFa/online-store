const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create database if it doesn't exist
try {
  console.log('Creating database...');
  
  // Check platform and use appropriate command
  const isWindows = process.platform === 'win32';
  
  if (isWindows) {
    execSync('psql -U postgres -c "CREATE DATABASE online_store;"', { stdio: 'inherit', shell: true });
  } else {
    execSync('createdb online_store', { stdio: 'inherit' });
  }
  
  console.log('Database created successfully');
} catch (error) {
  console.log('Database might already exist or there was an error creating it');
  console.error(error.message);
}

// Run the seed script
try {
  console.log('Seeding database...');
  execSync('node src/scripts/seed-db.js', { stdio: 'inherit' });
  console.log('Database setup complete!');
} catch (error) {
  console.error('Error seeding database:', error.message);
  process.exit(1);
}
