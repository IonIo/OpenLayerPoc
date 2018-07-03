import { element } from 'protractor';
import { ActivatedRoute } from '@angular/router';
import { MapSettingsFeatureService } from './../../services/map-settings-feature.service';
import { FeatureService } from './../../services/feature.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { MatTableDataSource } from '@angular/material';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';


export interface FeatureElementElement {
  name: string;
  position: number;
}

@Component({
  selector: 'gsecm-camera-alarm-manager',
  templateUrl: './camera-alarm-manager.component.html',
  styleUrls: ['./camera-alarm-manager.component.css']
})
export class CameraAlarmManagerComponent implements OnInit {

  public hubUrl = 'http://localhost:4251/alarm';
  public hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl)
    .configureLogging(LogLevel.Information)
    .build();


  displayedColumns: string[] = ['select', 'position', 'name'];
  dataSource: MatTableDataSource<FeatureElementElement>;
  selection = new SelectionModel<FeatureElementElement>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  constructor(private route: ActivatedRoute, public featureService: FeatureService) {
    this.route.params
      .subscribe(params => {
        this.featureService.initStore(params['mapId'] || "1");
        const features = this.featureService.features$.getValue();
        const featureElementElement = features.filter(feature => feature.getGeometry().getType() == "Point" && feature.get("name") != null
        ).map(feature => {
          return {
            name: feature.get("name"),
            position: feature.getId()
          }
        })
        this.dataSource = new MatTableDataSource<FeatureElementElement>(featureElementElement);
      });
      this.hubConnection.start();
  }

  sendAlarm() {
    if(this.selection.selected.length > 0) {
      this.hubConnection.invoke('Send', JSON.stringify(this.selection.selected.map(element => element.position)));
    }
  }

  ngOnInit() {
  }

}
