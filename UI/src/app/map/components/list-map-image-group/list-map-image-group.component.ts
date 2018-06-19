import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gsecm-list-map-image-group',
  template: `
  <mat-list>
  <h3 mat-subheader>Maps</h3>
  <mat-list-item *ngFor="let folder of folders">
    <mat-icon mat-list-icon>folder</mat-icon>
    <h4 mat-line>{{folder.name}}</h4>
    <p mat-line> {{folder.updated | date}} </p>
  </mat-list-item>
  <mat-divider></mat-divider>
</mat-list>
  `,
  styleUrls: ['./list-map-image-group.component.css']
})
export class ListMapImageGroupComponent implements OnInit {
  folders = [
    {
      name: 'Photos',
      updated: new Date('1/1/16'),
    },
    {
      name: 'Recipes',
      updated: new Date('1/17/16'),
    },
    {
      name: 'Work',
      updated: new Date('1/28/16'),
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
