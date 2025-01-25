import express from 'express';
import { getToken } from './signer.js';
import config from './config.js';
import pg from 'pg';
import fs from 'fs';

let pool;

console.log(config)

// Initialize the PostgreSQL connection pool
async function initializePool() {
  console.log('initializePool');
  pool = new pg.Pool({
    host: config.RDS_LOCAL_HOST || config.RDS_REMOTE_HOST,
    port: Number(config.RDS_LOCAL_PORT || config.RDS_REMOTE_PORT),
    database: config.RDS_DATABASE,
    user: config.RDS_USER,
    password: await getToken(),
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('global-bundle.pem'),
    },
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Timeout for acquiring a connection
  });
  console.log(pool)
}

// Start the app and server
async function startApp() {
  await initializePool();

  const app = express();

  app.get('/', (req, res) => {
    res.status(200).send('OK');
  });

  // Endpoint to query PostgreSQL
  app.get('/todolist', async (req, res) => {
    console.log('/todolist');
    try {
      const client = await pool.connect(); // Get a client from the pool
      try {
        const result = await client.query('SELECT * FROM todolist');
        res.json(result.rows); // Return the results as JSON
      } finally {
        client.release(); // Release the client back to the pool
      }
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Start the server
  app.listen(config.PORT, () => {
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
  });
}

startApp().catch((error) => {
  console.error('Error starting the app:', error);
});
