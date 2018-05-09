// Ebben a chat-hez való service-ben vannak azok a függvények, amiket a
// chaten kívül más modulok is használnak. (Ez pillanatnyilag a core modulban
// lévő navbárt jelenti.)

import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatListModel} from '../chat/model/chat-list.model';
import {Subject} from 'rxjs/Subject';
import {ChatService} from '../chat/chat.service';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {UserService} from './user.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OpenChatListService {
  private openChatList = new BehaviorSubject<boolean>(false);
  private openChat = new Subject<ChatListModel>();
  public newMessagesLength = new ReplaySubject<number>(1);

  constructor(private _chatService: ChatService,
              private _userService: UserService) {
    this._userService.isLoggedIn$
      .switchMap(isLoggedIn => isLoggedIn ? this._chatService.getFriendList() :
        Observable.of(null))
      .subscribe(list => {
        if (list != null) {
          this.newMessagesLength.next(list.filter(model => model.newMessage).length);
        } else {
          this.newMessagesLength.next(0);
        }
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
