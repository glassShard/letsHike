import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImgPreviewComponent} from './img-preview.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ImgPreviewComponent
  ],
  exports: [
    ImgPreviewComponent
  ]
})
export class ImgPreviewModule { }
