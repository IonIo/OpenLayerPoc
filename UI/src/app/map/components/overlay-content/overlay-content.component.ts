import { FormModel } from './../forms/base/base-editor-form';
import { CameraEditFormComponent } from './../forms/camera-edit-form/camera-edit-form.component';
import { FormContentDirective } from './../../directives/form-content.directive';
import { GsecMapComponent } from './../gsec-map/gsec-map.component';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Host, ComponentFactoryResolver, OnDestroy, Type } from '@angular/core';
import * as ol from 'openlayers';
import { BaseEditorForm } from '../forms/base/base-editor-form';
import { PolygonEditFormComponent } from '../forms/polygon-edit-form/polygon-edit-form.component';
import { componentRefresh } from '@angular/core/src/render3/instructions';

type ComponentTypes  = CameraEditFormComponent | PolygonEditFormComponent;

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
  @ViewChild(FormContentDirective) host: FormContentDirective;
  
  private instance: BaseEditorForm<FormModel>;
  private _feature: any;
  overlay: any;
  @Input() set feature(feature: any) {
    if(feature != null) {
      let featureType = feature.getGeometry().getType();
      let coordinates = feature.get("position_coordinate")
      if(this.gsecMapComponent.selectedMode == 'DRAW') {
        if(featureType == "Point") {
          coordinates = feature.getGeometry().getCoordinates();
          this.createComponent(feature, featureType);
          this.overlay.setPosition(coordinates);
        }
      } else if (this.gsecMapComponent.selectedMode == 'MODIFY') {
        if(featureType == "Polygon") {
          this.createComponent(feature, 'Polygon');
          coordinates = feature.getGeometry().getCoordinates();
          this.overlay.setPosition(coordinates);
        }
      } 
    }
  }
  ngOnInit(): void {
  }
  constructor(@Host() public gsecMapComponent: GsecMapComponent, 
  private componentFactoryResolver: ComponentFactoryResolver) {}
  
  private createComponent(feature: any, featureType: string) {
    let component: Type<any> = CameraEditFormComponent;
    if(featureType == "Polygon") {
      component = PolygonEditFormComponent;
    }
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.instance = (<BaseEditorForm<FormModel>>componentRef.instance);
    this.instance.overlay = this.overlay;
    let op = this.gsecMapComponent.selectedMode == 'MODIFY' ? 'EDIT' : 'ADD'
    this.instance.feature({ payload: feature, operation: op });
  }

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
