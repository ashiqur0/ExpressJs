import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const port = 5000;
app.use(express.json()); // parser for json data

// Database connection configuration
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_z9ZKYpae5vGU@ep-holy-mode-adjqzui6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXITSTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      age INT,
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Next Level Developer!');
});

app.post('/', (req: Request, res: Response) => {
  console.log(req.body);

  res.status(201).json({
    success: true,
    message: 'simple post api created'
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});