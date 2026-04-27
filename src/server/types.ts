import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string(),
  titulo: z.string().min(1, 'O título é obrigatório'),
  descricao: z.string().optional(),
  dataCriacao: z.date(),
});

export const TaskInputSchema = z.object({
  titulo: z.string().min(1, 'O título é obrigatório'),
  descricao: z.string().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export type TaskInput = z.infer<typeof TaskInputSchema>;
