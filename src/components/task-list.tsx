'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { trpc } from '../trpc/trpc';
import { TaskItem } from './task-item';
import { Task } from '@/src/server/types';

interface TaskListProps {
  initialTasks: Task[];
}

const TASKS_PER_PAGE = 10;

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(Array.isArray(initialTasks) ? initialTasks : []);
  const [displayedTasks, setDisplayedTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const prevDataLengthRef = useRef(0);

  const { data, refetch } = trpc.task.getAll.useQuery(undefined, {
    initialData: { success: true, data: Array.isArray(initialTasks) ? initialTasks : [] },
  });

  const deleteTask = trpc.task.delete.useMutation();

  const loadMoreTasks = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    const nextPage = currentPage + 1;
    const startIndex = nextPage * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;
    const nextTasks = tasks.slice(startIndex, endIndex);
    
    if (nextTasks.length > 0) {
      setDisplayedTasks(prev => [...prev, ...nextTasks]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < tasks.length);
    } else {
      setHasMore(false);
    }
    
    setIsLoading(false);
  }, [currentPage, tasks, hasMore, isLoading]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastTaskElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreTasks();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreTasks]);

  useEffect(() => {
    if (data?.success) {
      const currentDataLength = data.data.length;
      const dataLengthChanged = currentDataLength !== prevDataLengthRef.current;
      setTasks(data.data);
      setError(null);
      
      // Only reset pagination when actual tasks are added/deleted
      if (dataLengthChanged) {
        const initialDisplay = data.data.slice(0, TASKS_PER_PAGE);
        setDisplayedTasks(initialDisplay);
        setCurrentPage(0);
        setHasMore(data.data.length > TASKS_PER_PAGE);
      }
      
      prevDataLengthRef.current = currentDataLength;
    }
  }, [data]);

  const handleDeleteTask = async (id: string) => {
    try {
      const result = await deleteTask.mutateAsync({ id });
      if (result.success) {
        setError(null);
        setSuccess('Tarefa excluída com sucesso!');
        setTimeout(() => setSuccess(null), 3000);
        refetch();
      }
    } catch (error) {
      setError('Erro ao deletar tarefa');
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    // Update local state immediately with backend response
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
    setDisplayedTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task));
  };
  
  if (isLoading && displayedTasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando tarefas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      
      {displayedTasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
          <p className="text-gray-400 mt-2">Crie sua primeira tarefa para começar!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedTasks.map((task, index) => (
            <div
              key={task.id}
              ref={index === displayedTasks.length - 1 ? lastTaskElementRef : undefined}
            >
              <TaskItem
                task={task}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
              />
            </div>
          ))}
          
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Carregando mais tarefas...</p>
            </div>
          )}
          
          {!hasMore && displayedTasks.length > 0 && (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">
                {displayedTasks.length} tarefas carregadas
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
