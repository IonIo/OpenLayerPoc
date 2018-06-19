import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[form-content]'
})
export class FormContentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
