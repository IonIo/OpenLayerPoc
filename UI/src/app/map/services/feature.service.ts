import { UpdateFeatureAction, AddFeatureAction, RemoveFeatureAction } from './../common/actions';
import { Feature } from 'ol/feature';
import { interval } from 'rxjs';

import { LocalStorageService } from './local-storage.service';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject, Subject } from "rxjs";


import * as ol from 'openlayers';
import { ActionsBusService } from './actions-bus.service';
import { takeUntil } from 'rxjs/operators';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  public hubUrl = 'http://localhost:4251/alarm';
  public hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl)
    .configureLogging(LogLevel.Information)
    .build();

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

  public featuresObservable(): Observable<any> {
    return this.features$.asObservable();
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
      });

    this.actionsBusService.of(AddFeatureAction)
      .subscribe(action => {
        this.addFeatures(action.payload);
      });

    this.actionsBusService.of(RemoveFeatureAction)
      .subscribe(action => {
        this.removeFeatures(action.payload);
      });

  }


  initStore(mapId: string) {

    this.selectedMapId = mapId;

    let featureCollections: any = this.localStorage.getItem(this.KEY);

    if (!featureCollections) {

      featureCollections = gedInitData();
      this.localStorage.setItem(this.KEY, featureCollections);

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
    feature.setId(++index);

    const newCollection = this.updateNestedFeaturesCollectionAddItem(featureConfig.collection, this.getFeaturePayload(feature), 
      featureConfig.collectionIndex)

     this.saveAndPushUpdates(newCollection);
  }


  updateFeatures(feature: any) {

    const featureConfig = this.getFeatureConfig();

    let newCollection = this.updateNestedFeaturesCollectionUpdateItem(featureConfig.collection, this.getFeaturePayload(feature), 
    featureConfig.collectionIndex);

    this.saveAndPushUpdates(newCollection);
  }

  removeFeatures(feature: any) {

    const featureConfig = this.getFeatureConfig();

    let newCollection = this.updateNestedFeaturesCollectionRemoveItem(featureConfig.collection, this.getFeaturePayload(feature), 
      featureConfig.collectionIndex);

      this.saveAndPushUpdates(newCollection);
  }

  

  private getFeatureConfig() {
    let items: any = this.localStorage.getItem(this.KEY);
    let collectionIndex = items.findIndex(item => item.mapId == this.selectedMapId);
    return {
      collection: items,
      collectionIndex: collectionIndex
    }
  }

  saveAndPushUpdates(newCollection) {
    let features = this.getOpenLayerFeaturesFromGeoJsonFromat(newCollection[this.getFeatureConfig().collectionIndex].featureCollection)
    this.features$.next(features);
    this.localStorage.setItem(this.KEY, newCollection);
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
            "id": 13,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    273.6327971220021,
                    461.4374852031474
                  ],
                  [
                    255.6327971220021,
                    272.4374852031474
                  ],
                  [
                    287.1327971220021,
                    288.9374852031474
                  ],
                  [
                    321.6327971220021,
                    281.4374852031474
                  ],
                  [
                    375.6327971220021,
                    272.4374852031474
                  ],
                  [
                    384.6327971220021,
                    446.4374852031474
                  ],
                  [
                    273.6327971220021,
                    461.4374852031474
                  ]
                ]
              ]
            },
            "properties": {
              "position_coordinate": [
                336.75779725611255,
                362.43748556077526
              ],
              "name": "Hotspot map 12",
              "destination": {
                "name": "Gsec Map 2",
                "zoom": "2",
                "maxZoom": "8",
                "staticSourceOptions": {
                  "html": "",
                  "url": "http://localhost:4251/StaticFiles/GoogleMapSaver.jpg"
                },
                "id": "2"
              }
            }
          },
          {
            "type": "Feature",
            "id": 2,
            "geometry": {
              "type": "Point",
              "coordinates": [
                272.25779725611255,
                480.93748556077526
              ]
            },
            "properties": {
              "name": "001",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                380.25779725611255,
                455.43748556077526
              ]
            },
            "properties": {
              "name": "002",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                245.25779725611255,
                300.93748556077526
              ]
            },
            "properties": {
              "name": "003",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                390.75779725611255,
                272.43748556077526
              ]
            },
            "properties": {
              "name": "004",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 6,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    14.257797256112553,
                    182.43748556077526
                  ],
                  [
                    18.757797256112553,
                    41.43748556077526
                  ],
                  [
                    156.75779725611255,
                    41.43748556077526
                  ],
                  [
                    158.25779725611255,
                    185.43748556077526
                  ],
                  [
                    14.257797256112553,
                    182.43748556077526
                  ]
                ]
              ]
            },
            "properties": {
              "position_coordinate": [
                108.75779725611255,
                123.93748556077526
              ],
              "name": "Super polygon",
              "destination": {
                "id": "3",
                "name": "Gsec Map 3",
                "zoom": "2",
                "maxZoom": "10",
                "staticSourceOptions": {
                  "html": "",
                  "url": "http://localhost:4251/StaticFiles/object1.png"
                }
              }
            }
          },
          {
            "type": "Feature",
            "id": 7,
            "geometry": {
              "type": "Point",
              "coordinates": [
                284.63279725611255,
                597.9374855607753
              ]
            },
            "properties": {
              "name": "005",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
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
            "id": 19,
            "geometry": {
              "type": "Point",
              "coordinates": [
                540.7577981054787,
                623.4374833256011
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 20,
            "geometry": {
              "type": "Point",
              "coordinates": [
                591.7577981054787,
                495.9374833256011
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 21,
            "geometry": {
              "type": "Point",
              "coordinates": [
                465.75779806077526,
                383.4374832808976
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 23,
            "geometry": {
              "type": "Point",
              "coordinates": [
                512.2577984631066,
                561.937483683229
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 24,
            "geometry": {
              "type": "Point",
              "coordinates": [
                485.25779846310655,
                626.437483683229
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 25,
            "geometry": {
              "type": "Point",
              "coordinates": [
                519.7577984631066,
                642.937483683229
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 28,
            "geometry": {
              "type": "Point",
              "coordinates": [
                543.7577984631066,
                620.437483683229
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
                299.13279725611255,
                623.4374855607753
              ]
            },
            "properties": {
              "name": "001",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                203.13279725611255,
                548.4374855607753
              ]
            },
            "properties": {
              "name": "002",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 16,
            "geometry": {
              "type": "Point",
              "coordinates": [
                362.13279725611255,
                495.93748556077526
              ]
            },
            "properties": {
              "name": "003",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 17,
            "geometry": {
              "type": "Point",
              "coordinates": [
                266.13279725611255,
                447.93748556077526
              ]
            },
            "properties": {
              "name": "004",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 18,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    237.63279725611255,
                    557.4374855607753
                  ],
                  [
                    299.13279725611255,
                    612.9374855607753
                  ],
                  [
                    362.13279725611255,
                    494.43748556077526
                  ],
                  [
                    288.63279725611255,
                    432.93748556077526
                  ],
                  [
                    222.63279725611255,
                    542.4374855607753
                  ],
                  [
                    237.63279725611255,
                    557.4374855607753
                  ]
                ]
              ]
            },
            "properties": {
              "position_coordinate": [
                293.25779725611255,
                543.9374855607753
              ],
              "name": "Link to map 1",
              "destination": {
                "staticSourceOptions": {
                  "html": "&copy; <a href=\"http://xkcd.com/license.html\">xkcd</a>",
                  "url": "http://localhost:4251/StaticFiles/maps.jpg"
                },
                "zoom": 2,
                "maxZoom": 8,
                "name": "Gsec Map 1",
                "id": "1"
              }
            }
          }
        ]
      }
    },
    {
      "mapId": "3",
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
            "id": 13,
            "geometry": {
              "type": "Point",
              "coordinates": [
                512.2577972561126,
                724.9374802857643
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
                519.757797300816,
                870.4374803304678
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 15,
            "geometry": {
              "type": "Point",
              "coordinates": [
                623.2577975243335,
                871.9374803304678
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 16,
            "geometry": {
              "type": "Point",
              "coordinates": [
                626.2577975243335,
                721.9374803304678
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 19,
            "geometry": {
              "type": "Point",
              "coordinates": [
                519.7577975243335,
                727.9374803304678
              ]
            },
            "properties": null
          },
          {
            "type": "Feature",
            "id": 7,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    509.25779640674637,
                    395.43748556077526
                  ],
                  [
                    506.25779640674637,
                    254.43748556077526
                  ],
                  [
                    627.7577953785662,
                    252.93748457729862
                  ],
                  [
                    626.2577953785662,
                    399.9374845772986
                  ],
                  [
                    509.25779640674637,
                    395.43748556077526
                  ]
                ]
              ]
            },
            "properties": {
              "position_coordinate": [
                567.7577972561126,
                365.43748556077526
              ],
              "name": "Super",
              "destination": {
                "name": "Gsec Map 2",
                "zoom": "2",
                "maxZoom": "8",
                "staticSourceOptions": {
                  "html": "",
                  "url": "http://localhost:4251/StaticFiles/GoogleMapSaver.jpg"
                },
                "id": "2"
              }
            }
          },
          {
            "type": "Feature",
            "id": 8,
            "geometry": {
              "type": "Point",
              "coordinates": [
                486.75779725611255,
                398.43748556077526
              ]
            },
            "properties": {
              "name": "004",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              },
              "position_coordinate": [
                506.25779725611255,
                393.93748556077526
              ]
            }
          },
          {
            "type": "Feature",
            "id": 8,
            "geometry": {
              "type": "Point",
              "coordinates": [
                486.75779725611255,
                398.43748556077526
              ]
            },
            "properties": {
              "name": "004",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              },
              "position_coordinate": [
                506.25779725611255,
                393.93748556077526
              ]
            }
          },
          {
            "type": "Feature",
            "id": 9,
            "geometry": {
              "type": "Point",
              "coordinates": [
                516.7577972561126,
                254.43748556077526
              ]
            },
            "properties": {
              "name": "003",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                633.7577972561126,
                401.43748556077526
              ]
            },
            "properties": {
              "name": "004",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                651.7577972561126,
                257.43748556077526
              ]
            },
            "properties": {
              "name": "005",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          }
        ]
      }
    },
    {
      "mapId": "4",
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
                398.25779725611255,
                777.9374855607753
              ]
            },
            "properties": {
              "name": "12",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                495.75779725611255,
                771.9374811798339
              ]
            },
            "properties": {
              "name": "12",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                411.75779725611255,
                702.9374811798339
              ]
            },
            "properties": {
              "name": "12",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
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
                492.75779725611255,
                693.9374811798339
              ]
            },
            "properties": {
              "name": "12",
              "population": 4000,
              "rainfall": 500,
              "featuretype": "POINT",
              "icon_style_options": {
                "anchor": [
                  0.5,
                  0.5
                ],
                "anchorXUnits": "pixels",
                "anchorYUnits": "pixels",
                "src": "http://localhost:4251/assets/icon.png"
              }
            }
          },
          {
            "type": "Feature",
            "id": 5,
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    399.75779645144985,
                    776.4374858736996
                  ],
                  [
                    398.25779645144985,
                    690.9374858736996
                  ],
                  [
                    513.7577964514498,
                    683.4374858736996
                  ],
                  [
                    513.7577964514498,
                    789.9374858736996
                  ],
                  [
                    399.75779645144985,
                    776.4374858736996
                  ]
                ]
              ]
            },
            "properties": {
              "position_coordinate": [
                470.25779645144985,
                753.9374858736996
              ],
              "name": "Link",
              "destination": {
                "id": "3",
                "name": "Gsec Map 3",
                "zoom": "2",
                "maxZoom": "10",
                "staticSourceOptions": {
                  "html": "",
                  "url": "http://localhost:4251/StaticFiles/object1.png"
                }
              }
            }
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