import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ChatListModel} from '../model/chat-list.model';
import {Observable} from 'rxjs/Observable';
import {ChatService} from '../chat.service';
import {OpenChatListService} from '../../shared/open-chat-list.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit {
  friendList$: Observable<ChatListModel[]>;
  @Output() select = new  EventEmitter<ChatListModel>();

  constructor(private _chatService: ChatService,
              private _openChatListService: OpenChatListService) { }

  ngOnInit() {
    this.friendList$ = this._chatService.getFriendList();
  }

  onSelectFriend(friend: ChatListModel) {
    this.select.emit(friend);
  }

  closeChatList() {
    this._openChatListService.setOpenChatList(false);
  }
}
