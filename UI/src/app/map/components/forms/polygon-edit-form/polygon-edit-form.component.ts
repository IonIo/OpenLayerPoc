import { Component, OnInit, Input } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';

export interface Polygon extends FormModel {

}

@Component({
  selector: 'gsecm-polygon-edit-form',
  templateUrl: './polygon-edit-form.component.html',
  styleUrls: ['./polygon-edit-form.component.css']
})
export class PolygonEditFormComponent extends BaseEditorForm<Polygon> {

  @Input() overlay: any;
  @Input() feature(feature: any) {
    super.feature = feature;
  }
  constructor() {
    super();
  }
  ngOnInit() {
  }
}
