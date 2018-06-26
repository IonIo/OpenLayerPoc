import { FeatureService } from './../../../services/feature.service';
import { MapFactory } from './../../../common/map-factory';
import { Component, OnInit, Input } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

export interface CameraPoint extends FormModel {

}

@Component({
  selector: 'gsecm-camera-edit-form',
  templateUrl: './camera-edit-form.component.html',
  styleUrls: ['./camera-edit-form.component.css']
})
export class CameraEditFormComponent extends BaseEditorForm<CameraPoint> {

  private modeDescription: string = "Edit camera"
  @Input() coordinate: [number, number] = [0,0];
  @Input() overlay: any;
  @Input() mode?: 'EDIT' | 'ADD' = 'ADD';
  @Input() feature(feature: any) {
    super.feature = feature.payload;
    if(feature.operation == "ADD") {
      this.modeDescription = "Add camera"
    }
    if(feature.payload) {
      this.featureForm.patchValue({
        name: "Hello",
        coordinate: feature.payload.getGeometry().getCoordinates(),
        src: 'http://localhost:4251/assets/icon.png',
        geometry: 'POINT'
      })
    } else {
      this.featureForm.reset();
    }
  }

  featureForm: FormGroup;

  constructor(private mapFactory: MapFactory, private featureService: FeatureService, private fb: FormBuilder) {
    super();   
    this.featureForm = this.fb.group({
      name: ['', Validators.required],
      src: [''],
      coordinate: [''],
      geometry: ['']
    });
  }

  onSave(item: CameraPoint) {
    let newObject = this.mapFactory.createIconFeature(this.featureForm.value);
    this.featureService.addFeatures(newObject);
  }
  onDismiss(item: CameraPoint) {

  }

  ngOnInit() {
  }
  get isValid() { return !this.featureForm.valid; }
}
