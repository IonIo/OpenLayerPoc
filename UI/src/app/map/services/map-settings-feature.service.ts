import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

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
      foundItem = this.mapSettings$.getValue()[0]
    return foundItem;
  }
  constructor(private localStorageService: LocalStorageService) {
    this.mapSettings$ = new BehaviorSubject<MapSettings[]>(this.initStore());
  }

  initStore(): MapSettings[] {
    let mapSetting = this.localStorageService.getItem(this.KEY);
    if (!mapSetting) {
      mapSetting = gedInitData();
      this.localStorageService.setItem(this.KEY, mapSetting)
    }
    return mapSetting;
  }

  public addItem(item: MapSettings) {

    let mapSettings = this.mapSettings$.getValue();
    let index =  mapSettings.length; 
    let mapItem: MapSettings = {...item, id: (++index).toString() };
    mapSettings.push(mapItem);
    this.mapSettings$.next(mapSettings);
    this.localStorageService.setItem(this.KEY, mapSettings)
  }

  public updateItem(index: number, item: MapSettings) {

  }

  public removeItem(index: number, item: MapSettings) {

  }
}

export function gedInitData(): any {
  return [
    {
      staticSourceOptions: {
        html: '&copy; <a href="http://xkcd.com/license.html">xkcd</a>',
        url: 'http://localhost:61833/StaticFiles/maps.jpg'
      },
      zoom: 2,
      maxZoom: 8,
      name: "First Name",
      id: "1"
    }
  ]
}
