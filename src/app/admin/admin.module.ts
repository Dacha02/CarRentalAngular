import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminAddPriceComponent } from './components/admin-add-price/admin-add-price.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminAddCarComponent } from './components/admin-add-car/admin-add-car.component';
import { AdminCarsComponent } from './components/admin-cars/admin-cars.component';
import {CarsModule} from "../components/cars/cars.module";
import {SharedModule} from "../shared/shared.module";
import { AdminRentingsComponent } from './components/admin-rentings/admin-rentings/admin-rentings.component';


@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminAddPriceComponent,
    AdminAddCarComponent,
    AdminCarsComponent,
    AdminRentingsComponent,
    // Add more admin-specific components as needed
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ReactiveFormsModule,
        CarsModule,
        SharedModule
    ]
})
export class AdminModule { }