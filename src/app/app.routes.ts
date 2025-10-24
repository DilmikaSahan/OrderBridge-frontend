import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';
import { RoleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard').then(m => m.AdminDashboard),
    canActivate: [AuthGuard, RoleGuard],
    children:[
      {
        path: 'inventory',
        loadComponent: () => import('./admin/inventory-management').then(m => m.InventoryManagement),
      },
      {
        path: 'products',
        loadComponent: () => import('./admin/product-management').then(m => m.ProductManagement),
      },
      {
        path: 'orders',
        loadComponent: () => import('./admin/order-management').then(m => m.OrderManagement),
      },
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      }      
    ]
  },
  {
    path: 'user',
    loadComponent: () => import('./user/user-dashboard').then(m => m.UserDashboard),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/user', pathMatch: 'full' },
  { path: '**', redirectTo: '/user' }
];