import { IBaseTask, TaskStatus, TaskType } from "./task.model";
import { TaskDto } from "./taskDto";

export class ImplementationTask implements IBaseTask{
  id: string;
  title: string;
  difficulty: number;
  status: TaskStatus;
  assignToUser: string | undefined;

  description: string;

  constructor(id: string, title: string, difficulty: number, status: TaskStatus, assignToUser: string | undefined, description: string){
    this.id = id;
    this.title = title;
    this.difficulty = difficulty;
    this.status = status;
    this.assignToUser = assignToUser;
    this.description = description;
  }

  getTaskType(): TaskType {
    return TaskType.Implementation;
  }

toDto(): TaskDto {
    const taskDto = new TaskDto(this.id, this.title, this.difficulty, TaskType.Maintenance, this.status, this.assignToUser);
    taskDto.servers = this.description;
    return taskDto;
  }
}