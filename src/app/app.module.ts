import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {EventService} from './shared/event.service';
import {ItemService} from './shared/item.service';
import {UserService} from './shared/user.service';
import {AlertModule, ModalModule, ProgressbarModule} from 'ngx-bootstrap';
import {LoggedInGuard} from './shared/logged-in.guard';
import {CategoryService} from './shared/category.service';
import {HttpClientModule} from '@angular/common/http';
import 'moment/locale/hu';
import {environment} from '../environments/environment';
import * as firebase from 'firebase';
import {CoreModule} from './core/core.module';
import {FileService} from './shared/file.service';
import {LoginModalComponent} from './core/login-modal/login-modal.component';
import {ImageService} from './shared/image.service';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ChatModule} from './chat/chat.module';
import {EmailComponent} from './core/email/email.component';
import {EmailService} from './shared/email.service';
import {ChatService} from './chat/chat.service';
import {OpenChatListService} from './shared/open-chat-list.service';
import {VerifyEmailComponent} from './verify-email/verify-email.component';
import {ChangePasswordComponent} from './user/change-password/change-password.component';
import {VerifyEmailModule} from './verify-email/verify-email.module';
import {ChangePasswordModule} from './user/change-password/change-password.module';
import {SEOServiceService} from './shared/seoservice.service';
import {WindowRef} from './shared/windowRef';
import {ThumbContainerModule} from './shared/img/thumb-container/thumb-container.module';

@NgModule({
  declarations: [
    AppComponent,
    ...AppRoutingModule.routableComponents
  ],
  imports: [
    BsDropdownModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ChatModule,
    VerifyEmailModule,
    ChangePasswordModule,
    ThumbContainerModule
  ],
  providers: [
    EventService,
    ItemService,
    UserService,
    CategoryService,
    LoggedInGuard,
    FileService,
    ImageService,
    EmailService,
    ChatService,
    OpenChatListService,
    SEOServiceService,
    Title,
    WindowRef
  ],
  entryComponents: [
    LoginModalComponent,
    EmailComponent,
    VerifyEmailComponent,
    ChangePasswordComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    firebase.initializeApp(environment.firebase);
  }
}
