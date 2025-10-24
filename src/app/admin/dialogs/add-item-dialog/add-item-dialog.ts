import { Component } from '@angular/core';import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-item-dialog',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-item-dialog.html',
  styleUrl: './add-item-dialog.scss'
})
export class AddItemDialog {
  newItem = {
    id:'',
    itemId: '',
    productId: '',
    quantity: 0
  };

  constructor(private dialogRef: MatDialogRef<AddItemDialog>) {}

  onSave() {
    this.dialogRef.close(this.newItem);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
