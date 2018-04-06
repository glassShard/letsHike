import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatWindowConfig} from '../model/chat-window.config';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  windows$ = new BehaviorSubject<ChatWindowConfig[]>([]);
  constructor() { }

  ngOnInit() {
  }

  openChat(config: ChatWindowConfig) {
    if(config.id === null) {
      config.id = `${config.roomId}${new Date().getTime()}`;
    }
    if(config.closeable === null) {
      config.closeable = true;
    }
    config.roomId = 'chat_list/${config.roomId}';
  }

  removeChat(id: string) {

  }

}
