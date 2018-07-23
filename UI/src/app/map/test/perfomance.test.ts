import { range } from "rxjs/internal/observable/range";
import { mergeMap } from "rxjs/operators";
import { of } from "rxjs/internal/observable/of";
import { Observable } from "rxjs";

const maxRecord = 10;
const source = range(1, maxRecord);
const featuresObservable = source.pipe(mergeMap(val => {

        const randomElement = Math.floor(Math.random() * 2);     
        let feature = mockFatures[randomElement]

        if(feature.geometry.type ==  "Polygon") {
            feature.properties.name == `Hotspot map ${val}`;
           let [long, lati] = feature.properties.position_coordinate;
           feature.properties.position_coordinate = [(long + val), (lati + val)]
        }

        if(feature.geometry.type ==  "Point") {
            feature.properties.name == `Name ${val}`;
            let [long, lati] = feature.geometry.coordinates as number[];
            feature.properties.position_coordinate = [(long + val), (lati + val)]
        }
        return of(feature);
    } ))

 //featuresObservable.subscribe(feature => console.table(feature))

 export function mockDataGenerator() : Observable<any> {
      return featuresObservable;
 }

let mockFatures =
[
    {
        "type": "Feature",
        "id": 0,
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
        "id": 0,
        "geometry": {
          "type": "Point",
          "coordinates": [
            272.25779725611255,
            480.93748556077526
          ]
        },
        "properties": {
          "name": "",
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
