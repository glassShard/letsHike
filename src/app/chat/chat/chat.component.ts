import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ChatWindowConfig} from '../model/chat-window.config';
import {ChatService} from '../chat.service';
import {ChatListModel} from '../model/chat-list.model';
import {UserService} from '../../shared/user.service';
import {AngularFireDatabase} from 'angularfire2/database';
import {OpenChatListService} from '../../shared/open-chat-list.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, OnDestroy {
  windows$ = new BehaviorSubject<ChatWindowConfig[]>([]);
  public openChatList: boolean;
  private subscriptions: Subscription[] = [];

  constructor (private _userService: UserService,
              private _chatService: ChatService,
              private _afDb: AngularFireDatabase,
              private _openChatListService: OpenChatListService,
              private _cdr: ChangeDetectorRef) {
    this._chatService.getChatCallWatcher().subscribe(data => {
      if (data != null && data.length > 0) {
        data.forEach(call => {
          this.openChat({
            title: call.friend.nick,
            roomId: call.roomId,
            friend: call.friend
          });
          this._chatService.removeWatcher(call.friend.$id);
        });
      }
    });
  }

  ngOnInit() {
    this.subscriptions.push(this._openChatListService.getOpenChatList()
      .subscribe(value => {
        this.openChatList = value;
        this._cdr.markForCheck();
      }));
    this.subscriptions.push(this._openChatListService.getOpenChat()
      .subscribe(friend => this.onSelectFriend(friend)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openChat(config: ChatWindowConfig) {
    console.log(config);
    const windows = this.windows$.getValue();
    if (windows.find(element => element.roomId === `chat_list/${config.roomId}`) == null) {
      if (config.id === undefined) {
        this._chatService.addChatWait(config.roomId, config.friend);
        config.id = `${config.roomId}${new Date().getTime()}`;
      }
      if (config.closeable == null) {
        config.closeable = true;
      }
      config.roomId = `chat_list/${config.roomId}`;

      windows.push(config);
      this.windows$.next(windows);
    }
  }

  removeChat(id: string) {
    console.log(id);
    const windows = this.windows$.getValue();
    const configIndex = windows.findIndex(config => config.id === id);
    if (configIndex > -1) {
      windows.splice(configIndex, 1);
      this.windows$.next(windows);
    }
  }

  onSelectFriend(friend: ChatListModel) {
    this._userService.getCurrentUser().first()
      .subscribe(user => {
        let roomId = `${user.id}-${friend.$id}`;
        this._afDb.object(`chat/room/chat_list/${roomId}`)
          .subscribe(room => {
            if (room.$exists()) {
              this.openChat({
                title: friend.nick, 'roomId': roomId,
                closeable: true, 'friend': friend, new: false
              });
            } else {
              roomId = `${friend.$id}-${user.id}`;
              this.openChat({
                title: friend.nick, 'roomId': roomId,
                closeable: true, 'friend': friend, new: true
              });
            }
          });

      });
  }
}
