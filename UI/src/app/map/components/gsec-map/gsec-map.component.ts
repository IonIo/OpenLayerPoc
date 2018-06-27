import { ChangeFeatureTypeModeAction, ChangeMapModeAction } from './../../common/actions';
import { ActionsBusService } from './../../services/actions-bus.service';
import { StyleDecorator, AnimationAlert } from './../../services/style-decorator';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, ContentChild, Host, Self, EventEmitter } from '@angular/core';
import * as ol from 'openlayers';

import {
  Map, MapBrowserEvent, MapEvent, render, ObjectEvent, control,
  interaction
} from 'openlayers';

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
  public vectorSource = ol.source.Vector;
  public staticImageLayer: ol.layer.Image
  public vectorLayer: ol.layer.Vector

  @ViewChild('map') mapField: ElementRef;
  @ViewChild('popup') popupField: ElementRef;
  @ContentChild(OverlayComponent) content: OverlayComponent;

  @Output() onClick: EventEmitter<MapBrowserEvent>;
  @Output() onDblClick: EventEmitter<MapBrowserEvent>;
  @Output() onMoveEnd: EventEmitter<MapEvent>;
  @Output() onPointerDrag: EventEmitter<MapBrowserEvent>;
  @Output() onPointerMove: EventEmitter<MapBrowserEvent>;
  @Output() onPostCompose: EventEmitter<render.Event>;
  @Output() onPostRender: EventEmitter<MapEvent>;
  @Output() onPreCompose: EventEmitter<render.Event>;
  @Output() onPropertyChange: EventEmitter<ObjectEvent>;
  @Output() onSingleClick: EventEmitter<MapBrowserEvent>;
  @Output() 
  public get nextMap(): EventEmitter<any> {
    return this.actionCompose.nextMap;
  }

  private _mapOptions: MapSettings;
  public get mapOptions(): MapSettings {
    return this._mapOptions;
  }
  @Input()
  public set mapOptions(mapOptions: MapSettings) {
    this._mapOptions = mapOptions;
    this.reinitMap();
  }

  public reinitMap() {
    if (this.map != null) {
      this.resetMapLayers();
      this.addMapLayers();
    }
  }

  private resetMapLayers() {
    this.map.removeLayer(this.staticImageLayer);
    this.map.removeLayer(this.vectorLayer);
    this.staticImageLayer = this.vectorLayer = this.vectorSource = null;
  } 


  private addMapLayers() {
    this.staticImageLayer = this.mapFactory.createImageLayer(this.mapOptions.staticSourceOptions);
    this.map.addLayer(this.staticImageLayer);
    this.initMapVector();
    this.map.addLayer(this.vectorLayer);
    this.vectorSource.clear();
    this.vectorSource.addFeatures(this.featureService.features$.getValue());  
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
    this.actionCompose.setVectorLayer(this.vectorLayer);
  }

  ngAfterViewInit() {
    this.initMapVector();
    this.map = this.mapFactory.createMap({ zoom: this.mapOptions.zoom, maxZoom: this.mapOptions.maxZoom });
    this.staticImageLayer = this.mapFactory.createImageLayer(this.mapOptions.staticSourceOptions);
    this.map.addLayer(this.staticImageLayer);
    this.map.addLayer(this.vectorLayer);
    this.actionCompose.setMap(this.map);
    console.log('GsecMap')
    //this.actionCompose.setMode(this._mode);
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
        this.featureService.actions$.next(feature);
      }
    });
    this.map.on('dblclick', (evt) => { });
  }
}

