import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-order-dialog',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-order-dialog.html',
  styleUrl: './add-order-dialog.scss',
  standalone: true
})
export class AddOrderDialog {
  newOrder = {
    id: '',
    itemId: '',
    orderDate: '',
    amount: 0
  };

  constructor(private dialogRef: MatDialogRef<AddOrderDialog>) {}

  onSave() {
    this.dialogRef.close(this.newOrder);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
