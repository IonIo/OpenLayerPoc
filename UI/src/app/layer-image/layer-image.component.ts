import { MapComponent } from './../map/map.component';
import { LayerGroupComponent } from './../layer-group/layer-group.component';
import {
  Component, EventEmitter, Input, OnChanges, OnInit, Optional,
  SimpleChanges
} from '@angular/core';
import { Extent, layer, source } from 'openlayers';
import { LayerComponent } from '../layer/layer.component';

@Component({
  selector: 'gsecm-layer-image',
  template: `<ng-content></ng-content>`,
  styles: []
})
export class LayerImageComponent extends LayerComponent implements OnInit, OnChanges {
  public source: source.Image;

  @Input() opacity: number;
  @Input() visible: boolean;
  @Input() extent: Extent;
  @Input() minResolution: number;
  @Input() maxResolution: number;
  @Input() zIndex: number;

  constructor(map: MapComponent,
              @Optional() group?: LayerGroupComponent) {
    super(group || map);
  }

  ngOnInit() {
    this.instance = new layer.Image(this);
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}

