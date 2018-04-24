// Ebben a chat-hez való service-ben vannak azok a függvények, amiket a
// chaten kívül más modulok is használnak. (Ez pillanatnyilag a core modulban
// lévő navbárt jelenti.)

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatListModel} from '../chat/model/chat-list.model';
import {Subject} from 'rxjs/Subject';
import {ChatService} from '../chat/chat.service';

@Injectable()
export class OpenChatListService {
  private openChatList = new BehaviorSubject<boolean>(false);
  private openChat = new Subject<ChatListModel>();
  public newMessagesLength = new Subject<number>();

  constructor(private _chatService: ChatService) {
    console.log('newMessagesLength: ');
    this._chatService.getFriendList().subscribe(list => {
      this.newMessagesLength.next(list.filter(model => model.newMessage).length);
    });
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

  getNewMessagesLength() {
    return this.newMessagesLength;
  }
}
