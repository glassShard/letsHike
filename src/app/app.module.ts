import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {LoginModalComponent} from './login-modal/login-modal.component';
import {EventService} from './shared/event.service';
import {ItemService} from './shared/item.service';
import {PointReplacerPipe} from './shared/point-replacer.pipe';
import {UserService} from './shared/user.service';
import {AlertModule} from 'ngx-bootstrap';
import {LoggedInGuard} from './shared/logged-in.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from './shared/category.service';
import {HttpClientModule} from '@angular/common/http';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/hu';
import {environment} from '../environments/environment';
import * as firebase from 'firebase';
import {CoreModule} from './core/core.module';

@NgModule({
  declarations: [
    AppComponent,
    ...AppRoutingModule.routableComponents,
    LoginModalComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    CoreModule
  ],
  providers: [
    EventService,
    ItemService,
    UserService,
    CategoryService,
    LoggedInGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(environment.firebase);
  }
}
