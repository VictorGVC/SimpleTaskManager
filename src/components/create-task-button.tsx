'use client';

import { useState } from 'react';
import { TaskForm } from './task-form';

export function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Nova Tarefa
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <TaskForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      )}
    </>
  );
}
