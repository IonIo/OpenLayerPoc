import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MapSettings } from '../../../models/map-settings';

@Component({
  selector: 'gsecm-list-map-image-group',
  templateUrl: './list-map-image-group.component.html',
  styleUrls: ['./list-map-image-group.component.css']
})
export class ListMapImageGroupComponent implements OnInit {

  private selectedMapSettings: MapSettings;
  @Input() mapsSettingsItems;
  @Input() routerLinkUrl;
  @Output() removeMap = new EventEmitter<MapSettings>();
  @Output() changeMap = new EventEmitter<MapSettings>();
  @Output() selectMap = new EventEmitter<MapSettings>();
  onMapSelected(item: MapSettings) {
    this.selectMap.emit(item);
    this.selectedMapSettings = item;
  }
  constructor() { }

  ngOnInit() {
  }

}
