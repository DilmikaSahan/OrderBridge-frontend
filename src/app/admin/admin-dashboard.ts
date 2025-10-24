import { Component } from '@angular/core';
import { Navbar } from '../shared/components/navbar';
import {MatTabsModule} from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Navbar, MatTabsModule,RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
  standalone: true
})
export class AdminDashboard {
    links = [{name: 'Inventory', path: 'inventory'},
            {name: 'Products', path: 'products'},
            {name: 'Orders', path: 'orders'}];
}
