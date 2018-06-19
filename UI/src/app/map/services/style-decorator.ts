import { Injectable } from '@angular/core';
import Feature from 'ol/feature';

@Injectable({
  providedIn: 'root'
})

export class StyleDecorator {
  
  setAlert(feature: Feature) {
    if(feature.get('featuretype') == "POINT") {
     let style = feature.getStyle();
     let iconStyle = style.getImage();
     const iconStyleDecorated = Object.assign({}, iconStyle, { color:'rgba(255, 0, 0, 0.6);' });
     style.setImage(iconStyleDecorated);
    }
  }
}
