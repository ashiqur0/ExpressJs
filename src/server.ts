import express, { NextFunction, Request, Response } from 'express';
import config from './config';
import initDb from './config/db';
import logger from './middleware/logger';
import { userRouter } from './modules/user/user.routes';
import { todoRouter } from './modules/todo/todo.routes';

const port = config.port || 5000;
const app = express();
app.use(express.json()); // parser for json data

// initialize database
initDb();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next Level Developer!');
});

app.use('/users', userRouter);
app.use('/todos', todoRouter);

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