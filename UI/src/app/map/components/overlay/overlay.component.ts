import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'gsecm-overlay',
  template: '<ng-content></ng-content>',
  styleUrls: ['./overlay.component.css']
})
export class OverlayComponent {
  constructor(
    public elementRef: ElementRef
  ) {
  }
}
