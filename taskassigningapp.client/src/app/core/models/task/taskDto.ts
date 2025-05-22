export class TaskDto{
  public id: string; 
  public title: string;
  public difficulty: number;
  public type: string;
  public status: string;
  public assignToUser: string | undefined;

  public deadline: Date = new Date();
  public description: string = '';
  public services: string = '';
  public servers: string = '';

  constructor(id: string, title: string, difficulty: number, type: string, status: string, assignToUser: string | undefined){
    this.id = id;
    this.title = title;
    this.difficulty = difficulty;
    this.type = type;
    this.status = status;
  }
}