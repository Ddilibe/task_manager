import { URL } from "url";
import { Task, TaskPriority, TaskStatus } from "../entity/Task";
import { taskRepository, userRepository } from "../source";
import { Request, Response } from "express";


export const CreateTask = async (req: Request, res: Response) => {
    const { title, description, status, tag, dueDate, priority } = req.body;
    const userId = req.userId as string;

    if (!title || !userId || !dueDate) {
        return res.status(400).json({ message: 'Title, userId, and dueDate are required for a task.' });
    }

    try {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const task = new Task();
        task.title = title;
        task.description = description || null;
        task.status = status || TaskStatus.PENDING;
        task.tag = tag || null;
        task.dueDate = new Date(dueDate);
        task.priority = priority || TaskPriority.MEDIUM;
        task.user = user;
        task.userId = userId;

        await taskRepository.save(task);
        res.status(201).json({ message: 'Task created successfully!', taskId: task.id });
    } catch (error: any) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: 'Failed to create task.', error: error.message });
    }
};

export const getTask = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    // const page = req.params.page as unknown as number;
    const baseurl = `${req.protocol}://${req.host}${req.originalUrl}`
    const phrased = new URL(baseurl);
    const page = phrased.searchParams.get("page") as unknown as number;

    try {
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['tasks'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if (page && page > 1) {
            if ((page - 1) * 10 < user.tasks.length) {
                let length = (page - 1) * 10;
                let data = user.tasks.slice(length, length + 10);
                let number_of_pages = user.tasks.length / 10 < 1 ? 1 : Math.ceil(user.tasks.length / 10);
                return res.status(200).json({ task: data, page: page + 1, number_of_pages: number_of_pages })
            }
        }
        let data = user.tasks.slice(0, 10);
        let number_of_pages = user.tasks.length / 10 < 1 ? 1 : Math.ceil(user.tasks.length / 10);
        return res.status(200).json({ task: data, page: 1, number_of_pages: number_of_pages });
    } catch (error: any) {
        console.error(`Error fetching tasks for user ${userId}:`, error);
        res.status(500).json({ message: 'Failed to fetch tasks.', error: error.message });
    }
}

export const getSingleTask = async (req: Request, res: Response) => {
    const taskId = req.taskId;
    const userId = req.userId;
    try {
        const user = await userRepository.findOne({
            where: { id: userId },
            relations: ['tasks'],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const task = await taskRepository.findOneBy({ id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        return res.status(200).json(task);
    } catch (error: any) {
        console.error(`Error updating task ${taskId}:`, error);
        res.status(500).json({ message: 'Failed to get single task', error: error.message });
    }
}

export const updateTask = async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const taskId = req.taskId;
    const { title, description, status, tag, dueDate, priority } = req.body;

    try {
        const task = await taskRepository.findOneBy({ id: taskId, userId: userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status !== undefined ? status : task.status;
        task.tag = tag !== undefined ? tag : task.tag;
        task.dueDate = dueDate !== undefined ? new Date(dueDate) : task.dueDate;
        task.priority = priority !== undefined ? priority : task.priority;

        await taskRepository.save(task);
        res.status(200).json({ message: 'Task updated successfully!' });
    } catch (error: any) {
        console.error(`Error updating task ${taskId}:`, error);
        res.status(500).json({ message: 'Failed to update task.', error: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    const taskId = req.params.taskId as string;
    const userId = req.userId as string;
    try {
        const task = taskRepository.findOneBy({ id: taskId, userId: userId })
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        const result = await taskRepository.delete(taskId);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task deleted successfully!' });
    } catch (error: any) {
        console.error(`Error deleting task ${taskId}:`, error);
        res.status(500).json({ message: 'Failed to delete task.', error: error.message });
    }
};