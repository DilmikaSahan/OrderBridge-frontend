import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import { Inventory } from '../core/services/inventory';
import { ThisReceiver } from '@angular/compiler';
import {MatTableModule,MatTableDataSource } from '@angular/material/table';
import { HttpClient,HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatDialog,MatDialogModule} from '@angular/material/dialog';
import { AddItemDialog } from './dialogs/add-item-dialog/add-item-dialog';

export interface InventoryItem {
  id: number;
  itemId: number;
  productId:string;
  quantity: number;
}

@Component({
  selector: 'app-inventory-management',
  imports: [ MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule, FormsModule, MatGridListModule, MatTableModule, HttpClientModule, CommonModule],
  templateUrl: './inventory-management.html',
  styleUrl: './inventory-management.scss'
})
export class InventoryManagement implements OnInit{
  displayedColumns: string[] = ['id', 'itemId', 'productId', 'quantity'];
  dataSource = new MatTableDataSource<InventoryItem>([]);
  selectedRow: InventoryItem | null = null;
  searchItemId: number | null = null;


  constructor(private http:HttpClient,private snackBar: MatSnackBar,private dialog: MatDialog) {}
  ngOnInit(): void {
      
  }
  loadAllItems():void{
    this.http.get<InventoryItem[]>('http://localhost:14998/api/v1/getitems').subscribe({
      next:(data)=>{
        this.dataSource.data=Array.isArray(data)?data:[data];
        this.snackBar.open('Inventory items loaded successfully','Close',{duration:2000});
      },
      error:(err)=>{
        console.error('Error loading inventory items',err);
        this.snackBar.open('Failed to load inventory items','Close',{duration:2000});
      }
    });
  }

  SearchItems():void{
    this.http.get<InventoryItem[]>(`http://localhost:14998/api/v1/item/${this.searchItemId}`).subscribe({
      next:(data)=>{
        this.dataSource.data=Array.isArray(data)?data:[data];
        this.snackBar.open('Search results loaded successfully','Close',{duration:2000});
      },
      error:(err)=>{
        console.error('Error loading search results',err);
        this.snackBar.open('Failed to load search results','Close',{duration:2000});
      }
    });
  }
  deleteItem(itemId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) {
      this.snackBar.open('Delete cancelled', 'Close', { duration: 2000 });
      return;
    }

    this.http.delete(`http://localhost:14998/api/v1/deleteitem/${itemId}`).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(item => item.id !== itemId);
        this.snackBar.open('Item deleted successfully', 'Close', { duration: 2000 });
        this.loadAllItems();
      },
      error: (err) => {
        console.error('Error deleting item', err);
        this.snackBar.open('Failed to delete item', 'Close', { duration: 2000 });
        this.loadAllItems();
      }
    });
  }
  updateItem(): void {
    if (!this.selectedRow) {
      this.snackBar.open('No item selected for update', 'Close', { duration: 2000 });
      return;
    }
    const payload: InventoryItem = { ...this.selectedRow };

    this.http.put<InventoryItem>('http://localhost:14998/api/v1/updateitem', payload).subscribe({
      next: (updated) => {
        this.dataSource.data = this.dataSource.data.map(item => item.id === updated.id ? updated : item);
        this.snackBar.open('Item updated successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating item', err);
        this.snackBar.open('Failed to update item', 'Close', { duration: 2000 });
      }
    });
  }

  onRowClick(row: InventoryItem): void {
    this.selectedRow=this.selectedRow===row ? null : row;
}
openAddItemDialog(): void {
  const dialogRef = this.dialog.open(AddItemDialog, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.http.post('http://localhost:14998/api/v1/additem', result).subscribe({
        next: () => {
          this.snackBar.open('Item added successfully', 'Close', { duration: 2000 });
          this.loadAllItems(); 
        },
        error: (err) => {
          console.error('Error adding item', err);
          this.snackBar.open('Failed to add item', 'Close', { duration: 2000 });
        }
      });
    }
  });
}


}
