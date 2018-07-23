import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialExportModule } from './angular-material-export/angular-material-export.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';

import {
  EditMapItemDialogComponent,
  GsecMapComponent,
  ListMapImageGroupComponent,
  ListMapImageItemComponent,
  ToolbarComponent,
  OverlayContentComponent,
  CameraEditFormComponent,
  PolygonEditFormComponent,
  CameraAlarmManagerComponent,
  OverlayComponent
} from './map/components/';

import {
  MapDashboardComponent,
} from './map/containers/';

import { FormContentDirective } from './map/directives/form-content.directive';


@NgModule({
  declarations: [
    AppComponent,
    EditMapItemDialogComponent,
    GsecMapComponent,
    MapDashboardComponent,
    ListMapImageGroupComponent,
    ListMapImageItemComponent,
    OverlayComponent,
    OverlayContentComponent,
    CameraEditFormComponent,
    FormContentDirective,
    PolygonEditFormComponent,
    ToolbarComponent,
    CameraAlarmManagerComponent,
  ],
  imports: [
    AppRoutingModule,
    FormsModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialExportModule,
    BrowserModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule
  ],
  entryComponents: [
    EditMapItemDialogComponent,
    PolygonEditFormComponent,
    CameraEditFormComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
