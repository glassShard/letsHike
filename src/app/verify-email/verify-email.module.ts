import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertModule} from 'ngx-bootstrap';
import {VerifyEmailComponent} from './verify-email.component';

@NgModule({
  imports: [
    CommonModule,
    AlertModule
  ],
  declarations: [
    VerifyEmailComponent
  ]
})
export class VerifyEmailModule { }
