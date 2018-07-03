import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';
import { MapFactory } from '../../../common/map-factory';
import { FeatureService } from '../../../services/feature.service';
import { MapSettingsFeatureService } from '../../../services/map-settings-feature.service';
import { MapSettings } from '../../../models/map-settings';

export interface Polygon extends FormModel {

}

@Component({
  selector: 'gsecm-polygon-edit-form',
  templateUrl: './polygon-edit-form.component.html',
  styleUrls: ['./polygon-edit-form.component.css']
})
export class PolygonEditFormComponent extends BaseEditorForm<Polygon> {

  featureForm: FormGroup;
  maps: MapSettings[] = [];

  @Input() overlay: any;

  public setFeatureItem(feature: any) {

    super.setFeatureItem(feature.payload);

    this.maps = this.mapSettingsFeatureService.mapSettings$.getValue().filter(mapSettings => 
      mapSettings.id != this.featureService.selectedMapId)

    if(feature.payload) {
      this.featureForm.patchValue({ 
        name: feature.payload.get("name"), 
        destination: feature.payload.get("destination")
      });
    }

  };

  public get featureItem(): any {
    return super.getGeatureItem();
  }

  constructor(private mapSettingsFeatureService: MapSettingsFeatureService, 
    private featureService: FeatureService, private fb: FormBuilder) {

    super();

    this.featureForm = this.fb.group({
      name: ['', Validators.required],
      destination: ['']
    });
    
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
}

  onSave(item: Polygon) {
     this.featureItem.set("name", this.featureForm.get('name').value);
     this.featureItem.set("destination", this.featureForm.get('destination').value), 
     this.featureService.updateFeatures(this.featureItem);
  };

  onDismiss (item: Polygon) {};

  get isValid() { return !this.featureForm.valid; }
}
