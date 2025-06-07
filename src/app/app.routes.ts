import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { WeatherComponent } from './features/weather/weather.component';
import { CardsComponent } from './features/cards/cards.component';
export const routes: Routes = [

{
    path: '', // Ruta inicial
    component: HomeComponent,
},
{
    path: 'login', // Página de inicio de sesión
    component: LoginComponent,
},
{
    path: 'cards', // Página protegida
    component: CardsComponent,
    canActivate: [authGuard],
},
{
    path: 'forbidden',
    component: ForbiddenComponent
}, // Página 403
{
    path: "weather",
    component: WeatherComponent

},
{
    path: '**', // Ruta comodin para 404
    component: Error404Component,
},


];

