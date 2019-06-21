import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlacesPage } from './places.page';
import {PlacesRoutingModule} from './places-routing.module';

// const routes: Routes = [
//   {
//     path: '',
//     component: PlacesPage
//   }
// ];

@NgModule({
  imports: [
    CommonModule,
    PlacesRoutingModule,
    // FormsModule,
    IonicModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [PlacesPage]
})
export class PlacesPageModule {}
