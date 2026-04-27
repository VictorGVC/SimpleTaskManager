'use client';

import { useState } from 'react';
import { trpc } from '../trpc/trpc';
import { TaskInput } from '../server/types';

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<TaskInput>({
    titulo: '',
    descricao: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  const createTask = trpc.task.create.useMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    
    if (!form.titulo.trim()) {
      setError('O título é obrigatório');
      return;
    }

    try {
      const result = await createTask.mutateAsync({
        titulo: form.titulo.trim(),
        descricao: form.descricao?.trim() || undefined,
      });

      if (result.success) {
        setForm({ titulo: '', descricao: undefined });
        setError(null);
        onSuccess();
      }
    } catch (error) {
      setError('Erro ao criar tarefa');
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Nova Tarefa</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título da tarefa"
            disabled={createTask.isPending}
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite a descrição (opcional)"
            rows={3}
            disabled={createTask.isPending}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={createTask.isPending}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTask.isPending ? 'Criando...' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}
