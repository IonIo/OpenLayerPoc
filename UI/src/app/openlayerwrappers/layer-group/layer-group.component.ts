import { Component, OnDestroy, OnInit, SkipSelf, Inject, Optional } from '@angular/core';
import { layer } from 'openlayers';
import * as ol from 'openlayers';

import { LayerComponent } from '../layer/layer.component';
import { MapComponent } from '../../map/map.component';


@Component({
  selector: 'gsecm-layer-group',
  template: `<ng-content></ng-content>`,
  styles: []
})
export class LayerGroupComponent extends LayerComponent implements OnInit, OnDestroy {
  public instance: ol.layer.Group;

  constructor(map: MapComponent,
              @SkipSelf() @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }
  
  ngOnInit() {
    this.instance = new layer.Group(this);
    super.ngOnInit();
  }
}