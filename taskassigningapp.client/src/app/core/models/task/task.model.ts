import { TaskDto } from "./taskDto";

export enum TaskStatus {
  Done = 'Done',
  ToDo = 'ToDo'
}

export enum TaskType {
  Deployment = 'Deployment',
  Implementation = 'Implementation',
  Maintenance = 'Maintenance'
}

export interface IBaseTask{
  id: string;
  title: string;
  difficulty: number;
  status: TaskStatus;
  assignToUser: string | undefined;

  getTaskType(): TaskType;
  toDto(): TaskDto;
}

export { TaskDto };
