import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from "rxjs";

import * as ol from 'openlayers';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  private extent = [0, 0, 1024, 968];
  private projection = new ol.proj.Projection({
    code: 'xkcd-image',
    units: 'pixels',
    extent: this.extent
  });

  private esrijsonFormat = new ol.format.EsriJSON();
  public serviceUrl: string = 'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/' +
    'services/PDX_Pedestrian_Districts/FeatureServer/';

  public features$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedFeature$: Subject<any> = new Subject<any>();

  public get selectedFeature() : Observable<any> {
    return this.selectedFeature$.asObservable();
  }

  constructor(private http: HttpClient) { }

  loadFeatures(extent: any, resolution: any, projection: any, layer: any) {
    var url = this.serviceUrl + "0" + '/query/?f=json&' +
      'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
      encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
        extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
        ',"spatialReference":{"wkid":102100}}') +
      '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
      '&outSR=102100';

     this.http.get(url).subscribe(response => {
      var features = this.esrijsonFormat.readFeatures(response, {
        featureProjection: projection
      });
      if (features != null && features.length > 0) {
        this.features$.next(features);
      }
    });
  }

  addFeatures(feature: any) {
    let url = this.serviceUrl + "0" + '/addFeatures';
    let payload = this.getFeaturePayload(feature);
    const body = new HttpParams()
    .set('f', 'json')
    .set('features',  payload);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post(url, body.toString(),  { headers }).subscribe((result: any) => {
      if (result.addResults && result.addResults.length > 0) {
      if (result.addResults[0].success === true) {
            feature.setId(result.addResults[0]['objectId']);
           // this.vectorSource.clear();
          } else {
            var error = result.addResults[0].error;
            alert(error.description + ' (' + error.code + ')');
          }
        }
    })
  }

  

  updateFeatures(feature: any) {
    let url = this.serviceUrl + '0' + '/updateFeatures';
    let payload = this.getFeaturePayload(feature);
    const body = new HttpParams()
    .set('f', 'json')
    .set('features',  payload);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.http.post(url, body.toString(),  { headers }).subscribe((result: any) => {
      if (result.updateResults && result.updateResults.length > 0) {
        if (result.updateResults[0].success !== true) {
          var error = result.updateResults[0].error;
          alert(error.description + ' (' + error.code + ')');
        } else {
          //delete this.dirty[fid];
        }
      }
    });
  }

  private getFeaturePayload(feature: any) {
    let payload = '[' + this.esrijsonFormat.writeFeature(feature, {
      featureProjection: this.projection
    }) + ']';
    return payload;
  }
}
