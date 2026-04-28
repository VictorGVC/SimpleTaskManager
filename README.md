# Simple Task Manager

Um sistema simples de gerenciamento de tarefas construído com Next.js v16, TypeScript, e tRPC. Esta aplicação demonstra uma arquitetura full-stack moderna com validação de dados, tratamento de erros, e uma experiência de usuário responsiva.

## 🚀 Funcionalidades

### Funcionalidades Principais
- ✅ **CRUD Completo**: Criar, listar, atualizar e deletar tarefas
- 🎯 **Validação Robusta**: Validação no backend e frontend com Zod
- 🔄 **Server-Side Rendering**: Pré-carregamento de dados para melhor performance
- 🎨 **Interface Responsiva**: Design limpo e moderno com Tailwind CSS
- ⚡ **Feedback Visual**: Mensagens de sucesso/erro e estados de carregamento
- 📝 **Edição Inline**: Edição de tarefas diretamente na lista sem navegação
- 🔄 **Otimimização de Estado**: Atualizações locais imediatas com sincronização via refetch

### Funcionalidades Bônus
- 📜 **Infinite Scroll**: Carregamento incremental de tarefas (10 por página) conforme o usuário rola a página
- 🔧 **Type Safety**: TypeScript em toda a aplicação

## 🛠️ Stack

- **Frontend**: Next.js v16.2.4, React 19.2.4, TypeScript 5, Tailwind CSS v4.2.4
- **Backend**: tRPC v11.16.0, Zod v4.3.6 (validação), SuperJSON v2.2.6 (serialização)
- **State Management**: TanStack React Query v5.100.5
- **Storage**: In-memory (sem persistência em banco de dados)
- **Testing**: Jest v30.3.0, ts-jest v29.4.9

## 🚀 Inicializando

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/VictorGVC/SimpleTaskManager.git
cd simple-task-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

**Deploy no vercel:** [https://simple-task-manager-sooty.vercel.app/](https://simple-task-manager-sooty.vercel.app/)

## 📖 Como Usar

### Criar uma Tarefa
1. Clique no botão "Nova Tarefa"
2. Preencha o título (obrigatório) e descrição (opcional)
3. Clique em "Criar"
4. A página será recarregada para exibir a nova tarefa

### Editar uma Tarefa
1. Clique no botão "Editar" na tarefa desejada
2. Modifique os campos necessários
3. Clique em "Salvar" ou "Cancelar"
4. A atualização é refletida imediatamente na interface

### Excluir uma Tarefa
1. Clique no botão "Excluir" na tarefa desejada
2. Confirme a exclusão no diálogo
3. A lista é atualizada automaticamente com mensagem de sucesso

### Infinite Scroll
- Role a página para baixo para carregar mais tarefas automaticamente
- A aplicação exibe 10 tarefas por vez para melhor performance

## 🔧 API Endpoints

A aplicação utiliza tRPC com os seguintes procedimentos:

### `task.getAll`
- **Tipo**: Query
- **Descrição**: Retorna todas as tarefas
- **Retorno**: `{ success: boolean, data: Task[] }`

### `task.create`
- **Tipo**: Mutation
- **Descrição**: Cria uma nova tarefa
- **Input**: `{ titulo: string, descricao?: string }`
- **Retorno**: `{ success: boolean, data: Task }`

### `task.update`
- **Tipo**: Mutation
- **Descrição**: Atualiza uma tarefa existente
- **Input**: `{ id: string, data: Partial<{ titulo: string, descricao: string }> }`
- **Retorno**: `{ success: boolean, data: Task }`

### `task.delete`
- **Tipo**: Mutation
- **Descrição**: Exclui uma tarefa
- **Input**: `{ id: string }`
- **Retorno**: `{ success: boolean, message: string }`

## 🎯 Modelo de Dados

### Task
```typescript
interface Task {
  id: string;           // ID único gerado automaticamente
  titulo: string;       // Título (obrigatório)
  descricao?: string;    // Descrição (opcional)
  dataCriacao: Date;    // Data de criação
}
```

## 🛡️ Validação

### Backend (Zod)
- Título obrigatório e não vazio
- Validação de tipos de dados
- Tratamento de erros significativos

### Frontend
- Validação de formulários antes do envio
- Feedback visual para erros de validação
- Estados de carregamento durante operações assíncronas

## 🔄 Fluxo de Dados

1. **SSR**: A página inicial carrega as tarefas no servidor usando `TaskService.getAll()`
2. **Cliente**: tRPC Client mantém o cache sincronizado com React Query
3. **Criação**: Após criar uma tarefa, a página é recarregada para exibir a nova tarefa
4. **Atualização**: Edição inline atualiza o estado local imediatamente com os dados do formulário
5. **Exclusão**: Usa `refetch()` para sincronizar a lista após exclusão
6. **Infinite Scroll**: Carregamento progressivo baseado em Intersection Observer API
7. **Otimização de Paginação**: Reset inteligente da paginação apenas quando o número de tarefas muda

## 🧪 Testes

### Executar Testes
Os testes são testes de integração que requerem que o servidor de desenvolvimento esteja rodando.

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Em um terminal separado, execute os testes:
```bash
npm test
```

## 📝 Notas de Implementação

### Decisões de Arquitetura
- **Storage em Memória**: Escolhido para simplicidade, conforme requisitos do desafio
- **Edição Inline**: Melhor UX comparado a navegação para página separada
- **Recarregamento após Criação**: Simplificação para garantir sincronização com SSR
- **Refetch após Exclusão**: Garante consistência de dados entre cliente e servidor
- **Atualização Local**: Edições atualizam estado local imediatamente para feedback instantâneo

### Otimizações
- **Paginação Inteligente**: Reset apenas quando o número de tarefas muda, evitando re-render desnecessário
- **SuperJSON**: Serialização eficiente para preservar tipos Date e outros objetos complexos
- **React Query**: Cache automático e sincronização de dados entre cliente e servidor
