import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeconductorPageRoutingModule } from './homeconductor-routing.module';

import { HomeconductorPage } from './homeconductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeconductorPageRoutingModule
  ],
  declarations: [HomeconductorPage]
})
export class HomeconductorPageModule {}
