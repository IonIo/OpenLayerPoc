import { MatDialogRef } from '@angular/material';
import { StyleDecorator } from './../../services/style-decorator';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, ContentChild } from '@angular/core';
import * as ol from 'openlayers';
import { ActionCompose } from '../../interaction/action.compose';
import { FeatureService } from '../../services/feature.service';
import { MapFactory } from '../../common/map-factory';
import { OverlayComponent } from '../overlay/overlay.component';
declare var $;
interface Map<T> {
  [key: string]: T;
}

interface StaticSourceOptions {
  html: string;
  url: string;
}

@Component({
  selector: 'gsecm-m',
  templateUrl: './gsec-map.component.html',
  styleUrls: ['./gsec-map.component.css']
})
export class GsecMapComponent implements AfterViewInit {

  public staticSourceOptions: StaticSourceOptions = {
    html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>',
    url: 'http://localhost:61833/StaticFiles/maps.jpg'
  }
  public map: ol.Map;
  private vectorSource = ol.source.Vector;
  private vectorLayer: ol.layer.Vector
  public dirty: Map<any> = {};
  private actionCompose: ActionCompose;
  
  // private _popup : any;
  // public get popup() : any {
  //   return this._popup;
  // }
  // public set popup(v : any) {
  //   this._popup = v;
  // }
  

  @ViewChild('map') mapField: ElementRef;
  @ViewChild('popup') popupField: ElementRef;
  @ContentChild(OverlayComponent) content: OverlayComponent;
  @Input() set selectedMode(mode: string) {
    this.actionCompose.setMode(mode);
  }

  constructor(private featureService: FeatureService, private mapFactory: MapFactory,
    private styleDecorator: StyleDecorator) {
    this.actionCompose = new ActionCompose(this.vectorSource, this.featureService);
    this.actionCompose.addEventHandler();

    let iconFeature = this.mapFactory.createIconFeature({
      geometry: 'POINT',
      name: 'Test Name',
      src: 'http://localhost:4251/assets/icon.png',
      coordinate: [411.5, 523]
    });
    this.vectorSource = new ol.source.Vector({
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          width: 3,
          color: [255, 0, 0, 1]
        }),
        fill: new ol.style.Fill({
          color: [0, 0, 255, 0.6]
        })
      })
    });
    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
    });
    this.vectorSource.addFeature(iconFeature);
    this.featureService.features$.subscribe((features) => {
      if (features != null && features.length > 0) {
        debugger;
         this.vectorSource.addFeatures(features);
      }
    })
  }

  ngAfterViewInit() {
    this.map = this.mapFactory.createMap({ zoom: 2, maxZoom: 8 });
    this.mapFactory.addImageStaticSource(this.map, this.staticSourceOptions);
    this.map.addLayer(this.vectorLayer);
    this.actionCompose.addInteractions = this.map;
    this.addMapOnLick();
  }

  private addMapOnLick() {
    this.map.on('click', (evt) => {
      let feature = this.map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
      if (feature) {
        this.featureService.selectedFeature$.next(feature);
      } else {
        feature = this.mapFactory.createIconFeature({
          geometry: 'POINT',
          name: 'Test Name',
          src: 'http://localhost:4251/assets/icon.png',
          coordinate: evt.coordinate
        });
        this.vectorSource.addFeature(feature);
        this.featureService.addFeatures(feature);
      }
    });
  }
}

