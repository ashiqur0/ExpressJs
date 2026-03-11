import express, { Request, Response } from 'express';
import initDb from './config/db';
import logger from './middleware/logger';
import { userRouter } from './modules/user/user.routes';
import { todoRouter } from './modules/todo/todo.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();
app.use(express.json()); // parser for json data
app.use(express.urlencoded({ extended: true })); // parser for form data

// initialize database
initDb();

app.get('/', logger, (req: Request, res: Response) => {
  res.send('Hello Next Level Developer!');
});

app.use('/users', userRouter);
app.use('/todos', todoRouter);
app.use('/auth', authRoutes);

// not found route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

export default app;