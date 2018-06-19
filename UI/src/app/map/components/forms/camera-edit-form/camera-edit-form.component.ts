import { Component, OnInit, Input } from '@angular/core';
import { BaseEditorForm, FormModel } from '../base/base-editor-form';

export interface CameraPoint extends FormModel {

}


@Component({
  selector: 'gsecm-camera-edit-form',
  template: `
  <div class="example-container">
  <mat-form-field>
    <input matInput placeholder="Input" (click)="test">
  </mat-form-field>

  <mat-form-field>
    <textarea matInput placeholder="Textarea"></textarea>
  </mat-form-field>

  <mat-form-field>
    <mat-select placeholder="Select">
      <mat-option value="option">Option</mat-option>
    </mat-select>
  </mat-form-field>
  <mat-dialog-actions>
  <button mat-button (click)="save()">Save</button>
  <button mat-button (click)="save()">Cancel</button>
</mat-dialog-actions>
  </div>
 `,
  styleUrls: ['./camera-edit-form.component.css']
})
export class CameraEditFormComponent extends BaseEditorForm<CameraPoint> {

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
