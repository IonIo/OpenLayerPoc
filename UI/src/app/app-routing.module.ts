
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapDashboardComponent } from './map/containers';


const routes: Routes = [
    { path: 'map',  component: MapDashboardComponent },
    { path: 'map/:mapId', component: MapDashboardComponent, },
    { path: '**', redirectTo: 'map' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
