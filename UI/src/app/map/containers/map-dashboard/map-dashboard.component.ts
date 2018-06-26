import { GsecMapComponent } from './../../components/gsec-map/gsec-map.component';
import { ChangeFeatureTypeModeAction, ChangeMapModeAction, ReinitializationOfMapAction } from './../../common/actions';
import { ActionsBusService } from './../../services/actions-bus.service';
import { LocalStorageService } from './../../services/local-storage.service';
import { HttpClient } from '@angular/common/http';

import { MapSettings } from './../../models/map-settings';
import { Subject, Observable } from 'rxjs';
import { MapSettingsFeatureService } from './../../services/map-settings-feature.service';
import { FeatureService } from './../../services/feature.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddImageItemDialogComponent } from './../../components/dialogs/add-image-item-dialog/add-image-item-dialog.component';
import { log } from 'util';

export interface MapState {
  map: any;
  mode: string;
  type: string;
}

@Component({
  selector: 'map-dashboard',
  templateUrl: './map-dashboard.component.html',
  styleUrls: ['./map-dashboard.component.css'],
})
export class MapDashboardComponent implements AfterViewInit {
  @ViewChild(GsecMapComponent) gsecMap: GsecMapComponent;

  private unsubscribe$: Subject<void> = new Subject<void>();
  private mapsSettingsItems: Observable<MapSettings[]>
  private mapOptions: MapSettings;

  public nextMap(nextMap: any) {
    this.router.navigate(['/map', 1]);
  }
  constructor(private dialog: MatDialog, public featureService: FeatureService,
    private route: ActivatedRoute, private router: Router,
    private mapSettingsFeatureService: MapSettingsFeatureService,
    private actionsBusService: ActionsBusService) {
    this.route.params
      .subscribe(params => {
        this.mapOptions = this.mapSettingsFeatureService.getItemByMapId(params['mapId']);
        this.featureService.initStore(params['mapId'] || "1");
      });
    this.mapsSettingsItems = this.mapSettingsFeatureService.mapSettingsObservable;
  }

  ngAfterViewInit() {
    console.log('MapDashboardComponent')
  }
  
  public openDialog() {
    this.dialog.open(AddImageItemDialogComponent, { width: '450px' });
  }

  public featureTypeEvent(type: string) {
    this.actionsBusService.publish(new ChangeFeatureTypeModeAction(type));
  }

  public selectedModeEvent(mode: string) {
    this.actionsBusService.publish(new ChangeMapModeAction(mode));
  }

  public changeMapConfig(mapConfig: MapSettings) {
    this.actionsBusService.publish(new ReinitializationOfMapAction(mapConfig));
  }

  public createdMapEvent(map: any) {

  }

}
