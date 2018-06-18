import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private url = 'api/FileAPI/UploadFile'
  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    let formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams();
    const options = {
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest('POST', this.url, formData, options);
    return this.http.request(req);
  }
}
