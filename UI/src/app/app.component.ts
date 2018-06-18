import { Component, AfterViewInit } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';
  public openCycleMapLayer: ol.layer.Tile;
  public openSeaMapLayer: ol.layer.Tile;
  public map: ol.Map;
  extent: ol.Extent = [0, 0, 1024, 968];
  po: ol.ProjectionOptions = {
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent
  };
  projection: ol.ProjectionLike = new ol.proj.Projection(this.po);
  coordinane = [512, 484];

  constructor() {
  }

  ngAfterViewInit() {
    // debugger;
    // this.extent = [0, 0, 1024, 968]
    // this.po = {
    //   code: 'xkcd-image',
    //   units: 'pixels',
    //   extent: this.extent
    // }
    // this.projection = new ol.proj.Projection(this.po);
   // this.coordinane = ol.extent.getCenter(this.extent)
  }

  // ngAfterViewInit() {
  //   this.openCycleMapLayer = new ol.layer.Tile({
  //     source: new ol.source.OSM({
  //       attributions: [
  //         'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
  //         ol.source.OSM.ATTRIBUTION
  //       ],
  //       url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
  //           '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
  //     })
  //   });

  //   this.openSeaMapLayer = new ol.layer.Tile({
  //     source: new ol.source.OSM({
  //       attributions: [
  //         'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
  //         ol.source.OSM.ATTRIBUTION
  //       ],
  //       opaque: false,
  //       url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
  //     })
  //   });

  //   this.map = new ol.Map({
  //     layers: [
  //       this.openSeaMapLayer
  //     ],
  //     controls: ol.control.defaults({
  //       attributionOptions: {
  //         collapsible: false
  //       }
  //     }),
  //     view: new ol.View({
  //       maxZoom: 18,
  //       center: [-244780.24508882355, 5986452.183179816],
  //       zoom: 15
  //     })
  //   });
  // }


}
