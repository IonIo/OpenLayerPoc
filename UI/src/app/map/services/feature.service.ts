import { UpdateFeatureAction, AddFeatureAction } from './../common/actions';
import { Feature } from 'ol/feature';

import { LocalStorageService } from './local-storage.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject, Subject } from "rxjs";


import * as ol from 'openlayers';
import { ActionsBusService } from './actions-bus.service';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private unsubscribe = new Subject<void>();
  private geojsonFormat = new ol.format.GeoJSON();
  private readonly KEY: string = "feature";
  private extent = [0, 0, 1024, 968];
  private projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent
  });
  public selectedMapId: string;
  public features$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public actions$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public get selectedFeature(): Observable<any> {
    return this.actions$.asObservable();
  }

  public getOpenLayerFeaturesFromGeoJsonFromat(geoJsonObject: any): any{
    if (this.geojsonFormat == null)
      return [];

    let features: any = this.geojsonFormat.readFeatures(geoJsonObject, {
      featureProjection: this.projection
    });
    return features
  }


  constructor(private http: HttpClient, private localStorage: LocalStorageService,public  actionsBusService: ActionsBusService) {

  this.actionsBusService.of(UpdateFeatureAction)
    //.pipe(takeUntil(this.unsubscribe))
     .subscribe(action => {
       debugger;
        this.updateFeatures(action.payload);
     })
     this.actionsBusService.of(AddFeatureAction)
     //.pipe(takeUntil(this.unsubscribe))
      .subscribe(action => {
        debugger;
         this.addFeatures(action.payload);
      })     
   }

  initStore(mapId: string) {
    this.selectedMapId = mapId;
    let featureCollections: any = this.localStorage.getItem(this.KEY);
    //If not inialized load test data
    if (!featureCollections) {
      featureCollections = gedInitData();
      this.localStorage.setItem(this.KEY, featureCollections)
    }
    this.setFeatureCollectionIfNotExist(featureCollections);
  }

  private setFeatureCollectionIfNotExist(featureCollections: any) {
    let collectionForSelectedMap: any = featureCollections.find(item => item.mapId == this.selectedMapId);
    if (!collectionForSelectedMap) {
      collectionForSelectedMap = { mapId: this.selectedMapId, featureCollection: getDefaultFeatureCollectionDefinition() }
      featureCollections.push(collectionForSelectedMap);
      this.localStorage.setItem(this.KEY, collectionForSelectedMap);
    }
    let filtered = collectionForSelectedMap.featureCollection.features.filter(item => item != null);
    collectionForSelectedMap.featureCollection.features = filtered;
    this.features$ = new BehaviorSubject<any>(this.getOpenLayerFeaturesFromGeoJsonFromat(collectionForSelectedMap.featureCollection));
  }

  loadFeatures(extent: any, resolution: any, projection: any, layer: any) {
    let features = this.features$.getValue();
    if (features != null && features.length > 0) {
      this.features$.next(features);
    }
  }

  addFeatures(feature: any) {
    let collection: any = this.localStorage.getItem(this.KEY);
    let concreateCollectionOfFeature = collection.find(item => item.mapId == this.selectedMapId);
    let featureCollection = concreateCollectionOfFeature.featureCollection.features;
    feature.setId(++featureCollection.length)
    let payload = this.getFeaturePayload(feature);
    let newArray = [...featureCollection, ...payload];
    let newArray2 = newArray.filter(item => item != null);
    concreateCollectionOfFeature.featureCollection.features = newArray2;
    this.localStorage.setItem(this.KEY, collection);
    let features: any = this.geojsonFormat.readFeatures(concreateCollectionOfFeature.featureCollection, {
      featureProjection: this.projection
    });
    this.features$.next(features);
  }

  updateFeatures(feature: any) {
    let collection: any = this.localStorage.getItem(this.KEY);
    let concreateCollectionOfFeature = collection.find(item => item.mapId == this.selectedMapId);
    let payload = this.getFeaturePayload(feature);
    let newArray = concreateCollectionOfFeature.featureCollection.features.map((item, index) => {
      if (item.id == payload) {
        return payload;
      }
      return item;
    }).filter(item => item != null);
    concreateCollectionOfFeature.featureCollection.features = newArray;
    this.localStorage.setItem(this.KEY, collection);
  }

  private getFeaturePayload(feature: any) {
    let payload = this.geojsonFormat.writeFeature(feature, {
      featureProjection: this.projection
    })
    return JSON.parse(payload);
  }
}


