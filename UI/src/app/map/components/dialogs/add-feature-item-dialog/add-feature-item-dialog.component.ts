import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as ol from 'openlayers';
import { MapFactory } from '../../../common/map-factory';

export class Feature {
  public geometry: string;
  public name: string;
  src: string;
  coordinate: [number, number]; 
  constructor() {}
}

@Component({
  selector: 'gsecm-add-feature-item-dialog',
  templateUrl:'./add-feature-item-dialog.component.html',
  styleUrls: ['./add-feature-item-dialog.component.css']
})
export class AddFeatureItemDialogComponent implements OnInit {

  featureForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddFeatureItemDialogComponent>, 
    private mapFactory: MapFactory,  private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data:any) {
   
    this.featureForm = this.fb.group({
      geometry: ['', Validators.required],
      name: ['', Validators.required],
      src: [''],
      coordinate: ['', Validators.required]
    });
  }

  ngOnInit() {
    let controls = this.featureForm.controls;
    Object.keys(controls).forEach(function(k, i) {
  });
  }
  save() {
    let newItem =  this.mapFactory.createIconFeature(this.featureForm.value);

    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }

  get isValid() { return this.featureForm.valid; }
}

// feature = this.mapFactory.createIconFeature({
//   geometry: 'POINT',
//   name: 'Test Name',
//   src: 'http://localhost:4251/assets/icon.png',
//   coordinate: evt.coordinate
// });
// feature.set("icon_style_options", {
//   'anchor': [0.5, 0.5],
//   'anchorxunits': 'pixels',
//   'anchoryunits': 'pixels',
//   'src': 'http://localhost:4251/assets/icon.png'
// })