import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChangePasswordComponent} from './change-password.component';
import {AlertModule} from 'ngx-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AlertModule,
    ReactiveFormsModule
  ],
  declarations: [
    ChangePasswordComponent
  ]
})
export class ChangePasswordModule { }
