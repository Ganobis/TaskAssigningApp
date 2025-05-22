import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDto, UserRole } from '../../core/models/user.model';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { IBaseTask, TaskStatus, TaskType } from '../../core/models/task/task.model';
import { DeploymentTask } from '../../core/models/task/deploymentTask';
import { ImplementationTask } from '../../core/models/task/implementationTask';
import { MaintenanceTask } from '../../core/models/task/maintenenceTask';

@Component({
  selector: 'app-task-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-assign.component.html',
  styleUrl: './task-assign.component.scss'
})
export class TaskAssignComponent implements OnInit {
  TaskType = TaskType; 

  users: UserDto[] = [];
  tasks: (DeploymentTask | ImplementationTask | MaintenanceTask)[] = []

  private selectedUserId: string = '';
  
  get SelectedUserId(): string {
    return this.selectedUserId;
  }  
  set SelectedUserId(selectedUserId : string) {
    this.selectedUserId = selectedUserId;
    this.getAssignedTasks();
  }

  public getDescription(task: IBaseTask): string | undefined {
    if (task.getTaskType() === TaskType.Implementation) {
      return (task as ImplementationTask).description;
    } else if (task.getTaskType() === TaskType.Deployment) {
      return (task as DeploymentTask).description;
    }
    return undefined;
  }

  public getServers(task: IBaseTask): string | undefined {
    return task.getTaskType() === TaskType.Maintenance 
      ? (task as MaintenanceTask).servers 
      : undefined;
  }

  public getServices(task: IBaseTask): string | undefined {
    return task.getTaskType() === TaskType.Maintenance 
      ? (task as MaintenanceTask).services 
      : undefined;
  }

  public getDeadline(task: IBaseTask): Date | undefined {
    return task.getTaskType() === TaskType.Deployment 
      ? (task as DeploymentTask).deadline 
      : undefined;
  }

  selectedUser?: UserDto;
  selectedTasksId: Set<string> = new Set(); 
  selectedTask: (DeploymentTask | ImplementationTask | MaintenanceTask)[] = [];
  assignUserTasks: (DeploymentTask | ImplementationTask | MaintenanceTask)[] = [];
  availibleTasks: (DeploymentTask | ImplementationTask | MaintenanceTask)[] = [];

  message: string = '';
  isLoading: boolean = false;

  constructor(private readonly taskService: TaskService, private readonly userService: UserService){

  }

  ngOnInit(): void {
    this.loadData();
  }

  toggleTaskSecection(taskId: string): void{
    if(this.selectedTasksId.has(taskId)){
      this.selectedTasksId.delete(taskId);
    }
    else{
      this.selectedTasksId.add(taskId);
    }
  }

  assignTask(): void {
    this.message = '';

    const validateMessage = this.vaildateAssignTask();
    if(validateMessage !== undefined){
      this.message = validateMessage;
      return;
    }

    this.taskService.assignTaskToUser(this.selectedUserId, Array.from(this.selectedTasksId)).subscribe({
      next: () => {
        this.message = 'Task assigned successfully.';
        this.selectedTasksId.clear();
        this.loadData();
      },
      error: () => {
        this.message = 'Error assignig task.'
      }
    });
  }

  private loadData(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(u => {
      this.users = u;
      this.taskService.getUnassignedTask().subscribe(t => {
        this.tasks = t.map(t => {
          switch(t.type){
            case TaskType.Deployment:
              return Object.assign(new DeploymentTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.deadline, t.description));
            case TaskType.Implementation:
              return Object.assign(new ImplementationTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.description));
            default:
              return Object.assign(new MaintenanceTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.services, t.servers));
          }
        });
        this.availibleTasks = this.tasks.filter(t => (t.assignToUser === undefined || t.assignToUser === null));
        this.isLoading = false;
      });
    });
  }

  private getAssignedTasks(): void{
    this.isLoading = true;
    this.taskService.getAssignedTasks(this.selectedUserId).subscribe(t => {
      this.assignUserTasks = t.map(t => {
        switch(t.type){
          case TaskType.Deployment:
            return Object.assign(new DeploymentTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.deadline, t.description));
          case TaskType.Implementation:
            return Object.assign(new ImplementationTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.description));
          default:
            return Object.assign(new MaintenanceTask(t.id, t.title, t.difficulty, t.status as TaskStatus, t.assignToUser, t.services, t.servers));
        }
      });
      this.isLoading = false;
    })
  }

  private vaildateAssignTask(): string | undefined {
    if(!this.selectedUserId){
      return 'Please select a user.';
    }

    this.selectedUser = this.users.find(u => u.id === this.selectedUserId) as UserDto;
    this.selectedTask = this.tasks.filter(t => this.selectedTasksId.has(t.id));
    if(!this.selectedUser){
      return 'User with choosen Id donnot exist.';
    }

    if(this.selectedTask.length !== this.selectedTasksId.size){
      return 'Not all tasks ids is correct.';
    }
    for (const task of this.selectedTask){
      if(!this.canAssignTask(task)){
        return `This user role: ${this.selectedUser.type}  cannot assign this type of task: ${task.getTaskType()}.`;
      }
    }

    if(this.selectedTasksId.size === 0){
      return 'Please select a task.';
    }
    if(this.selectedTasksId.size > 10){
      return 'You can only assign 10 task in one time.';
    }

    const easyPrecent = (this.selectedTask.filter(t => t.difficulty < 3).length * 100) / this.selectedTask.length;
    if(easyPrecent > 50){
      return 'Max task with difficulty 1 or 2 is 50%.'
    }
    const hardPrecent = (this.selectedTask.filter(t => t.difficulty > 3).length * 100) / this.selectedTask.length;
    if(hardPrecent < 10 || hardPrecent > 30){
      return 'User must have from 10% to 30% with 4 or 5 difficulty task.'
    }

    return undefined;
  }

  private canAssignTask(task: IBaseTask) : boolean{
    if(!this.selectedUserId || this.selectedUser === null || this.selectedUser === undefined){
      return false;
    }
    switch(this.selectedUser.type){
      case UserRole.Programmer:
        return task.getTaskType() === TaskType.Implementation;
      case UserRole.DevOps:
        return true;
      default:
        return false;
    }
  }
}
