// client/src/pages/TaskManagerPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { makeAuthenticatedRequest } from '../api/api';
import TaskForm from '../components/TaskForm';
import type { Task } from '../types/task';
import { ListTasks } from '../components/ListTasks';


const TaskManagerPage: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(0)
  const [pages, setPages] = useState<number>(0)
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    setTasksError(null);
    interface TaskData {
      task: Task[];
      number_of_pages: number;
      page: number;
    }
    const result = await makeAuthenticatedRequest<TaskData>('/tasks', 'GET');
    if (result.success && result.data) {
      console.log(result.data)
      console.log(result.data);
      setTasks(result.data.task);
      setNumberOfPages(result.data.number_of_pages);
      setPages(result.data.page);
    } else {
      setTasksError(result.error || 'Failed to fetch tasks.');
      if (result.error?.includes('token') || result.error?.includes('Authentication')) {
        logout(); // Logout if token is invalid/expired
      }
    }
    setLoadingTasks(false);
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  // Handle Add/Update Task
  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'user' | 'userId'>) => {
    setFormLoading(true);
    setFormError(null);
    let result;
    if (editingTask) {
      // Update existing task
      result = await makeAuthenticatedRequest<Task>(`/task/${editingTask.id}`, 'PUT', taskData);
    } else {
      // Add new task
      result = await makeAuthenticatedRequest<Task>('/task', 'POST', taskData);
    }

    if (result.success) {
      setIsAddingTask(false);
      setEditingTask(undefined);
      fetchTasks(); // Refresh tasks
    } else {
      setFormError(result.error || 'Failed to save task.');
      if (result.error?.includes('token') || result.error?.includes('Authentication')) {
        logout();
      }
    }
    setFormLoading(false);
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    setLoadingTasks(true); // Show loading while deleting
    const result = await makeAuthenticatedRequest<any>(`/tasks/${taskId}`, 'DELETE');
    if (result.success) {
      fetchTasks(); // Refresh tasks
    } else {
      setTasksError(result.error || 'Failed to delete task.');
      if (result.error?.includes('token') || result.error?.includes('Authentication')) {
        logout();
      }
    }
    setLoadingTasks(false);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsAddingTask(true); // Open form in edit mode
  };

  const handleCancelEdit = () => {
    setEditingTask(undefined);
    setIsAddingTask(false);
  };

  if (!isAuthenticated) {
    return <p className="text-center text-gray-400 mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-400">
            {username}'s Task Manager
          </h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>

        {/* <div className="mb-8"> */}
        {!isAddingTask && !editingTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
          // className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Add New Task
          </button>
        ) : (
          <TaskForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={handleCancelEdit}
            loading={formLoading}
            error={formError}
          />
        )}
        {/* </div> */}
        <ListTasks currentTasks={tasks} page={pages} totalPages={numberOfPages} fetchTasks={fetchTasks}/>
      </div>
    </div>
  );
};

export default TaskManagerPage;