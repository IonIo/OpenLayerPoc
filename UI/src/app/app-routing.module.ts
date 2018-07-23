
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapDashboardComponent } from './map/containers';
import { CameraAlarmManagerComponent } from './map/components';


const routes: Routes = [
  { path: 'map', component: MapDashboardComponent },
  { path: 'map/:mapId', component: MapDashboardComponent },
  { path: 'map/:mapId/alarm', component: CameraAlarmManagerComponent },
  { path: '**', redirectTo: 'map' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
