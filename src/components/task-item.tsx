'use client';

import { useState } from 'react';
import { Task } from '@/src/server/types';
import { trpc } from '../trpc/trpc';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (updatedTask: Task) => void;
}

export function TaskItem({ task, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    titulo: task.titulo,
    descricao: task.descricao || '',
  });
  const [error, setError] = useState<string | null>(null);

  const updateTask = trpc.task.update.useMutation();

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      titulo: task.titulo,
      descricao: task.descricao || '',
    });
    setError(null);
  };

  const handleSave = async () => {
    if (!editForm.titulo.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      const result = await updateTask.mutateAsync({
        id: task.id,
        data: {
          titulo: editForm.titulo.trim(),
          descricao: editForm.descricao.trim() || undefined,
        },
      });

      if (result.success) {
        setError(null);
        setIsEditing(false);
        onUpdate({
          ...task,
          titulo: editForm.titulo.trim(),
          descricao: editForm.descricao.trim() || undefined,
        });
      }
    } catch (error) {
      setError('Erro ao atualizar tarefa');
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDelete(task.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={editForm.titulo}
              onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título da tarefa"
            />
          </div>
          
          <div>
            <textarea
              value={editForm.descricao}
              onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descrição (opcional)"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateTask.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateTask.isPending ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.titulo}</h3>
          {task.descricao && (
            <p className="text-gray-600 mb-2">{task.descricao}</p>
          )}
          <p className="text-sm text-gray-400">
            Criado em {formatDate(task.dataCriacao)}
          </p>
        </div>
        
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleEdit}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
