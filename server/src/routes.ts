import { Router } from "express";
import { CreateTask, deleteTask, getSingleTask, getTask, updateTask } from "./controller/Task";
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { loginUser, registerUser } from "./controller/User";
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;


declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
        taskId?: string;
    }
}


const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Authentication token required.' });
    }

    jwt.verify(token, JWT_SECRET, (err, userPayload) => {
        if (err) {
            console.error("JWT verification failed:", err);
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }

        req.userId = (userPayload as { userId: string }).userId;
        next();
    });
};

// Authentication Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);

// Tasks Endpoints
router.post("/task", authenticateToken, CreateTask);
router.get("/tasks", authenticateToken, getTask);
router.put("/task/:taskId", authenticateToken, updateTask);
router.delete("/task/:taskId", authenticateToken, deleteTask);
router.get("/task/:taskId", authenticateToken, getSingleTask);

export default router;