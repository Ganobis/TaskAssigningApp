export enum UserRole {
  Programmer = 'Programmer',
  DevOps = 'DevOps'
}

export interface UserDto {
  id: string;
  name: string;
  type: string;
}