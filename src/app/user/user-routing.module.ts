import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {RegistrationComponent} from './registration/registration.component';
import {LoggedInGuard} from '../shared/logged-in.guard';

const routes: Routes = [
  {path: '', children: [
      {path: '', component: ProfileComponent, canActivate: [LoggedInGuard]},
      {path: 'edit', component: ProfileEditComponent, canActivate: [LoggedInGuard]},
      {path: 'registration', component: RegistrationComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
