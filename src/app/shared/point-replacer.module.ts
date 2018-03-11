import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PointReplacerPipe} from './point-replacer.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PointReplacerPipe
  ],
  exports: [
    PointReplacerPipe
  ]
})
export class PointReplacerModule {
}
