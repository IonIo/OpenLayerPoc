import { ActivatedRoute, Router } from '@angular/router';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subject, Observable } from 'rxjs';
import { 
  ChangeFeatureTypeModeAction, 
  ChangeMapModeAction, 
  ReinitializationOfMapAction, 
  UpdateMapAction, AddMapAction, RemoveMapAction 
} from './../../common/actions';
import { ActionsBusService } from './../../services/actions-bus.service';

import { MapSettingsFeatureService } from './../../services/map-settings-feature.service';
import { FeatureService } from './../../services/feature.service';
import { MapSettings } from './../../models/map-settings';
import { EditMapItemDialogComponent } from '../../components/dialogs/edit-map-item-dialog/edit-map-item-dialog.component';

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
export class MapDashboardComponent implements AfterViewInit, OnDestroy {
  
  ngOnDestroy(): void {
       console.log("MapDashboardComponent  destriyed")
  }

  private unsubscribe$: Subject<void> = new Subject<void>();
  
  public mapOptions: MapSettings;
  public mapsSettingsItems: Observable<MapSettings[]>

  public nextMap(feature: any) {

    if(feature && feature.get("destination")) {
      this.router.navigate(['/map', feature.get("destination").id]);
    }
  }

  constructor(private dialog: MatDialog, public featureService: FeatureService,
    private route: ActivatedRoute, private router: Router,
    private mapSettingsFeatureService: MapSettingsFeatureService,
    private actionsBusService: ActionsBusService) {
    this.route.params
      .subscribe(params => {
        this.mapOptions = this.mapSettingsFeatureService.getItemByMapId(params['mapId']);
        this.featureService.initStore(params['mapId'] || "1");
        this.changeMapConfig(this.mapOptions);
      });
    this.mapsSettingsItems = this.mapSettingsFeatureService.mapSettingsObservable;
  }

  ngAfterViewInit() {
    this.featureTypeEvent("Point");
    this.selectedModeEvent("DRAW");
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

  public createMap(event: any) {
    this.dialog.open(EditMapItemDialogComponent, { width: '450px' });
  }
  public removeMap(mapConfig: MapSettings) {
    this.actionsBusService.publish(new RemoveMapAction(mapConfig));
  }
  public changeMap(mapConfig: MapSettings) {
    this.dialog.open(EditMapItemDialogComponent, { width: '450px', data:  mapConfig });
  }
}
