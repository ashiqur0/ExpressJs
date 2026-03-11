import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;

  fs.writeFileSync('./src/logs.txt', log, { flag: 'a' });

  next();
}

export default logger;