import { TRPCProvider } from '../src/providers/trpc-provider';
import { TaskList } from '../src/components/task-list';
import { CreateTaskButton } from '../src/components/create-task-button';
import { taskStorage } from '../src/server/storage';

async function getTasks() {
  try {
    return taskStorage.getAll();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export default async function Home() {
  const initialTasks = await getTasks();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Tarefas</h1>
          <CreateTaskButton />
        </div>
        
        <TRPCProvider>
          <TaskList initialTasks={initialTasks} />
        </TRPCProvider>
      </div>
    </main>
  );
}
