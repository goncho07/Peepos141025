import { create } from 'zustand';
import { directorTaskItems as initialTasks } from '@/data/dashboard';

export interface Task {
  id: number;
  text: string;
  status: 'Completo' | 'En progreso' | 'Pendiente';
  priority: 'high' | 'medium' | 'low';
}

interface TaskState {
  tasks: Task[];
  toggleTaskStatus: (taskId: number) => void;
  addTask: (text: string, priority: Task['priority']) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
  
  toggleTaskStatus: (taskId: number) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === 'Completo' ? 'Pendiente' : 'Completo' }
          : task
      ),
    })),

  addTask: (text, priority) =>
    set((state) => {
        if (!text.trim()) return state;
        const newTask: Task = {
            id: Math.max(0, ...state.tasks.map(t => t.id)) + 1,
            text,
            priority,
            status: 'Pendiente',
        };
        return {
            tasks: [...state.tasks, newTask],
        };
    }),
}));
