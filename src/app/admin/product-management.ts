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
import { AddProductDialog } from './dialogs/add-product-dialog/add-product-dialog';

export interface Product {
  id: number;
  productId: number;
  productName: string;
  description: string;
  forSale: number;
  forSaleDisplay?: string; // For display purposes
}

@Component({
  selector: 'app-product-management',
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
  templateUrl: './product-management.html',
  styleUrl: './product-management.scss',
  standalone: true
})
export class ProductManagement implements OnInit {
  displayedColumns: string[] = ['id', 'productId', 'productName', 'description', 'forSale'];
  dataSource = new MatTableDataSource<Product>([]);
  selectedRow: Product | null = null;
  searchProductId: number | null = null;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Optionally load all products on init
  }

  // Convert forSale number (0/1) to display string
  private convertForSaleToDisplay(product: Product): Product {
    return {
      ...product,
      forSaleDisplay: product.forSale === 1 ? 'For Sale' : 'Not For Sale'
    };
  }

  loadAllProducts(): void {
    this.http.get<Product[]>('http://localhost:13031/api/v1/getproducts').subscribe({
      next: (data) => {
        // Convert forSale to display string for each product
        this.dataSource.data = (Array.isArray(data) ? data : [data]).map(product => 
          this.convertForSaleToDisplay(product)
        );
        this.snackBar.open('Products loaded successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.snackBar.open('Failed to load products', 'Close', { duration: 2000 });
      }
    });
  }

  SearchProducts(): void {
    if (this.searchProductId == null) {
      this.snackBar.open('Please provide a product ID to search', 'Close', { duration: 2000 });
      return;
    }

    this.http.get<Product>(`http://localhost:13031/api/v1/product/${this.searchProductId}`).subscribe({
      next: (data) => {
        this.dataSource.data = [this.convertForSaleToDisplay(data)];
        this.snackBar.open('Search results loaded successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error loading search results', err);
        this.snackBar.open('Failed to load search results', 'Close', { duration: 2000 });
      }
    });
  }

  deleteProduct(productId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) {
      this.snackBar.open('Delete cancelled', 'Close', { duration: 2000 });
      return;
    }

    this.http.delete(`http://localhost:13031/api/v1/deleteproduct/${productId}`).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(product => product.id !== productId);
        this.snackBar.open('Product deleted successfully', 'Close', { duration: 2000 });
        this.loadAllProducts();
      },
      error: (err) => {
        console.error('Error deleting product', err);
        this.snackBar.open('Failed to delete product', 'Close', { duration: 2000 });
        this.loadAllProducts();
      }
    });
  }

  updateProduct(): void {
    if (!this.selectedRow) {
      this.snackBar.open('No product selected for update', 'Close', { duration: 2000 });
      return;
    }

    // Ensure forSale is a number (0 or 1)
    const payload: Product = {
      ...this.selectedRow,
      forSale: this.selectedRow.forSaleDisplay === 'For Sale' ? 1 : 0
    };

    this.http.put<Product>('http://localhost:13031/api/v1/updateproduct', payload).subscribe({
      next: (updated) => {
        this.dataSource.data = this.dataSource.data.map(product =>
          product.id === updated.id ? this.convertForSaleToDisplay(updated) : product
        );
        this.snackBar.open('Product updated successfully', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error('Error updating product', err);
        this.snackBar.open('Failed to update product', 'Close', { duration: 2000 });
      }
    });
  }

  onRowClick(row: Product): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(AddProductDialog, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Convert forSaleDisplay to forSale number before sending
        const payload = {
          ...result,
          forSale: result.forSaleDisplay === 'For Sale' ? 1 : 0
        };

        this.http.post('http://localhost:13031/api/v1/addproduct', payload).subscribe({
          next: () => {
            this.snackBar.open('Product added successfully', 'Close', { duration: 2000 });
            this.loadAllProducts();
          },
          error: (err) => {
            console.error('Error adding product', err);
            this.snackBar.open('Failed to add product', 'Close', { duration: 2000 });
          }
        });
      }
    });
  }
}
