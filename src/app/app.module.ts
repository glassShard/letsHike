import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {EventService} from './shared/event.service';
import {ItemService} from './shared/item.service';
import {UserService} from './shared/user.service';
import {AlertModule, ModalModule} from 'ngx-bootstrap';
import {LoggedInGuard} from './shared/logged-in.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CategoryService} from './shared/category.service';
import {HttpClientModule} from '@angular/common/http';
import {MomentModule} from 'angular2-moment';
import 'moment/locale/hu';
import {environment} from '../environments/environment';
import * as firebase from 'firebase';
import {CoreModule} from './core/core.module';
import {FileService} from './shared/file.service';
import {LoginModalComponent} from './core/login-modal/login-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    ...AppRoutingModule.routableComponents,
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
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
    FileService
  ],
  entryComponents: [
    LoginModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(environment.firebase);
  }
}
