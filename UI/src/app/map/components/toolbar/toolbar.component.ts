import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'gsecm-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  
  private _mode: string = 'DRAW';
  public set selectedMode(mode: string) {
    this._mode = mode;
    this.selectedModeEvent.emit(mode);
  }
  public get selectedMode() :string {
    return this._mode;
  }

  private _featureType : string = 'Point';
  public get featureType() : string {
    return this._featureType;
  }
  public set featureType(type : string) {
    this._featureType = type;
    this.featureTypeEvent.emit(type);
  }

  @Output()
  openDialog: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  selectedModeEvent: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  featureTypeEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {

  }

}
