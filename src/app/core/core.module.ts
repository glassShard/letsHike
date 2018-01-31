import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {LoadingSpinnerComponent} from './loading-spinner/loading-spinner.component';
import {OwnerButtonsComponent} from './owner-buttons/owner-buttons.component';
import {FilterAndNewBarComponent} from './filter-and-new-bar/filter-and-new-bar.component';
import {AlertModule, CollapseModule} from 'ngx-bootstrap';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    CollapseModule,
    AlertModule,
    RouterModule
  ],
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    OwnerButtonsComponent,
    FilterAndNewBarComponent,

  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    OwnerButtonsComponent,
    FilterAndNewBarComponent
  ]
})
export class CoreModule { }
