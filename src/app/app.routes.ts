import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user-dashboard').then(m => m.UserDashboard),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: '**', redirectTo: '/user' }
];