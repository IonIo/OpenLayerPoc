import { FormModel } from './../forms/base/base-editor-form';
import { CameraEditFormComponent } from './../forms/camera-edit-form/camera-edit-form.component';
import { FormContentDirective } from './../../directives/form-content.directive';
import { GsecMapComponent } from './../gsec-map/gsec-map.component';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Host, ComponentFactoryResolver, OnDestroy, Type } from '@angular/core';
import * as ol from 'openlayers';
import { BaseEditorForm } from '../forms/base/base-editor-form';

// <a href="#" id="popup-closer" #closer class="ol-popup-closer"></a>
@Component({
  selector: 'gsecm-overlay-content',
  template: `
  <div id="popup" class="ol-popup" #popup>
    <div id="popup-content" #content >
     <ng-template form-content></ng-template>
    </div>
</div>
  `,
  styleUrls: ['./overlay-content.component.css']
})
export class OverlayContentComponent implements AfterViewInit, OnInit, OnDestroy  {
  
  @ViewChild("popup") container: ElementRef;
  @ViewChild("content") content: ElementRef;
  // @ViewChild("closer") closer: ElementRef;
  @ViewChild(FormContentDirective) host: FormContentDirective;
  
  private instance: BaseEditorForm<FormModel>;
  private _feature: any;
  overlay: any;
  @Input() set feature(feature: any) {
    if(feature != null) {
      var coordinates = feature.getGeometry().getCoordinates();
      this.instance.overlay = this.overlay;
      this.instance.feature = this.feature;
      this.overlay.setPosition(coordinates);
    }
  }

  ngOnInit(): void {
    let component: Type<any> = CameraEditFormComponent;
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.instance = (<BaseEditorForm<FormModel>>componentRef.instance);
  }

  constructor(@Host() public gsecMapComponent: GsecMapComponent, 
  private componentFactoryResolver: ComponentFactoryResolver) {}
  
  ngAfterViewInit(): void {
     this.addOverlay();
  }

  private addOverlay() {
    this.overlay = new ol.Overlay({
      element: this.container.nativeElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    setTimeout(()=>{    
      this.gsecMapComponent.map.addOverlay(this.overlay);
    }, 1000);
  }
  ngOnDestroy(): void {

  }
}
