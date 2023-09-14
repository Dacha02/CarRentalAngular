import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./components/home/home/home.component";
import {ContactComponent} from "./components/contact/contact/contact.component";
import {SinglecarComponent} from "./components/singlecar/singlecar/singlecar.component";
import {CarsComponent} from "./components/cars/cars/cars.component";
import {LoginComponent} from "./components/login/login.component";
import {LoginGuardGuard} from "./guards/login-guard.guard";
import {UserProfileComponent} from "./components/user-profile/user-profile.component";
import {UserRentingsComponent} from "./components/user-rentings/user-rentings.component";
import {LogedOutGuard} from "./guards/loged-out.guard";
import {RegisterComponent} from "./components/register/register/register.component";
import {AuthGuard} from "./guards/auth.guard";
import {JsScriptResolver} from "./components/user-rentings/resolver/js-script.resolver";

const routes: Routes = [
    { path: 'admin', loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule) },
    { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
    { path: 'single-car/:id', component: SinglecarComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuardGuard] },
    { path: 'update_profile', component: UserProfileComponent, canActivate: [AuthGuard, LogedOutGuard] },
    { path: 'user_rents', component: UserRentingsComponent, canActivate: [AuthGuard, LogedOutGuard],
        /*resolve:{
            jsScriptResolver: JsScriptResolver
        }*/ },
    { path: 'register', component: RegisterComponent, canActivate: [LoginGuardGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'cars', component: CarsComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/' }, // Keep this line at the end
];


@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {
}
