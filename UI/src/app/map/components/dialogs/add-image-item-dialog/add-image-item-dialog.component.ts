import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MapSettingsFeatureService } from '../../../services/map-settings-feature.service';
import { UploadService } from '../../../services/upload.service';

@Component({
  selector: 'gsecm-add-image-item-dialog',
  templateUrl: './add-image-item-dialog.component.html',
  styleUrls: ['./add-image-item-dialog.component.css']
})
export class AddImageItemDialogComponent implements AfterViewInit {

  @ViewChild('file') file: ElementRef;
  @ViewChild('label') label: ElementRef;
  @ViewChild('fileName') fileName: ElementRef;
  private mapSettingsForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<AddImageItemDialogComponent>,
    private mapSettingsFeature: MapSettingsFeatureService,
    private uploadService: UploadService, private fb: FormBuilder) {

    this.mapSettingsForm = this.fb.group({
      name: ['', Validators.required],
      zoom: ['', Validators.required],
      maxZoom: ['', Validators.required]
    });
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

  save() {
    this.uploadService.uploadFile(this.file.nativeElement.files[0]).subscribe((response: any) => {
      if (response.status == 200) {
        let serviceImageUrl = 'http://localhost:61833/StaticFiles/{image}'
        let fileUrl = serviceImageUrl.replace('{image}', this.fileName.nativeElement.textContent);
        let staticSourceOptions = {
          staticSourceOptions: {
            html: '',
            url: fileUrl
          }
        }
        let settings = { ...this.mapSettingsForm.value, ...staticSourceOptions }
        this.mapSettingsFeature.addItem(settings)
      }
    });
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }
}
