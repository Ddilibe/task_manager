
import React, { useState, useEffect } from 'react';
import { type Task, TaskStatus, TaskPriority } from '../types/task';
import { FloatingModal } from './FloatingModal';

interface TaskFormProps {
    task?: Task; 
    onSave: (task: Omit<Task, 'id' | 'user' | 'userId'>) => Promise<void>;
    onCancel?: () => void; 
    loading: boolean;
    error: string | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSave, onCancel, loading, error }) => {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState<TaskStatus>(task?.status || TaskStatus.PENDING);
    const [tag, setTag] = useState(task?.tag || '');
    const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [priority, setPriority] = useState<TaskPriority>(task?.priority || TaskPriority.MEDIUM);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setStatus(task.status);
            setTag(task.tag || '');
            setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
            setPriority(task.priority);
        }
    }, [task]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave({
            title,
            description: description || null,
            status,
            tag: tag || null,
            dueDate: new Date(dueDate),
            priority,
        });
    };

    return (
        <FloatingModal onClose={""}>
            <h3 className="text-2xl font-bold text-blue-400 text-center mb-4">
                {task ? 'Edit Task' : 'Add New Task'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">

                {error && <p className="text-red-400 text-center mb-4">{error}</p>}

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

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (task ? 'Update Task' : 'Add Task')}
                    </button>
                </div>
            </form>
        </FloatingModal>
    );
};

export default TaskForm;