export function gedInitData(): any {
  return [
    {
      "mapId": 1,
      "featureCollection": {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:3857"
          }
        },
        "features": [
          {
            "type": "Feature",
            "id": 1,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    631.0077972561126,
                    650.4765480607753
                  ],
                  [
                    520.0077972561126,
                    480.97654435038623
                  ],
                  [
                    1012.0077972561126,
                    519.9765443503862
                  ],
                  [
                    631.0077972561126,
                    650.4765480607753
                  ]
                ]
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "position_coordinate": [
                787.0077972561126,
                561.4374855607753
              ],
              "destination": "r"
            }
          }
        ]
      }
    },
    {
      "mapId": "2",
      "featureCollection": {
        "type": "FeatureCollection",
        "crs": {
          "type": "name",
          "properties": {
            "name": "EPSG:3857"
          }
        },
        "features": [
          {
            "type": "Feature",
            "id": 1,
            "geometry": {
              "type": "Point",
              "coordinates": [
                285.25779725611255,
                425.47654806077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 2,
            "geometry": {
              "type": "Point",
              "coordinates": [
                610.7577972561126,
                549.9765480607753
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 3,
            "geometry": {
              "type": "Point",
              "coordinates": [
                501.25779779255436,
                405.97654913365886
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 4,
            "geometry": {
              "type": "Point",
              "coordinates": [
                699.2577972561126,
                347.47654806077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 5,
            "geometry": {
              "type": "Point",
              "coordinates": [
                282.25779725611255,
                647.4765480607753
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 6,
            "geometry": {
              "type": "Point",
              "coordinates": [
                237.25779725611255,
                272.47654806077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 7,
            "geometry": {
              "type": "Point",
              "coordinates": [
                515.282210759819,
                405.30955788493196
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 8,
            "geometry": {
              "type": "Point",
              "coordinates": [
                451.757798597217,
                395.4765479713683
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 9,
            "geometry": {
              "type": "Point",
              "coordinates": [
                757.7577985972171,
                590.4765479713683
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 10,
            "geometry": {
              "type": "Point",
              "coordinates": [
                387.25779725611255,
                602.4765480607753
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 11,
            "geometry": {
              "type": "Point",
              "coordinates": [
                475.75779725611255,
                548.4765457808976
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 12,
            "geometry": {
              "type": "Point",
              "coordinates": [
                835.7577972561126,
                477.97654806077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 13,
            "geometry": {
              "type": "Point",
              "coordinates": [
                -10.242202743887447,
                478.93748556077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 14,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    159.25779725611255,
                    697.9374855607753
                  ],
                  [
                    162.25779725611255,
                    507.4374797940259
                  ],
                  [
                    615.2577972561126,
                    577.9374797940259
                  ],
                  [
                    159.25779725611255,
                    697.9374855607753
                  ]
                ]
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 14,
            "geometry": {
              "type": "Point",
              "coordinates": [
                105.75779725611255,
                369.43748556077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 15,
            "geometry": {
              "type": "Point",
              "coordinates": [
                354.75779725611255,
                358.93748556077526
              ]
            },
            "properties": {
              "name": "Test Name",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorxunits": "pixels",
                "anchoryunits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 16,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    608.2577969431882,
                    396.4374851584439
                  ],
                  [
                    708.7577969431882,
                    547.9374851584439
                  ],
                  [
                    824.2577969431882,
                    370.9374851584439
                  ],
                  [
                    608.2577969431882,
                    396.4374851584439
                  ]
                ]
              ]
            },
            "properties": null
          }
        ]
      }
    }
  ]
}

export function getDefaultFeatureCollectionDefinition(): any {
  return {
    'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:3857'
      }
    },
    'features': []
  }
}