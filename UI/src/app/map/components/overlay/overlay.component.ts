import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'gsecm-overlay',
  template: '<ng-content></ng-content>'
})
export class OverlayComponent {
  constructor(
    public elementRef: ElementRef
  ) {
  }
}
