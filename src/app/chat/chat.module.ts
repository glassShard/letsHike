import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../core/core.module';
import { ChatMessageRowComponent } from './chat-message-row/chat-message-row.component';
import { ChatMessageSendFormComponent } from './chat-message-send-form/chat-message-send-form.component';
import {MomentModule} from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoreModule,
    MomentModule
  ],
  declarations: [
    ChatWindowComponent,
    ChatMessageRowComponent,
    ChatMessageSendFormComponent
  ],
  exports: [
    ChatWindowComponent
  ]
})

export class ChatModule {
}
