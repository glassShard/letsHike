import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ThumbContainerComponent} from './thumb-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ThumbContainerComponent
  ],
  exports: [
    ThumbContainerComponent
  ]
})
export class ThumbContainerModule { }
