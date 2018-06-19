import { Injectable } from '@angular/core';
import {
  Map, MapBrowserEvent, MapEvent, render, ObjectEvent, control,
  interaction, View, extent, MapOptions, proj, layer, source, Attribution
} from 'openlayers';

import * as ol from 'openlayers';
import { StyleDecorator } from '../services/style-decorator';

@Injectable({
  providedIn: 'root'
})
export class MapFactory {

  private extent = [0, 0, 1024, 968];
  private projection = new proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent
  });

  public createMap(options: any): any {
    return new ol.Map({
      target: 'map',
      view: new ol.View({
        projection: this.projection,
        center: ol.extent.getCenter(this.extent),
        zoom: options.zoom, //2
        maxZoom: options.maxZoom, //8
      })
    });
  }

  public addImageStaticSource(map: any, staticSourceOptions) {
    let layerImage = new layer.Image({
      source: new source.ImageStatic({
        attributions: [
          new Attribution({
            html: staticSourceOptions.html
          })
        ],
        url: staticSourceOptions.url,
        projection: this.projection,
        imageExtent: this.extent
      })
    });
    map.addLayer(layerImage);
  }

  public createVector(loader: any) {
    let vector = new ol.source.Vector({
      loader: loader,
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        tileSize: 512
      }))
    });
    return vector;
  }

  createIconFeature(payload: any): ol.Feature {
    if (payload.geometry == "POINT") {
      return this.createPointFeature(payload)
    }
  }

  private createPointFeature(payload: any) : ol.Feature {
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(payload.coordinate),
      name: payload.name,
      population: 4000,
      rainfall: 500
    });
    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 0.5],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: payload.src 
      }))
    });
    iconFeature.set('featuretype', 'POINT');
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }
}
