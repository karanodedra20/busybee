import { Route } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { LandingComponent } from './components/landing/landing.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'tasks',
  },
];
