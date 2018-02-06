import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {RegistrationComponent} from './registration/registration.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import 'moment/locale/hu';
import {MomentModule} from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ModalModule,
    AlertModule,
    CoreModule,
    ReactiveFormsModule,
    MomentModule
  ],
  declarations: [
    ProfileComponent,
    RegistrationComponent,
    ProfileEditComponent
  ]
})
export class UserModule {
}
