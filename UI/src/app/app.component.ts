import { Observable } from 'rxjs';
import { Component, AfterViewInit } from '@angular/core';
import * as ol from 'openlayers';
import { mockDataGenerator } from 'src/app/map/test/perfomance.test';
import { debug } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  mockData: Observable<any>
  constructor() {
    this.mockData = mockDataGenerator();
    this.mockData.subscribe(feature => {
    })
  }
}
