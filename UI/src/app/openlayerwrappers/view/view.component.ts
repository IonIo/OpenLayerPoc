import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { View, Extent, Coordinate, ProjectionLike } from 'openlayers';

import { MapComponent } from '../../map/map.component';

@Component({
  selector: 'gsecm-view',
  template: `<ng-content></ng-content>`,
  styles: []
})
export class ViewComponent implements OnInit, OnChanges {

  public instance: View;
  public componentType: string = 'view';

  @Input() constrainRotation: boolean|number;
  @Input() enableRotation: boolean;
  @Input() extent: Extent;
  @Input() maxResolution: number;
  @Input() minResolution: number;
  @Input() maxZoom: number;
  @Input() minZoom: number;
  @Input() resolution: number;
  @Input() resolutions: number[];
  @Input() rotation: number;
  @Input() zoom: number;
  @Input() zoomFactor: number;
  @Input() center: Coordinate;
  @Input() projection: ProjectionLike;

  @Input() zoomAnimation = false;

  constructor(private host: MapComponent) {
  }
  ngOnInit() {
    this.instance = new View(this);
    this.host.instance.setView(this.instance);
  }
  ngOnChanges(changes: SimpleChanges) {
    let properties: { [index: string]: any } = {};
    if (!this.instance) {
      return;
    }
    for (let key in changes) {
      if (changes.hasOwnProperty(key)) {
        switch (key) {
          case 'zoom':
            /** Work-around: setting the zoom via setProperties does not work. */
            if (this.zoomAnimation) {
              this.instance.animate({zoom: changes[key].currentValue});
            } else {
              this.instance.setZoom(changes[key].currentValue);
            }
            break;
          default:
            break;
        }
        properties[key] = changes[key].currentValue;
      }
    }
    // console.log('changes detected in aol-view, setting new properties: ', properties);
    this.instance.setProperties(properties, false);
  }
}
