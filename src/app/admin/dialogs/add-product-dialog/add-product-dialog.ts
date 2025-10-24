import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './add-product-dialog.html',
  styleUrl: './add-product-dialog.scss',
  standalone: true
})
export class AddProductDialog {
  newProduct = {
    id: '',
    productId: '',
    productName: '',
    description: '',
    forSaleDisplay: 'For Sale' // Default to "For Sale"
  };

  constructor(private dialogRef: MatDialogRef<AddProductDialog>) {}

  onSave() {
    this.dialogRef.close(this.newProduct);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
