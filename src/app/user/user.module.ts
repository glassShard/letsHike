import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {ProfileEditComponent} from './profile-edit/profile-edit.component';
import {AlertModule, CollapseModule, ModalModule} from 'ngx-bootstrap';
import {RegistrationComponent} from './registration/registration.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import 'moment/locale/hu';
import {MomentModule} from 'angular2-moment';
import {EventCardModule} from '../event-card/event-card.module';
import {ItemCardModule} from '../item-card/item-card.module';
import {CollapsibleModule} from '../shared/collapsible/collapsible.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    ModalModule,
    AlertModule,
    CoreModule,
    ReactiveFormsModule,
    MomentModule,
    EventCardModule,
    ItemCardModule,
    CollapsibleModule,
    CollapseModule
  ],
  declarations: [
    ProfileComponent,
    RegistrationComponent,
    ProfileEditComponent
  ]
})
export class UserModule {
}
