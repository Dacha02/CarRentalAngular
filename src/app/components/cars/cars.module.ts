import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CarsComponent } from "./cars/cars.component";
import {CarService} from "./services/cars/car.service";
import {ManufacturerService} from "./services/manufacturers/manufacturer.service";
import {ModelService} from "./services/models/model.service";
import {CategoryService} from "./services/categories/category.service";

import {CarsRoutingModule} from './cars-routing.module';
import {SinglecarComponent} from "../singlecar/singlecar/singlecar.component";
import {CarCardComponent} from "./car-card/car-card.component";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
    declarations: [CarsComponent, SinglecarComponent, CarCardComponent],
    imports: [CommonModule, CarsRoutingModule, SharedModule, ReactiveFormsModule],
    providers: [CarService, ManufacturerService, ModelService, CategoryService],
    exports: [
        CarCardComponent
    ]
})
export class CarsModule { }
