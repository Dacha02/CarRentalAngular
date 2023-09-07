import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CarsComponent} from "./cars/cars.component";
import {SinglecarComponent} from "../singlecar/singlecar/singlecar.component";


const routes: Routes = [
  {
    path: '',
    component: CarsComponent,
  },

  {
    path: 'car/:id',
    component: SinglecarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarsRoutingModule {
}
