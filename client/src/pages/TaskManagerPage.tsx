import "../styles/TaskManager.css";
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { makeAuthenticatedRequest } from '../api/api';
import TaskForm from '../components/TaskForm';
import Header from "../components/Header";
import type { Task } from '../types/task';
import { ListTasks } from '../components/ListTasks';


const TaskManagerPage: React.FC = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [numberOfPages, setNumberOfPages] = useState<number>(0)
  const [pages, setPages] = useState<number>(1);

  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const fetchTasks = useCallback(async (length: number = 1) => {

    interface TaskData {
      task: Task[];
      number_of_pages: number;
      page: number;
    }
    const result = await makeAuthenticatedRequest<TaskData>(`/tasks?page=${length}`, 'GET');
    if (result.success && result.data) {
      setTasks(result.data.task);
      setNumberOfPages(result.data.number_of_pages);
      setPages(result.data.page);
    } else {
      if (result.error?.includes('token') || result.error?.includes('Authentication')) {
        logout(); 
      }
    }
  }, [logout]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated, fetchTasks]);

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'user' | 'userId'>) => {
    setFormLoading(true);
    setFormError(null);
    let result;
    if (editingTask) {
      result = await makeAuthenticatedRequest<Task>(`/task/${editingTask.id}`, 'PUT', taskData);
    } else {
      result = await makeAuthenticatedRequest<Task>('/task', 'POST', taskData);
    }

    if (result.success) {
      setIsAddingTask(false);
      setEditingTask(undefined);
      fetchTasks();
    } else {
      setFormError(result.error || 'Failed to save task.');
      if (result.error?.includes('token') || result.error?.includes('Authentication')) {
        logout();
      }
    }
    setFormLoading(false);
  };


  const handleCancelEdit = () => {
    setEditingTask(undefined);
    setIsAddingTask(false);
  };

  if (!isAuthenticated) {
    return <p className="text-center text-gray-400 mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="" style={{ width: "100%" }}>
      <div className="" style={{ display: "flex", flexDirection: "column", gap: "2em", alignContent: "center", justifyContent: "center" }}>
        <Header username={username as string} />


        {!isAddingTask && !editingTask ? (
          <button
            onClick={() => setIsAddingTask(true)}
            style={{ width: "20%", margin: "0, 100px", alignContent: "center" }}
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
        <ListTasks currentTasks={tasks} page={pages} totalPages={numberOfPages} fetchTasks={fetchTasks} />
      </div>
    </div>
  );
};

export default TaskManagerPage;