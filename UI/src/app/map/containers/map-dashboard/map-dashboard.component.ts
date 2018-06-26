import { LocalStorageService } from './../../services/local-storage.service';
import { HttpClient } from '@angular/common/http';

import { MapSettings } from './../../models/map-settings';
import { Subject, Observable } from 'rxjs';
import { MapSettingsFeatureService } from './../../services/map-settings-feature.service';
import { FeatureService } from './../../services/feature.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddImageItemDialogComponent } from './../../components/dialogs/add-image-item-dialog/add-image-item-dialog.component';
import { AddFeatureItemDialogComponent } from './../../components/dialogs/add-feature-item-dialog/add-feature-item-dialog.component';

let featureServiceFactory = (logger: HttpClient, localStorage: LocalStorageService) => {
  return new FeatureService(logger, localStorage);
};

@Component({
  selector: 'my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css'],
  // providers: [{
  //   provide: FeatureService,
  //   useFactory: featureServiceFactory,
  //   deps: [HttpClient, LocalStorageService]
  // }]
})
export class MapDashboardComponent {
  private unsubscribe$: Subject<void> = new Subject<void>();
  private mapsSettingsItems: Observable<MapSettings[]>
  private selectedMode: string = 'DRAW'
  private featureType: string = 'Point'
  private selectedFeature: Observable<any>;
  private mapOptions: MapSettings;
  
  public nextMap(nextMap: any) {
    this.router.navigate(['/map', 1]);
  }
  constructor(private dialog: MatDialog, public featureService: FeatureService,
    private route: ActivatedRoute,   private router: Router,
    private mapSettingsFeatureService: MapSettingsFeatureService) {

    this.route.params
      .subscribe(params => {
        this.featureService.selectedMapId$ = params['mapId'] || "1";
        this.mapOptions = mapSettingsFeatureService.getItemByMapId(params['mapId']);
        this.featureService.initStore();
      });
    this.mapsSettingsItems = this.mapSettingsFeatureService.mapSettingsObservable;
    this.selectedFeature = this.featureService.selectedFeature;
  }

  openAddImageDialog() {
    let dialogRef = this.dialog.open(AddImageItemDialogComponent, { width: '450px' });
  }

  openAddFeatureDialog() {
    let dialogRef = this.dialog.open(AddFeatureItemDialogComponent, { width: '450px' });
  }
}
