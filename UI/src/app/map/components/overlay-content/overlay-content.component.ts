import { DrawFeatureMode, FeatureTypes, Map } from './../../interaction/action.compose';
import { ModifyFeatureAction, DrawFeatureAction } from './../../common/actions';
import { ActionsBusService } from './../../services/actions-bus.service';
import { FormModel } from './../forms/base/base-editor-form';
import { CameraEditFormComponent } from './../forms/camera-edit-form/camera-edit-form.component';
import { FormContentDirective } from './../../directives/form-content.directive';
import { GsecMapComponent } from './../gsec-map/gsec-map.component';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Host, ComponentFactoryResolver, OnDestroy, Type } from '@angular/core';
import * as ol from 'openlayers';
import { BaseEditorForm } from '../forms/base/base-editor-form';
import { PolygonEditFormComponent } from '../forms/polygon-edit-form/polygon-edit-form.component';

// export static class FeatureTypeName {
//   public static Camera = "Point";
//   public static Polygon = "Polygon";
// }



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
export class OverlayContentComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild("popup") container: ElementRef;
  @ViewChild("content") content: ElementRef;
  @ViewChild(FormContentDirective) host: FormContentDirective;
  
  public Camera = "Point";
  public Polygon = "Polygon";
  private instance: BaseEditorForm<FormModel>;
  public overlay: any;
  private componentsByFeatureType: Map<Type<any>> = {
    "Point": CameraEditFormComponent,
    "Polygon": PolygonEditFormComponent
  };

  
  constructor(@Host() public gsecMapComponent: GsecMapComponent,
    private componentFactoryResolver: ComponentFactoryResolver,
    public actionsBusService: ActionsBusService) {

    this.actionsBusService.of(DrawFeatureAction).subscribe(action => {
      let payload: DrawFeatureMode = action.payload;
      if (payload.type == this.Camera) {
        let coordinates = payload.feature.getGeometry().getCoordinates();
        this.createComponentAndShowOverlay(coordinates, payload.type, payload.feature);
      }
    })

    this.actionsBusService.of(ModifyFeatureAction).subscribe(action => {
      let payload: DrawFeatureMode = action.payload;
      if (payload.type ==  this.Polygon) {
        let coordinates = action.payload.get("position_coordinate")
        this.createComponentAndShowOverlay(coordinates, payload.type, payload.feature);
      }
    })
  }

  ngOnInit(): void { }
  
  ngAfterViewInit(): void {
    console.log('OverlayContentComponent')
    this.addOverlay();
  }
  

  private createComponentAndShowOverlay(coordinates: [number, number], featureType: FeatureTypes, feature: any) {
    this.createComponent(feature, featureType);
    this.overlay.setPosition(coordinates);
  }

  private createComponent(feature: any, featureType: FeatureTypes) {
    let component = this.componentsByFeatureType[featureType]
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    let viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();
    let componentRef = viewContainerRef.createComponent(componentFactory);
    this.instance = (<BaseEditorForm<FormModel>>componentRef.instance);
    this.instance.overlay = this.overlay;
    this.instance.feature({ payload: feature, operation: 'ADD' });
  }

  private addOverlay() {
    this.overlay = new ol.Overlay({
      element: this.container.nativeElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    setTimeout(() => {
      this.gsecMapComponent.map.addOverlay(this.overlay);
    }, 1000);
  }
  ngOnDestroy(): void {

  }
}
