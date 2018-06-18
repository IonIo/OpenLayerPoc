import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gsecm-list-map-image-group',
  template: `
  <mat-selection-list #shoes>
  <mat-list-option *ngFor="let shoe of typesOfShoes">
    {{shoe}}
  </mat-list-option>
</mat-selection-list>

<p>
  Options selected: {{shoes.selectedOptions.selected.length}}
</p>
  `,
  styleUrls: ['./list-map-image-group.component.css']
})
export class ListMapImageGroupComponent implements OnInit {
  typesOfShoes = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  constructor() { }

  ngOnInit() {
  }

}
