import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './core/page-not-found/page-not-found.component';
import {UsersComponent} from './users/users.component';
import {ProfileComponent} from './user/profile/profile.component';
import {ProfileEditComponent} from './user/profile-edit/profile-edit.component';
import {RegistrationComponent} from './user/registration/registration.component';
import {LoggedInGuard} from './shared/logged-in.guard';

const routes: Routes = [
  {path: 'kezdolap', component: HomeComponent},

  {path: 'turak', loadChildren: 'app/event/event.module#EventModule'},
  {path: 'cuccok', loadChildren: 'app/item/item.module#ItemModule'},

  {path: 'tobbiek', component: UsersComponent},
  {path: 'user', children: [
      {path: '', component: ProfileComponent, canActivate: [LoggedInGuard]},
      {path: 'edit', component: ProfileEditComponent, canActivate: [LoggedInGuard]},
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
    RegistrationComponent,
    ProfileComponent,
    ProfileEditComponent,
    UsersComponent,
    PageNotFoundComponent
  ];
}
