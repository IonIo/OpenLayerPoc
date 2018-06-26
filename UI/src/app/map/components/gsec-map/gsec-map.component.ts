import { MapSettingsFeatureService } from './../../services/map-settings-feature.service';
import { MatDialogRef } from '@angular/material';
import { StyleDecorator, AnimationAlert } from './../../services/style-decorator';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ContentChild, Host, Self, EventEmitter } from '@angular/core';
import * as ol from 'openlayers';
import { ActionCompose } from '../../interaction/action.compose';
import { FeatureService } from '../../services/feature.service';
import { MapFactory } from '../../common/map-factory';
import { OverlayComponent } from '../overlay/overlay.component';
import { MapSettings } from '../../models/map-settings';
declare var $;
interface Map<T> {
  [key: string]: T;
}

@Component({
  selector: 'gsecm-m',
  templateUrl: './gsec-map.component.html',
  styleUrls: ['./gsec-map.component.css']
})
export class GsecMapComponent implements AfterViewInit {

  public map: ol.Map;
  private vectorSource = ol.source.Vector;
  private staticImageLayer: ol.layer.Image
  private vectorLayer: ol.layer.Vector
  public dirty: Map<any> = {};

  @ViewChild('map') mapField: ElementRef;
  @ViewChild('popup') popupField: ElementRef;
  @ContentChild(OverlayComponent) content: OverlayComponent;



  private _mapOptions: MapSettings;
  public get mapOptions(): MapSettings {
    return this._mapOptions;
  }
  @Input()
  public set mapOptions(mapOptions: MapSettings) {
    this.featureService.selectedMapId$ = mapOptions.id;
    this._mapOptions = mapOptions;
    if (this.map != null) {
      this.map.removeLayer(this.staticImageLayer);
      this.map.removeLayer(this.vectorLayer);
      this.staticImageLayer = this.vectorLayer = this.vectorSource = null;
      this.staticImageLayer = this.mapFactory.createImageLayer(this.mapOptions.staticSourceOptions);
      this.map.addLayer(this.staticImageLayer);
      this.initMapVector();
      this.map.addLayer(this.vectorLayer);
      this.vectorSource.clear();
      this.vectorSource.addFeatures(this.featureService.features$.getValue());
    }
  }

  private _mode: string;
  @Input() public set selectedMode(mode: string) {
    if(this.map != null) {
      this.actionCompose.setMode(mode);
    }
    this._mode = mode;
  }

  public get selectedMode(): string {
   return this._mode;
  }


  private _featureType: string;
  public get featureType(): string {
    return this._featureType;
  }
  @Input()
  public set featureType(featureType: string) {
    if(this._featureType != featureType) {
      this.actionCompose.featureType = featureType;
      this._featureType = featureType;
    }
  }

  @Output() 
 public get nextMap(): EventEmitter<any> {
   return this.actionCompose.nextMap;
 }

  constructor(private featureService: FeatureService, private mapFactory: MapFactory,
    private styleDecorator: StyleDecorator, private actionCompose: ActionCompose) {
    this.initMapVector()
    this.featureService.features$.subscribe((features) => {
      if (features != null && features.length > 0) {
        this.vectorSource.clear();
        this.vectorSource.addFeatures(features);
      }
    })
  }

  private initMapVector() {
    this.vectorSource = new ol.source.Vector({
      loader: this.featureService.loadFeatures.bind(this.featureService),
    });
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      style: this.styleDecorator.applyFeatureStyle.bind(this.styleDecorator)
    });
    this.actionCompose.setVectorSource(this.vectorSource);
  }

  ngAfterViewInit() {
    this.initMapVector();
    this.map = this.mapFactory.createMap({ zoom: this.mapOptions.zoom, maxZoom: this.mapOptions.maxZoom });
    this.staticImageLayer = this.mapFactory.createImageLayer(this.mapOptions.staticSourceOptions);
    this.map.addLayer(this.staticImageLayer);
    this.map.addLayer(this.vectorLayer);
    this.actionCompose.setMap(this.map);
    this.actionCompose.setMode(this._mode);

    // this.addMapOnLick();
  }

  private addMapOnLick() {
    this.map.on('click', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      if (feature) {
        // this.featureService.selectedFeature$.next(feature);
      }
      // } else {
      //   feature = this.mapFactory.createIconFeature({
      //     geometry: 'POINT',
      //     name: 'Test Name',
      //     src: 'http://localhost:4251/assets/icon.png',
      //     coordinate: evt.coordinate
      //   });
      //   feature.set("icon_style_options", {
      //     'anchor': [0.5, 0.5],
      //     'anchorxunits': 'pixels',
      //     'anchoryunits': 'pixels',
      //     'src': 'http://localhost:4251/assets/icon.png'
      //   })
      //   this.animationAlert = new AnimationAlert(this.map);
      //   this.vectorSource.addFeature(feature);
      //   this.featureService.addFeatures(feature);
      //   this.animationAlert.flash(feature);
      // }
    });
    this.map.on('singleclick', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      if (feature) {
        feature.set("position_coordinate", evt.coordinate)
        this.featureService.selectedFeature$.next(feature);
      }
    });
    this.map.on('dblclick', (evt) => { });
  }
}

