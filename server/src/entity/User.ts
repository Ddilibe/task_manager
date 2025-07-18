import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";
import * as bcrypt from "bcryptjs";


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    password!: string;

    @Column({ unique: true })
    emailAddress!: string;


    @OneToMany(() => Task, task => task.user)
    tasks!: Task[];

    async hashPassword(password: string): Promise<void> {
        this.password = await bcrypt.hash(password, 10);
    }

    async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}