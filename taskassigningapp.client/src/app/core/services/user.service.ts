import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserDto } from "../models/user.model";

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly baseUrl = 'https://localhost:7046/api/users';

  constructor(private readonly http: HttpClient) {

  }

  getAllUsers(): Observable<UserDto[]>{
    return this.http.get<UserDto[]>(this.baseUrl);
  }
}