import { useState } from "react";
import { FloatingModal } from "./FloatingModal";
import { TaskPriority, TaskStatus, type Task } from "../types/task";

interface EditModalProps {
    task: Task;
    onClose: any;
    onSave: (updated: Task) => void;
}

export function EditModal({ task, onClose, onSave }: EditModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || '');
    const [status, setStatus] = useState(task.status || TaskStatus.PENDING);
    const [tag, setTag] = useState(task?.tag || '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);
    let four = 4;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ ...task, title, description });
    };



    return (
        <FloatingModal onClose={onClose}>
            <h3 className="text-xl font-semibold mb-4">Edit Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <textarea
                    className="w-full px-4 py-2 border rounded focus:outline-none"
                    rows={four}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task details"
                />
                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="status">
                        Status
                    </label>
                    <select
                        id="status"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    >
                        {Object.values(TaskStatus).map((s) => (
                            <option key={s} value={s}>
                                {s.replace(/_/g, ' ').toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="tag">
                        Tag
                    </label>
                    <input
                        type="text"
                        id="tag"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="dueDate">
                        Due Date
                    </label>
                    <input
                        type="date"
                        id="dueDate"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="priority">
                        Priority
                    </label>
                    <select
                        id="priority"
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    >
                        {Object.values(TaskPriority).map((p) => (
                            <option key={p} value={p}>
                                {p.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="text-gray-600 hover:underline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </FloatingModal>
    );
}