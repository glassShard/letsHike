import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventRoutingModule } from './event-routing.module';
import {EventComponent} from './event.component';
import {EventListComponent} from './event-list/event-list.component';
import {EventDetailComponent} from './event-detail/event-detail.component';
import {EventViewComponent} from './event-view/event-view.component';
import {CoreModule} from '../core/core.module';
import {EventCardModule} from '../event-card/event-card.module';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/hu';
import {ReactiveFormsModule} from '@angular/forms';
import {AlertModule} from 'ngx-bootstrap';
import {ImgModule} from '../shared/img/img/img.module';
import {ImageSwiperModule} from '../shared/swiper/image-swiper.module';

@NgModule({
  imports: [
    CommonModule,
    EventRoutingModule,
    CoreModule,
    EventCardModule,
    MomentModule,
    ReactiveFormsModule,
    AlertModule,
    ImgModule,
    ImageSwiperModule
  ],
  declarations: [
    EventComponent,
    EventListComponent,
    EventDetailComponent,
    EventViewComponent,
  ],
  exports: [

  ]
})
export class EventModule { }
