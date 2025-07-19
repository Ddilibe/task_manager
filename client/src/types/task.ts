

// @ts-ignore
export enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    DONE = "done",
}
// @ts-ignore
export enum TaskPriority {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    tag: string | null;
    dueDate: Date;
    priority: TaskPriority;
    userId: string;
}