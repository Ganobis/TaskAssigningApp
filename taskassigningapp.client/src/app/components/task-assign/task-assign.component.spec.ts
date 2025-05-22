import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskAssignComponent } from './task-assign.component';
import { TaskService } from '../../core/services/task.service';
import { UserService } from '../../core/services/user.service';
import { of } from 'rxjs';
import { UserDto, UserRole } from '../../core/models/user.model';
import { TaskDto, TaskStatus, TaskType } from '../../core/models/task/task.model';
import { ImplementationTask } from '../../core/models/task/implementationTask';
import { DeploymentTask } from '../../core/models/task/deploymentTask';
import { MaintenanceTask } from '../../core/models/task/maintenenceTask';

describe('TaskAssignComponent', () => {
  let component: TaskAssignComponent;
  let fixture: ComponentFixture<TaskAssignComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  const PROGRAMMER_ID = '22965bc6-4de1-4410-b76a-90ee3992cbc1';
  const DEVOPS_ID = '22965bc6-4de1-4410-b76a-90ee3992cbc2';
  const IMPL_TASK_ID = '32965bc6-4de1-4410-b76a-90ee3992cbc1';
  const DEPLOY_TASK_ID = '32965bc6-4de1-4410-b76a-90ee3992cbc2';
  const MAINT_TASK_ID = '32965bc6-4de1-4410-b76a-90ee3992cbc3';
  const INVALID_ID = '00000000-0000-0000-0000-000000000000';

  const mockUsers: UserDto[] = [
    { id: PROGRAMMER_ID, name: 'Programmer 1', type: UserRole.Programmer },
    { id: DEVOPS_ID, name: 'DevOps 1', type: UserRole.DevOps }
  ];

  const mockTaskDtos: TaskDto[] = [
    {
      id: IMPL_TASK_ID,
      title: 'Impl Task 1',
      difficulty: 2,
      type: TaskType.Implementation,
      status: TaskStatus.ToDo,
      assignToUser: undefined,
      description: 'Description 1',
      deadline: new Date(),
      services: '',
      servers: ''
    },
    {
      id: DEPLOY_TASK_ID,
      title: 'Deploy Task 1',
      difficulty: 4,
      type: TaskType.Deployment,
      status: TaskStatus.ToDo,
      assignToUser: undefined,
      deadline: new Date(),
      description: 'Description 2',
      services: '',
      servers: ''
    },
    {
      id: MAINT_TASK_ID,
      title: 'Maintenance Task 1',
      difficulty: 3,
      type: TaskType.Maintenance,
      status: TaskStatus.ToDo,
      assignToUser: undefined,
      services: 'Services 1',
      servers: 'Servers 1',
      deadline: new Date(),
      description: ''
    }
  ];

  const mockTasks = [
    new ImplementationTask(IMPL_TASK_ID, 'Impl Task 1', 2, TaskStatus.ToDo, undefined, 'Description 1'),
    new DeploymentTask(DEPLOY_TASK_ID, 'Deploy Task 1', 4, TaskStatus.ToDo, undefined, new Date(), 'Description 2'),
    new MaintenanceTask(MAINT_TASK_ID, 'Maintenance Task 1', 3, TaskStatus.ToDo, undefined, 'Services 1', 'Servers 1')
  ];

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj('TaskService', [
      'getUnassignedTask',
      'getAssignedTasks',
      'assignTaskToUser'
    ]);
    mockUserService = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [TaskAssignComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAssignComponent);
    component = fixture.componentInstance;

    mockUserService.getAllUsers.and.returnValue(of(mockUsers));
    mockTaskService.getUnassignedTask.and.returnValue(of(mockTaskDtos));
    mockTaskService.getAssignedTasks.and.returnValue(of([]));
    mockTaskService.assignTaskToUser.and.returnValue(of(void 0));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load users and tasks on init', () => {
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(mockTaskService.getUnassignedTask).toHaveBeenCalled();
      expect(component.users).toEqual(mockUsers);
      expect(component.tasks.length).toBe(3);
      expect(component.tasks[0].title).toBe('Impl Task 1');
      expect(component.tasks[1].title).toBe('Deploy Task 1');
      expect(component.tasks[2].title).toBe('Maintenance Task 1');
    });
  });

  describe('SelectedUserId', () => {
    it('should set selectedUserId and load assigned tasks', () => {
      spyOn(component as any, 'getAssignedTasks');
      component.SelectedUserId = PROGRAMMER_ID;
      expect(component['selectedUserId']).toBe(PROGRAMMER_ID);
      expect(component['getAssignedTasks']).toHaveBeenCalled();
    });
  });

  describe('toggleTaskSelection', () => {
    it('should add task to selection if not selected', () => {
      component.toggleTaskSecection(IMPL_TASK_ID);
      expect(component.selectedTasksId.has(IMPL_TASK_ID)).toBeTrue();
    });

    it('should remove task from selection if already selected', () => {
      component.selectedTasksId.add(IMPL_TASK_ID);
      component.toggleTaskSecection(IMPL_TASK_ID);
      expect(component.selectedTasksId.has(IMPL_TASK_ID)).toBeFalse();
    });
  });

  describe('getDescription', () => {
    it('should return description for ImplementationTask', () => {
      const task = mockTasks[0];
      expect(component.getDescription(task)).toBe('Description 1');
    });

    it('should return description for DeploymentTask', () => {
      const task = mockTasks[1];
      expect(component.getDescription(task)).toBe('Description 2');
    });

    it('should return undefined for MaintenanceTask', () => {
      const task = mockTasks[2];
      expect(component.getDescription(task)).toBeUndefined();
    });
  });

  describe('getServers', () => {
    it('should return servers for MaintenanceTask', () => {
      const task = mockTasks[2];
      expect(component.getServers(task)).toBe('Servers 1');
    });

    it('should return undefined for non-MaintenanceTask', () => {
      const task = mockTasks[0];
      expect(component.getServers(task)).toBeUndefined();
    });
  });

  describe('getServices', () => {
    it('should return services for MaintenanceTask', () => {
      const task = mockTasks[2];
      expect(component.getServices(task)).toBe('Services 1');
    });

    it('should return undefined for non-MaintenanceTask', () => {
      const task = mockTasks[0];
      expect(component.getServices(task)).toBeUndefined();
    });
  });

  describe('getDeadline', () => {
    it('should return deadline for DeploymentTask', () => {
      const task = mockTasks[1];
      expect(component.getDeadline(task)).toEqual(jasmine.any(Date));
    });

    it('should return undefined for non-DeploymentTask', () => {
      const task = mockTasks[0];
      expect(component.getDeadline(task)).toBeUndefined();
    });
  });

  describe('validateAssignTask', () => {
    beforeEach(() => {
      component.SelectedUserId = PROGRAMMER_ID;
      component.users = mockUsers;
      component.tasks = [
        new ImplementationTask(IMPL_TASK_ID, 'Impl Task 1', 2, TaskStatus.ToDo, undefined, 'Description 1'),
        new DeploymentTask(DEPLOY_TASK_ID, 'Deploy Task 1', 4, TaskStatus.ToDo, undefined, new Date(), 'Description 2'),
        new MaintenanceTask(MAINT_TASK_ID, 'Maintenance Task 1', 3, TaskStatus.ToDo, undefined, 'Services 1', 'Servers 1')
      ];
    });

    it('should return error if no user selected', () => {
      component.SelectedUserId = '';
      expect(component['vaildateAssignTask']()).toBe('Please select a user.');
    });

    it('should return error if user not found', () => {
      component.SelectedUserId = INVALID_ID;
      expect(component['vaildateAssignTask']()).toBe('User with choosen Id donnot exist.');
    });

    it('should return error if no tasks selected', () => {
      component.selectedTasksId.clear();
      expect(component['vaildateAssignTask']()).toBe('Please select a task.');
    });
  });

  describe('canAssignTask', () => {
    beforeEach(() => {
      component['selectedUser'] = mockUsers[0]; // Programmer
    });

    it('should not allow Programmer to assign Deployment task', () => {
      const task = new DeploymentTask(DEPLOY_TASK_ID, 'Deploy Task 1', 4, TaskStatus.ToDo, undefined, new Date(), 'Description 2');
      expect(component['canAssignTask'](task)).toBeFalse();
    });

    it('should not allow Programmer to assign Maintenance task', () => {
      const task = new MaintenanceTask(MAINT_TASK_ID, 'Maintenance Task 1', 3, TaskStatus.ToDo, undefined, 'Services 1', 'Servers 1');
      expect(component['canAssignTask'](task)).toBeFalse();
    });

    it('should return false when no user is selected', () => {
      component['selectedUser'] = undefined;
      const task = new ImplementationTask(IMPL_TASK_ID, 'Impl Task 1', 2, TaskStatus.ToDo, undefined, 'Description 1');
      expect(component['canAssignTask'](task)).toBeFalse();
    });
  });

  describe('loadData', () => {
    it('should load users and tasks', () => {
      component['loadData']();
      expect(mockUserService.getAllUsers).toHaveBeenCalled();
      expect(mockTaskService.getUnassignedTask).toHaveBeenCalled();
    });

    it('should set isLoading to false after loading', () => {
      component.isLoading = true;
      component['loadData']();
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('getAssignedTasks', () => {
    it('should load assigned tasks for selected user', () => {
      component['selectedUserId'] = PROGRAMMER_ID;
      component['getAssignedTasks']();
      expect(mockTaskService.getAssignedTasks).toHaveBeenCalledWith(PROGRAMMER_ID);
    });

    it('should set isLoading to false after loading', () => {
      component.isLoading = true;
      component['getAssignedTasks']();
      expect(component.isLoading).toBeFalse();
    });
  });
});