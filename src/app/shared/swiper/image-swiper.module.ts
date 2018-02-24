import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SwiperComponent} from './swiper/swiper.component';
import {SwiperModule} from 'ngx-swiper-wrapper';

@NgModule({
  imports: [
    CommonModule,
    SwiperModule
  ],
  declarations: [
    SwiperComponent
  ],
  exports: [
    SwiperComponent
  ]
})
export class ImageSwiperModule { }
