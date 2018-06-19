import { UploadService } from '../../services/upload.service';
import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';

export interface Image {
  url: string;
  name: string;
}

@Component({
  selector: 'gsecm-add-image-item-dialog',
  template: `
  <h2 mat-dialog-title class="dialog-title">Add dashboard</h2>
  <mat-dialog-content>
    <div class="dialog-container">
    <input type="file" #file name="file" id="file" class="inputfile" data-multiple-caption="{count} files selected"/>
    <label for="file" #label><span>Choose a file</span></label>

    <mat-form-field >
    <input matInput placeholder="Favorite food" value="Sushi">
  </mat-form-field>

  <mat-form-field >
    <textarea matInput placeholder="Leave a comment"></textarea>
  </mat-form-field>

    </div>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button (click)="save()">Save</button>
    <button mat-button (click)="dismiss()">Cancel</button>
  </mat-dialog-actions>

  `,
  styleUrls: ['./add-image-item-dialog.component.css']
})
export class AddImageItemDialogComponent implements AfterViewInit {


  @ViewChild('file') file: ElementRef;

  @ViewChild('label') label: ElementRef;
  private image: Image;
  constructor(private dialogRef: MatDialogRef<AddImageItemDialogComponent>, private uploadService: UploadService) {
    this.image = { url: '', name: '' };
  }
  ngAfterViewInit() {
    var input = this.file.nativeElement,
     label = this.label.nativeElement,
    labelVal = label.innerHTML
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
  ngOnInit() {

  }
  save() {
    this.uploadService.uploadFile(this.file.nativeElement.files[0]).subscribe();
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }
}
