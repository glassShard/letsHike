import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {ItemComponent} from './item/item.component';
import {EventComponent} from './event/event.component';
import {UsersComponent} from './users/users.component';
import {ItemListComponent} from './item/item-list/item-list.component';
import {ItemDetailsComponent} from './item/item-details/item-details.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {LoginComponent} from './user/login/login.component';
import {RegistrationComponent} from './user/registration/registration.component';
import {EventListComponent} from './event/event-list/event-list.component';
import {EventDetailComponent} from './event/event-detail/event-detail.component';
import {LoggedInGuard} from './shared/logged-in.guard';
import {ItemViewComponent} from './item/item-view/item-view.component';
import {EventViewComponent} from './event/event-view/event-view.component';

const routes: Routes = [
  {path: 'kezdolap', component: HomeComponent},

  {path: 'turak', loadChildren: 'app/event/event.module#EventModule'},
  {path: 'cuccok', loadChildren: 'app/item/item.module#ItemModule'},

  {path: 'tobbiek', component: UsersComponent},
  {path: 'user', children: [
      {path: '', component: ProfileComponent, canActivate: [LoggedInGuard]},
      {path: 'edit', component: ProfileEditComponent},
      {path: 'login', component: LoginComponent},
      {path: 'registration', component: RegistrationComponent}
    ]},
  {path: '', redirectTo: '/kezdolap', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
  static routableComponents = [
    HomeComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    ProfileEditComponent,
    UsersComponent,
    PageNotFoundComponent
  ];
}
