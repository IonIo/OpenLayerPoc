import { Injectable } from '@angular/core';
import Feature from 'ol/feature';
import * as ol from 'openlayers';
@Injectable({
  providedIn: 'root'
})

export class StyleDecorator {

  applyFeatureStyle(feature: any) {
    if(feature.get('featuretype') == "POINT") {
      let options = feature.get('icon_style_options') || {
             'anchor': [0.5, 0.5],
             'anchorxunits': 'pixels',
             'anchoryunits': 'pixels',
             'src': 'http://localhost:4251/assets/icon.png'
           };
      let iconStyle = new ol.style.Style({
        image: new ol.style.Icon(options)
      });
      return iconStyle
    }
    return new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: 'blue',
        lineDash: [4],
        width: 3
      }),
      fill: new ol.style.Fill({
        color: 'rgba(0, 0, 255, 0.1)'
      })
    })
  }
  
  setAlert(feature: Feature) {
    if(feature.get('featuretype') == "POINT") {
     let style = feature.getStyle();
     let iconStyle = style.getImage();
     const iconStyleDecorated = Object.assign({}, iconStyle, { color:'rgba(255, 0, 0, 0.6);' });
     style.setImage(iconStyleDecorated);
    }
  }
}

export interface Map<T> {
  [key: string]: T;
}

export class FlyWeightFeaturePointer {


}
export class AnimationAlert {
  private duration = 3000;
  private animate: any;

  constructor(private map: any) {}
  flash(feature) {
    var start = new Date().getTime();
    var listenerKey;
    this.animate = (event) => {
      var vectorContext = event.vectorContext;
      var frameState = event.frameState;
      var flashGeom = feature.getGeometry().clone();
      var elapsed = frameState.time - start;
      var elapsedRatio = elapsed / this.duration;
      var radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
      var opacity = ol.easing.easeOut(1 - elapsedRatio);
  
      var style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          snapToPixel: false,
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 0, 0, ' + opacity + ')',
            width: 0.25 + opacity
          })
        })
      });
      vectorContext.setStyle(style);
      vectorContext.drawGeometry(flashGeom);
      if (elapsed > this.duration) {
        ol.Observable.unByKey(listenerKey);
        return;
      }
      // tell OpenLayers to continue postcompose animation
      this.map.render();
    }
    listenerKey = this.map.on('postcompose', this.animate);

}

}