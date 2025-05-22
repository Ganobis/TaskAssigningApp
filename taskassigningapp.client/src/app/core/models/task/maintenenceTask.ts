import { IBaseTask, TaskStatus, TaskType } from "./task.model";
import { TaskDto } from "./taskDto";

export class MaintenanceTask implements IBaseTask{
  id: string;
  title: string;
  difficulty: number;
  status: TaskStatus;
  assignToUser: string | undefined;

  services: string;
  servers: string;

  constructor(id: string, title: string, difficulty: number, status: TaskStatus, assignToUser: string | undefined, services: string, servers: string){
    this.id = id;
    this.title = title;
    this.difficulty = difficulty;
    this.status = status;
    this.assignToUser = assignToUser;
    this.services = services;
    this.servers = servers;
  }

  getTaskType(): TaskType {
    return TaskType.Maintenance;
  }

  toDto(): TaskDto {
    const taskDto = new TaskDto(this.id, this.title, this.difficulty, TaskType.Maintenance, this.status, this.assignToUser);
    taskDto.servers = this.servers;
    taskDto.services = this.services;
    return taskDto;
  }
}