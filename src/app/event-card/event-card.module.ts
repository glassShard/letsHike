import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EventCardComponent} from './event-card.component';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/hu';
import {RouterModule} from '@angular/router';
import {GrowingModule} from "../directives/growing/growing.module";
import {GrowingDirective} from "../directives/growing/growing.directive";

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    RouterModule
  ],
  declarations: [
    EventCardComponent
  ],
  exports: [
    EventCardComponent
  ]
})
export class EventCardModule { }
