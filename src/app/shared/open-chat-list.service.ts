import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatListModel} from '../chat/model/chat-list.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class OpenChatListService {
  private openChatList = new BehaviorSubject<boolean>(false);
  private openChat = new Subject<ChatListModel>();

  constructor() {
  }

  getOpenChatList() {
    return this.openChatList;
  }

  setOpenChatList(value) {
    this.openChatList.next(value);
  }

  setOpenChat(friend: ChatListModel) {
    this.openChat.next(friend);
  }

  getOpenChat() {
    return this.openChat;
  }
}
