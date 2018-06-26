import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialExportModule } from './angular-material-export/angular-material-export.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';

import { AppComponent } from './app.component';
import { OverlayComponent } from './map/components/overlay/overlay.component';

import {
  AddImageItemDialogComponent,
  AddFeatureItemDialogComponent,
  GsecMapComponent,
  ListMapImageGroupComponent,
  ListMapImageItemComponent,
} from './map/components/';

import {
  MapDashboardComponent,
} from './map/containers/';

import { OverlayContentComponent } from './map/components/overlay-content/overlay-content.component';
import { CameraEditFormComponent } from './map/components/forms/camera-edit-form/camera-edit-form.component';
import { FormContentDirective } from './map/directives/form-content.directive';
import { PolygonEditFormComponent } from './map/components/forms/polygon-edit-form/polygon-edit-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AddImageItemDialogComponent,
    AddFeatureItemDialogComponent,
    GsecMapComponent,
    MyDashboardComponent,
    ListMapImageGroupComponent,
    ListMapImageItemComponent,
    OverlayComponent,
    OverlayContentComponent,
    CameraEditFormComponent,
    FormContentDirective,
    PolygonEditFormComponent
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
    PolygonEditFormComponent,
    AddFeatureItemDialogComponent,
     AddImageItemDialogComponent, 
     CameraEditFormComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
