// Load environment variables before any other imports
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { Sequelize, Dialect } from 'sequelize';
import config from './database';

const env: string = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config];

// Log database connection details
console.log('Database configuration:', {
  username: dbConfig.username,
  database: dbConfig.database,
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  password: dbConfig.password ? '***' : 'undefined'
});

// Check if password is set
if (!dbConfig.password) {
  console.error('Database password is not defined');
}

import { Pool } from 'pg';

// Create a direct PostgreSQL connection
const createPgConnection = async () => {
  console.log('Attempting direct PostgreSQL connection...');
  
  // Get port from environment or use default
  const port = (dbConfig as any).port || 5432;
  
  // Try multiple connection methods
  const connectionMethods: any[] = [
    // Method 1: Standard password authentication
    {
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: String(dbConfig.password || ''),
      port: port,
      name: 'password authentication'
    },
    // Method 2: Trust authentication (no password)
    {
      user: dbConfig.username,
      host: dbConfig.host,
      database: dbConfig.database,
      password: undefined,
      port: port,
      name: 'trust authentication'
    },
    // Method 3: Connection string without password
    {
      connectionString: `postgres://${dbConfig.username}@${dbConfig.host}:${port}/${dbConfig.database}`,
      name: 'connection string without password'
    }
  ];
  
  // Try each connection method
  for (const method of connectionMethods) {
    try {
      console.log(`Trying ${method.name}...`);
      const pool = new Pool(method);
      const client = await pool.connect();
      console.log(`Successfully connected using ${method.name}`);
      client.release();
      
      // Create Sequelize instance using the successful connection method
      let sequelize;
      if (method.connectionString) {
        sequelize = new Sequelize(method.connectionString, {
          dialect: 'postgres',
          logging: (msg: string) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[Sequelize]:', msg);
            }
          },
          dialectOptions: {
            ssl: false,
            clientMinMessages: 'notice',
            application_name: 'online_store_app'
          }
        });
      } else {
        sequelize = new Sequelize(
          method.database as string,
          method.user as string,
          String(method.password || ''),
          {
            host: method.host,
            port: method.port,
            dialect: 'postgres',
            logging: (msg: string) => {
              if (process.env.NODE_ENV === 'development') {
                console.log('[Sequelize]:', msg);
              }
            },
            dialectOptions: {
              ssl: false,
              clientMinMessages: 'notice',
              application_name: 'online_store_app'
            }
          }
        );
      }
      
      // Test the Sequelize connection
      await sequelize.authenticate();
      console.log('Sequelize connection successful');
      return sequelize;
    } catch (error: any) {
      console.error(`Failed with ${method.name}:`, error.message);
    }
  }
  
  // If all methods fail, create a default Sequelize instance
  console.log('All connection methods failed, creating default Sequelize instance');
  return new Sequelize(
    dbConfig.database || '',
    dbConfig.username || '',
    String(dbConfig.password || ''),
    {
      host: dbConfig.host || '',
      port: (dbConfig as any).port || 5432,
      dialect: (dbConfig.dialect || 'postgres') as Dialect,
      logging: (msg: string) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Sequelize]:', msg);
        }
      },
      dialectOptions: {
        ssl: false,
        clientMinMessages: 'notice',
        application_name: 'online_store_app'
      },
      ...(dbConfig as any).pool ? { pool: (dbConfig as any).pool } : {}
    }
  );
};

// Create a default Sequelize instance immediately
let sequelize = new Sequelize(
  dbConfig.database || '',
  dbConfig.username || '',
  String(dbConfig.password || ''),
  {
    host: dbConfig.host || '',
    port: (dbConfig as any).port || 5432,
    dialect: (dbConfig.dialect || 'postgres') as Dialect,
    logging: (msg: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[Sequelize]:', msg);
      }
    },
    dialectOptions: {
      ssl: false,
      clientMinMessages: 'notice',
      application_name: 'online_store_app'
    },
    ...(dbConfig as any).pool ? { pool: (dbConfig as any).pool } : {}
  }
);

// Try to improve the connection asynchronously
createPgConnection().then(instance => {
  // If a better connection is found, replace the default one
  sequelize = instance;
  console.log('Database connection improved');
}).catch(err => {
  console.error('Failed to improve database connection, using default:', err);
});

export { sequelize };
