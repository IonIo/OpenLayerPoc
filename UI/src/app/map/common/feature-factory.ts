import { MapFeature } from './map-feature';
import * as ol from 'openlayers';

export class FeatureFactory {
   public static mapFeature: MapFeature[];
   public static getFeature() {
   }
}
interface Square {
    kind: "square";
    size: number;
}
interface Rectangle {
    kind: "rectangle";
    width: number;
    height: number;
}
interface Circle {
    kind: "circle";
    radius: number;
}
export class Point {
    kind: "circle";
    radius: number;
    geometry: any;
    // geometry: new ol.geom.Point([0, 0]),
    name: '';
    population: 4000;
    rainfall: 500
}
//
export class FeatureIconPoint extends Point {
    private iconFeature: ol.Feature;

    constructor(feature) {
    super();
    this.iconFeature = new ol.Feature({
        geometry: new ol.geom.Point([411.5, 523]),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });
      let iconDefaultStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
          anchor: [0.5, 0.5],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: 'http://localhost:4251/assets/icon.png'
        }))
      });
      this.iconFeature.setStyle(iconDefaultStyle);   
    }

    public setStyle(iconStyle) {
        this.iconFeature.setStyle(iconStyle);   
    }

}


type Shape = Square | Rectangle | Circle ;
