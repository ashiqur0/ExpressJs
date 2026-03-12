import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await authServices.loginUser(email, password);
        res.status(201).send({
            success: true,
            message: 'Login successful',
            data: result
        });
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: 'Login failed',
            error: error.message
        })
    }
}

export const authController = {
    loginUser
}