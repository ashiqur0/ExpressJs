import express, { NextFunction, Request, Response } from 'express';

import fs from 'fs';
import config from './config';
import initDb, { pool } from './config/db';

const port = config.port || 5000;
const app = express();
app.use(express.json()); // parser for json data

initDb();

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;

  fs.writeFileSync('./src/logs.txt', log, { flag: 'a' });

  next();
}

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next Level Developer!');
});

// users CRUD
app.post('/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *`,
      [name, email]
    );

    res.status(201).json({
      success: true,
      message: 'Data inserted successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    })
  }
});

app.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: result.rows[0]
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: result.rows[0]
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: result.rows
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// todos CRUD
app.post('/todos', async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO todos(user_id, title) VALUES ($1, $2) RETURNING *`,
      [user_id, title]
    );

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
});

app.get('/todos', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: result.rows
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    })
  }
});

app.get('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM todos WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Todo retrieved successfully',
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    })
  }
});

app.put('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(`UPDATE todos SET user_id=$1, title=$2 WHERE id=$3 RETURNING *`,
      [user_id, title, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Todo not found",
        data: result.rows
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Todo updated successfully',
        data: result.rows[0]
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    })
  }
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: 'Todo not found',
        data: result.rows
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Todo delelted successfully',
        data: result.rows
      })
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error
    })
  }
});

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});