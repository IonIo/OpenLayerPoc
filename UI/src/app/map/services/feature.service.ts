import { UpdateFeatureAction, AddFeatureAction, RemoveFeatureAction } from './../common/actions';
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

  public featuresObservable(): Observable<any> {
    return this.features$.asObservable();
  }

  public get selectedFeature(): Observable<any> {
    return this.actions$.asObservable();
  }

  public getOpenLayerFeaturesFromGeoJsonFromat(geoJsonObject: any): any {
    if (this.geojsonFormat == null)
      return [];

    let features: any = this.geojsonFormat.readFeatures(geoJsonObject, {
      featureProjection: this.projection
    });
    return features
  }


  constructor(private http: HttpClient, private localStorage: LocalStorageService, public actionsBusService: ActionsBusService) {

    console.log("FeatureService created");

    this.actionsBusService.of(UpdateFeatureAction)
      .subscribe(action => {
        this.updateFeatures(action.payload);
      })
    this.actionsBusService.of(AddFeatureAction)
      .subscribe(action => {
        this.addFeatures(action.payload);
      })
    this.actionsBusService.of(RemoveFeatureAction)
      .subscribe(action => {
        this.removeFeatures(action.payload);
      })
  }

  initStore(mapId: string) {
    this.selectedMapId = mapId;
    let featureCollections: any = this.localStorage.getItem(this.KEY);
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
      this.localStorage.setItem(this.KEY, [...featureCollections, collectionForSelectedMap]);
    }
    this.features$.next(this.getOpenLayerFeaturesFromGeoJsonFromat(collectionForSelectedMap.featureCollection));
  }

  loadFeatures(extent: any, resolution: any, projection: any, layer: any) {
    let features = this.features$.getValue();
    if (features != null && features.length > 0) {
      this.features$.next(features);
    }
  }

  addFeatures(feature: any) {
    const featureConfig = this.getFeatureConfig();
    let index = featureConfig.collection[featureConfig.collectionIndex].featureCollection.features.length;
    feature.setId(++index)
    const newCollection = this.updateNestedFeaturesCollectionAddItem(featureConfig.collection, this.getFeaturePayload(feature), 
      featureConfig.collectionIndex)
    let features = this.getOpenLayerFeaturesFromGeoJsonFromat(newCollection[featureConfig.collectionIndex].featureCollection)
    this.features$.next(features);
    this.localStorage.setItem(this.KEY, newCollection);
  }


  updateFeatures(feature: any) {
    const featureConfig = this.getFeatureConfig();
    let newCollection = this.updateNestedFeaturesCollectionUpdateItem(featureConfig.collection, this.getFeaturePayload(feature), 
    featureConfig.collectionIndex);
    this.localStorage.setItem(this.KEY, newCollection);
  }

  removeFeatures(feature: any) {
    const featureConfig = this.getFeatureConfig();
    let newCollection = this.updateNestedFeaturesCollectionRemoveItem(featureConfig.collection, this.getFeaturePayload(feature), 
      featureConfig.collectionIndex);
    this.localStorage.setItem(this.KEY, newCollection);
  }

  private getFeatureConfig() {
    let items: any = this.localStorage.getItem(this.KEY);
    let collectionIndex = items.findIndex(item => item.mapId == this.selectedMapId);
    return {
      collection: items,
      collectionIndex: collectionIndex
    }
  }


  reducer(action: string, collection: any, itemCollectionToUpdate: any, feature: any) {
    let expression: (items: any, feature?: any) => any[] = null;
    switch (action) {
      case "ADD": {
        expression = (items) => [
          ...items.featureCollection.features,
          ...feature
        ];
      }
      case "UPDATE": {
        expression = (items, feature) => [
          ...items.featureCollection.features.map((item) => {
            if (item != null && item.id != null && item.id == feature.id) {
              return feature;
            }
            return item;
          })
        ];
      }
      case "REMOVE": {
        expression = (items, feature) => [
           ...items.featureCollection.features.filter(item => item.id !== feature.id)
        ];
      }
    };
    return collection.map((item, index) => {
      if (index !== itemCollectionToUpdate) {
        return item;
      }
      return {
        ...item,
        featureCollection: {
          ...item.featureCollection,
          features: [
            ...expression(item, feature)
          ]
        }
      }
    })
  }


  updateNestedFeaturesCollectionUpdateItem(collection: any, feature: any, itemCollectionToUpdate: number) {
    return collection.map((item, index) => {
      if (index !== itemCollectionToUpdate) {
        return item;
      }
      return {
        ...item,
        featureCollection: {
          ...item.featureCollection,
          features: [
            ...item.featureCollection.features.map((item, index) => {
              if (item != null && item.id != null && item.id == feature.id) {
                return feature;
              }
              return item;
            })
          ]
        }
      }
    });
  }

  updateNestedFeaturesCollectionRemoveItem(collection: any, feature: any, itemCollectionToUpdate: number) {
        return collection.map((item, index) => {
          if (index !== itemCollectionToUpdate) {
            return item;
          }
          return {
            ...item,
            featureCollection: {
              ...item.featureCollection,
              features: [
                ...item.featureCollection.features.filter(item => item.id !== feature.id)
              ]
            }
          }
        });
      }

  updateNestedFeaturesCollectionAddItem(collection: any, feature: any, itemToUpdate: number) {
        return collection.map((item, index) => {
          if (index !== itemToUpdate) {
            return item;
          }
          return {
            ...item,
            featureCollection: {
              ...item.featureCollection,
              features: [
                 ...item.featureCollection.features,
                 ...feature
              ]
            }
          }
        });
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
      "mapId": "1",
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