import { Routes } from '@angular/router';

import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';
import { ForbiddenComponent } from './features/forbidden/forbidden.component';
import { Error404Component } from './features/error404/error404.component';
import { WeatherComponent } from './features/weather/weather.component';
import { CardsComponent } from './features/cards/cards.component';
import { ExpansionsComponent } from './features/expansions/expansions.component';
import { ExpansionDetailComponent } from './features/expansion-detail/expansion-detail.component';
import { DecksListComponent } from './features/decks-list/decks-list.component';
import { DecksDetailsComponent } from './features/deck-details/deck-details.component';
import { MyDecksComponent } from './features/my-decks/my-decks.component';
import { DeckEditComponent } from './features/deck-edit/deck-edit.component';
import { DeckCreateComponent } from './features/deck-create/deck-create.component';
import { RegisterComponent } from './features/register/register.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { CardCreateComponent } from './features/card-create/card-create.component';
import { CardEditComponent } from './features/card-edit/card-edit.component';
import { ExpansionCreateComponent } from './features/expansion-create/expansion-create.component';
import { ExpansionEditComponent } from './features/expansion-edit/expansion-edit.component';
import { UserAdminComponent } from './features/user-admin/user-admin.component';
import { ContactComponent } from './features/contact/contact.component';
export const routes: Routes = [

{
    path: '', // Ruta inicial
    component: HomeComponent,
},
{
    path: 'contact', // Ruta inicial
    component: ContactComponent,
},
{
    path: 'login', // Página de inicio de sesión
    component: LoginComponent,
},{
  path: 'register',
  component: RegisterComponent,
},

{
    path: 'cards',
    component: CardsComponent
},{
    path: 'cards/create',
    component: CardCreateComponent
},{
  path: 'cards/:id/edit',
  component: CardEditComponent
},

{
    path: 'cards/edit',
    component: CardEditComponent
},
{
    path: 'expansions', 
    component: ExpansionsComponent,
   
},
{
    path: 'expansions/create',
    component: ExpansionCreateComponent
},
{
  path: 'expansions/:id/edit',
  component: ExpansionEditComponent
},

{
    path: 'expansions/edit',
    component: ExpansionEditComponent
},
{
    path: 'profile',
    component: PerfilComponent,
    canActivate: [authGuard]
},
{
    path: 'decks/my',
    component: MyDecksComponent,
    canActivate: [authGuard]
},
{
  path: 'decks/create',
  component: DeckCreateComponent,
  canActivate: [authGuard]
},
{
  path: 'decks/:id/edit',
  component: DeckEditComponent,
  canActivate: [authGuard]
}
,

{
    path: 'decks/:id',
    component: DecksDetailsComponent,
},
{
    path: 'decks',
    component: DecksListComponent,
},

{
    path: 'users-admin',
    component: UserAdminComponent,
},
{
    path: 'expansions/:id',
    component: ExpansionDetailComponent,
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

