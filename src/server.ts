import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDb, { pool } from './config/db';
import logger from './middleware/logger';
import { userRouter } from './modules/user/user.routes';
import { todoRouter } from './modules/todo/todo.routes';

const port = config.port || 5000;
const app = express();
app.use(express.json()); // parser for json data

initDb();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next Level Developer!');
});

app.use('/users', userRouter);
app.use('/todos', todoRouter);

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