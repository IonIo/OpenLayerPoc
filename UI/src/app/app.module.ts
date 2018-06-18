import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialExportModule } from './angular-material-export/angular-material-export.module';
import { GsecMapComponent } from './map/gsec-map/gsec-map.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LayerComponent } from './layer/layer.component';
import { MapComponent } from './map/map.component';
import { ViewComponent } from './view/view.component';
import { CoordinateComponent } from './coordinate/coordinate.component';
import { SourceOsmComponent } from './source-osm/source-osm.component';
import { LayerTileComponent } from './layer-tile/layer-tile.component';
import { TileGridComponent } from './tilegrid/tilegrid.component';
import { SourceXYZComponent } from './source-xyz/source-xyz.component';
import { SourceComponent } from './source/source.component';
import { SourceImageStaticComponent } from './source-imagestatic/source-imagestatic.component';
import { LayerImageComponent } from './layer-image/layer-image.component';
import { ProtoMapComponent } from './proto-map/proto-map.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MainComponent } from './layout/main/main.component';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule } from '@angular/material';
import { ListMapImageGroupComponent } from './list-map-image-group/list-map-image-group.component';
import { ListMapImageItemComponent } from './list-map-image-item/list-map-image-item.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AddImageItemDialogComponent } from './add-image-item-dialog/add-image-item-dialog.component';
import { AddFeatureItemDialogComponent } from './add-feature-item-dialog/add-feature-item-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ViewComponent,
    CoordinateComponent,
    SourceOsmComponent,
    LayerTileComponent,
    SourceXYZComponent,
    TileGridComponent,
    SourceImageStaticComponent,
    LayerImageComponent,
    ProtoMapComponent,
    GsecMapComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    MyDashboardComponent,
    ListMapImageGroupComponent,
    ListMapImageItemComponent,
    AddImageItemDialogComponent,
    AddFeatureItemDialogComponent
  ],
  imports: [
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
  entryComponents: [AddFeatureItemDialogComponent, AddImageItemDialogComponent], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
