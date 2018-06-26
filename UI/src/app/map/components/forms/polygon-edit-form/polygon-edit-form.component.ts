import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';
import { MapFactory } from '../../../common/map-factory';
import { FeatureService } from '../../../services/feature.service';

export interface Polygon extends FormModel {

}

@Component({
  selector: 'gsecm-polygon-edit-form',
  templateUrl: './polygon-edit-form.component.html',
  styleUrls: ['./polygon-edit-form.component.css']
})
export class PolygonEditFormComponent extends BaseEditorForm<Polygon> {
  featureForm: FormGroup;
  @Input() overlay: any;
  @Input() feature(feature: any) {
    super.feature = feature;
    this.featureItem = feature;
    if(feature) {
      this.featureForm.patchValue({ 
        name: feature.get("name"), 
        destination: feature.get("destination")
      });
    }
  }
  constructor(private mapFactory: MapFactory, private featureService: FeatureService, private fb: FormBuilder) {
    super();
    this.featureForm = this.fb.group({
      name: ['', Validators.required],
      destination: ['']
    });
  }
  ngOnInit() {
  }

  onSave(item: Polygon) {
     this.featureItem.set("name", this.featureForm.get('name').value);
     this.featureItem.set("destination", this.featureForm.get('destination').value), 
     this.featureService.updateFeatures(this.featureItem)
  };
  onDismiss (item: Polygon) {

  };
  get isValid() { return !this.featureForm.valid; }
}
