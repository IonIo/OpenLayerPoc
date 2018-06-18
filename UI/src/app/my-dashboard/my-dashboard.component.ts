import { AddFeatureItemDialogComponent } from './../add-feature-item-dialog/add-feature-item-dialog.component';
import { AddImageItemDialogComponent } from './../add-image-item-dialog/add-image-item-dialog.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent {
  constructor(private dialog: MatDialog) {
    
  }

  openAddImageDialog() {
   let dialogRef = this.dialog.open(AddImageItemDialogComponent, { width: '450px' });
  }

  openAddFeatureDialog() {
   let dialogRef = this.dialog.open(AddFeatureItemDialogComponent, { width: '450px' });
  }

  cards = [
    { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];
}
