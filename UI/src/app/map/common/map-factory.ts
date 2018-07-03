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

  private readonly extent = [0, 0, 1024, 968];
  private readonly projection = new proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent
  });

  public createMap(options: any): any {
    return new ol.Map({
      target: 'map',
      view: new ol.View({
        interactions: ol.interaction.defaults({ doubleClickZoom: false }),
        projection: this.projection,
        center: ol.extent.getCenter(this.extent),
        zoom: options.zoom, //2
        maxZoom: options.maxZoom, //8
      })
    });
  }

  public createStaticImageSource(staticSourceOptions): source.ImageStatic {
    return new source.ImageStatic({
      attributions: [
        new Attribution({
          html: staticSourceOptions.html
        })
      ],
      url: staticSourceOptions.url,
      projection: this.projection,
      imageExtent: this.extent
    })
  }

  public createImageLayer(staticSourceOptions: any) {
    return new layer.Image({
      source: this.createStaticImageSource(staticSourceOptions)
    });
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

  private createPointFeature(payload: any): ol.Feature {
    let iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(payload.coordinate),
      name: payload.name,
      population: 4000,
      rainfall: 500
    });
    let iconOptions = {
      anchor: [0.5, 0.5],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: payload.src
    }
    let iconStyle = new ol.style.Style({
      image: new ol.style.Icon(iconOptions)
    });
    iconFeature.set('name', payload.name);
    iconFeature.set('featuretype', 'POINT');
    iconFeature.set('icon_style_options', iconOptions);
    iconFeature.setStyle(iconStyle);
    return iconFeature;
  }
}
