import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddOrderDialog } from './dialogs/add-order-dialog/add-order-dialog';

export interface Order {
  id: number;
  itemId: number;
  orderDate: string;
  amount: number;
}

@Component({
  selector: 'app-order-management',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
    MatGridListModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule
  ],
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.scss'],
  standalone: true
})
export class OrderManagement implements OnInit {
  displayedColumns: string[] = ['id', 'itemId', 'orderDate', 'amount'];
  dataSource = new MatTableDataSource<Order>([]);
  selectedRow: Order | null = null;
  searchOrderId: number | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  loadAllOrders(): void {
    this.http.get<Order[]>('http://localhost:8081/api/v1/getOrders').subscribe({
      next: (data) => {
        this.dataSource.data = Array.isArray(data) ? data : [data];
        this.snackBar.open('Orders loaded successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.snackBar.open('Failed to load orders', 'Close', { duration: 2000 });
      }
    });
  }

  SearchOrders(): void {
    if (this.searchOrderId == null) {
      this.snackBar.open('Please provide an order ID to search', 'Close', { duration: 2000 });
      return;
    }

    this.http.get<Order>(`http://localhost:8081/api/v1/order/${this.searchOrderId}`).subscribe({
      next: (data) => {
        this.dataSource.data = [data];
        this.snackBar.open('Search results loaded successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error loading search results', err);
        this.snackBar.open('Failed to load search results', 'Close', { duration: 2000 });
      }
    });
  }

  deleteOrder(orderId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this order?');
    if (!confirmed) {
      this.snackBar.open('Delete cancelled', 'Close', { duration: 2000 });
      return;
    }

    this.http.delete(`http://localhost:8081/api/v1/deleteorder/${orderId}`).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(order => order.id !== orderId);
        this.snackBar.open('Order deleted successfully', 'Close', { duration: 2000 });
        this.loadAllOrders();
      },
      error: (err) => {
        console.error('Error deleting order', err);
        this.snackBar.open('Failed to delete order', 'Close', { duration: 2000 });
        this.loadAllOrders();
      }
    });
  }

  updateOrder(): void {
    if (!this.selectedRow) {
      this.snackBar.open('No order selected for update', 'Close', { duration: 2000 });
      return;
    }

    const payload: Order = { ...this.selectedRow };

    this.http.put<Order>('http://localhost:8081/api/v1/updateorder', payload).subscribe({
      next: (updated) => {
        this.dataSource.data = this.dataSource.data.map(order =>
          order.id === updated.id ? updated : order
        );
        this.snackBar.open('Order updated successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating order', err);
        this.snackBar.open('Failed to update order', 'Close', { duration: 2000 });
      }
    });
  }

  onRowClick(row: Order): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  openAddOrderDialog(): void {
    const dialogRef = this.dialog.open(AddOrderDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post('http://localhost:8081/api/v1/addorder', result).subscribe({
          next: () => {
            this.snackBar.open('Order added successfully', 'Close', { duration: 2000 });
            this.loadAllOrders();
          },
          error: (err) => {
            console.error('Error adding order', err);
            this.snackBar.open('Failed to add order', 'Close', { duration: 2000 });
          }
        });
      }
    });
  }
}
