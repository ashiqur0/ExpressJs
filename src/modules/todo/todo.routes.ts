import express from 'express';
import { todoController } from './todo.controller';
import { todo } from 'node:test';

const router = express.Router();

router.post('/', todoController.createTodo);
router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getSingleTodo);
router.put('/:id', todoController.updateTodo);

export const todoRouter = router;