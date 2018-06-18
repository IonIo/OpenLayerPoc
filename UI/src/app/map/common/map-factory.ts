import { Injectable } from '@angular/core';
import {
  Map, MapBrowserEvent, MapEvent, render, ObjectEvent, control,
  interaction, View, extent, MapOptions, proj, layer, source, Attribution
} from 'openlayers';

import * as ol from 'openlayers';
import { StyleDecorator } from './style-decorator';

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
}
