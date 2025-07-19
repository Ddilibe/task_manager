import { Request, Response } from "express";
import { userRepository } from "../source";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
    const { username, firstName, lastName, password, emailAddress } = req.body;

    if (!username || !firstName || !lastName || !password || !emailAddress) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const existingUser = await userRepository.findOne({ where: [{ username }, { emailAddress }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Username or email already exists.' });
        }

        const user = new User();
        user.username = username;
        user.firstName = firstName;
        user.lastName = lastName;
        user.emailAddress = emailAddress;
        await user.hashPassword(password);

        await userRepository.save(user);
        res.status(201).json({ message: 'User registered successfully!', userId: user.id });
    } catch (error: any) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: 'Failed to register user.', error: error.message });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        const user = await userRepository.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful!', userId: user.id, username: user.username, token: token });
    } catch (error: any) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: 'Failed to login.', error: error.message });
    }
};