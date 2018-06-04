import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {OwnerButtonsComponent} from './owner-buttons/owner-buttons.component';
import {FilterAndNewBarComponent} from './filter-and-new-bar/filter-and-new-bar.component';
import {AlertModule, CollapseModule, ModalModule} from 'ngx-bootstrap';
import {RouterModule} from '@angular/router';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {EmailComponent} from './email/email.component';
import {ReactiveFormsModule} from '@angular/forms';
import { NothingToShowComponent } from './nothing-to-show/nothing-to-show.component';

@NgModule({
  imports: [
    CommonModule,
    CollapseModule,
    ModalModule,
    AlertModule,
    RouterModule,
    ReactiveFormsModule
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    OwnerButtonsComponent,
    FilterAndNewBarComponent,
    LoginModalComponent,
    EmailComponent,
    NothingToShowComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    OwnerButtonsComponent,
    FilterAndNewBarComponent,
    LoginModalComponent,
    EmailComponent,
    NothingToShowComponent
  ]
})
export class CoreModule { }
