import { Injectable } from '@angular/core';
import {UserService} from '../shared/user.service';
import {Observable} from 'rxjs/Observable';
import {ChatMessageModel} from './model/chat.model';
import * as moment from 'moment';
import {AngularFireDatabase} from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';
import {ChatListModel} from './model/chat-list.model';
import 'rxjs/add/operator/first';
import {ChatCallModel} from './model/chat-call.model';

@Injectable()
export class ChatService {
  private static PATH = 'chat';

  constructor(private _userService: UserService,
              private _afDb: AngularFireDatabase) {
  }

  addMessage(roomId: string, msg: string): Observable<boolean> {
    return this._userService.getCurrentUser()
      .switchMap(user => {
        if (user) {
          return new Observable<boolean>(
            observer => {
              console.log(`${ChatService.PATH}/${roomId}`);
              const room = this._afDb.list(`${ChatService.PATH}/${roomId}`);
              const picUrl = user.picUrl ? user.picUrl : '';
              room.push(
                new ChatMessageModel({
                  $id: null,
                  'msg': msg,
                  userId: user.id,
                  userName: user.nick,
                  userPicUrl: picUrl,
                  created: moment().unix()
                })
              ).then(() => {
                observer.next(true);
                observer.complete();
              }, error => {
                observer.next(false);
                observer.error(error);
                observer.complete();
              });
            }
          );
        }
      });
  }

  getRoomMessages(roomId: string): Observable<ChatMessageModel[]> {
    return this._afDb.list(`${ChatService.PATH}/${roomId}`)
      .map(list => {
        return list.map(chatMessage => new ChatMessageModel(Object.assign(chatMessage, {$id: chatMessage.key})));
      });
  }

  getFriendList(): Observable<ChatListModel[]> {
    return this._userService.getCurrentUser()
      .first()
      .switchMap(user => {
        return this._afDb.list(`chat_friend_list/${user.id}`)
          .map(friends => friends.map(
            friend => new ChatListModel(Object.assign(friend, {$id: friend.$key}))
          ));
      });
  }

  addChatWait(roomId: string, friend: ChatListModel) {
    this._userService.getCurrentUser().first()
      .subscribe(user => {
        this._afDb.object(`chat_wait/${friend.$id}/${user.id}`)
          .set({
            'roomId': roomId,
            'friend': new ChatListModel({$id: user.id, picUrl: user.picUrl, nick: user.nick})
          });
      });
  }

  getChatCallWatcher(): Observable<ChatCallModel[]> {
    return this._userService.getCurrentUser().first()
      .switchMap(user =>
        this._afDb.list(`chat_wait/${user.id}`)
          .map(calls =>
            calls.map(call =>
              new ChatCallModel(Object.assign(call, {
                $id: call.$key,
                friend: new ChatListModel(Object.assign(call.friend, {
                  $id: call.$key})
                )
              }))
            )
          )
      );
  }

  removeWatcher(id: string) {
    this._userService.getCurrentUser().first()
      .delay(1000)
      .subscribe(user => {
        this._afDb.object(`chat_wait/${user.id}/${id}`).remove().then();
      });
  }

  checkRoomAgain(roomId) {
    this._afDb.object(`${ChatService.PATH}/room/chat_list/${roomId}`)
      .subscribe(room => {
        if (room.$exists()) {
          console.log('van id');
          return true;
        } else {
          console.log('nincs id');
          return false;
        }
      });
  }
}
