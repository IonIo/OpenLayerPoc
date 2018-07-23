
import { Component, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { ActionsBusService } from './../../../services/actions-bus.service';
import { UploadService } from '../../../services/upload.service';

import { AddMapAction, UpdateMapAction } from './../../../common/actions';
import { MapSettings } from './../../../models/map-settings';


@Component({
  selector: 'gsecm-edit-map-item-dialog',
  templateUrl: './edit-map-item-dialog.component.html',
  styleUrls: ['./edit-map-item-dialog.component.css']
})
export class EditMapItemDialogComponent implements AfterViewInit {

  @ViewChild('file') file: ElementRef;
  @ViewChild('label') label: ElementRef;
  @ViewChild('fileName') fileName: ElementRef;
  public mapSettingsForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<EditMapItemDialogComponent>,
    private actionsBusService: ActionsBusService,
    private uploadService: UploadService, private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MapSettings) {
    this.mapSettingsForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      zoom: ['', Validators.required],
      maxZoom: ['', Validators.required]
    });
    if (data) {
      this.patchFormValues();
    }
  }

  ngAfterViewInit() {
    var input = this.file.nativeElement, label = this.label.nativeElement, labelVal = label.innerHTML;
    input.onchange = function (e) {
      var fileName = '';
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        label.querySelector('span').innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    };
  }

  patchFormValues(): void {
    this.mapSettingsForm.patchValue({
      id: this.data.id,
      zoom: this.data.zoom,
      maxZoom: this.data.maxZoom,
      name: this.data.name,
    })
  }

  save() {
    if (this.data) {
      this.actionsBusService.publish(new UpdateMapAction(this.mapSettingsForm.value));
    } else {
      this.create()
    }
    this.dialogRef.close();
  }

  private create() {
    this.uploadService.uploadFile(this.file.nativeElement.files[0]).subscribe((response: any) => {
      if (response.status == 200) {
        let serviceImageUrl = 'http://localhost:4251/StaticFiles/{image}'
        const fileUrl = serviceImageUrl.replace('{image}', this.fileName.nativeElement.textContent);
        const staticSourceOptions = {
          staticSourceOptions: {
            html: '',
            url: fileUrl
          }
        }
        const settings = { ...this.mapSettingsForm.value, ...staticSourceOptions };
        this.actionsBusService.publish(new AddMapAction(settings));
      }
    });
  }
  dismiss() {
    this.dialogRef.close();
  }
}
