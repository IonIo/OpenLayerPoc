import { FeatureService } from './../../../services/feature.service';
import { MapFactory } from './../../../common/map-factory';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

export interface CameraPoint extends FormModel {

}

@Component({
  selector: 'gsecm-camera-edit-form',
  templateUrl: './camera-edit-form.component.html',
  styleUrls: ['./camera-edit-form.component.css']
})
export class CameraEditFormComponent extends BaseEditorForm<CameraPoint> implements OnDestroy {

  featureForm: FormGroup;
  
  public modeDescription: string = "Edit camera"

  @Input() coordinate: [number, number] = [0,0];

  @Input() overlay: any;

  @Input() mode?: 'EDIT' | 'ADD' = 'ADD';

  public setFeatureItem(feature: any) {

    super.setFeatureItem(feature.payload);


    if(feature.operation == "ADD") {
      this.modeDescription = "Add camera"
    }

    this.mode = feature.operation;

    if(feature.payload) {
      this.featureForm.patchValue({
        name: feature.payload.get("name"),
        coordinate: feature.payload.getGeometry().getCoordinates(),
        src: 'http://localhost:4251/assets/icon.png',
        geometry: 'POINT'
      });
    } else {
      this.featureForm.reset();
    }
  };

  public get featureItem(): any {
    return super.getGeatureItem();
  }


  constructor(private mapFactory: MapFactory, private featureService: FeatureService, private fb: FormBuilder) {

    super();   

    this.featureForm = this.fb.group({
      name: ['', Validators.required],
      src: [''],
      coordinate: [''],
      geometry: ['']
    });

    console.log("CameraEditFormComponent created")
  }

  ngOnDestroy(): void {
    console.log("CameraEditFormComponent destroyed")
  }

   public onSave(item: CameraPoint) {

    if(this.mode == 'ADD') {

      let newObject = this.mapFactory.createIconFeature(this.featureForm.value);
      this.featureService.addFeatures(newObject);

    } else {

      this.featureItem.set("name", this.featureForm.get("name").value);
      this.featureService.updateFeatures(this.featureItem);

    }
  }

  onDismiss(item: CameraPoint) {}

  get isValid() { return !this.featureForm.valid; }
}
