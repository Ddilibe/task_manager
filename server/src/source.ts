import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Task } from "./entity/Task";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Task],
    migrations: [],
    subscribers: [],
});

AppDataSource.initialize().then(() => {
    console.log("DataSource have been initialized");
}).catch((error) => {
    console.error("Error during Data Source initialization:", error)
});
export const userRepository = AppDataSource.getRepository(User);
export const taskRepository = AppDataSource.getRepository(Task);