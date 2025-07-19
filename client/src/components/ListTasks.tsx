import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { FloatingModal } from "./FloatingModal";
import { type Task } from '../types/task';
import { EditModal } from "./EditModal";
import { makeAuthenticatedRequest } from "../api/api";
import { useAuth } from "../context/AuthContext";


export type FetchTasksFunction = () => Promise<void>;

interface TaskProps {
    currentTasks: Task[];
    totalPages: number;
    page: number;
    fetchTasks: any;
}

export const ListTasks: React.FC<TaskProps> = ({ currentTasks, totalPages, page, fetchTasks }) => {
    const { logout } = useAuth();
    const [selectedTask, setSelectedTask] = useState<Task | null>();
    const [editingTask, setEditingTask] = useState<Task | null>();
    const [currentPage, setCurrentPage] = useState(page);

    const handleDelete = async (deletetasks: Task) => {
        if (!window.confirm('Are you sure you want to delete this task?')) {
            return;
        }
        interface Result {
            message: string;
        }
        const result = await makeAuthenticatedRequest<Result>(`/task/${deletetasks.id}`, 'DELETE');
        if (result.success) {
            fetchTasks();
            setSelectedTask(null);
        } else {
            alert(result.error || 'Failed to delete task.');
            if (result.error?.includes('token') || result.error?.includes('Authentication')) {
                logout();
            }
        }

    };

    const handleUpdate = async (e: Task) => {
        interface Result {
            message: string;
            token: string;
            userId: string;
            username: string;
        }
        let result = await makeAuthenticatedRequest<Result>(`/task/${e.id}`, "PUT", e);
        if (result.success) {
            alert(`${e.id} has been updated`);
        } else {
            alert(`Error updating ${e.id}: ${result.error}`);
        }
        setEditingTask(null);
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-blue-100 p-4 sm:p-6 flex flex-col items-center">
            <div className="w-full max-w-xl bg-white shadow rounded-xl p-4 sm:p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Your Tasks</h2>

                {currentTasks.length === 0 ? (
                    <p className="text-center text-gray-500">No tasks</p>
                ) : (
                    <ul className="space-y-3 mb-4">
                        {currentTasks.map((task) => (
                            <li
                                key={task.id}
                                className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                                onClick={() => setSelectedTask(task)}
                            >
                                <span>{task.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingTask(task);
                                    }}
                                    className="text-blue-500 hover:text-blue-700"
                                    title="Edit task"
                                >
                                    <Pencil size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => {
                                setCurrentPage(currentPage - 1);
                                fetchTasks(currentPage + 1)
                            }}
                            className="p-2 rounded-full border hover:bg-gray-200 disabled:opacity-30"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="text-gray-600 text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => {
                                setCurrentPage(currentPage + 1);
                                fetchTasks(currentPage + 1)
                            }}
                            className="p-2 rounded-full border hover:bg-gray-200 disabled:opacity-30"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                )}
            </div>

            {/* View Modal */}
            {selectedTask && (
                <FloatingModal onClose={() => setSelectedTask(null)}>
                    <h3 className="text-xl text-black font-semibold mb-2">{selectedTask.title}</h3>
                    <p className="text-gray-700 mb-4">{selectedTask.description}</p>
                    <p>Status: {selectedTask.status.split("_")}</p>
                    <p>Tag: {selectedTask.tag?.split(",").map(val => `#${val} `)}</p>
                    {/* ts-ignore */}
                    <p>DueDate: {selectedTask.dueDate as unknown as String}</p>
                    <p>Priority: {selectedTask.priority}</p>
                    <div className="flex justify-end gap-2" style={{ display: 'flex', gap: "10px" }}>
                        <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDelete(selectedTask)}
                        >
                            Delete
                        </button>
                        <button
                            className="text-gray-700 hover:underline"
                            onClick={() => setSelectedTask(null)}
                        >
                            Close
                        </button>
                    </div>
                </FloatingModal>
            )}

            {/* Edit Modal */}
            {editingTask && (
                <EditModal
                    task={editingTask}
                    onClose={() => {
                        fetchTasks();
                        setEditingTask(null);
                    }
                    }
                    onSave={(e: Task) => {
                        handleUpdate(e)
                        fetchTasks()
                    }}
                />
            )}
        </div>
    )
}