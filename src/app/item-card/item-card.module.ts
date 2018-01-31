import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'angular2-moment';
import {RouterModule} from '@angular/router';
import {ItemCardComponent} from './item-card.component';
import 'moment/locale/hu';
import {PointReplacerModule} from '../shared/point-replacer.module';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    RouterModule,
    PointReplacerModule
  ],
  declarations: [
    ItemCardComponent,
  ],
  exports: [
    ItemCardComponent
  ]
})
export class ItemCardModule {
}
