import { ActionsBusService } from './actions-bus.service';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AddMapAction, UpdateMapAction, RemoveMapAction } from '../common/actions';
import { LocalStorageService } from './local-storage.service';

import { Injectable } from '@angular/core';

import { MapSettings } from './../models/map-settings';


@Injectable({
  providedIn: 'root'
})
export class MapSettingsFeatureService {
  private readonly KEY: string = "mapsetting";

  public mapSettings$: BehaviorSubject<MapSettings[]>;

  public get mapSettingsObservable(): Observable<MapSettings[]> {
    return this.mapSettings$.asObservable();
  }

  public getItemByMapId(id: string) {

    let foundItem = this.mapSettings$.getValue().find(item => item.id == id);

    if (!foundItem)
      foundItem = this.mapSettings$.getValue()[0];

    return foundItem;
  }
  constructor(private localStorageService: LocalStorageService, private actionsBusService: ActionsBusService) {

    this.mapSettings$ = new BehaviorSubject<MapSettings[]>(this.initStore());

    this.actionsBusService.of(AddMapAction)
      .subscribe(action => {
        this.addItem(action.payload);
      });

    this.actionsBusService.of(UpdateMapAction)
      .subscribe(action => {
        this.updateItem(action.payload);
      });

    this.actionsBusService.of(RemoveMapAction)
      .subscribe(action => {
        this.removeItem(action.payload);
      });
  }

  initStore(): MapSettings[] {

    let mapSetting = this.localStorageService.getItem(this.KEY);

    if (!mapSetting) {

      mapSetting = gedInitData();
      this.localStorageService.setItem(this.KEY, mapSetting);

    }
    return mapSetting;
  }

  public addItem(item: MapSettings) {
    const mapSettings = this.mapSettings$.getValue();

    let index = mapSettings.length;

    const mapItem: MapSettings = { ...item, id: (++index).toString() };
    const newArray = [...mapSettings, mapItem];

    this.saveAndPushUpdates(newArray);
  }

  public updateItem(item: MapSettings) {

    const mapSettings = this.mapSettings$.getValue();
    const newArray = mapSettings.map(mapSetting => {

      if (mapSetting.id === item.id) {
        const mapToUpdate = Object.assign({}, mapSetting, item);
        return mapToUpdate;
      }

      return mapSetting;

    });

    this.saveAndPushUpdates(newArray);
  }

  public removeItem(item: MapSettings) {

    const mapSettings = this.mapSettings$.getValue();
    const newArray = mapSettings.filter(mapSetting => mapSetting.id !== item.id);

    this.saveAndPushUpdates(newArray);
  }

  private saveAndPushUpdates(newArray: MapSettings[]) {
    this.mapSettings$.next(newArray);
    this.localStorageService.setItem(this.KEY, newArray)
  }
}

export function gedInitData(): any {
  return [
    {
      "staticSourceOptions": {
        "html": "&copy; <a href=\"http://xkcd.com/license.html\">xkcd</a>",
        "url": "http://localhost:4251/StaticFiles/maps.jpg"
      },
      "zoom": 2,
      "maxZoom": 8,
      "name": "Gsec Map 1",
      "id": "1"
    },
    {
      "name": "Gsec Map 2",
      "zoom": "2",
      "maxZoom": "8",
      "staticSourceOptions": {
        "html": "",
        "url": "http://localhost:4251/StaticFiles/GoogleMapSaver.jpg"
      },
      "id": "2"
    },
    {
      "id": "3",
      "name": "Gsec Map 3",
      "zoom": "2",
      "maxZoom": "10",
      "staticSourceOptions": {
        "html": "",
        "url": "http://localhost:4251/StaticFiles/object1.png"
      }
    }
  ]
}
