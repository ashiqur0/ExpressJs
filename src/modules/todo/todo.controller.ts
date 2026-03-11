import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodo = async (req: Request, res: Response) => {
    const { user_id, title } = req.body;
    try {
        const result = await todoService.createTodo(user_id, title);

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
}

const getAllTodos = async (req: Request, res: Response) => {
    try {
        const result = await todoService.getAllTodos();

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
}

const getSingleTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await todoService.getSingleTodo(id as string);

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
}

const updateTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user_id, title } = req.body;
    try {
        const result = await todoService.updateTodo(id as string, user_id, title);

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
}

const deleteTodo = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await todoService.deleteTodo(id as string);

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
}

export const todoController = {
    createTodo,
    getAllTodos,
    getSingleTodo,
    updateTodo,
    deleteTodo
}