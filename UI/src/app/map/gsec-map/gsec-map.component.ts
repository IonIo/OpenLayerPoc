import { StyleDecorator } from './../common/style-decorator';
import { ActionCompose } from './../interaction/action.compose';
import { MapFactory } from './../common/map-factory';
import { FeatureService } from './../common/feature.service';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as ol from 'openlayers';
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
    url: 'http://localhost:61832/StaticFiles/maps.jpg'
  }
  public map: ol.Map;
  private vectorSource = ol.source.Vector;
  private vectorLayer: ol.layer.Vector
  public dirty: Map<any> = {};
  private actionCompose: ActionCompose;
  @ViewChild('map') mapField: ElementRef;
  @ViewChild('type') typeSelect: ElementRef;

  constructor(private featureService: FeatureService, private mapFactory: MapFactory) {
    //his.vectorSource = this.mapFactory.createVector(this.featureService.loadFeatures.bind(this.featureService));

    this.actionCompose = new ActionCompose(this.vectorSource, this.featureService);
    this.actionCompose.addEventHandler();

    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point([411.5, 523]),
      // geometry: new ol.geom.Point([0, 0]),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });

    iconFeature.setId("1")
    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 0.5],
        // crossOrigin: 'Anonymous',
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: 'http://localhost:4251/assets/icon.png'
      }))
    });
    iconFeature.setStyle(iconStyle);
    iconFeature.on('change',function(feature){

    });
    this.vectorSource = new ol.source.Vector({
      features: [iconFeature]
    });
    this.vectorSource.addFeatures(iconFeature);


    this.vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      // style: (feature) => {
      //   this.style.getText().setText("Test");
      //   return this.style;
      // }
      //style: iconStyle
      // style: styleDecorator.styleFunction.bind(styleDecorator)
    });

    // let styleDecorator = new StyleDecorator(this.vectorLayer)
    // this.vectorLayer.setStyle(styleDecorator.styleFunction.bind(styleDecorator));
    this.featureService.features$.subscribe((features) => {
      if (features != null && features.length > 0) {
        // this.vectorSource.addFeatures(iconFeature);
      }
    })
  }

  ngAfterViewInit() {
    this.typeSelect.nativeElement.onchange = function () {
      let selectedMode = this.typeSelect.nativeElement.value;
      let isModify = selectedMode === 'MODIFY';
      let isDraw = selectedMode === 'DRAW';
      let isView = selectedMode === 'VIEW';
      this.actionCompose.draw.setActive(isView ? !isView : isDraw);
      this.actionCompose.select.setActive(isView ? !isView : isModify);
      this.actionCompose.modify.setActive(isView ? !isView : isModify);
    }.bind(this);
    this.map = this.mapFactory.createMap({ zoom: 2,  maxZoom: 8 });
    this.mapFactory.addImageStaticSource(this.map, this.staticSourceOptions);
    this.map.addLayer(this.vectorLayer);
    this.map.on('click', (evt) => {
      var feature = this.map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
          return feature;
        });
        let iconStyle = new ol.style.Style({
          image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 0.5],
            color: 'rgba(255,0,0,0.1)',
            // crossOrigin: 'Anonymous',
            anchorXUnits: 'pixels',
            anchorYUnits: 'pixels',
            src: 'http://localhost:4251/assets/icon.png'
          }))
        });
        if (feature) {
        let id = this.vectorSource.getFeatureById("1");
        feature.setStyle(iconStyle);
      } else {
        var feature = new ol.Feature(new ol.geom.Point(evt.coordinate));
        feature.setStyle(iconStyle)
        feature.on('change',function(){
            debugger;
        }, feature);
       // this.vectorSource.clear();
        this.vectorSource.addFeature(feature);
      }
    });
    this.actionCompose.addInteractions = this.map;
  }
}

