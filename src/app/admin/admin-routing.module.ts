import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AdminLayoutComponent} from './components/admin-layout/admin-layout.component';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';
import {AdminAddPriceComponent} from "./components/admin-add-price/admin-add-price.component";
import {AdminAddCarComponent} from "./components/admin-add-car/admin-add-car.component";
import {AdminCarsComponent} from "./components/admin-cars/admin-cars.component";
import {HomeComponent} from "../components/home/home/home.component";
import {AdminRentingsComponent} from "./components/admin-rentings/admin-rentings/admin-rentings.component";
import {AdminGuard} from "../guards/admin.guard";
import {AuthGuard} from "../guards/auth.guard";

const routes: Routes = [
    {
        path: 'admin',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'home', component: AdminHomeComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: 'price', component: AdminAddPriceComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: 'add-car', component: AdminAddCarComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: 'change-car/:id', component: AdminAddCarComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: 'cars', component: AdminCarsComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: 'rents', component: AdminRentingsComponent, canActivate: [AuthGuard,AdminGuard]
            },
            {
                path: '**', redirectTo: '/admin/home'
            },
            // Add more child routes for other admin components as needed
        ],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}