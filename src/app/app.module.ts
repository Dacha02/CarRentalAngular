import {NgModule, AfterViewInit, Renderer2} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home/home.component';
import {ContactComponent} from './components/contact/contact/contact.component';

import {RouterModule, Routes} from '@angular/router';
import {SinglecarComponent} from './components/singlecar/singlecar/singlecar.component';
import {CarCardComponent} from './components/cars/car-card/car-card.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {PricePipe} from './shared/pipes/price/price.pipe';
import {ReactiveFormsModule} from "@angular/forms";
import {CarsModule} from "./components/cars/cars.module";
import {CarsRoutingModule} from "./components/cars/cars-routing.module";
import {SharedModule} from "./shared/shared.module";
import {LoginComponent} from './components/login/login.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {JwtModule} from "@auth0/angular-jwt";
import {UserRentingsComponent} from './components/user-rentings/user-rentings.component';
import {AdminModule} from "./admin/admin.module";
import {APP_BASE_HREF} from "@angular/common";
import {Router} from "@angular/router";
import {AdminRoutingModule} from "./admin/admin-routing.module";
import {RegisterComponent} from './components/register/register/register.component';
import {AuthGuard} from "./guards/auth.guard";


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ContactComponent,
        LoginComponent,
        UserProfileComponent,
        UserRentingsComponent,
        RegisterComponent,
    ],
    imports: [
        BrowserModule,
        AdminRoutingModule,
        AppRoutingModule,
        RouterModule,
        CarsModule,
        CarsRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        SharedModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: () => {
                    return localStorage.getItem('token');
                },
                allowedDomains: ['http://localhost:4200'], // Replace with your domain(s)
                disallowedRoutes: ['http://localhost:5000/api/token'], // Replace with your API URL(s)
            },
        })
    ],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: '/'
        },
        ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
