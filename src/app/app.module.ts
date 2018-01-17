import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { FooterComponent } from './core/footer/footer.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { EventCardComponent } from './event-card/event-card.component';
import {AppRoutingModule} from './app-routing.module';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import { LoginModalComponent } from './login-modal/login-modal.component';
import {EventService} from './shared/event.service';
import {ItemService} from './shared/item.service';
import { PointReplacerPipe } from './shared/point-replacer.pipe';
import {UserService} from './shared/user.service';
import {AlertModule} from 'ngx-bootstrap';
import {LoggedInGuard} from './shared/logged-in.guard';
import {FormsModule} from '@angular/forms';
import {CategoryService} from './shared/category.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ItemCardComponent,
    EventCardComponent,
    ...AppRoutingModule.routableComponents,
    LoginModalComponent,
    PointReplacerPipe,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    EventService,
    ItemService,
    PointReplacerPipe,
    UserService,
    CategoryService,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
