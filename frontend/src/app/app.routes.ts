import { Routes } from '@angular/router';
import { Projects } from './pages/projects/projects';
import { Tasks } from './pages/tasks/tasks';

export const routes: Routes = [
    { path: '', redirectTo: 'projects', pathMatch: 'full' }, 
    { path: 'projects', component: Projects },
    { path: 'projects/:id/tasks', component: Tasks}
];
