import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import {CoreModule} from '../core/core.module';
import {UsersComponent} from './users.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { UserListComponent } from './user-list/user-list.component';
import {MomentModule} from 'angular2-moment';
import {CollapseModule} from 'ngx-bootstrap';
import {ItemCardModule} from '../item-card/item-card.module';
import {EventCardModule} from '../event-card/event-card.module';


@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    CoreModule,
    MomentModule,
    CollapseModule,
    EventCardModule,
    ItemCardModule
  ],
  declarations: [
    UsersComponent,
    ProfilesComponent,
    UserListComponent
  ]
})
export class UsersModule { }
