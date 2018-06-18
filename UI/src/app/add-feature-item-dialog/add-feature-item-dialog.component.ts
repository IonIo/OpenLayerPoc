import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

export interface Feature {
  url: string;
  name: string;
  type: string
}

@Component({
  selector: 'gsecm-add-feature-item-dialog',
  template: `
  <h2 mat-dialog-title class="dialog-title">Add dashboard</h2>
  <mat-dialog-content>
    <div class="dialog-container">

      <mat-form-field>
        <input matInput placeholder="" [formControl]="name" [(ngModel)]="image.url" required>
      </mat-form-field>
  
      <mat-form-field>
        <input matInput placeholder="Name " [(ngModel)]="image.name" required>
      </mat-form-field>
    </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="save()">Save</button>
    <button mat-button (click)="dismiss()">Cancel</button>
  </mat-dialog-actions>
  `,
  styleUrls: ['./add-feature-item-dialog.component.css']
})
export class AddFeatureItemDialogComponent implements OnInit {

  feature: Feature;

  constructor(private dialogRef: MatDialogRef<AddFeatureItemDialogComponent>) {
    this.feature = { url: '', name: '', type: '' };
  }

  ngOnInit() {
  }
  save() {
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }
}
