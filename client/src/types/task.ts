// client/src/types/task.ts

// Must match the enums in your backend Task entity
export enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    DONE = "done",
}

export enum TaskPriority {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
}

// Interface for Task entity (matching backend's response structure)
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