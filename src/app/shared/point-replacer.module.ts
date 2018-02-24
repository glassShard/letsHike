import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PointReplacerPipe} from './point-replacer.pipe';
import { SwiperComponent } from './swiper/swiper/swiper.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PointReplacerPipe,
    SwiperComponent,
  ],
  exports: [
    PointReplacerPipe
  ]
})
export class PointReplacerModule {
}
