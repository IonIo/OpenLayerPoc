import { LayerImageComponent } from './../layer-image/layer-image.component';
import { SourceComponent } from './../source/source.component';
import { Component, Host, Input, OnInit, forwardRef } from '@angular/core';
import { ProjectionLike, source, Extent, AttributionLike, ImageLoadFunctionType, Size, olx } from 'openlayers';

@Component({
  selector: 'gsecm-source-imagestatic',
  template: `<ng-content></ng-content>`,
  providers: [{ provide: SourceComponent, useExisting: forwardRef(() => SourceImageStaticComponent) }],
  styles: []
})
export class SourceImageStaticComponent extends SourceComponent implements OnInit {
  instance: source.ImageStatic;

  @Input() projection: (ProjectionLike | string);
  @Input() imageExtent: Extent;
  @Input() url: string;
  @Input() attributions: AttributionLike;
  @Input() crossOrigin?: string;
  @Input() imageLoadFunction?: ImageLoadFunctionType;
  @Input() logo?: (string | olx.LogoOptions);
  @Input() imageSize?: Size;

  
  constructor(@Host() layer: LayerImageComponent) {
    super(layer);
  }

  ngOnInit() {
    this.instance = new source.ImageStatic(this);
    this.host.instance.setSource(this.instance);
  }
}
