import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ImgComponent} from './img.component';
import {ImgUploaderComponent} from '../img-uploader/img-uploader.component';
import {ImgPreviewComponent} from '../img-preview/img-preview.component';
import {ProgressbarModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ProgressbarModule
  ],
  declarations: [
    ImgComponent,
    ImgUploaderComponent,
    ImgPreviewComponent
  ],
  exports: [
    ImgComponent,
    ImgUploaderComponent,
    ImgPreviewComponent
  ]
})
export class ImgModule { }
