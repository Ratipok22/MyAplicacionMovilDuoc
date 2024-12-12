import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeconductorPage } from './homeconductor.page';

const routes: Routes = [
  {
    path: '',
    component: HomeconductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeconductorPageRoutingModule {}
