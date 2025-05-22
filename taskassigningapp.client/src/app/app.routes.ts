import { Routes } from '@angular/router';
import { TaskAssignComponent } from './components/task-assign/task-assign.component';

export const routes: Routes = [
    {path: 'assing-tasks', component: TaskAssignComponent},
    {path: '', redirectTo: 'assing-task', pathMatch: 'full'}
];
