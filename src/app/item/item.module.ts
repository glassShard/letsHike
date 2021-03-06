import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemRoutingModule} from './item-routing.module';
import {ItemComponent} from './item.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ItemDetailsComponent} from './item-details/item-details.component';
import {ItemViewComponent} from './item-view/item-view.component';
import {AlertModule} from 'ngx-bootstrap';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/hu';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import {ItemCardModule} from '../item-card/item-card.module';
import {PointReplacerModule} from '../shared/point-replacer.module';
import {ImgModule} from '../shared/img/img/img.module';
import {ImageSwiperModule} from '../shared/swiper/image-swiper.module';
import {ChatModule} from '../chat/chat.module';
import {QuillModule} from 'ngx-quill';
import {ThumbContainerModule} from '../shared/img/thumb-container/thumb-container.module';

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    AlertModule,
    MomentModule,
    ReactiveFormsModule,
    CoreModule,
    ItemCardModule,
    PointReplacerModule,
    ImgModule,
    ImageSwiperModule,
    ChatModule,
    QuillModule,
    ThumbContainerModule
  ],
  declarations: [
    ItemComponent,
    ItemListComponent,
    ItemDetailsComponent,
    ItemViewComponent
  ]
})
export class ItemModule {
}
