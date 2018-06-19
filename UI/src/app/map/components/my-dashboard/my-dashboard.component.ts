import { Observable } from 'rxjs';
import { FeatureService } from './../../services/feature.service';
import { AddFeatureItemDialogComponent } from './../add-feature-item-dialog/add-feature-item-dialog.component';
import { AddImageItemDialogComponent } from './../add-image-item-dialog/add-image-item-dialog.component';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent {
  private subscription: Subscription;
  private selectedMode: string = 'VIEW'
  private selectedFeature: Observable<any>;
  constructor(private dialog: MatDialog, public featureService: FeatureService) {
   this.selectedFeature = this.featureService.selectedFeature;
  }
  openAddImageDialog() {
    let dialogRef = this.dialog.open(AddImageItemDialogComponent, { width: '450px' });
  }

  openAddFeatureDialog() {
    let dialogRef = this.dialog.open(AddFeatureItemDialogComponent, { width: '450px' });
  }
}
